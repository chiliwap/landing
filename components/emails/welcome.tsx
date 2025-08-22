import * as React from "react";
import {
  Html,
  Preview,
  Body,
  Tailwind,
  pixelBasedPreset,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import { Img } from "@react-email/img";

export type WelcomeProps = {
  baseURL: string;
  firstName?: string | null;
};

export default function Welcome({ baseURL, firstName }: WelcomeProps) {
  const preview = "Welcome to Chiliwap — you're in!";
  const name = (firstName ?? "").trim();

  return (
    <Html lang="en">
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                background: "#f9fafb",
                foreground: "#111827",
                border: "#e5e7eb",
                muted: "#6b7280",
                accent: "#f54a00",
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-0 bg-background p-0 font-sans text-[14px] leading-[1.6] text-foreground">
          {/* Header */}
          <Container className="mx-auto w-full max-w-[600px] bg-white px-6 py-6">
            <Section className="text-center">
              <Link href={baseURL} className="inline-block">
                <Img
                  src={`${baseURL}/logo-reverse.png`}
                  alt="Chiliwap"
                  className="mx-auto mb-4 h-[48px] w-[48px]"
                />
              </Link>
            </Section>
            <Section className="text-left">
              <Heading as="h1" className="m-0 mb-2 text-[28px] font-bold">
                {name ? `Welcome, ${name}!` : "Welcome to Chiliwap News"}
              </Heading>
              <Text className="m-0 mb-4 text-[14px] text-muted">
                Thanks for subscribing to Chiliwap News. You'll get the latest
                on wildfire intelligence, tools, and product updates—designed to
                help communities prepare, respond, and rebuild smarter.
              </Text>
              <Section className="my-6">
                <Button
                  href={`${baseURL}/news`}
                  className="inline-block rounded bg-accent px-4 py-3 text-center text-[14px] font-semibold text-white no-underline"
                >
                  Explore the latest updates
                </Button>
              </Section>

              <Heading as="h2" className="m-0 mb-2 text-[18px] font-semibold">
                What to expect
              </Heading>
              <Text className="m-0 mb-2 text-[14px] text-foreground">
                - Product news and release notes
                <br />- Research, guides, and field stories
                <br />- Early access to features and pilots
              </Text>

              <Heading
                as="h2"
                className="m-0 mb-2 mt-6 text-[18px] font-semibold"
              >
                Start with a good read
              </Heading>
              <Text className="m-0 mb-1">
                <Link
                  href={`${baseURL}/article/a-builders-perspective`}
                  className="text-accent no-underline"
                >
                  A Builder's Perspective: Designing for Resilience
                </Link>
              </Text>
              <Text className="m-0 mb-4">
                <Link
                  href={`${baseURL}/article/firefighting-with-foresight`}
                  className="text-accent no-underline"
                >
                  Firefighting with Foresight
                </Link>
              </Text>

              <Hr className="my-6 border-t border-border" />

              <Text className="m-0 mb-2 text-[12px] text-muted">
                For questions, visit our{" "}
                <Link href={`${baseURL}/support`}>Support</Link> page. Learn how
                we handle data in our{" "}
                <Link href={`${baseURL}/privacy`}>Privacy Policy</Link>. If you
                prefer not to receive emails like this, you can{" "}
                <Link
                  href={`https://app.useplunk.com/unsubscribe/{{plunk_id}}`}
                  className="text-muted underline"
                >
                  unsubscribe here
                </Link>
                .
              </Text>
              <Text className="m-0 text-[12px] text-muted">
                © {new Date().getFullYear()} Chiliwap. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
