// this layout is b/c the child of this layout is a client component and metadata needs to be on server.
export const metadata = {
	title: "Privacy | Chiliwap",
	description:
		"Learn about our privacy practices and how we protect your information.",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
