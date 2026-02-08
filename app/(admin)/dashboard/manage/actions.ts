"use server";
import { getUser, listUserSessions, revokeSession } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function getSessions() {
  const user = await getUser();
  if (!user) return [];
  return listUserSessions(user.id);
}

export async function revoke(token: string) {
  await revokeSession(token);
  revalidatePath("/dashboard/manage");
}
