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
        <li onClick={() => setSelectedLanguage("shell")}>
          <Card
            title="AWS CLI"
            icon="img/icons/aws-cli"
            selected={selectedLanguage === "shell"}
          />
        </li>
        <li onClick={() => setSelectedLanguage("javascript")}>
          <Card
            title="JavaScript"
            icon="img/icons/javascript"
            selected={selectedLanguage === "javascript"}
          />
        </li>
        <li onClick={() => setSelectedLanguage("go")}>
          <Card
            title="Golang"
            icon="img/icons/golang"
            selected={selectedLanguage === "go"}
          />
        </li>
        <li onClick={() => setSelectedLanguage("java")}>
          <Card
            title="Java"
            icon="img/icons/java"
            selected={selectedLanguage === "java"}
          />
        </li>
        <li onClick={() => setSelectedLanguage("python")}>
          <Card
            title="Python"
            icon="img/icons/python"
            selected={selectedLanguage === "python"}
          />
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
