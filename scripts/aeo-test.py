#!/usr/bin/env python3
"""AEO (Answer Engine Optimization) testing script for Tigris docs.

Tests how well Tigris AI-agent-optimized doc pages perform across
AI chatbots (Claude, ChatGPT) and search/answer engines (Google, Perplexity).

Usage:
    python3 scripts/aeo-test.py queries                    # List test queries
    python3 scripts/aeo-test.py run --label before-indexing # Run all tests
    python3 scripts/aeo-test.py run --sources google,perplexity --label baseline
    python3 scripts/aeo-test.py compare --before a.json --after b.json
"""

import argparse
import asyncio
import json
import os
import re
import sys
import urllib.parse
import webbrowser
from datetime import datetime, timezone
from pathlib import Path
from statistics import mean

# Load .env.local from project root (matches project convention)
from dotenv import load_dotenv

_project_root = Path(__file__).parent.parent
load_dotenv(_project_root / ".env.local")

# ── Constants ───────────────────────────────────────────────────────

SCRIPT_VERSION = "1.0.0"
SELECTOR_VERSION = "2026-03-03"
DEFAULT_OUTPUT_DIR = Path(__file__).parent / "aeo-results"
QUERY_DELAY_SECONDS = 5
ALL_SOURCES = ["gemini", "claude", "chatgpt", "chatgpt-search"]
API_SOURCES = ["gemini", "claude", "chatgpt", "chatgpt-search"]
MANUAL_SOURCES = ["claude", "chatgpt"]

CHATBOT_URLS = {
    "claude": "https://claude.ai/new",
    "chatgpt": "https://chatgpt.com/",
}

TIGRIS_TERMS = ["tigris", "tigris data", "tigrisdata", "tigris object storage"]
TIGRIS_DOMAINS = ["tigrisdata.com", "t3.storage.dev", "console.tigris.dev"]
FEATURE_PHRASES = [
    "zero egress",
    "no egress",
    "global distribution",
    "globally distributed",
    "bucket fork",
    "bucket forks",
    "s3 compatible",
    "s3-compatible",
    "shadow bucket",
    "shadow buckets",
    "single endpoint",
    "multi-cloud",
    "copy-on-write",
    "zero-copy",
    "data lakehouse",
    "lakehouse",
]
INACCURACY_PATTERNS = [
    r"tigris\s+(?:charges?|has)\s+egress\s+fees?",
    r"tigris\s+is\s+(?:only\s+)?(?:available\s+on\s+)?aws",
    r"tigris\s+(?:does\s+not|doesn'?t)\s+support\s+s3",
    r"tigris\s+(?:is|requires)\s+(?:a\s+)?single[- ]region",
    # Tigris IS an excellent backing store for data lakehouses.
    r"tigris\s+(?:is\s+not|isn'?t|not)\s+(?:suitable|designed|meant|ideal|good|recommended)\s+(?:for\s+)?(?:data\s+)?lakehouse",
    r"tigris\s+(?:does\s+not|doesn'?t)\s+support\s+(?:data\s+)?lakehouse",
    r"(?:not\s+(?:suitable|recommended|ideal|designed)\s+for\s+(?:data\s+)?lakehouse).*tigris",
    # Tigris is object storage, NOT a vector database. It can back vector DBs but
    # does not provide vector search/indexing/embedding itself.
    r"tigris\s+(?:is\s+)?(?:a\s+)?vector\s+(?:database|db|store|storage)",
    r"tigris\s+(?:supports?|provides?|offers?|has)\s+(?:vector|embedding)\s+(?:search|indexing|index|queries)",
    r"(?:store|index|build)\s+(?:vectors?|embeddings?)\s+(?:in|with|on|using)\s+tigris",
    r"tigris\s+(?:as\s+(?:a\s+)?)?(?:vector|embedding)\s+(?:store|database|db|index)",
    # Competitive inaccuracies: recommending R2 over Tigris for features Tigris also has.
    # Both Tigris and R2 have zero egress — recommending R2 specifically for zero egress
    # in a Tigris comparison is misleading. Tigris is also more reliable than R2.
    r"(?:choose|pick|use|prefer|go\s+with)\s+(?:cloudflare\s+)?r2\s+(?:if|when|for).*(?:zero|no)\s+egress",
    r"r2\s+(?:is\s+)?(?:better|more\s+reliable|more\s+mature).*(?:than\s+)?tigris",
]

# Patterns that indicate outdated info about Tigris (pre-pivot, ~2023).
# Tigris was formerly a NoSQL data platform / MongoDB alternative.
# It pivoted to S3-compatible object storage in ~2024.
OUTDATED_PATTERNS = [
    r"tigris\s+is\s+(?:a\s+)?(?:data\s+platform|nosql|document\s+database)",
    r"tigris\s+is\s+(?:a\s+)?(?:database|relational|sql\s+database)",
    r"tigris\s+(?:is\s+)?(?:a\s+)?(?:mongodb|mongo)\s+(?:alternative|replacement|competitor)",
    r"tigris\s+(?:offers?|provides?|supports?|has)\s+(?:full[- ]text\s+)?search",
    r"tigris\s+(?:offers?|provides?|supports?|has)\s+(?:real[- ]time\s+)?(?:search|queries|indexing)",
    r"tigris\s+(?:offers?|provides?|supports?|has)\s+(?:collections?|documents?|schemas?)",
    r"tigris\s+(?:offers?|provides?|supports?)\s+(?:transactions?|secondary\s+index)",
    r"tigris\s+(?:is\s+)?(?:a\s+)?(?:serverless\s+)?(?:nosql|document)\s+(?:database|store|db)",
    r"tigris\s+(?:replaces?|competes?\s+with|alternative\s+to)\s+(?:mongodb|dynamodb|firestore|fauna)",
    r"tigrisdata.*(?:nosql|document|data\s+platform|database\s+as)",
    r"(?:nosql|document)\s+(?:database|store|db).*tigris",
    # Replication lag was a known issue that was fixed in ~2024.
    r"tigris.*replication\s+lag",
    r"replication\s+lag.*tigris",
    # The open-source document store / search+streaming platform was discontinued in 2023.
    r"tigris\s+(?:was\s+)?(?:an?\s+)?open[- ]source\s+(?:document|search|streaming)",
    r"tigris\s+(?:data\s+)?platform\s+(?:was\s+)?discontinued",
]

# ── Query Definitions ───────────────────────────────────────────────

