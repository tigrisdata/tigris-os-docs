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
        <li onMouseEnter={() => setSelectedLanguage("shell")}>
          <Card
            title="AWS CLI"
            to="/sdks/s3/aws-cli/"
            icon="img/icons/aws-cli"
          />
        </li>
        <li onMouseEnter={() => setSelectedLanguage("javascript")}>
          <Card
            title="JavaScript"
            to="/sdks/s3/aws-js-sdk/"
            icon="img/icons/javascript"
          />
        </li>
        <li onMouseEnter={() => setSelectedLanguage("go")}>
          <Card
            title="Golang"
            to="/sdks/s3/aws-go-sdk/"
            icon="img/icons/golang"
          />
        </li>
        <li onMouseEnter={() => setSelectedLanguage("java")}>
          <Card
            title="Java"
            to="/sdks/s3/aws-java-sdk/"
            icon="img/icons/java"
          />
        </li>
        <li onMouseEnter={() => setSelectedLanguage("python")}>
          <Card
            title="Python"
            to="/sdks/s3/aws-python-sdk/"
            icon="img/icons/python"
          />
        </li>
        <li>
          <Card title="And More!" to="/sdks/s3/" icon="img/cube" />
        </li>
      </ul>
      <div className="terminal">
        <CodeBlock
          language={selectedLanguage}
          title={selectedLanguage}
          showLineNumbers={true}
          className="code-block"
        >
          {code}
        </CodeBlock>
      </div>
    </div>
  );
}
