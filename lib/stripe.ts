import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY env var is required for billing.");
}

// Lazily instantiate a single Stripe client (Next.js server modules are cached).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // Use default apiVersion from library typings; pin if needed.
    appInfo: { name: "chiliwap-landing" },
});

export async function getOrCreateCustomer(
    params: { id: string; email: string; name?: string },
): Promise<string> {
    // Use a deterministic metadata key to look up existing customer
    const search = await stripe.customers.search({
        query: `metadata['app_user_id']:'${params.id}'`,
        limit: 1,
    });
    if (search.data.length > 0) {
        return search.data[0].id;
    }
    const customer = await stripe.customers.create({
        email: params.email,
        name: params.name,
        metadata: { app_user_id: params.id },
    });
    return customer.id;
}