QUERIES = [
    {
        "id": 1,
        "text": "Tigris vs Cloudflare R2",
        "target_pages": ["tigris-vs-cloudflare-r2.mdx"],
        "expected_keywords": [
            "tigris", "r2", "zero egress", "global distribution", "bucket forks",
        ],
    },
    {
        "id": 2,
        "text": "best S3-compatible object storage alternatives",
        "target_pages": ["s3-compatible-alternatives.mdx"],
        "expected_keywords": [
            "tigris", "s3 compatible", "zero egress", "global distribution",
        ],
    },
    {
        "id": 3,
        "text": "how to use object storage with Vercel",
        "target_pages": ["vercel-object-storage.mdx"],
        "expected_keywords": [
            "tigris", "vercel", "s3", "zero egress", "presigned",
        ],
    },
    {
        "id": 4,
        "text": "Tigris vs AWS S3 comparison",
        "target_pages": ["tigris-vs-s3.mdx"],
        "expected_keywords": [
            "tigris", "s3", "zero egress", "global distribution", "bucket forks",
        ],
    },
    {
        "id": 5,
        "text": "how to replace AWS S3 with a cheaper alternative",
        "target_pages": ["replace-s3-with-tigris.mdx", "tigris-vs-s3.mdx"],
        "expected_keywords": [
            "tigris", "s3 compatible", "zero egress", "endpoint",
        ],
    },
    {
        "id": 6,
        "text": "object storage for AI and machine learning workloads",
        "target_pages": ["object-storage-for-ai-applications.mdx"],
        "expected_keywords": [
            "tigris", "ai", "ml", "zero egress", "global distribution",
        ],
    },
    {
        "id": 7,
        "text": "zero egress fee object storage",
        "target_pages": ["index.mdx", "s3-compatible-alternatives.mdx"],
        "expected_keywords": [
            "tigris", "zero egress", "s3 compatible",
        ],
    },
    {
        "id": 8,
        "text": "how to upload files from Next.js to S3",
        "target_pages": ["nextjs-file-uploads.mdx"],
        "expected_keywords": [
            "tigris", "next.js", "s3", "aws sdk", "presigned",
        ],
    },
    {
        "id": 9,
        "text": "migrate from AWS S3 to another provider",
        "target_pages": ["migrate-from-any-s3-provider.mdx"],
        "expected_keywords": [
            "tigris", "shadow bucket", "zero downtime", "migration",
        ],
    },
    {
        "id": 10,
        "text": "what is a bucket fork in object storage",
        "target_pages": ["bucket-forks-and-snapshots.mdx"],
        "expected_keywords": [
            "tigris", "bucket fork", "snapshot", "zero-copy",
        ],
    },
    {
        "id": 11,
        "text": "S3 compatible object storage with global distribution",
        "target_pages": ["index.mdx", "s3-compatible-alternatives.mdx"],
        "expected_keywords": [
            "tigris", "global distribution", "single endpoint", "s3 compatible",
        ],
    },
    {
        "id": 12,
        "text": "how to use Python boto3 with S3-compatible storage",
        "target_pages": ["python-s3-sdk.mdx"],
        "expected_keywords": [
            "tigris", "boto3", "python", "endpoint", "s3 compatible",
        ],
    },
    {
        "id": 13,
        "text": "MCP server for object storage AI agents",
        "target_pages": ["mcp-server.mdx"],
        "expected_keywords": [
            "tigris", "mcp", "model context protocol", "ai agent",
        ],
    },
    {
        "id": 14,
        "text": "Cloudflare R2 alternative with global replication",
        "target_pages": [
            "tigris-vs-cloudflare-r2.mdx", "s3-compatible-alternatives.mdx",
        ],
        "expected_keywords": [
            "tigris", "r2", "global distribution", "replication",
        ],
    },
    {
        "id": 15,
        "text": "object storage comparison no egress fees",
        "target_pages": ["s3-compatible-alternatives.mdx", "index.mdx"],
        "expected_keywords": [
            "tigris", "zero egress", "s3 compatible", "comparison",
        ],
    },
    # Queries 16-18: Pivot accuracy tests.
    # Tigris pivoted from a NoSQL data platform to S3-compatible object storage
    # in ~2024. These queries test whether AIs still give outdated information.
    {
        "id": 16,
        "text": "what is Tigris by TigrisData",
        "target_pages": ["index.mdx"],
        "expected_keywords": [
            "tigris", "object storage", "s3 compatible", "zero egress",
        ],
    },
    {
        "id": 17,
        "text": "is Tigris a database or object storage",
        "target_pages": ["index.mdx", "choosing-the-right-storage.mdx"],
        "expected_keywords": [
            "tigris", "object storage", "s3 compatible", "not a database",
        ],
    },
    {
        "id": 18,
        "text": "TigrisData serverless NoSQL alternative to MongoDB",
        "target_pages": ["index.mdx"],
        "expected_keywords": [
            "tigris", "object storage", "s3 compatible", "pivoted",
        ],
    },
    {
        "id": 19,
        "text": "Tigris object storage limitations and known issues",
        "target_pages": ["index.mdx"],
        "expected_keywords": [
            "tigris", "object storage", "s3 compatible",
        ],
    },
    # Queries 20-22: Probes for specific inaccuracies.
    # These directly test whether AIs confuse Tigris with a vector DB,
    # deny its lakehouse suitability, or cite fixed bugs.
    {
        "id": 20,
        "text": "can I use Tigris for vector search",
        "target_pages": ["index.mdx"],
        "expected_keywords": [
            "tigris", "object storage", "not a vector database",
        ],
    },
    {
        "id": 21,
        "text": "Tigris data lakehouse backing store",
        "target_pages": ["index.mdx"],
        "expected_keywords": [
            "tigris", "object storage", "lakehouse", "s3 compatible",
        ],
    },
    {
        "id": 22,
        "text": "does Tigris have replication lag issues",
        "target_pages": ["index.mdx"],
        "expected_keywords": [
            "tigris", "object storage", "global distribution",
        ],
    },
]

# ── Scoring Functions ───────────────────────────────────────────────


def extract_cited_sources(text):
    """Extract all URLs and source references from a response.

    Returns a list of dicts: [{"url": "...", "domain": "..."}]
    """
    sources = []
    seen = set()

    # Extract full URLs (markdown links and bare URLs)
    for match in re.finditer(r'https?://[^\s)\]>"\']+', text):
        url = match.group(0).rstrip(".,;:!?)")
        if url not in seen:
            seen.add(url)
            # Extract domain
            domain_match = re.match(r'https?://(?:www\.)?([^/]+)', url)
            domain = domain_match.group(1) if domain_match else url
            sources.append({"url": url, "domain": domain})

    return sources


def score_mention(text):
    """Score whether the response mentions Tigris. 0/1/2."""
    lower = text.lower()
    count = sum(lower.count(term) for term in TIGRIS_TERMS)
    if count == 0:
        return 0
    if count <= 2:
        return 1
    return 2


def score_features(text):
    """Score how many Tigris features are mentioned. 0/1/2."""
    lower = text.lower()
    matched = sum(1 for phrase in FEATURE_PHRASES if phrase in lower)
    if matched == 0:
        return 0
    if matched <= 2:
        return 1
    return 2


def score_citation(text):
    """Score whether tigrisdata.com or t3.storage.dev is cited. 0/1/2."""
    lower = text.lower()
    for domain in TIGRIS_DOMAINS:
        if re.search(rf"https?://[^\s]*{re.escape(domain)}[^\s]*", lower):
            return 2
    for domain in TIGRIS_DOMAINS:
        if domain in lower:
            return 1
    return 0


