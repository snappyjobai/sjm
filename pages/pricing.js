import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import InFooter from "../components/inFooter";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe outside of component
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isStripeReady, setIsStripeReady] = useState(false);

  useEffect(() => {
    // Check if Stripe is loaded
    if (stripePromise) {
      stripePromise.then(() => setIsStripeReady(true));
    }
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        const data = await response.json();
        setPlans(data.plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePayment = async (priceId) => {
    if (!isStripeReady) {
      console.error("Stripe is not initialized");
      return;
    }

    try {
      const stripe = await stripePromise;
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, paymentMethod }),
      });

      const { sessionId } = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading text-accent mb-4">
            Ready to Get Started? 🚀
          </h1>
          <p className="text-xl text-gray-300">
            Choose the plan that fits your needs
          </p>
        </motion.div>

        {/* Payment Method Selection */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`px-6 py-2 rounded-lg transition-all ${
              paymentMethod === "card"
                ? "bg-accent text-white"
                : "bg-white/10 text-gray-300"
            }`}
          >
            💳 Card
          </button>
          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`px-6 py-2 rounded-lg transition-all ${
              paymentMethod === "paypal"
                ? "bg-accent text-white"
                : "bg-white/10 text-gray-300"
            }`}
          >
            <span className="text-[#009cde]">Pay</span>
            <span className="text-[#003087]">Pal</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative ${plan.recommended ? "md:-mt-4" : ""}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 text-center">
                  <span className="bg-accent text-white px-4 py-1 rounded-full text-sm">
                    Recommended
                  </span>
                </div>
              )}

              <div
                className={`
                  h-full p-8 rounded-2xl backdrop-blur-sm
                  border border-accent/20 bg-white/5
                  hover:bg-white/10 transition-all duration-300
                  ${plan.recommended ? "shadow-2xl shadow-accent/20" : ""}
                `}
              >
                <h3 className="text-2xl font-heading text-accent mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                      className="flex items-center text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-accent mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-full py-3 rounded-lg text-white font-medium
                    bg-gradient-to-r ${plan.color}
                    hover:shadow-lg hover:shadow-accent/20
                    transition-all duration-300
                  `}
                  onClick={() => handlePayment(plan.priceId)}
                >
                  {plan.name === "Free" ? "Get Started" : "Subscribe Now"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <InFooter />
    </div>
  );
}
