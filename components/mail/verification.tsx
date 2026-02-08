import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Link,
	Preview,
	Row,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
	verifyUrl: string;
}

export const VerificationEmail = ({ verifyUrl }: VerificationEmailProps) => (
	<Html>
		<Head />
		<Preview>Verify your Chiliwap account</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={box}>
					<Text style={heading}>Verify your email</Text>
					<Text style={paragraph}>
						Thanks for signing up! Click the link below to verify your email and
						activate your account.
					</Text>
					<Button style={button} href={verifyUrl}>
						Verify Email
					</Button>
					<Hr style={hr} />
					<Text style={paragraph}>
						Or copy and paste this link in your browser:
					</Text>
					<Link style={link} href={verifyUrl}>
						{verifyUrl}
					</Link>
					<Hr style={hr} />
					<Text style={footer}>
						This link expires in 24 hours. If you didn&apos;t create this
						account, you can safely ignore this email.
					</Text>
				</Section>
			</Container>
		</Body>
	</Html>
);

export default VerificationEmail;

const main = {
	backgroundColor: "#f3f3f5",
	fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
};

const container = {
	backgroundColor: "#ffffff",
	border: "1px solid #f3f3f5",
	borderRadius: "4px",
	margin: "40px auto",
	padding: "20px",
	marginBottom: "12px",
	maxWidth: "600px",
};

const box = {
	padding: "0 16px",
};

const hr = {
	borderColor: "#f3f3f5",
	margin: "20px 0",
};

const paragraph = {
	color: "#525f7f",
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
};

const heading = {
	color: "#1a1a1a",
	fontSize: "24px",
	fontWeight: "bold",
	margin: "16px 0",
	textAlign: "left" as const,
};

const button = {
	backgroundColor: "#ea580c",
	borderRadius: "4px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	padding: "12px 20px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block" as const,
	margin: "20px 0",
};

const link = {
	color: "#ea580c",
	textDecoration: "underline",
	fontSize: "14px",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
	lineHeight: "16px",
};