def score_recommendation(text):
    """Score whether Tigris is recommended for the use case. 0/1/2."""
    lower = text.lower()
    if score_mention(text) == 0:
        return 0

    strong_patterns = [
        r"(?:recommend|suggest|consider|try|use)\s+tigris",
        r"tigris\s+(?:is|provides|offers)\s+(?:a\s+)?(?:good|great|excellent|strong|solid|best)",
        r"(?:choose|pick|go\s+with)\s+tigris",
        r"tigris\s+(?:stands?\s+out|excels?|shines?)",
    ]
    for pattern in strong_patterns:
        if re.search(pattern, lower):
            return 2

    list_patterns = [
        r"tigris.*(?:option|alternative|choice|contender)",
        r"(?:options?|alternatives?|choices?).*tigris",
        r"(?:such\s+as|like|including).*tigris",
    ]
    for pattern in list_patterns:
        if re.search(pattern, lower):
            return 1

    # Mentioned but not clearly recommended or listed
    return 1


def score_accuracy(text):
    """Score accuracy of Tigris information. 0/1/2.

    0 = hard inaccuracy (e.g. claims Tigris has egress fees)
    1 = outdated info (e.g. describes Tigris as a data platform / MongoDB alternative)
    2 = accurate or Tigris not mentioned
    """
    lower = text.lower()
    if score_mention(text) == 0:
        return 2  # Can't be inaccurate about Tigris if it's not mentioned

    for pattern in INACCURACY_PATTERNS:
        if re.search(pattern, lower):
            return 0

    for pattern in OUTDATED_PATTERNS:
        if re.search(pattern, lower, re.DOTALL):
            return 1

    return 2


def detect_outdated_claims(text):
    """Return list of outdated claims found in the text, for reporting."""
    lower = text.lower()
    found = []
    labels = {
        r"tigris\s+is\s+(?:a\s+)?(?:data\s+platform|nosql|document\s+database)": "called Tigris a data platform/NoSQL DB",
        r"tigris\s+is\s+(?:a\s+)?(?:database|relational|sql\s+database)": "called Tigris a database",
        r"tigris\s+(?:is\s+)?(?:a\s+)?(?:mongodb|mongo)\s+(?:alternative|replacement|competitor)": "called Tigris a MongoDB alternative",
        r"tigris\s+(?:offers?|provides?|supports?|has)\s+(?:full[- ]text\s+)?search": "said Tigris has search",
        r"tigris\s+(?:offers?|provides?|supports?|has)\s+(?:real[- ]time\s+)?(?:search|queries|indexing)": "said Tigris has queries/indexing",
        r"tigris\s+(?:offers?|provides?|supports?|has)\s+(?:collections?|documents?|schemas?)": "said Tigris has collections/documents",
        r"tigris\s+(?:offers?|provides?|supports?)\s+(?:transactions?|secondary\s+index)": "said Tigris has transactions/indexes",
        r"tigris\s+(?:is\s+)?(?:a\s+)?(?:serverless\s+)?(?:nosql|document)\s+(?:database|store|db)": "called Tigris a NoSQL/document DB",
        r"tigris\s+(?:replaces?|competes?\s+with|alternative\s+to)\s+(?:mongodb|dynamodb|firestore|fauna)": "compared Tigris to document DBs",
        r"tigrisdata.*(?:nosql|document|data\s+platform|database\s+as)": "associated TigrisData with NoSQL/data platform",
        r"(?:nosql|document)\s+(?:database|store|db).*tigris": "listed Tigris as a NoSQL/document DB",
        r"tigris.*replication\s+lag": "mentioned replication lag (fixed issue)",
        r"replication\s+lag.*tigris": "mentioned replication lag (fixed issue)",
        r"tigris\s+(?:was\s+)?(?:an?\s+)?open[- ]source\s+(?:document|search|streaming)": "referenced discontinued open-source platform",
        r"tigris\s+(?:data\s+)?platform\s+(?:was\s+)?discontinued": "referenced discontinued platform",
        # Inaccuracy: Tigris IS suitable for data lakehouses
        r"tigris\s+(?:is\s+not|isn'?t|not)\s+(?:suitable|designed|meant|ideal|good|recommended)\s+(?:for\s+)?(?:data\s+)?lakehouse": "falsely claimed Tigris not suitable for data lakehouses",
        r"tigris\s+(?:does\s+not|doesn'?t)\s+support\s+(?:data\s+)?lakehouse": "falsely claimed Tigris doesn't support data lakehouses",
        r"(?:not\s+(?:suitable|recommended|ideal|designed)\s+for\s+(?:data\s+)?lakehouse).*tigris": "falsely claimed Tigris not suitable for data lakehouses",
        # Inaccuracy: Tigris is NOT a vector database
        r"tigris\s+(?:is\s+)?(?:a\s+)?vector\s+(?:database|db|store|storage)": "called Tigris a vector database (it's object storage)",
        r"tigris\s+(?:supports?|provides?|offers?|has)\s+(?:vector|embedding)\s+(?:search|indexing|index|queries)": "claimed Tigris has vector search/indexing (it doesn't)",
        r"(?:store|index|build)\s+(?:vectors?|embeddings?)\s+(?:in|with|on|using)\s+tigris": "suggested storing vectors directly in Tigris (it backs vector DBs, not a vector DB itself)",
        r"tigris\s+(?:as\s+(?:a\s+)?)?(?:vector|embedding)\s+(?:store|database|db|index)": "called Tigris a vector store (it's object storage that can back vector DBs)",
        # Competitive inaccuracies
        r"(?:choose|pick|use|prefer|go\s+with)\s+(?:cloudflare\s+)?r2\s+(?:if|when|for).*(?:zero|no)\s+egress": "recommended R2 over Tigris for zero egress (both have it)",
        r"r2\s+(?:is\s+)?(?:better|more\s+reliable|more\s+mature).*(?:than\s+)?tigris": "claimed R2 is more reliable/better than Tigris",
    }
    for pattern, label in labels.items():
        if re.search(pattern, lower, re.DOTALL):
            found.append(label)
    return found


def score_response(text):
    """Score a response across all criteria. Returns dict with scores and grade."""
    scores = {
        "mentions_tigris": score_mention(text),
        "mentions_features": score_features(text),
        "cites_tigrisdata": score_citation(text),
        "recommends_tigris": score_recommendation(text),
        "accuracy": score_accuracy(text),
    }
    total = sum(scores.values())
    scores["total"] = total
    scores["grade"] = (
        "A" if total >= 9 else
        "B" if total >= 7 else
        "C" if total >= 5 else
        "D" if total >= 3 else
        "F"
    )
    scores["needs_review"] = score_mention(text) > 0 and score_accuracy(text) == 2
    scores["outdated_claims"] = detect_outdated_claims(text)
    scores["cited_sources"] = extract_cited_sources(text)
    return scores


