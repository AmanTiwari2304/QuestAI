import React from "react";
// import "./Pricing.css"

export default function Pricing() {
    const plans = [
    {
      name: "Free",
      price: "₹0 / month",
      features: [
        "Access to QuestAI-5",
        "Limited file uploads",
        "Limited and slower image generation",
        "Limited memory and context",
        "Limited deep research"
      ],
      button: "Your current plan",
      disabled: true,
      color: "bg-gray-800"
    },
    {
      name: "Go",
      price: "₹399 / month",
      features: [
        "Access to QuestAI-5",
        "Expanded messaging and uploads",
        "Expanded and faster image creation",
        "Longer memory and context",
        "Projects, tasks, custom QuestAI"
      ],
      button: "Upgrade to Go",
      disabled: false,
      color: "bg-indigo-900"
    },
    {
      name: "Plus",
      price: "₹1,999 / month",
      features: [
        "QuestAI-5 with advanced reasoning",
        "Expanded messaging and uploads",
        "Expanded and faster image creation",
        "Expanded memory and context",
        "Projects, tasks, custom QuestAI"
      ],
      button: "Get Plus",
      disabled: false,
      color: "bg-gray-900"
    },
    {
      name: "Pro",
      price: "₹19,900 / month",
      features: [
        "QuestAI-5 with pro reasoning",
        "Unlimited messages and uploads",
        "Unlimited and faster image creation",
        "Maximum memory and context",
        "Expanded deep research and agent mode"
      ],
      button: "Get Pro",
      disabled: false,
      color: "bg-gray-900"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-10">Upgrade your plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${plan.color} rounded-2xl p-6 flex flex-col justify-between shadow-lg`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-lg mb-4">{plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm">✅ {feature}</li>
                ))}
              </ul>
            </div>
            <button
              disabled={plan.disabled}
              className={`w-full py-2 rounded-lg ${
                plan.disabled
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
    );
}