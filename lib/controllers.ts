// Temporary controller domain (stubbed) until real persistence + telemetry integration.
// Replace stub implementations with DynamoDB backed versions when CONTROLLERS_TABLE is available.

export type ControllerStatus = "online" | "offline" | "alert";

export interface ControllerMetrics {
  temperatureC?: number;
  humidityPct?: number;
  batteryPct?: number;
  signalPct?: number;
}

export interface Controller {
  id: string;
  userId: string;
  name: string;
  status: ControllerStatus;
  lastSeen: string; // ISO timestamp
  firmware: string;
  armed: boolean;
  metrics: ControllerMetrics;
  location?: string;
}

// In‑memory ephemeral stub store (per server instance). For demo only.
const _controllers: Controller[] = [];

function seed(userId: string) {
  if (_controllers.some((c) => c.userId === userId)) return;
  const now = Date.now();
  _controllers.push(
    {
      id: "ctrl_1",
      userId,
      name: "Primary Yard Controller",
      status: "online",
      lastSeen: new Date(now - 45_000).toISOString(),
      firmware: "1.2.3",
      armed: true,
      metrics: {
        temperatureC: 27.4,
        humidityPct: 31,
        batteryPct: 100,
        signalPct: 92,
      },
      location: "Front Pump House",
    },
    {
      id: "ctrl_2",
      userId,
      name: "North Ridge Node",
      status: "offline",
      lastSeen: new Date(now - 1000 * 60 * 57).toISOString(),
      firmware: "1.2.1",
      armed: false,
      metrics: {
        temperatureC: 25.1,
        humidityPct: 40,
        batteryPct: 76,
        signalPct: 0,
      },
      location: "North Tree Line",
    },
    {
      id: "ctrl_3",
      userId,
      name: "Valve Cluster B",
      status: "alert",
      lastSeen: new Date(now - 12_000).toISOString(),
      firmware: "1.3.0-beta",
      armed: true,
      metrics: {
        temperatureC: 34.9,
        humidityPct: 18,
        batteryPct: 64,
        signalPct: 70,
      },
      location: "Rear Slope",
    },
  );
}

export async function listUserControllers(
  userId: string,
): Promise<Controller[]> {
  if (!userId) return [];
  seed(userId);
  return _controllers.filter((c) => c.userId === userId).slice();
}

export async function renameController(
  userId: string,
  id: string,
  name: string,
) {
  const ctrl = _controllers.find((c) => c.userId === userId && c.id === id);
  if (ctrl) ctrl.name = name.trim().slice(0, 80);
}

export async function toggleArmed(userId: string, id: string) {
  const ctrl = _controllers.find((c) => c.userId === userId && c.id === id);
  if (ctrl) ctrl.armed = !ctrl.armed;
}

export async function requestSync(userId: string, id: string) {
  const ctrl = _controllers.find((c) => c.userId === userId && c.id === id);
  if (ctrl) ctrl.lastSeen = new Date().toISOString();
}

export async function rebootController(userId: string, id: string) {
  const ctrl = _controllers.find((c) => c.userId === userId && c.id === id);
  if (ctrl) {
    ctrl.status = "offline";
    setTimeout(() => {
      ctrl.status = "online";
      ctrl.lastSeen = new Date().toISOString();
    }, 1500);
  }
}

export async function registerController(userId: string, code: string) {
  const id = `ctrl_${Date.now()}`;
  _controllers.push({
    id,
    userId,
    name: `New Controller (${code.trim().toUpperCase()})`,
    status: "online",
    lastSeen: new Date().toISOString(),
    firmware: "1.0.0",
    armed: false,
    metrics: {
      temperatureC: 26,
      humidityPct: 35,
      batteryPct: 100,
      signalPct: 88,
    },
  });
}
