import React from "react";
import DashboardSidebar from "../../components/layout/dashboard-sidebar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-screen w-full bg-neutral-950 text-neutral-200 overflow-hidden">
			<DashboardSidebar />
			{/* Shift content right on desktop to account for fixed sidebar */}
			<div className="ml-0 md:ml-64 h-full flex flex-col overflow-hidden">
				{/* Scroll only inside this container */}
				<div className="flex-1 overflow-y-auto pb-20 will-change-transform">
					{children}
				</div>
			</div>
		</div>
	);
}
