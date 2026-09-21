import { Check, ChevronRight, ChevronLeft } from "lucide-react";

export interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export function StepWizard({
  steps,
  currentStep,
  onStepClick,
  onNext,
  onPrev,
  isFirstStep = false,
  isLastStep = false,
}: StepWizardProps) {
  return (
    <div className="space-y-4">
      
      {/* STEPPER HEADER TRAIL */}
      <div className="flex items-center justify-between relative bg-gray-50/90 p-3 rounded-2xl border border-gray-200/80">
        
        {/* Connecting line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-gray-200 z-0 pointer-events-none" />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick && onStepClick(step.id)}
              className="relative z-10 flex items-center gap-2 focus:outline-none group text-left"
            >
              {/* Step Icon Badge */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                  isCompleted
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                    : isCurrent
                      ? "bg-[#0f1e36] text-[#44abff] border-[#44abff]/50 ring-4 ring-[#44abff]/15 shadow-md scale-105"
                      : "bg-white text-gray-400 border-gray-200 group-hover:border-gray-300"
                }`}
              >
                {isCompleted ? <Check size={14} className="stroke-[3]" /> : step.id}
              </div>

              {/* Step Label */}
              <div className="hidden sm:block">
                <h5 className={`text-xs font-bold leading-tight ${isCurrent ? "text-[#0f1e36]" : "text-gray-400"}`}>
                  {step.title}
                </h5>
                <p className="text-[9px] text-gray-400 leading-none">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* STEP NAVIGATION FOOTER BUTTONS */}
      {(onNext || onPrev) && (
        <div className="flex items-center justify-between pt-2">
          {onPrev && !isFirstStep ? (
            <button
              type="button"
              onClick={onPrev}
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={14} />
              <span>Etapa Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {onNext && !isLastStep && (
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-2 rounded-xl bg-[#0f1e36] hover:bg-[#0f1e36]/90 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs border border-[#44abff]/30"
            >
              <span>Próxima Etapa</span>
              <ChevronRight size={14} className="text-[#44abff]" />
            </button>
          )}
        </div>
      )}

    </div>
  );
}
