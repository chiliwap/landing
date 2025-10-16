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
} from "@react-email/components";

export function MagicLinkEmail({ signInUrl }: { signInUrl: string }) {
	return (
		<Html>
			<Head />
			<Preview>Your secure sign-in link for Chiliwap</Preview>
			<Tailwind>
				<Body className="bg-white font-sans">
					<Container className="mx-auto my-10 p-6 border border-solid border-neutral-200 rounded">
						<Text className="text-2xl font-semibold mb-2">
							Sign in to Chiliwap
						</Text>
						<Text className="text-neutral-700 mb-4">
							Click the button below to sign in. This link will expire in 15
							minutes.
						</Text>
						<Section>
							<Button
								className="bg-black text-white px-4 py-3 rounded"
								href={signInUrl}
							>
								Sign in
							</Button>
						</Section>
						<Text className="text-neutral-500 text-sm mt-6">
							If you didn&apos;t request this link, you can safely ignore this
							email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export default MagicLinkEmail;
