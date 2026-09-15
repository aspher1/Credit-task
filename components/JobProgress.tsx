import { pipelineSteps } from "@/lib/copy";
import { pipelineStage, type JobStatus } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

export function JobProgress({ status }: { status: JobStatus }) {
  const stage = pipelineStage(status);
  const index = pipelineSteps.findIndex((step) => step.key === stage);
  const value = ((index + 1) / pipelineSteps.length) * 100;

  return (
    <div className="space-y-3">
      <Progress value={value} />
      <ol className="flex justify-between text-xs font-medium text-stone-500">
        {pipelineSteps.map((step, i) => (
          <li
            key={step.key}
            className={i <= index ? "text-stone-900" : undefined}
          >
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
