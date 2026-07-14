# Razorpay Subscription Integration — What Changed

## Backend (`backend/src`)

**New files**
- `schema/plan.ts` — Plan model (name, price, duration in days, features.chatbot / features.iot)
- `schema/subscription.ts` — Subscription model (patient, plan, status, startDate, endDate, autoRenew, paymentHistory)
- `schema/payment.ts` — Payment model (orderId, paymentId, signature, amount, status)
- `config/razorpay.ts` — Razorpay SDK instance, reads `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- `utils/paymentVerification.ts` — HMAC SHA256 signature check (`timingSafeEqual`, not `===`)
- `controllers/payment.controller.ts` — `createOrder`, `verifyPayment`
- `controllers/subscription.controller.ts` — `getStatus`, `getFeatures`, `getPlans`
- `middleware/requireSubscription.ts` — the reusable gate: attach to any route, no payment code changes needed per-feature
- `routes/payment.routes.ts` — `POST /payment/create-order`, `POST /payment/verify`
- `routes/subscription.routes.ts` — `GET /subscription/plans` (public), `GET /subscription/status`, `GET /subscription/features`
- `scripts/seedPlans.ts` — seeds "Free" and "Premium Monthly" (₹299) plans. Run with `npm run seed:plans` after `npm run build`.

**Modified**
- `app.ts` — mounted the two new route groups (`/payment`, `/subscription`)
- `schema/patient.ts` — added an optional `subscription` ref, kept in sync on successful payment
- `package.json` — added `razorpay` dependency + `seed:plans` script
- `.env` — added `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` placeholders (also see `.env.example`)

**Important — read before running:**
- Your repo has two backend entrypoints: `app.ts` (what `npm run dev`/`npm start` actually run) and an `index.ts` that references route files (`routes/auth.ts`, `routes/patient.ts`, etc.) that don't exist yet. I wired everything into `app.ts` since that's the live one. `index.ts` won't compile as-is — that's a pre-existing issue, not something I introduced (confirmed via `tsc --noEmit`).
- Put your real Razorpay test keys in `.env` before testing — `rzp_test_...` and the matching secret from the Razorpay dashboard.

## Frontend (`frontend/src`)

**New files**
- `services/paymentService.ts` — loads the Razorpay checkout script, `getPlans`, `getSubscriptionStatus`, `createOrder`, `verifyPayment`, and `subscribeToPlan` (orchestrates the full checkout flow)
- `components/patient/PremiumCard.tsx` — the before/after subscription card from your doc
- `components/patient/AssistantGate.tsx` — shows the "Premium Feature" locked screen or the real `Chatbot`, based on subscription status

**Modified**
- `layouts/DashboardLayout.tsx` — fetches subscription status once, exposes it (and a `refreshSubscription` callback) via `Outlet` context and to `Sidebar`
- `components/dashboard/Sidebar.tsx` — shows a lock icon next to "Assistant" when unsubscribed
- `pages/dashboard/patient/PatientHome.tsx` — renders `PremiumCard` between the welcome banner and the appointment/tip grid, per your layout doc
- `App.tsx` — `/dashboard/patient/chat` now renders `AssistantGate` instead of `Chatbot` directly

**Note on the chatbot itself:** `components/patient/Chatbot.tsx` calls `http://localhost:8000/query` directly — that's your separate Python AI service (`AI_chatbot/mainv2.py`), not a route on the Express backend. `requireSubscription` is ready to protect an Express route the moment you decide to proxy that call through Express (matching your doc's `auth → requireSubscription → chatbotController` pipeline); right now the gate is enforced entirely on the frontend via `AssistantGate`, which is fine for now but not a substitute for server-side enforcement if that Python service is reachable directly.

## To run it
```bash
cd backend && npm install && npm run build && npm run seed:plans && npm run dev
cd frontend && npm install && npm run dev
```
Both `npm install` and `npm run build` (backend) / `vite build` (frontend) were run against this exact code during development to confirm no new type errors or build failures.
