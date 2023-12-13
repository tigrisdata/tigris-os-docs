import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";
import {
  GoIcon,
  PhpIcon,
  DotNetIcon,
  TerminalIcon,
  PythonIcon,
  JSIcon,
  RubyIcon,
} from "../../icons";

export default function SDKCards() {
  return (
    <Section title="AWS S3 SDKs" id="sdks">
      <Card
        title="AWS CLI"
        description="Use Tigris with AWS CLI"
        to="/sdks/s3/aws-cli/"
        icon={<TerminalIcon />}
      />
      <Card
        title="JavaScript"
        description="Integrate Tigris in your JavaScript App"
        to="/sdks/s3/aws-js-sdk/"
        icon={<JSIcon />}
      />
      <Card
        title="Golang"
        description="Integrate Tigris in your Golang App"
        to="/sdks/s3/aws-go-sdk/"
        icon={<GoIcon />}
      />
      <Card
        title="Python"
        description="Integrate Tigris in your Python App"
        to="/sdks/s3/aws-python-sdk/"
        icon={<PythonIcon />}
      />
      <Card
        title="PHP"
        description="Integrate Tigris in your PHP App"
        to="/sdks/s3/aws-php-sdk/"
        icon={<PhpIcon />}
      />
      <Card
        title="Ruby"
        description="Integrate Tigris in your Ruby App"
        to="/sdks/s3/aws-ruby-sdk/"
        icon={<RubyIcon />}
      />
      <Card
        title=".NET"
        description="Integrate Tigris in your .NET App"
        to="/sdks/s3/aws-net-sdk/"
        icon={<DotNetIcon />}
      />
    </Section>
  );
}
