export default function StripeNotice() {
  return (
    <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-8 text-yellow-200">
      <h3 className="font-bold mb-2">⚠️ Stripe Configuration Required</h3>
      <p>
        To enable payments, please add your Stripe API keys to the .env.local
        file:
      </p>
      <pre className="mt-2 bg-black/30 p-2 rounded text-sm">
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...{"\n"}
        STRIPE_SECRET_KEY=sk_test_...
      </pre>
    </div>
  );
}
