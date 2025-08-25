// this layout is b/c the child of this layout is a client component and metadata needs to be on server.
export const metadata = {
	title: "Support | Chiliwap",
	description: "See our FAQ for common questions and support resources.",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
