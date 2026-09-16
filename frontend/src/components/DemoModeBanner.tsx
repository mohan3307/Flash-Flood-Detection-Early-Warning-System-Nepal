import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Zap, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { setScenario } from '../services/api';

interface DemoModeBannerProps {
  currentScenario: string;
  onOpenPerformance: () => void;
  activeAlertsCount: number;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  currentScenario,
  onOpenPerformance,
  activeAlertsCount
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Sync active step when currentScenario changes
  useEffect(() => {
    if (currentScenario === 'normal') setActiveStep(1);
    else if (currentScenario === 'heavy_rain') setActiveStep(2);
    else if (currentScenario === 'flash_flood' && activeStep !== 4) setActiveStep(3);
    else if (currentScenario === 'false_alarm') setActiveStep(5);
  }, [currentScenario]);

  const steps = [
    {
      num: 1,
      title: "Normal Flow",
      scenario: "normal",
      desc: "Baseflow 1.2m, rain <12mm/hr. Cross-node corroboration maintains LOW risk.",
      action: async () => {
        await setScenario('normal');
        setActiveStep(1);
      }
    },
    {
      num: 2,
      title: "Monsoon Surge",
      scenario: "heavy_rain",
      desc: "Precipitation 60+ mm/hr. Stage climbs to 2.8m -> MEDIUM advisory.",
      action: async () => {
        await setScenario('heavy_rain');
        setActiveStep(2);
      }
    },
    {
      num: 3,
      title: "Flash Flood",
      scenario: "flash_flood",
      desc: "Upstream cloudburst. Surge velocity >0.38 m/hr -> HIGH RISK siren trigger.",
      action: async () => {
        await setScenario('flash_flood');
        setActiveStep(3);
      }
    },
    {
      num: 4,
      title: "Emergency SOPs",
      scenario: "flash_flood",
      desc: "Inspect live 45m lead-time countdown & Pul Bazaar downstream evacuation.",
      action: () => {
        setActiveStep(4);
      }
    },
    {
      num: 5,
      title: "False-Alarm Rejection",
      scenario: "false_alarm",
      desc: "Rain spike 95mm/hr without river surge. Multi-signal AI suppresses false siren.",
      action: async () => {
        await setScenario('false_alarm');
        setActiveStep(5);
      }
    },
    {
      num: 6,
      title: "ML Benchmarks",
      scenario: currentScenario,
      desc: "Review Accuracy (99.96%), Confusion Matrix, and 0.78% False Alarm Rate.",
      action: () => {
        setActiveStep(6);
        onOpenPerformance();
      }
    }
  ];

  const handleNextStep = () => {
    const next = activeStep < 6 ? activeStep + 1 : 1;
    steps[next - 1].action();
  };

  const handlePrevStep = () => {
    const prev = activeStep > 1 ? activeStep - 1 : 6;
    steps[prev - 1].action();
  };

  return (
    <div className="bg-[#131b2e]/90 border border-[#222a3d] rounded-xl p-3.5 shadow-xl backdrop-blur-xl relative reticle-box">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 font-mono text-xs font-bold">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-wide uppercase text-white font-['Space_Grotesk']">
                HACKATHON DEMO EXECUTION MATRIX
              </h2>
              <span className="text-[10px] font-mono bg-[#171f33] text-[#4cd7f6] px-2 py-0.5 rounded border border-[#06b6d4]/30">
                2-3 Min Evaluation Protocol
              </span>
            </div>
            <p className="text-xs text-[#869397]">
              Execute the 6-stage sequence below to verify multi-signal flood surge detection, false-alarm suppression, and SOP dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto font-mono text-xs">
          <button
            onClick={handlePrevStep}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border border-[#222a3d] cursor-pointer transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNextStep}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <span>Advance Step ({activeStep}/6)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-[#869397] hover:text-[#dae2fd] px-2 py-1 cursor-pointer"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-[#222a3d]">
          {steps.map((step) => {
            const isActive = activeStep === step.num;
            return (
              <button
                key={step.num}
                onClick={step.action}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#06b6d4]/10 border-[#06b6d4] text-white shadow-lg shadow-cyan-500/10 ring-1 ring-[#4cd7f6]/40'
                    : 'bg-[#0b1326]/70 border-[#222a3d] text-[#869397] hover:bg-[#171f33] hover:text-[#dae2fd]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-[#06b6d4] text-[#003640]' : 'bg-[#171f33] text-[#869397]'
                    }`}
                  >
                    STAGE 0{step.num}
                  </span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#4cd7f6]" />}
                </div>
                <span className="text-xs font-bold truncate w-full text-white font-['Space_Grotesk']">
                  {step.title}
                </span>
                <span className="text-[11px] text-[#869397] line-clamp-2 mt-0.5 leading-snug">
                  {step.desc}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
