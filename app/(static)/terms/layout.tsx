// this layout is b/c the child of this layout is a client component and metadata needs to be on server.
export const metadata = {
	title: "Terms | Chiliwap",
	description: "Read the terms and conditions for using Chiliwap's services.",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