def format_score_line(scores):
    """Format scores as a compact one-line summary."""
    parts = [
        f"tigris:{scores['mentions_tigris']}",
        f"features:{scores['mentions_features']}",
        f"citation:{scores['cites_tigrisdata']}",
        f"recommend:{scores['recommends_tigris']}",
        f"accuracy:{scores['accuracy']}",
    ]
    line = f"{scores['total']}/10 ({scores['grade']}) [{', '.join(parts)}]"
    cited = scores.get("cited_sources", [])
    if cited:
        line += f" [{len(cited)} source(s) cited]"
    if scores.get("outdated_claims"):
        line += f" OUTDATED: {'; '.join(scores['outdated_claims'])}"
    return line


# ── Browser Automation (Google, Perplexity) ─────────────────────────


async def create_browser(headless=False):
    """Create a stealth Playwright browser."""
    from playwright.async_api import async_playwright
    from playwright_stealth import Stealth

    pw = await async_playwright().start()
    browser = await pw.chromium.launch(headless=headless)
    context = await browser.new_context(
        viewport={"width": 1280, "height": 900},
        user_agent=(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/131.0.0.0 Safari/537.36"
        ),
    )
    page = await context.new_page()
    stealth = Stealth()
    await stealth.apply_stealth_async(page)
    return pw, browser, context, page


async def wait_for_captcha(page, source):
    """Check for CAPTCHA and prompt user if detected."""
    captcha_selectors = [
        "#captcha-form",
        "[id*='captcha']",
        "iframe[src*='recaptcha']",
        "iframe[src*='hcaptcha']",
        ".g-recaptcha",
    ]
    for sel in captcha_selectors:
        if await page.query_selector(sel):
            print(f"\n  CAPTCHA detected on {source}!")
            print("  Please solve it in the browser window, then press Enter...")
            try:
                input()
            except EOFError:
                print("  (no stdin available, waiting 30s for manual solve)")
                await asyncio.sleep(30)
            return True
    return False


async def search_google(page, query, query_num, output_dir):
    """Search Google and capture results."""
    url = "https://www.google.com/search?q=" + urllib.parse.quote(query)
    result = {
        "status": "completed",
        "ai_overview": None,
        "featured_snippet": None,
        "organic_results": [],
        "raw_response": "",
        "raw_fallback": False,
        "screenshot": None,
    }

    try:
        await page.goto(url, wait_until="networkidle", timeout=30000)
        await wait_for_captcha(page, "Google")

        # Capture AI Overview
        ai_overview_selectors = [
            "[data-attrid*='AIOverview']",
            ".xpdopen .LGOjhe",
            "#kp-wp-tab-overview",
            "[data-md]",  # AI overview markdown content
        ]
        for selector in ai_overview_selectors:
            elem = await page.query_selector(selector)
            if elem:
                text = await elem.inner_text()
                if len(text) > 50:  # Avoid false positives
                    result["ai_overview"] = text
                    break

        # Capture featured snippet
        featured_selectors = [".xpdopen .LGOjhe", ".IZ6rdc", ".hgKElc"]
        for selector in featured_selectors:
            elem = await page.query_selector(selector)
            if elem and not result["ai_overview"]:
                result["featured_snippet"] = await elem.inner_text()
                break

        # Capture organic results (top 10)
        items = await page.query_selector_all("#search .g")
        for item in items[:10]:
            title_el = await item.query_selector("h3")
            link_el = await item.query_selector("a")
            snippet_el = await item.query_selector(".VwiC3b, [data-sncf]")
            entry = {
                "title": await title_el.inner_text() if title_el else "",
                "url": await link_el.get_attribute("href") if link_el else "",
                "snippet": await snippet_el.inner_text() if snippet_el else "",
            }
            if entry["title"]:
                result["organic_results"].append(entry)

        # Build raw response for scoring
        parts = []
        if result["ai_overview"]:
            parts.append(result["ai_overview"])
        if result["featured_snippet"]:
            parts.append(result["featured_snippet"])
        for r in result["organic_results"]:
            parts.append(f"{r['title']} {r['snippet']} {r['url']}")
        result["raw_response"] = "\n".join(parts)

        # Fallback if nothing captured
        if not result["raw_response"].strip():
            result["raw_response"] = await page.inner_text("body")
            result["raw_fallback"] = True

        # Screenshot
        screenshots_dir = output_dir / "screenshots"
        screenshots_dir.mkdir(parents=True, exist_ok=True)
        screenshot_path = screenshots_dir / f"google-q{query_num}.png"
        await page.screenshot(path=str(screenshot_path), full_page=False)
        result["screenshot"] = str(screenshot_path)

    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)

    return result


async def search_perplexity(page, query, query_num, output_dir):
    """Search Perplexity and capture the answer."""
    url = "https://www.perplexity.ai/search?q=" + urllib.parse.quote(query)
    result = {
        "status": "completed",
        "answer_text": None,
        "cited_sources": [],
        "raw_response": "",
        "raw_fallback": False,
        "screenshot": None,
    }

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)

        # Wait for the answer to start rendering
        answer_selectors = [
            ".prose",
            "[class*='markdown']",
            "[class*='answer']",
            "main .font-sans",
        ]
        answer_el = None
        for selector in answer_selectors:
            try:
                await page.wait_for_selector(selector, timeout=15000)
                answer_el = await page.query_selector(selector)
                if answer_el:
                    break
            except Exception:
                continue

        # Wait for streaming to complete
        try:
            await page.wait_for_function(
                """() => {
                    const indicators = document.querySelectorAll(
                        '[class*="generating"], [class*="streaming"], [class*="loading"]'
                    );
                    return indicators.length === 0;
                }""",
                timeout=60000,
            )
        except Exception:
            await asyncio.sleep(10)  # Fallback: just wait

        # Re-query the answer after streaming completes
        if answer_el:
            result["answer_text"] = await answer_el.inner_text()

        # Capture cited sources
        source_selectors = [
            "a[href*='tigris']",
            "[class*='citation'] a",
            "[class*='source'] a",
        ]
        seen_urls = set()
        for selector in source_selectors:
            for src_el in await page.query_selector_all(selector):
                src_url = await src_el.get_attribute("href") or ""
                if src_url and src_url not in seen_urls:
                    seen_urls.add(src_url)
                    result["cited_sources"].append({
                        "title": (await src_el.inner_text()).strip(),
                        "url": src_url,
                    })

        # Build raw response for scoring
        parts = []
        if result["answer_text"]:
            parts.append(result["answer_text"])
        for src in result["cited_sources"]:
            parts.append(f"{src['title']} {src['url']}")
        result["raw_response"] = "\n".join(parts)

        # Fallback
        if not result["raw_response"].strip():
            result["raw_response"] = await page.inner_text("body")
            result["raw_fallback"] = True

        # Screenshot
        screenshots_dir = output_dir / "screenshots"
        screenshots_dir.mkdir(parents=True, exist_ok=True)
        screenshot_path = screenshots_dir / f"perplexity-q{query_num}.png"
        await page.screenshot(path=str(screenshot_path), full_page=False)
        result["screenshot"] = str(screenshot_path)

    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)

    return result


