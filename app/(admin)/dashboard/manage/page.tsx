import { getUser } from "@/lib/dal";
import ControllerStateManager from "@/components/controllers/controller-state-manager";
import {
	fetchControllers,
	toggleArmedAction,
	syncAction,
	rebootAction,
	actionRegister,
} from "./controller-actions";

export default async function ManageDevicesPage() {
	const user = await getUser();
	if (!user) {
		return (
			<main className="max-w-xl mx-auto px-4 py-20">
				<h1 className="text-2xl font-semibold mb-2 text-white">Unauthorized</h1>
				<p className="text-neutral-400 text-sm">
					Please log in to manage sessions.
				</p>
			</main>
		);
	}
	const controllers = await fetchControllers();

	return (
		<main className="pb-24">
			<header className="border-b border-white/5 bg-gradient-to-b from-white/5/0 via-white/[0.02] to-transparent">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
					<h1 className="text-3xl font-semibold tracking-tight text-white">
						Controllers
					</h1>
					<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
						Monitor, update, and orchestrate your deployed Chiliwap controller
						hardware. Arm systems, sync telemetry, reboot nodes, and register
						new devices.
					</p>
				</div>
			</header>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-12">
				<section>
					<div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
						<div className="flex-1 min-w-0">
							<h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
								Deployed Controllers
							</h2>
							<p className="text-[11.5px] text-neutral-500 max-w-xl leading-relaxed">
								Each controller monitors local environmental conditions
								(temperature, humidity) and orchestrates valves & pumps. Arm a
								unit to allow automatic protective responses when thresholds are
								met.
							</p>
						</div>
						<div className="md:w-72">
							<form action={actionRegister} className="flex gap-2">
								<input
									name="code"
									placeholder="Claim / pairing code"
									className="flex-1 bg-neutral-900/60 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
								/>
								<button
									type="submit"
									className="cursor-pointer text-xs px-3 py-2 rounded-md bg-white text-neutral-900 font-medium hover:bg-white/90 transition"
								>
									Register
								</button>
							</form>
							<p className="mt-1 text-[10px] text-neutral-500">
								Enter the code shown on the controller OLED or provisioning
								label.
							</p>
						</div>
					</div>

					{controllers.length === 0 ? (
						<p className="text-sm text-neutral-500 border border-dashed border-white/10 rounded-lg p-8 text-center">
							No controllers registered yet.
						</p>
					) : (
						<ControllerStateManager
							controllers={controllers}
							actions={{
								toggle: toggleArmedAction,
								sync: syncAction,
								reboot: rebootAction,
							}}
						/>
					)}

					<p className="mt-8 text-[11px] text-neutral-500 leading-relaxed max-w-2xl">
						Telemetry updates reflect the last reported values. Sync attempts to
						fetch fresh metrics; reboot cycles power virtually. Controller
						registration is provisional in this demo environment.
					</p>
				</section>
			</div>
		</main>
	);
}
