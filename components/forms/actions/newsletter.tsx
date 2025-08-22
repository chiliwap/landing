"use server";

import Plunk from "@plunk/node";
import { render } from "@react-email/render";
import Welcome from "../../emails/welcome";

export async function subscribe(formData: FormData) {
  const email = formData.get("email");
  if (!email || typeof email !== "string") return;

  const body = await render(<Welcome baseURL="https://upcoming.chiliwap.ca" />);

  const plunk = new Plunk(process.env.PLUNK_API_KEY!);
  await plunk.emails.send({
    name: "Chiliwap News",
    to: email,
    subject: "Welcome to Chiliwap News",
    subscribed: true,
    body,
  });
}
