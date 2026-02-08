"use client";

import { useState } from "react";
import type { Controller } from "@/lib/controllers";
import ZoneMap from "./zone-map";
import ControllerTable from "./controller-table";

interface Props {
	controllers: Controller[];
	actions: {
		toggle: (formData: FormData) => void | Promise<void>;
		sync: (formData: FormData) => void | Promise<void>;
		reboot: (formData: FormData) => void | Promise<void>;
	};
}

export default function ControllerStateManager({ controllers, actions }: Props) {
	const [highlightedId, setHighlightedId] = useState<string | null>(null);

	return (
		<div className="space-y-6">
			<ZoneMap
				controllers={controllers}
				highlightedId={highlightedId}
				onHighlight={setHighlightedId}
			/>
			<ControllerTable
				controllers={controllers}
				highlightedId={highlightedId}
				onRowHover={setHighlightedId}
				actions={actions}
			/>
		</div>
	);
}