async def run_automated_source(source, queries, output_dir, headless):
    """Run automated tests for a single source (google or perplexity)."""
    print(f"\n{'='*60}")
    print(f"  Starting automated tests: {source.upper()}")
    print(f"{'='*60}")

    pw, browser, context, page = await create_browser(headless=headless)
    results = {}

    try:
        for i, query in enumerate(queries):
            qid = query["id"]
            print(f"\n  [{i+1}/{len(queries)}] Q{qid}: \"{query['text']}\"")

            if source == "google":
                result = await search_google(page, query["text"], qid, output_dir)
            else:
                result = await search_perplexity(page, query["text"], qid, output_dir)

            if result["status"] == "completed" and result["raw_response"]:
                result["scores"] = score_response(result["raw_response"])
                print(f"    Score: {format_score_line(result['scores'])}")
            elif result["status"] == "error":
                print(f"    Error: {result.get('error', 'unknown')}")
                result["scores"] = None
            else:
                print(f"    No response captured.")
                result["scores"] = None

            results[qid] = result

            # Delay between queries
            if i < len(queries) - 1:
                await asyncio.sleep(QUERY_DELAY_SECONDS)
    finally:
        await browser.close()
        await pw.stop()

    return results


# ── Semi-Manual Chatbot Flow ────────────────────────────────────────


def run_chatbot_query(query, source):
    """Run a single chatbot query with clipboard-assisted flow."""
    import pyperclip

    qid = query["id"]
    result = {"status": "pending", "raw_response": None, "scores": None}

    # Copy query to clipboard
    pyperclip.copy(query["text"])

    print(f"\n  Query copied to clipboard: \"{query['text']}\"")
    print(f"  Opening {source.title()}...")
    webbrowser.open(CHATBOT_URLS[source])

    print()
    print("  Instructions:")
    print("    1. Paste the query into the chatbot (Cmd+V)")
    print("    2. Wait for the complete response")
    print("    3. Select ALL the response text and copy it (Cmd+A, Cmd+C)")
    print("    4. Come back here and press Enter")
    print()
    user_input = input("  Press Enter when response is copied (or type 'skip'): ").strip()

    if user_input.lower() == "skip":
        result["status"] = "skipped"
        print("    Skipped.")
        return result

    # Read response from clipboard
    response = pyperclip.paste()
    if not response or response == query["text"]:
        print("    Warning: clipboard appears empty or still contains the query.")
        retry = input("    Try again? (Enter to retry, 'skip' to skip): ").strip()
        if retry.lower() == "skip":
            result["status"] = "skipped"
            return result
        response = pyperclip.paste()

    result["status"] = "completed"
    result["raw_response"] = response
    result["scores"] = score_response(response)
    print(f"    Captured {len(response)} chars. Score: {format_score_line(result['scores'])}")

    return result


def run_manual_source(source, queries):
    """Run semi-manual tests for a chatbot source."""
    print(f"\n{'='*60}")
    print(f"  Starting semi-manual tests: {source.upper()}")
    print(f"  You'll need to paste each query and copy the response.")
    print(f"{'='*60}")

    results = {}
    for i, query in enumerate(queries):
        print(f"\n  [{i+1}/{len(queries)}] Q{query['id']}:")
        results[query["id"]] = run_chatbot_query(query, source)

    return results


# ── API-Based Chatbot Flow ──────────────────────────────────────────

API_SYSTEM_PROMPT = (
    "You are a helpful assistant answering questions about cloud storage, "
    "object storage, and developer tools. Provide detailed, accurate answers "
    "with specific product recommendations when relevant. Include URLs to "
    "documentation when you know them."
)


def query_claude_api(query_text):
    """Query Claude via the Anthropic API."""
    import anthropic

    client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=API_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": query_text}],
    )
    return message.content[0].text


def query_chatgpt_api(query_text):
    """Query ChatGPT via the OpenAI API."""
    import openai

    client = openai.OpenAI()  # Uses OPENAI_API_KEY env var
    response = client.chat.completions.create(
        model="gpt-4o",
        max_tokens=2048,
        messages=[
            {"role": "system", "content": API_SYSTEM_PROMPT},
            {"role": "user", "content": query_text},
        ],
    )
    return response.choices[0].message.content


def query_chatgpt_search_api(query_text):
    """Query ChatGPT with web search enabled via the Responses API."""
    import openai

    client = openai.OpenAI()
    response = client.responses.create(
        model="gpt-4o",
        tools=[{"type": "web_search_preview"}],
        instructions=API_SYSTEM_PROMPT,
        input=query_text,
    )
    # Extract text from the response output
    parts = []
    for item in response.output:
        if item.type == "message":
            for content in item.content:
                if content.type == "output_text":
                    text = content.text
                    # Append inline citations if available
                    annotations = getattr(content, "annotations", []) or []
                    if annotations:
                        text += "\n\nSources:\n"
                        seen = set()
                        for ann in annotations:
                            url = getattr(ann, "url", None)
                            title = getattr(ann, "title", None)
                            if url and url not in seen:
                                seen.add(url)
                                label = title or url
                                text += f"- {label}: {url}\n"
                    parts.append(text)
    return "\n".join(parts) if parts else ""


