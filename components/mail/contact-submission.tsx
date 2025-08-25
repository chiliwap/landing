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
	Hr,
	Link,
} from "@react-email/components";

export type ContactSubmissionProps = {
	baseURL: string;
	name: string;
	email: string;
	phone?: string;
	subject?: string;
	message: string;
};

export default function ContactSubmission({
	baseURL,
	name,
	email,
	phone,
	subject,
	message,
}: ContactSubmissionProps) {
	const preview = `New contact from ${name}`;

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
				<Body className="text-foreground mx-auto my-0 bg-background p-0 font-sans text-[14px] leading-[1.6]">
					<Container className="mx-auto w-full max-w-[640px] bg-background px-6 py-6">
						<Section className="text-center">
							<Heading as="h1" className="m-0 mb-2 text-[22px] font-bold">
								New Contact Form Submission
							</Heading>
							<Text className="m-0 text-muted">
								From {name} &lt;{email}&gt;
							</Text>
						</Section>

						<Section className="mt-6 rounded-lg border border-border p-4 bg-black/20">
							<Heading as="h2" className="m-0 mb-3 text-[16px] font-semibold">
								Details
							</Heading>
							<Text className="m-0 mb-1">
								<strong>Name:</strong> {name}
							</Text>
							<Text className="m-0 mb-1">
								<strong>Email:</strong>{" "}
								<Link href={`mailto:${email}`} className="text-accent">
									{email}
								</Link>
							</Text>
							{phone ? (
								<Text className="m-0 mb-1">
									<strong>Phone:</strong>{" "}
									<Link href={`tel:${phone}`} className="text-accent">
										{phone}
									</Link>
								</Text>
							) : null}
							{subject ? (
								<Text className="m-0 mb-1">
									<strong>Subject:</strong> {subject}
								</Text>
							) : null}
						</Section>

						<Section className="mt-6 rounded-lg border border-border p-4 bg-black/20">
							<Heading as="h2" className="m-0 mb-3 text-[16px] font-semibold">
								Message
							</Heading>
							<Text className="whitespace-pre-wrap">{message}</Text>
						</Section>

						<Hr className="my-6 border-t border-border" />
						<Text className="m-0 text-[12px] text-muted">
							Sent from{" "}
							<Link href={`${baseURL}/contact`} className="text-accent">
								chiliwap.ca/contact
							</Link>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
