import { useLocation } from "react-router-dom";
import {
  ClipboardCheck,
  Truck,
  BadgeDollarSign,
  XCircle,
} from "lucide-react";

const statusFlow = [
  { label: "Order Confirmed", icon: ClipboardCheck },
  { label: "Out for Pickup", icon: Truck },
  { label: "Sold", icon: BadgeDollarSign },
];

const TrackOrder = () => {
  const { state } = useLocation();
  const order = state?.order;

  // Support both active flow and cancelled orders
  const currentStatus = order?.status || "Order Confirmed";
  const isCancelled = currentStatus === "Cancelled";

  const steps = isCancelled
    ? [{ label: "Cancelled", icon: XCircle }]
    : statusFlow;

  // Get current step index from status
  const currentStepIndex = steps.findIndex(
    (step) => step.label === currentStatus
  );

  return (
    <div className="relative flex flex-col items-start ml-12 sm:ml-30 mt-4 pl-6">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isLast = index === steps.length - 1;
        const Icon = step.icon;

        return (
          <div key={index} className="flex items-start relative mb-6">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[10px] top-6 h-[140%] w-0.5 bg-gray-300 overflow-hidden">
                <div
                  className={`origin-top transition-transform duration-400 ease-out w-full h-full ${
                    index < currentStepIndex
                      ? "bg-green-600 scale-y-100"
                      : "scale-y-0"
                  }`}
                  style={{ transitionDelay: `${index * 300}ms` }}
                />
              </div>
            )}

            {/* Dot/Icon */}
            <div
              className={`w-6 h-6 rounded-full z-10 mt-1 flex items-center justify-center transition-all duration-500 ${
                isActive
                  ? isCancelled
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              <Icon size={16} />
            </div>

            {/* Step label */}
            <div className="ml-4">
              <p
                className={`text-lg ${
                  isActive
                    ? isCancelled
                      ? "text-red-700 font-semibold"
                      : "text-green-700 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackOrder;
