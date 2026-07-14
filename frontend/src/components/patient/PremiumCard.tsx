import React, { useEffect, useState } from 'react';
import { Sparkles, Check, Watch, Loader2 } from 'lucide-react';
import { getPlans, subscribeToPlan, type Plan, type SubscriptionStatus } from '../../services/paymentService';

interface PremiumCardProps {
  subscription: SubscriptionStatus;
  patientName: string;
  onSubscribed: () => void;
}

const PremiumCard = ({ subscription, patientName, onSubscribed }: PremiumCardProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlans().then(setPlans);
  }, []);

  const premiumPlan = plans.find((p) => p.price > 0);

  const handleSubscribe = () => {
    if (!premiumPlan) return;
    setError(null);
    setLoading(true);

    subscribeToPlan(
      premiumPlan._id,
      patientName,
      () => {
        setLoading(false);
        onSubscribed();
      },
      (message) => {
        setLoading(false);
        setError(message);
      }
    );
  };

  if (subscription.active) {
    return (
      <div className="bg-white rounded-3xl shadow-card border border-gray-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Sparkles size={20} />
            Premium Active
          </div>
          <span className="text-xs font-medium bg-green-50 text-green-600 px-3 py-1 rounded-full">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-text-gray">Plan</p>
            <p className="font-semibold text-secondary">{subscription.plan}</p>
          </div>
          <div>
            <p className="text-text-gray">Expires</p>
            <p className="font-semibold text-secondary">
              {subscription.expiresOn
                ? new Date(subscription.expiresOn).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm mb-4">
          <span className="flex items-center gap-1 text-secondary">
            <Check size={16} className="text-green-500" /> AI Assistant
          </span>
          <span className="flex items-center gap-1 text-text-gray">
            <Watch size={16} /> Smartwatch (Coming Soon)
          </span>
        </div>

        <a
          href="/dashboard/patient/chat"
          className="block text-center bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          Open Assistant
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-card border border-gray-50 p-6">
      <div className="flex items-center gap-2 text-primary font-semibold mb-3">
        <Sparkles size={20} />
        AI Health Assistant
      </div>

      <ul className="space-y-2 mb-4 text-sm text-secondary">
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-500" /> Unlimited AI conversations
        </li>
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-500" /> Personalized responses
        </li>
        <li className="flex items-center gap-2 text-text-gray">
          <Check size={16} className="text-gray-300" /> Smartwatch Integration (Coming Soon)
        </li>
      </ul>

      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-secondary">
          {premiumPlan ? `\u20b9${premiumPlan.price}` : '—'}
          <span className="text-sm font-normal text-text-gray">/month</span>
        </p>
        <button
          onClick={handleSubscribe}
          disabled={!premiumPlan || loading}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Subscribe
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
    </div>
  );
};

export default PremiumCard;
