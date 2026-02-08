"use server";
import { getUser } from "@/lib/dal";
import {
  listUserControllers,
  rebootController,
  registerController,
  renameController,
  requestSync,
  toggleArmed,
} from "@/lib/controllers";
import { revalidatePath } from "next/cache";

export async function fetchControllers() {
  const user = await getUser();
  if (!user) return [];
  return listUserControllers(user.id);
}

// Legacy (id first) not used directly in forms now
export async function actionRename(id: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  const user = await getUser();
  if (user && name.trim()) {
    await renameController(user.id, id, name);
    revalidatePath("/dashboard/manage");
  }
}

// Form friendly server actions (FormData only)
export async function renameAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const user = await getUser();
  if (user && id && name.trim()) {
    await renameController(user.id, id, name.trim());
    revalidatePath("/dashboard/manage");
  }
}

export async function actionToggleArmed(id: string) {
  const user = await getUser();
  if (user) {
    await toggleArmed(user.id, id);
    revalidatePath("/dashboard/manage");
  }
}

export async function toggleArmedAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const user = await getUser();
  if (user && id) {
    await toggleArmed(user.id, id);
    revalidatePath("/dashboard/manage");
  }
}

export async function actionSync(id: string) {
  const user = await getUser();
  if (user) {
    await requestSync(user.id, id);
    revalidatePath("/dashboard/manage");
  }
}

export async function syncAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const user = await getUser();
  if (user && id) {
    await requestSync(user.id, id);
    revalidatePath("/dashboard/manage");
  }
}

export async function actionReboot(id: string) {
  const user = await getUser();
  if (user) {
    await rebootController(user.id, id);
    revalidatePath("/dashboard/manage");
  }
}

export async function rebootAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const user = await getUser();
  if (user && id) {
    await rebootController(user.id, id);
    revalidatePath("/dashboard/manage");
  }
}

export async function actionRegister(formData: FormData) {
  const code = String(formData.get("code") || "");
  const user = await getUser();
  if (user && code.trim()) {
    await registerController(user.id, code);
    revalidatePath("/dashboard/manage");
  }
}
