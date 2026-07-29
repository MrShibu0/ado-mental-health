import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Ensure key exists to prevent crashing immediately in case of missing env var, 
// though typically you'd throw an error on startup.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

class StripeService {
  /**
   * Creates a Stripe Checkout Session
   */
  async createSession({ amount, frequency, name, email }) {
    // Determine the host for success/cancel URLs. In production, this should be an env variable.
    const domainUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // Stripe expects amounts in cents
    const amountInCents = Math.round(amount * 100);

    const sessionConfig = {
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: frequency === "monthly" ? "Monthly Donation - ADO Mental Health Center" : "One-Time Donation - ADO Mental Health Center",
              description: "Your contribution helps expand access to counseling, psychiatric care, and community mental health initiatives in La Gonâve, Haiti.",
            },
            unit_amount: amountInCents,
            ...(frequency === "monthly" && {
              recurring: { interval: "month" },
            }),
          },
          quantity: 1,
        },
      ],
      mode: frequency === "monthly" ? "subscription" : "payment",
      success_url: `${domainUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/donate/cancel`,
      metadata: {
        donorName: name,
        donorEmail: email,
        donationType: frequency,
      },
    };

    // If using the placeholder key, simulate a successful redirect for UI testing
    if (process.env.STRIPE_SECRET_KEY === "sk_test_placeholder_key" || !process.env.STRIPE_SECRET_KEY) {
      console.log("Using placeholder Stripe key. Simulating checkout redirect.");
      return `${domainUrl}/donate/success?session_id=mock_session_12345`;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return session.url;
  }

  /**
   * Verifies the Stripe Webhook signature
   */
  verifyWebhook(rawBody, signature) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      throw new Error("Missing Stripe Webhook Secret");
    }
    return stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  }
}

export default new StripeService();
