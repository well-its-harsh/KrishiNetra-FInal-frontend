import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="relative mb-8">
      {/* Progress Line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#D1B48C] z-0" />
      <motion.div
        className="absolute top-6 left-0 h-0.5 bg-[#7C8B56] z-10"
        initial={{ width: "0%" }}
        animate={{ 
          width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Step Dots */}
      <div className="relative flex justify-between items-center">
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div key={step} className="relative z-20 flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#7C8B56] text-white'
                    : isCurrent
                    ? 'bg-[#BC8F29] text-white'
                    : 'bg-[#D1B48C] text-[#3F5E46]'
                }`}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  repeat: isCurrent ? Infinity : 0,
                  repeatDelay: 1.5,
                }}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  step
                )}

                {/* Millet Crop Animation - Only on current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-30"
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: [0, 1, 1],
                      y: [0, -15, -20],
                      scale: [0.5, 1, 1.1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-[#7C8B56] drop-shadow-sm"
                    >
                      {/* Millet stalk */}
                      <path
                        d="M12 2L11 6L13 6L12 2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M11 6L10 10L12 10L11 6Z"
                        fill="currentColor"
                        opacity="0.9"
                      />
                      <path
                        d="M10 10L9 14L11 14L10 10Z"
                        fill="currentColor"
                        opacity="0.8"
                      />
                      <path
                        d="M9 14L8 18L10 18L9 14Z"
                        fill="currentColor"
                        opacity="0.7"
                      />
                      {/* Millet grains */}
                      <circle cx="8" cy="18" r="1.5" fill="currentColor" opacity="0.9" />
                      <circle cx="10" cy="18" r="1.5" fill="currentColor" opacity="0.9" />
                      <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.9" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>

              {/* Step Label */}
              <span
                className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                  isCompleted || isCurrent
                    ? 'text-[#3F5E46]'
                    : 'text-[#D1B48C]'
                }`}
              >
                {step === 1 && "Account"}
                {step === 2 && "Role"}
                {step === 3 && "Verify"}
                {step === 4 && "Documents"}
                {step === 5 && "Complete"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;

