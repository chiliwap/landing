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
	selectedTier: string;
};

export default function ContactSubmission({
	baseURL,
	name,
	email,
	phone,
	subject,
	message,
	selectedTier,
}: ContactSubmissionProps) {
	const preview = `New contact from ${name}`;
	const now = new Date().toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});
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
								card: "#fff",
								shadow: "rgba(0,0,0,0.04)",
							},
						},
					},
				}}
			>
				<Body className="mx-auto my-0 bg-background p-0 font-sans text-[15px] leading-[1.7] text-foreground">
					<Container
						className="mx-auto w-full max-w-[600px] bg-white px-6 py-6 rounded-2xl shadow-lg"
						style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}
					>
						<Section className="text-center mb-2">
							<Link href={baseURL} className="inline-block">
								<img
									src={`${baseURL}/logo.png`}
									alt="Chiliwap Logo"
									className="mx-auto mb-4 h-[40px] w-[40px]"
									style={{
										borderRadius: "8px",
										background: "#fff",
										boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
									}}
								/>
							</Link>
						</Section>
						<Section className="text-left">
							<Heading
								as="h1"
								className="m-0 mb-2 text-[22px] font-bold text-foreground"
							>
								New Contact Submission
							</Heading>
							<Text className="m-0 mb-2 text-muted text-[13px]">{now}</Text>
							<Section className="my-4">
								<Text className="m-0 text-[15px] text-foreground">
									<strong>Name:</strong> {name}
								</Text>
								<Text className="m-0 text-[15px] text-foreground">
									<strong>Email:</strong>{" "}
									<Link href={`mailto:${email}`} className="text-accent">
										{email}
									</Link>
								</Text>
								{phone && (
									<Text className="m-0 text-[15px] text-foreground">
										<strong>Phone:</strong>{" "}
										<Link href={`tel:${phone}`} className="text-accent">
											{phone}
										</Link>
									</Text>
								)}
								{subject && (
									<Text className="m-0 text-[15px] text-foreground">
										<strong>Subject:</strong> {subject}
									</Text>
								)}

								<Text className="m-0 text-[15px] text-foreground">
									<strong>Selected Tier:</strong> {selectedTier}
								</Text>
							</Section>
							<Section className="rounded-xl border border-border bg-black/5 p-4 mb-4">
								<Heading
									as="h2"
									className="m-0 mb-2 text-[16px] font-semibold text-foreground"
								>
									Message
								</Heading>
								<Text className="whitespace-pre-wrap text-foreground text-[15px]">
									{message}
								</Text>
							</Section>
							<Hr className="my-6 border-t border-border" />
							<Text className="m-0 text-[12px] text-muted">
								Sent from{" "}
								<Link href={`${baseURL}/contact`} className="text-accent">
									chiliwap.ca/contact
								</Link>
							</Text>
							<Text className="m-0 text-[12px] text-muted mt-1">
								<span className="inline-block px-2 py-1 rounded bg-accent/10 text-accent font-semibold">
									Chiliwap Internal
								</span>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
