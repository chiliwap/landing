import {
    DASHBOARD_ACTIVITY_TABLE,
    DASHBOARD_ALERTS_TABLE,
    DASHBOARD_OVERVIEW_TABLE,
    DASHBOARD_SCHEDULE_TABLE,
    dynamodb,
} from "./dynamodb";
import {
    BatchWriteCommand,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const USER_ID_REGEX = /^user_[0-9]{10,20}_[a-z0-9]{5,}$/i;
const TEST_USER_ID = "user_1758693651591_3resv3c7v";

export type TrendDirection = "up" | "down" | "flat";

export interface DashboardKpi {
    id: string;
    label: string;
    value: string;
    delta: string;
    trend: TrendDirection;
}

export interface RiskTrendSummary {
    timeframe: string;
    stats: {
        peak: number;
        low: number;
        delta: number;
    };
    series?: { timestamp: number; value: number }[];
    narrative?: string;
}

export interface WaterUsageSummary {
    today: string;
    sevenDayAvg: string;
    projection: string;
    notes?: string;
}

export interface UpcomingItem {
    id: string;
    title: string;
    when: string;
    note?: string;
}

export type FireDangerRating =
    | "low"
    | "moderate"
    | "high"
    | "extreme"
    | "catastrophic";

export interface WeatherConditions {
    temperatureC: number;
    humidityPct: number;
    windSpeedKmh: number;
    fireDangerRating: FireDangerRating;
    lastUpdated: string;
    narrative?: string;
}

export interface DashboardOverview extends Record<string, unknown> {
    userId: string;
    kpis: DashboardKpi[];
    riskTrend: RiskTrendSummary;
    waterUsage: WaterUsageSummary;
    upcoming: UpcomingItem[];
    alertsSummary: {
        activeCount: number;
        description: string;
    };
    updatedAt: string;
}

export interface DashboardActivityItem extends Record<string, unknown> {
    userId: string;
    timestamp: number;
    eventId: string;
    category: "controller" | "automation" | "user" | "alert" | string;
    summary: string;
    actor?: string;
    createdAt: string;
}

export interface DashboardAlertThreshold {
    id: string;
    label: string;
    trigger: string;
    current: string;
    status: "armed" | "idle" | "disabled" | string;
}

export interface DashboardAlertHistoryItem {
    id: string;
    timestamp: number;
    label: string;
}

export interface DashboardAlertConfig extends Record<string, unknown> {
    userId: string;
    thresholds: DashboardAlertThreshold[];
    history: DashboardAlertHistoryItem[];
    activeCount: number;
    updatedAt: string;
    notes?: string;
}

export type ScheduleStatus = "scheduled" | "active" | "completed" | "cancelled";
export type ScheduleCategory =
    | "pre-soak"
    | "maintenance"
    | "firmware"
    | "inspection"
    | "custom";

export interface ScheduleItem {
    id: string;
    title: string;
    category: ScheduleCategory;
    status: ScheduleStatus;
    scheduledAt: number;
    durationMinutes: number;
    note?: string;
    controllerId?: string;
    controllerName?: string;
}

export interface DashboardSchedule extends Record<string, unknown> {
    userId: string;
    items: ScheduleItem[];
    updatedAt: string;
}

function assertValidUserId(userId: string) {
    if (!userId || !USER_ID_REGEX.test(userId)) {
        throw new Error("Invalid user identifier");
    }
}

function nowIso() {
    return new Date().toISOString();
}

function buildDefaultOverview(userId: string): DashboardOverview {
    return {
        userId,
        kpis: [
            {
                id: "controllers_online",
                label: "Controllers Online",
                value: "0",
                delta: "0",
                trend: "flat",
            },
            {
                id: "active_alerts",
                label: "Active Alerts",
                value: "0",
                delta: "0",
                trend: "flat",
            },
            {
                id: "risk_index",
                label: "Risk Index (24h avg)",
                value: "–",
                delta: "0",
                trend: "flat",
            },
            {
                id: "water_usage",
                label: "Water Usage (Today)",
                value: "0 L",
                delta: "0%",
                trend: "flat",
            },
        ],
        riskTrend: {
            timeframe: "24h",
            stats: {
                peak: 0,
                low: 0,
                delta: 0,
            },
            narrative:
                "Telemetry has not started reporting yet. Once controllers come online we will display risk movements here.",
            series: [],
        },
        waterUsage: {
            today: "0 L",
            sevenDayAvg: "0 L",
            projection: "–",
            notes:
                "Usage charts are empty until the first automated soak runs complete.",
        },
        upcoming: [],
        alertsSummary: {
            activeCount: 0,
            description:
                "No alerts configured yet. Visit Alerts to arm thresholds for humidity, temperature, and wind.",
        },
        updatedAt: nowIso(),
    };
}

function buildTestOverview(): DashboardOverview {
    const base = buildDefaultOverview(TEST_USER_ID);
    return {
        ...base,
        kpis: [
            {
                id: "controllers_online",
                label: "Controllers Online",
                value: "3",
                delta: "+1",
                trend: "up",
            },
            {
                id: "active_alerts",
                label: "Active Alerts",
                value: "0",
                delta: "0",
                trend: "flat",
            },
            {
                id: "risk_index",
                label: "Risk Index (24h avg)",
                value: "62",
                delta: "+4",
                trend: "up",
            },
            {
                id: "water_usage",
                label: "Water Usage (Today)",
                value: "118 L",
                delta: "-12%",
                trend: "down",
            },
        ],
        riskTrend: {
            timeframe: "24h",
            stats: { peak: 71, low: 54, delta: 9 },
            narrative:
                "Risk conditions rose modestly overnight but remain within automated response thresholds.",
            series: Array.from({ length: 12 }).map((_, idx) => ({
                timestamp: Date.now() - (12 - idx) * 60 * 60 * 1000,
                value: 48 + idx * 2,
            })),
        },
        waterUsage: {
            today: "118 L",
            sevenDayAvg: "132 L",
            projection: "↓ 8%",
            notes:
                "Usage softened after the dawn pre-soak. Expect similar draw tomorrow based on conditions.",
        },
        upcoming: [
            {
                id: "u1",
                title: "Scheduled Pre-Soak",
                when: "Tomorrow 06:00",
                note: "Eaves + perimeter",
            },
            {
                id: "u2",
                title: "Firmware Update window",
                when: "Oct 06 02:00",
                note: "Applies to 2 controllers",
            },
        ],
        alertsSummary: {
            activeCount: 0,
            description:
                "Controllers are monitoring humidity & temperature thresholds. No active alerts.",
        },
        updatedAt: nowIso(),
    };
}

async function putIfAbsent(
    tableName: string,
    item: Record<string, unknown>,
    keyName: string,
) {
    try {
        await dynamodb.send(
            new PutCommand({
                TableName: tableName,
                Item: item,
                ConditionExpression: `attribute_not_exists(#${keyName})`,
                ExpressionAttributeNames: { [`#${keyName}`]: keyName },
            }),
        );
    } catch (error: unknown) {
        // Ignore conditional failure (item already exists)
        if (
            !(error as { name?: string }).name?.includes(
                "ConditionalCheckFailed",
            )
        ) {
            throw error;
        }
    }
}

function buildDefaultAlertConfig(userId: string): DashboardAlertConfig {
    return {
        userId,
        thresholds: [],
        history: [],
        activeCount: 0,
        updatedAt: nowIso(),
        notes:
            "Add your first alert to automatically queue mitigations when thresholds are exceeded.",
    };
}

function buildTestAlertConfig(): DashboardAlertConfig {
    return {
        userId: TEST_USER_ID,
        thresholds: [
            {
                id: "t1",
                label: "High Temperature",
                trigger: "≥ 60°C",
                current: "54°C",
                status: "armed",
            },
            {
                id: "t2",
                label: "Low Humidity",
                trigger: "≤ 22%",
                current: "18%",
                status: "armed",
            },
            {
                id: "t3",
                label: "Wind Speed",
                trigger: "≥ 35km/h",
                current: "14km/h",
                status: "idle",
            },
        ],
        history: [
            {
                id: "h1",
                timestamp: Date.now() - 90 * 60 * 1000,
                label: "Low humidity threshold crossed (auto‑soak queued)",
            },
            {
                id: "h2",
                timestamp: Date.now() - 300 * 60 * 1000,
                label: "High temp alert cleared",
            },
        ],
        activeCount: 0,
        updatedAt: nowIso(),
        notes:
            "Demo alerts only – wire to telemetry ingestion service for live triggers.",
    };
}

function buildTestActivitySeed(): DashboardActivityItem[] {
    const baseTs = Date.now();
    return [
        {
            userId: TEST_USER_ID,
            eventId: "evt_1",
            timestamp: baseTs - 12 * 60 * 1000,
            category: "controller",
            summary:
                "Controller Barn-West telemetry sync (temp 54°C, humidity 18%).",
            actor: "system",
            createdAt: nowIso(),
        },
        {
            userId: TEST_USER_ID,
            eventId: "evt_2",
            timestamp: baseTs - 55 * 60 * 1000,
            category: "automation",
            summary: "Perimeter pre-soak completed (duration 4m, 38 L).",
            actor: "automation",
            createdAt: nowIso(),
        },
        {
            userId: TEST_USER_ID,
            eventId: "evt_3",
            timestamp: baseTs - 130 * 60 * 1000,
            category: "controller",
            summary: "Controller Ridge-Line armed for auto-response.",
            actor: "system",
            createdAt: nowIso(),
        },
    ];
}

async function batchWriteAll(table: string, items: DashboardActivityItem[]) {
    type ActivityWriteRequest = { PutRequest: { Item: DashboardActivityItem } };
    const chunkSize = 25;
    for (let i = 0; i < items.length; i += chunkSize) {
        let requests: ActivityWriteRequest[] = items.slice(i, i + chunkSize)
            .map(
                (item) => ({
                    PutRequest: {
                        Item: item,
                    },
                }),
            );
        let attempts = 0;
        while (requests.length) {
            const response = await dynamodb.send(
                new BatchWriteCommand({
                    RequestItems: {
                        [table]: requests,
                    },
                }),
            );
            const unprocessed = response.UnprocessedItems?.[table];
            if (!unprocessed || unprocessed.length === 0) {
                break;
            }
            const requeue: ActivityWriteRequest[] = [];
            for (const req of unprocessed) {
                const item = req.PutRequest?.Item as
                    | DashboardActivityItem
                    | undefined;
                if (item) {
                    requeue.push({ PutRequest: { Item: item } });
                }
            }
            requests = requeue;
            attempts += 1;
            if (attempts >= 5) {
                throw new Error(
                    "Failed to batch write dashboard activity after retries",
                );
            }
            await new Promise((resolve) => setTimeout(resolve, 50 * attempts));
        }
    }
}

function buildDefaultSchedule(userId: string): DashboardSchedule {
    return {
        userId,
        items: [],
        updatedAt: nowIso(),
    };
}

function buildTestSchedule(): DashboardSchedule {
    const now = Date.now();
    return {
        userId: TEST_USER_ID,
        items: [
            {
                id: "s1",
                title: "Dawn Pre-Soak — Eaves & Perimeter",
                category: "pre-soak",
                status: "scheduled",
                scheduledAt: now + 14 * 60 * 60 * 1000,
                durationMinutes: 8,
                note: "Automated trigger at 06:00 if humidity < 30%",
                controllerId: "ctrl_barn_west",
                controllerName: "Barn-West",
            },
            {
                id: "s2",
                title: "Firmware Update — v2.4.1",
                category: "firmware",
                status: "scheduled",
                scheduledAt: now + 2 * 24 * 60 * 60 * 1000,
                durationMinutes: 15,
                note: "Applies to 2 controllers (Barn-West, Ridge-Line)",
            },
            {
                id: "s3",
                title: "Quarterly Nozzle Inspection",
                category: "inspection",
                status: "scheduled",
                scheduledAt: now + 10 * 24 * 60 * 60 * 1000,
                durationMinutes: 45,
                note: "Check spray patterns and clear debris",
            },
            {
                id: "s4",
                title: "Filter Replacement — Ridge-Line",
                category: "maintenance",
                status: "active",
                scheduledAt: now - 30 * 60 * 1000,
                durationMinutes: 20,
                controllerId: "ctrl_ridge_line",
                controllerName: "Ridge-Line",
            },
            {
                id: "s5",
                title: "Perimeter Pre-Soak",
                category: "pre-soak",
                status: "completed",
                scheduledAt: now - 6 * 60 * 60 * 1000,
                durationMinutes: 4,
                note: "Completed — 38 L used",
                controllerId: "ctrl_barn_west",
                controllerName: "Barn-West",
            },
            {
                id: "s6",
                title: "Pump Pressure Calibration",
                category: "maintenance",
                status: "completed",
                scheduledAt: now - 2 * 24 * 60 * 60 * 1000,
                durationMinutes: 30,
                note: "Adjusted to 4.2 bar",
            },
            {
                id: "s7",
                title: "Emergency Drill — Full Activation",
                category: "custom",
                status: "cancelled",
                scheduledAt: now - 4 * 24 * 60 * 60 * 1000,
                durationMinutes: 60,
                note: "Cancelled due to water restrictions",
            },
        ],
        updatedAt: nowIso(),
    };
}

async function ensureTestSeeds(userId: string) {
    if (userId !== TEST_USER_ID) return;

    const existingActivity = await dynamodb.send(
        new QueryCommand({
            TableName: DASHBOARD_ACTIVITY_TABLE,
            KeyConditionExpression: "#uid = :uid",
            ExpressionAttributeNames: { "#uid": "userId" },
            ExpressionAttributeValues: { ":uid": userId },
            Limit: 1,
        }),
    );

    if (!existingActivity.Items || existingActivity.Items.length === 0) {
        await batchWriteAll(DASHBOARD_ACTIVITY_TABLE, buildTestActivitySeed());
    }

    await putIfAbsent(DASHBOARD_OVERVIEW_TABLE, buildTestOverview(), "userId");
    await putIfAbsent(DASHBOARD_ALERTS_TABLE, buildTestAlertConfig(), "userId");
    await putIfAbsent(DASHBOARD_SCHEDULE_TABLE, buildTestSchedule(), "userId");
}

export async function getDashboardOverview(
    userId: string,
): Promise<DashboardOverview> {
    assertValidUserId(userId);
    await ensureTestSeeds(userId);

    const result = await dynamodb.send(
        new GetCommand({
            TableName: DASHBOARD_OVERVIEW_TABLE,
            Key: { userId },
        }),
    );

    if (result.Item) {
        const overview = result.Item as DashboardOverview;
        return overview;
    }

    const fallback = buildDefaultOverview(userId);
    await putIfAbsent(DASHBOARD_OVERVIEW_TABLE, fallback, "userId");
    return fallback;
}

export async function listDashboardActivity(
    userId: string,
    { limit }: { limit?: number } = {},
): Promise<DashboardActivityItem[]> {
    assertValidUserId(userId);
    await ensureTestSeeds(userId);

    const result = await dynamodb.send(
        new QueryCommand({
            TableName: DASHBOARD_ACTIVITY_TABLE,
            KeyConditionExpression: "#uid = :uid",
            ExpressionAttributeNames: { "#uid": "userId" },
            ExpressionAttributeValues: { ":uid": userId },
            ScanIndexForward: false,
            Limit: limit,
        }),
    );

    const items = (result.Items || []) as DashboardActivityItem[];
    return items.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getDashboardAlertConfig(
    userId: string,
): Promise<DashboardAlertConfig> {
    assertValidUserId(userId);
    await ensureTestSeeds(userId);

    const result = await dynamodb.send(
        new GetCommand({
            TableName: DASHBOARD_ALERTS_TABLE,
            Key: { userId },
        }),
    );

    if (result.Item) {
        const config = result.Item as DashboardAlertConfig;
        return {
            ...config,
            activeCount: config.thresholds.filter((t) =>
                t.status === "armed"
            ).length,
        };
    }

    const fallback = buildDefaultAlertConfig(userId);
    await putIfAbsent(DASHBOARD_ALERTS_TABLE, fallback, "userId");
    return fallback;
}

export async function getDashboardSchedule(
    userId: string,
): Promise<DashboardSchedule> {
    assertValidUserId(userId);
    await ensureTestSeeds(userId);

    const result = await dynamodb.send(
        new GetCommand({
            TableName: DASHBOARD_SCHEDULE_TABLE,
            Key: { userId },
        }),
    );

    if (result.Item) {
        return result.Item as DashboardSchedule;
    }

    const fallback = buildDefaultSchedule(userId);
    await putIfAbsent(DASHBOARD_SCHEDULE_TABLE, fallback, "userId");
    return fallback;
}
