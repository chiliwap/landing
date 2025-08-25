// this layout is b/c the child of this layout is a client component and metadata needs to be on server.
export const metadata = {
	title: "About Us | Chiliwap",
	description:
		"Get to know Chiliwap, our mission, and the team behind the project.",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