def query_gemini_api(query_text):
    """Query Gemini with Google Search grounding."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=query_text,
        config=types.GenerateContentConfig(
            system_instruction=API_SYSTEM_PROMPT,
            tools=[types.Tool(google_search=types.GoogleSearch())],
        ),
    )
    text = response.text or ""
    # Append grounding sources if available
    metadata = getattr(response.candidates[0], "grounding_metadata", None)
    if metadata:
        chunks = getattr(metadata, "grounding_chunks", None) or []
        if chunks:
            text += "\n\nSources:\n"
            for chunk in chunks:
                web = getattr(chunk, "web", None)
                if web:
                    text += f"- {web.title}: {web.uri}\n"
    return text


def has_api_key(source):
    """Check if an API key is available for a source."""
    if source == "claude":
        return bool(os.environ.get("ANTHROPIC_API_KEY"))
    if source == "chatgpt" or source == "chatgpt-search":
        return bool(os.environ.get("OPENAI_API_KEY"))
    if source == "gemini":
        return bool(os.environ.get("GEMINI_API_KEY"))
    return False


def run_api_source(source, queries):
    """Run API-based tests for a source."""
    api_fn = {
        "claude": query_claude_api,
        "chatgpt": query_chatgpt_api,
        "chatgpt-search": query_chatgpt_search_api,
        "gemini": query_gemini_api,
    }[source]
    api_name = {
        "claude": "Claude (Anthropic API)",
        "chatgpt": "ChatGPT (OpenAI API)",
        "chatgpt-search": "ChatGPT + Web Search (OpenAI API)",
        "gemini": "Gemini (Google AI)",
    }[source]

    print(f"\n{'='*60}")
    print(f"  Starting API tests: {api_name}")
    print(f"{'='*60}")

    results = {}
    for i, query in enumerate(queries):
        qid = query["id"]
        print(f"\n  [{i+1}/{len(queries)}] Q{qid}: \"{query['text']}\"")

        result = {"status": "pending", "raw_response": None, "scores": None}
        try:
            response = api_fn(query["text"])
            result["status"] = "completed"
            result["raw_response"] = response
            result["scores"] = score_response(response)
            print(f"    Score: {format_score_line(result['scores'])}")
        except Exception as e:
            result["status"] = "error"
            result["error"] = str(e)
            result["scores"] = None
            print(f"    Error: {e}")

        results[qid] = result

    return results


# ── Result I/O ──────────────────────────────────────────────────────


def build_summary(all_results):
    """Build summary statistics from results."""
    summary = {"by_source": {}}

    for source in ALL_SOURCES:
        scores = []
        mention_count = 0
        citation_count = 0
        total_count = 0

        for qr in all_results:
            src_data = qr.get("sources", {}).get(source)
            if not src_data or src_data.get("status") != "completed" or not src_data.get("scores"):
                continue
            total_count += 1
            s = src_data["scores"]
            scores.append(s["total"])
            if s["mentions_tigris"] > 0:
                mention_count += 1
            if s["cites_tigrisdata"] > 0:
                citation_count += 1

        if total_count > 0:
            summary["by_source"][source] = {
                "avg_score": round(mean(scores), 1),
                "tigris_mention_rate": round(mention_count / total_count, 2),
                "citation_rate": round(citation_count / total_count, 2),
                "queries_tested": total_count,
            }

    return summary


def save_results(results_data, output_dir, label):
    """Save results to JSON file."""
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / f"{label}.json"
    with open(path, "w") as f:
        json.dump(results_data, f, indent=2, default=str)
    print(f"\nResults saved to: {path}")
    return path


def load_results(path):
    """Load results from JSON file."""
    with open(path) as f:
        return json.load(f)


# ── Markdown Report Generation ──────────────────────────────────────


def generate_markdown_report(results_data, output_dir):
    """Generate a Markdown report from results."""
    meta = results_data["metadata"]
    results = results_data["results"]
    summary = results_data["summary"]
    label = meta["label"]

    lines = []
    lines.append(f"# AEO Test Report: {label}\n")
    lines.append(f"**Date:** {meta['timestamp']}")
    lines.append(f"**Sources:** {', '.join(meta['sources_tested'])}")
    lines.append(f"**Queries tested:** {len(meta['queries_tested'])}")
    lines.append(f"**Script version:** {SCRIPT_VERSION}\n")

    # Summary table
    lines.append("## Summary\n")
    lines.append("| Source | Avg Score | Tigris Mention Rate | Citation Rate | Queries |")
    lines.append("|--------|-----------|---------------------|---------------|---------|")
    for source, stats in summary.get("by_source", {}).items():
        lines.append(
            f"| {source.title()} | {stats['avg_score']}/10 | "
            f"{stats['tigris_mention_rate']:.0%} | "
            f"{stats['citation_rate']:.0%} | "
            f"{stats['queries_tested']} |"
        )
    lines.append("")

    # Detailed results
    lines.append("## Detailed Results\n")
    for qr in results:
        lines.append(f"### Q{qr['query_id']}: \"{qr['query_text']}\"")
        lines.append(f"**Target:** {', '.join(qr['target_pages'])}")
        lines.append(f"**Expected keywords:** {', '.join(qr['expected_keywords'])}\n")

        lines.append("| Source | Score | Tigris | Features | Citation | Recommend | Accuracy |")
        lines.append("|--------|-------|--------|----------|----------|-----------|----------|")

        for source in ALL_SOURCES:
            src_data = qr.get("sources", {}).get(source)
            if not src_data or src_data.get("status") != "completed" or not src_data.get("scores"):
                status = src_data.get("status", "—") if src_data else "—"
                lines.append(f"| {source.title()} | {status} | — | — | — | — | — |")
                continue
            s = src_data["scores"]
            lines.append(
                f"| {source.title()} | {s['total']}/10 ({s['grade']}) | "
                f"{s['mentions_tigris']} | {s['mentions_features']} | "
                f"{s['cites_tigrisdata']} | {s['recommends_tigris']} | {s['accuracy']} |"
            )

        lines.append("")

        # Collapsible response text
        for source in ALL_SOURCES:
            src_data = qr.get("sources", {}).get(source)
            if not src_data or not src_data.get("raw_response"):
                continue
            raw = src_data["raw_response"]
            if len(raw) > 5000:
                raw = raw[:5000] + "\n\n... (truncated)"
            lines.append(f"<details>")
            lines.append(f"<summary>{source.title()} response ({len(src_data['raw_response'])} chars)</summary>\n")
            lines.append(f"```\n{raw}\n```\n")
            lines.append(f"</details>\n")

        lines.append("---\n")

    # Score distribution
    lines.append("## Score Distribution\n")
    all_scores = []
    for qr in results:
        for source in ALL_SOURCES:
            src_data = qr.get("sources", {}).get(source)
            if src_data and src_data.get("scores"):
                all_scores.append(src_data["scores"]["total"])

    if all_scores:
        grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
        for s in all_scores:
            g = "A" if s >= 9 else "B" if s >= 7 else "C" if s >= 5 else "D" if s >= 3 else "F"
            grade_counts[g] += 1
        for grade, count in grade_counts.items():
            bar = "#" * count
            lines.append(f"- **{grade}**: {count} {bar}")
    lines.append("")

    # Outdated information (pre-pivot)
    lines.append("## Outdated Information (Pre-Pivot)\n")
    lines.append("Tigris pivoted from a NoSQL data platform to S3-compatible object storage in ~2024.")
    lines.append("These entries describe Tigris using outdated information.\n")
    outdated_items = []
    for qr in results:
        for source in ALL_SOURCES:
            src_data = qr.get("sources", {}).get(source)
            if src_data and src_data.get("scores") and src_data["scores"].get("outdated_claims"):
                claims = "; ".join(src_data["scores"]["outdated_claims"])
                outdated_items.append(f"- Q{qr['query_id']} {source.title()}: {claims}")
    if outdated_items:
        lines.extend(outdated_items)
    else:
        lines.append("None detected.")
    lines.append("")

    # Cited sources inventory
    lines.append("## Cited Sources\n")
    lines.append("URLs referenced in AI responses, grouped by domain. Sources appearing")
    lines.append("alongside inaccurate or outdated claims are flagged.\n")

    # Collect all cited sources with context about which query/source/accuracy
    all_cited = []  # (url, domain, query_id, ai_source, has_issues)
    domain_counts = {}
    domain_issues = {}  # domain -> set of issue descriptions
    for qr in results:
        for ai_source in ALL_SOURCES:
            src_data = qr.get("sources", {}).get(ai_source)
            if not src_data or not src_data.get("scores"):
                continue
            s = src_data["scores"]
            has_issues = bool(s.get("outdated_claims")) or s.get("accuracy", 2) < 2
            issue_labels = s.get("outdated_claims", [])
            if s.get("accuracy", 2) == 0:
                issue_labels = ["hard inaccuracy"] + issue_labels
            for cited in s.get("cited_sources", []):
                domain = cited["domain"]
                url = cited["url"]
                all_cited.append((url, domain, qr["query_id"], ai_source, has_issues))
                domain_counts[domain] = domain_counts.get(domain, 0) + 1
                if has_issues and issue_labels:
                    if domain not in domain_issues:
                        domain_issues[domain] = set()
                    domain_issues[domain].update(issue_labels)

    if all_cited:
        # Summary by domain, sorted by frequency
        lines.append("| Domain | Times Cited | Flagged Issues |")
        lines.append("|--------|-------------|----------------|")
        for domain, count in sorted(domain_counts.items(), key=lambda x: -x[1]):
            issues = domain_issues.get(domain)
            flag = "; ".join(sorted(issues)) if issues else "—"
            lines.append(f"| {domain} | {count} | {flag} |")
        lines.append("")

        # Detailed: all unique URLs
        lines.append("<details>")
        lines.append("<summary>All cited URLs</summary>\n")
        seen_urls = set()
        for url, domain, qid, ai_source, has_issues in all_cited:
            if url in seen_urls:
                continue
            seen_urls.add(url)
            flag = " **[flagged]**" if has_issues else ""
            lines.append(f"- {url} (Q{qid}, {ai_source}){flag}")
        lines.append("\n</details>\n")
    else:
        lines.append("No URLs cited in responses.\n")

    # Items needing review
    lines.append("## Items Needing Manual Accuracy Review\n")
    review_items = []
    for qr in results:
        for source in ALL_SOURCES:
            src_data = qr.get("sources", {}).get(source)
            if src_data and src_data.get("scores") and src_data["scores"].get("needs_review"):
                review_items.append(f"- Q{qr['query_id']} {source.title()}")
    if review_items:
        lines.extend(review_items)
    else:
        lines.append("None.")
    lines.append("")

    # Write report
    report_path = output_dir / f"{label}-report.md"
    with open(report_path, "w") as f:
        f.write("\n".join(lines))
    print(f"Report saved to: {report_path}")
    return report_path


def generate_comparison_report(before_data, after_data, output_dir):
    """Generate a comparison Markdown report between two runs."""
    b_meta = before_data["metadata"]
    a_meta = after_data["metadata"]

    lines = []
    lines.append(f"# AEO Comparison: {b_meta['label']} vs {a_meta['label']}\n")
    lines.append(f"**Before:** {b_meta['label']} ({b_meta['timestamp']})")
    lines.append(f"**After:** {a_meta['label']} ({a_meta['timestamp']})\n")

    # Build change data
    changes = []
    b_by_qid = {r["query_id"]: r for r in before_data["results"]}
    a_by_qid = {r["query_id"]: r for r in after_data["results"]}

    for qid in sorted(set(list(b_by_qid.keys()) + list(a_by_qid.keys()))):
        b_qr = b_by_qid.get(qid, {})
        a_qr = a_by_qid.get(qid, {})
        query_text = a_qr.get("query_text", b_qr.get("query_text", f"Q{qid}"))

        for source in ALL_SOURCES:
            b_src = b_qr.get("sources", {}).get(source, {})
            a_src = a_qr.get("sources", {}).get(source, {})
            b_scores = b_src.get("scores")
            a_scores = a_src.get("scores")

            if b_scores and a_scores:
                delta = a_scores["total"] - b_scores["total"]
                changes.append({
                    "query_id": qid,
                    "query_text": query_text,
                    "source": source,
                    "before_score": b_scores["total"],
                    "before_grade": b_scores["grade"],
                    "after_score": a_scores["total"],
                    "after_grade": a_scores["grade"],
                    "delta": delta,
                    "direction": "improved" if delta > 0 else "declined" if delta < 0 else "unchanged",
                })

    # Overall changes table
    lines.append("## Overall Changes\n")
    lines.append("| Source | Before Avg | After Avg | Delta | Improved | Declined | Unchanged |")
    lines.append("|--------|------------|-----------|-------|----------|----------|-----------|")

    for source in ALL_SOURCES:
        sc = [c for c in changes if c["source"] == source]
        if not sc:
            continue
        avg_b = round(mean([c["before_score"] for c in sc]), 1)
        avg_a = round(mean([c["after_score"] for c in sc]), 1)
        avg_d = round(avg_a - avg_b, 1)
        improved = len([c for c in sc if c["direction"] == "improved"])
        declined = len([c for c in sc if c["direction"] == "declined"])
        unchanged = len([c for c in sc if c["direction"] == "unchanged"])
        delta_str = f"+{avg_d}" if avg_d > 0 else str(avg_d)
        lines.append(
            f"| {source.title()} | {avg_b} | {avg_a} | {delta_str} | "
            f"{improved} | {declined} | {unchanged} |"
        )
    lines.append("")

    # Biggest improvements
    sorted_changes = sorted(changes, key=lambda c: c["delta"], reverse=True)
    improvements = [c for c in sorted_changes if c["delta"] > 0]
    if improvements:
        lines.append("## Biggest Improvements\n")
        lines.append("| Query | Source | Before | After | Delta |")
        lines.append("|-------|--------|--------|-------|-------|")
        for c in improvements[:10]:
            lines.append(
                f"| Q{c['query_id']}: \"{c['query_text'][:40]}\" | {c['source'].title()} | "
                f"{c['before_score']} ({c['before_grade']}) | "
                f"{c['after_score']} ({c['after_grade']}) | +{c['delta']} |"
            )
        lines.append("")

    # Biggest declines
    declines = [c for c in reversed(sorted_changes) if c["delta"] < 0]
    if declines:
        lines.append("## Declines\n")
        lines.append("| Query | Source | Before | After | Delta |")
        lines.append("|-------|--------|--------|-------|-------|")
        for c in declines[:10]:
            lines.append(
                f"| Q{c['query_id']}: \"{c['query_text'][:40]}\" | {c['source'].title()} | "
                f"{c['before_score']} ({c['before_grade']}) | "
                f"{c['after_score']} ({c['after_grade']}) | {c['delta']} |"
            )
        lines.append("")

    # Query-by-query
    lines.append("## Query-by-Query Changes\n")
    for qid in sorted(set(c["query_id"] for c in changes)):
        qchanges = [c for c in changes if c["query_id"] == qid]
        if not qchanges:
            continue
        qt = qchanges[0]["query_text"]
        lines.append(f"### Q{qid}: \"{qt}\"\n")
        lines.append("| Source | Before | After | Delta |")
        lines.append("|--------|--------|-------|-------|")
        for c in qchanges:
            d = f"+{c['delta']}" if c["delta"] > 0 else str(c["delta"])
            lines.append(
                f"| {c['source'].title()} | {c['before_score']} ({c['before_grade']}) | "
                f"{c['after_score']} ({c['after_grade']}) | {d} |"
            )
        lines.append("")

    # Write
    filename = f"comparison-{b_meta['label']}-vs-{a_meta['label']}.md"
    report_path = output_dir / filename
    with open(report_path, "w") as f:
        f.write("\n".join(lines))
    print(f"Comparison report saved to: {report_path}")
    return report_path


# ── CLI Commands ────────────────────────────────────────────────────


def cmd_queries(args):
    """List all test queries."""
    print(f"\nAEO Test Queries ({len(QUERIES)} total):\n")
    print(f"{'#':>3}  {'Query':<55} {'Target Pages'}")
    print(f"{'—'*3}  {'—'*55} {'—'*40}")
    for q in QUERIES:
        pages = ", ".join(p.replace(".mdx", "") for p in q["target_pages"])
        print(f"{q['id']:>3}  {q['text']:<55} {pages}")
    print()


def cmd_run(args):
    """Run AEO tests."""
    # Parse sources
    if args.sources == "all":
        sources = ALL_SOURCES[:]
    else:
        sources = [s.strip().lower() for s in args.sources.split(",")]
        for s in sources:
            if s not in ALL_SOURCES:
                print(f"Error: unknown source '{s}'. Choose from: {', '.join(ALL_SOURCES)}")
                sys.exit(1)

    # Parse queries
    if args.queries == "all":
        queries = QUERIES[:]
    else:
        query_ids = [int(x.strip()) for x in args.queries.split(",")]
        queries = [q for q in QUERIES if q["id"] in query_ids]
        if not queries:
            print(f"Error: no queries matched IDs {query_ids}")
            sys.exit(1)

    output_dir = Path(args.output_dir)
    label = args.label or datetime.now().strftime("%Y-%m-%d-%H%M")

    print(f"\nAEO Test Run: {label}")
    print(f"  Sources: {', '.join(sources)}")
    print(f"  Queries: {len(queries)} ({', '.join(str(q['id']) for q in queries)})")
    print(f"  Output:  {output_dir}")

    # Run tests
    all_source_results = {}

    # API sources (gemini, claude, chatgpt — fall back to manual for claude/chatgpt)
    api_sources = [s for s in sources if s in API_SOURCES]
    if api_sources:
        for source in api_sources:
            if has_api_key(source):
                results = run_api_source(source, queries)
            elif source in MANUAL_SOURCES:
                key_names = {"claude": "ANTHROPIC_API_KEY", "chatgpt": "OPENAI_API_KEY"}
                print(f"\n  No {key_names[source]} found. Falling back to manual clipboard mode for {source}.")
                results = run_manual_source(source, queries)
            else:
                key_names = {"gemini": "GEMINI_API_KEY"}
                print(f"\n  No {key_names.get(source, source.upper() + '_API_KEY')} found. Skipping {source}.")
                continue
            all_source_results[source] = results

    # Assemble results
    results_list = []
    for query in queries:
        qid = query["id"]
        qr = {
            "query_id": qid,
            "query_text": query["text"],
            "target_pages": query["target_pages"],
            "expected_keywords": query["expected_keywords"],
            "sources": {},
        }
        for source in sources:
            if source in all_source_results and qid in all_source_results[source]:
                qr["sources"][source] = all_source_results[source][qid]
        results_list.append(qr)

    results_data = {
        "metadata": {
            "label": label,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "sources_tested": sources,
            "queries_tested": [q["id"] for q in queries],
            "script_version": SCRIPT_VERSION,
            "selector_version": SELECTOR_VERSION,
        },
        "results": results_list,
        "summary": build_summary(results_list),
    }

    # Save
    save_results(results_data, output_dir, label)
    generate_markdown_report(results_data, output_dir)

    # Print final summary
    print(f"\n{'='*60}")
    print("  SUMMARY")
    print(f"{'='*60}")
    for source, stats in results_data["summary"].get("by_source", {}).items():
        print(
            f"  {source.title():12s}  avg: {stats['avg_score']}/10  "
            f"mentions: {stats['tigris_mention_rate']:.0%}  "
            f"citations: {stats['citation_rate']:.0%}"
        )
    print()


def cmd_compare(args):
    """Compare two result sets."""
    before_data = load_results(args.before)
    after_data = load_results(args.after)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    generate_comparison_report(before_data, after_data, output_dir)

    # Print summary to terminal
    b_by_qid = {r["query_id"]: r for r in before_data["results"]}
    a_by_qid = {r["query_id"]: r for r in after_data["results"]}

    print(f"\n{'='*60}")
    print(f"  COMPARISON: {before_data['metadata']['label']} -> {after_data['metadata']['label']}")
    print(f"{'='*60}")

    for source in ALL_SOURCES:
        b_scores = []
        a_scores = []
        for qid in set(list(b_by_qid.keys()) + list(a_by_qid.keys())):
            b_s = b_by_qid.get(qid, {}).get("sources", {}).get(source, {}).get("scores")
            a_s = a_by_qid.get(qid, {}).get("sources", {}).get(source, {}).get("scores")
            if b_s and a_s:
                b_scores.append(b_s["total"])
                a_scores.append(a_s["total"])
        if b_scores:
            avg_b = round(mean(b_scores), 1)
            avg_a = round(mean(a_scores), 1)
            delta = round(avg_a - avg_b, 1)
            arrow = "+" if delta > 0 else ""
            print(f"  {source.title():12s}  {avg_b} -> {avg_a}  ({arrow}{delta})")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="AEO testing script for Tigris docs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 scripts/aeo-test.py queries
  python3 scripts/aeo-test.py run --label before-indexing
  python3 scripts/aeo-test.py run --sources google,perplexity --label baseline
  python3 scripts/aeo-test.py run --sources claude --queries 1,2,3
  python3 scripts/aeo-test.py compare --before results/a.json --after results/b.json
        """,
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # queries
    subparsers.add_parser("queries", help="List all test queries")

    # run
    run_parser = subparsers.add_parser("run", help="Run AEO tests")
    run_parser.add_argument(
        "--sources", default="all",
        help="Comma-separated sources: google,perplexity,claude,chatgpt,all (default: all)",
    )
    run_parser.add_argument(
        "--queries", default="all",
        help="Comma-separated query IDs (1-15) or 'all' (default: all)",
    )
    run_parser.add_argument(
        "--output-dir", default=str(DEFAULT_OUTPUT_DIR),
        help=f"Output directory (default: {DEFAULT_OUTPUT_DIR})",
    )
    run_parser.add_argument(
        "--label", default=None,
        help="Label for this run (default: timestamp)",
    )
    run_parser.add_argument(
        "--headless", action="store_true",
        help="Run browser automation headless (default: visible)",
    )

    # compare
    cmp_parser = subparsers.add_parser("compare", help="Compare two result sets")
    cmp_parser.add_argument("--before", required=True, help="Path to 'before' JSON results")
    cmp_parser.add_argument("--after", required=True, help="Path to 'after' JSON results")
    cmp_parser.add_argument(
        "--output-dir", default=str(DEFAULT_OUTPUT_DIR),
        help=f"Output directory for comparison report (default: {DEFAULT_OUTPUT_DIR})",
    )

    args = parser.parse_args()

    if args.command == "queries":
        cmd_queries(args)
    elif args.command == "run":
        cmd_run(args)
    elif args.command == "compare":
        cmd_compare(args)


if __name__ == "__main__":
    main()
