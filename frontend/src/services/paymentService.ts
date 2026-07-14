const API_BASE = "http://localhost:5000";

export interface SubscriptionStatus {
  active: boolean;
  plan: string | null;
  expiresOn: string | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Injects the Razorpay checkout script once and reuses it on subsequent calls.
let razorpayScriptPromise: Promise<boolean> | null = null;

export const loadRazorpayScript = (): Promise<boolean> => {
  if (window.Razorpay) return Promise.resolve(true);

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
};

export interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: { chatbot: boolean; iot: boolean };
}

export const getPlans = async (): Promise<Plan[]> => {
  const res = await fetch(`${API_BASE}/subscription/plans`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.plans || [];
};

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const res = await fetch(`${API_BASE}/subscription/status`, {
    credentials: "include",
  });

  if (!res.ok) {
    return { active: false, plan: null, expiresOn: null };
  }

  return res.json();
};

export const createOrder = async (planId: string) => {
  const res = await fetch(`${API_BASE}/payment/create-order`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Could not create order");
  }

  return res.json() as Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }>;
};

export const verifyPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await fetch(`${API_BASE}/payment/verify`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Payment verification failed");
  }

  return res.json();
};

// Orchestrates the full flow: create order -> open Razorpay checkout -> verify.
// Resolves with the fresh subscription status once verification succeeds.
export const subscribeToPlan = async (
  planId: string,
  patientName: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    onError("Could not load Razorpay checkout. Check your connection and try again.");
    return;
  }

  try {
    const order = await createOrder(planId);

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Nidaan Health",
      description: "Premium Subscription",
      order_id: order.orderId,
      prefill: { name: patientName },
      theme: { color: "#2563eb" },
      handler: async (response: any) => {
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          onSuccess();
        } catch (err: any) {
          onError(err.message || "Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => {
          // user closed the checkout without paying — nothing to do
        },
      },
    });

    razorpay.on("payment.failed", () => {
      onError("Payment failed. Please try again.");
    });

    razorpay.open();
  } catch (err: any) {
    onError(err.message || "Could not start checkout");
  }
};
