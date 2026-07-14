import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Lock, Check } from 'lucide-react';
import Chatbot from './Chatbot';
import PremiumCard from './PremiumCard';
import type { SubscriptionStatus } from '../../services/paymentService';

interface DashboardContext {
  user: { id: string; name: string; role: string };
  subscription: SubscriptionStatus;
  refreshSubscription: () => void;
}

const AssistantGate = () => {
  const context = useOutletContext<DashboardContext>();
  const subscription = context?.subscription || { active: false, plan: null, expiresOn: null };

  if (subscription.active) {
    return (
      <div className="max-w-2xl mx-auto">
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Lock size={28} />
      </div>
      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
        Premium Feature
      </p>
      <h2 className="text-2xl font-bold text-secondary mb-4">AI Health Assistant</h2>
      <p className="text-text-gray mb-6">Subscribe to unlock:</p>
      <ul className="space-y-2 mb-8 text-left inline-block text-secondary text-sm">
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-500" /> Unlimited AI Chat
        </li>
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-500" /> Personalized assistance
        </li>
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-500" /> Future smartwatch insights
        </li>
      </ul>

      <div className="max-w-xs mx-auto">
        <PremiumCard
          subscription={subscription}
          patientName={context?.user?.name || 'Patient'}
          onSubscribed={context?.refreshSubscription || (() => {})}
        />
      </div>
    </div>
  );
};

export default AssistantGate;
