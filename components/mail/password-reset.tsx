import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
	Heading,
} from "@react-email/components";

export interface PasswordResetEmailProps {
	resetUrl: string;
	name?: string;
}

export function PasswordResetEmail({
	resetUrl,
	name,
}: PasswordResetEmailProps) {
	const displayName = name || "there";

	return (
		<Html>
			<Head />
			<Preview>Password reset for Chiliwap</Preview>
			<Tailwind>
				<Body className="bg-white font-sans">
					<Container className="mx-auto my-10 p-6 border border-solid border-neutral-200 rounded">
						<Heading className="text-2xl font-semibold mb-2">
							Reset your password
						</Heading>

						<Text className="text-neutral-700 mb-4">Hi {displayName},</Text>

						<Text className="text-neutral-700 mb-4">
							We received a request to reset the password for your Chiliwap
							account. Click the button below to set a new password. This link
							will expire in 15 minutes.
						</Text>

						<Section className="mb-4">
							<Button
								className="bg-black text-white px-4 py-3 rounded"
								href={resetUrl}
							>
								Reset password
							</Button>
						</Section>

						<Text className="text-neutral-600 text-sm mb-4 break-words">
							If the button above does not work, copy and paste this URL into
							your browser:
							<br />
							<a href={resetUrl} className="text-blue-600 underline">
								{resetUrl}
							</a>
						</Text>

						<Text className="text-neutral-500 text-sm mt-6">
							If you didn&apos;t request this, you can safely ignore this email.
						</Text>

						<Text className="text-neutral-400 text-xs mt-6">
							Need help? Contact us at support@chiliwap.com
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export default PasswordResetEmail;
