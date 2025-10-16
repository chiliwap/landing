"use server";

import { dynamodb, USERS_TABLE } from "@/lib/dynamodb";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { getUser, type User } from "@/lib/auth";

export interface ProfileUpdateState {
	ok: boolean;
	error?: string;
	user?: Partial<User>;
}

function sanitizeName(input: string) {
	return input.replace(/\s+/g, " ").trim();
}

function sanitizePhone(input: string) {
	// Normalize common extension markers to 'x'
	let cleaned = input.replace(/ext\.?/gi, "x");
	// Extract extension (x1234 at end or after space)
	let ext = "";
	const extMatch = cleaned.match(/(?:x)\s*(\d{1,10})$/i);
	if (extMatch) {
		ext = extMatch[1];
		cleaned = cleaned.slice(0, extMatch.index).trim();
	}
	// Digits only for main part
	let digits = cleaned.replace(/[^0-9]/g, "");
	// Support leading country code 1
	let country = "";
	if (digits.length > 10 && digits[0] === "1") {
		country = "+1 ";
		digits = digits.slice(1);
	}
	// Limit to 10 for formatting
	const core = digits.slice(0, 10);
	let formatted = core;
	if (core.length >= 1 && core.length <= 3) {
		formatted = `(${core}`;
	} else if (core.length > 3 && core.length <= 6) {
		formatted = `(${core.slice(0, 3)}) ${core.slice(3)}`;
	} else if (core.length > 6) {
		formatted = `(${core.slice(0, 3)}) ${core.slice(3, 6)}-${core.slice(6)}`;
	}
	if (formatted.endsWith("(") && core.length < 3) {
		// do nothing special, user still typing area code
	}
	let result = (country + formatted).trim();
	if (ext) result += ` x${ext}`;
	return result;
}

function sanitizeAddress(input: string) {
	return input.trim();
}

export async function updateProfile(
	formData: FormData
): Promise<ProfileUpdateState> {
	try {
		const user = await getUser();
		if (!user) return { ok: false, error: "Not authenticated." };

		// honeypot
		const botField = (formData.get("company") || "").toString();
		if (botField) return { ok: true }; // silently succeed

		const nameRaw = (formData.get("name") || "").toString();
		const phoneRaw = (formData.get("phone") || "").toString();
		const addressRaw = (formData.get("address") || "").toString();

		const name = sanitizeName(nameRaw).slice(0, 120);
		const phone = sanitizePhone(phoneRaw).slice(0, 40);
		const address = sanitizeAddress(addressRaw).slice(0, 240);

		if (!name) return { ok: false, error: "Name is required." };

		// Basic phone heuristic (optional)
		if (phone && phone.replace(/[^0-9]/g, "").length < 7) {
			return { ok: false, error: "Enter a valid phone number or leave blank." };
		}

		const now = new Date().toISOString();

		// Build dynamic update expression to avoid setting placeholders with undefined values
		const setParts: string[] = ["#name = :name", "#updatedAt = :now"];
		const removeParts: string[] = [];
		const names: Record<string, string> = {
			"#name": "name",
			"#updatedAt": "updatedAt",
		};
		const values: Record<string, any> = { ":name": name, ":now": now };

		if (phone) {
			setParts.push("#phone = :phone");
			names["#phone"] = "phone";
			values[":phone"] = phone;
		} else {
			removeParts.push("#phone");
			names["#phone"] = "phone";
		}
		if (address) {
			setParts.push("#address = :address");
			names["#address"] = "address";
			values[":address"] = address;
		} else {
			removeParts.push("#address");
			names["#address"] = "address";
		}

		let UpdateExpression = `SET ${setParts.join(", ")}`;
		if (removeParts.length) {
			UpdateExpression += ` REMOVE ${removeParts.join(", ")}`;
		}

		await dynamodb.send(
			new UpdateCommand({
				TableName: USERS_TABLE,
				Key: { id: user.id },
				UpdateExpression,
				ExpressionAttributeNames: names,
				ExpressionAttributeValues: values,
			})
		);

		// fetch updated user subset for client (avoid re-fetch full auth logic here)
		const updated = await dynamodb.send(
			new GetCommand({ TableName: USERS_TABLE, Key: { id: user.id } })
		);
		const updatedUser = (updated.Item || {}) as User;
		return {
			ok: true,
			user: {
				name: updatedUser.name,
				phone: updatedUser.phone,
				address: updatedUser.address,
				updatedAt: updatedUser.updatedAt,
			},
		};
	} catch (e) {
		console.error("updateProfile error", e);
		return { ok: false, error: "Failed to update profile." };
	}
}
