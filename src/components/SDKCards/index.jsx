import React from "react";
import { HomepageCard as Card } from "../HomepageComponents";

import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";
import { codes } from "./snippets";

export default function SDKCards() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("shell");
  const code = codes[selectedLanguage];
  return (
    <div id="sdks" className="sdk-cards">
      <div className="intro">
        <h2>AWS S3 SDKs</h2>
        Tigris is a drop in replacement for S3 compatible storage. Use all your
        familiar tools and libraries by simply{" "}
        <Link to="get-started">changing your configuration</Link>.
      </div>
      <ul className="list">
        <li
          onMouseEnter={() => setSelectedLanguage("shell")}
          onTouchStart={() => setSelectedLanguage("shell")}
        >
          <Card title="AWS CLI" icon="img/icons/aws-cli" />
        </li>
        <li
          onMouseEnter={() => setSelectedLanguage("javascript")}
          onTouchStart={() => setSelectedLanguage("javascript")}
        >
          <Card title="JavaScript" icon="img/icons/javascript" />
        </li>
        <li
          onMouseEnter={() => setSelectedLanguage("go")}
          onTouchStart={() => setSelectedLanguage("go")}
        >
          <Card title="Golang" icon="img/icons/golang" />
        </li>
        <li
          onMouseEnter={() => setSelectedLanguage("java")}
          onTouchStart={() => setSelectedLanguage("java")}
        >
          <Card title="Java" icon="img/icons/java" />
        </li>
        <li
          onMouseEnter={() => setSelectedLanguage("python")}
          onTouchStart={() => setSelectedLanguage("python")}
        >
          <Card title="Python" icon="img/icons/python" />
        </li>
        <li>
          <Card title="And More!" to="/sdks/s3/" icon="img/cube" />
        </li>
      </ul>
      <div className="terminal">
        <CodeBlock
          language={selectedLanguage}
          title={
            <Link to={code.link}>
              <h3 style={{ margin: "0px" }}>{code.title}</h3>
            </Link>
          }
          showLineNumbers={true}
          className="code-block"
        >
          {code.code}
        </CodeBlock>
      </div>
    </div>
  );
}
