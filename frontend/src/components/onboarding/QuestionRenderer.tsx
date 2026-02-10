import type { QuestionDefinition } from "@/api/types"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function QuestionRenderer({ question }: { question: QuestionDefinition }) {
  const { answers, updateAnswer } = useOnboarding()
  const value = answers[question.key]

  const handleChange = (val: unknown) => {
    updateAnswer(question.key, val)
  }

  return (
    <div className="space-y-1.5">
      <label className="flex items-start gap-1.5">
        <span className="text-sm font-medium text-foreground">
          {question.question_text}
          {question.required && <span className="text-destructive ml-0.5">*</span>}
        </span>
        {question.help_text && (
          <span className="group/help relative" tabIndex={0}>
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 cursor-help" />
            <span role="tooltip" className="invisible group-hover/help:visible group-focus-within/help:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 max-w-xs rounded-md bg-popover border border-border p-2 text-xs text-popover-foreground shadow-md">
              {question.help_text}
            </span>
          </span>
        )}
      </label>

      {question.question_type === "text" && (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={question.placeholder}
          className={inputClass}
        />
      )}

      {question.question_type === "email" && (
        <input
          type="email"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={question.placeholder}
          className={inputClass}
        />
      )}

      {question.question_type === "number" && (
        <input
          type="number"
          value={(value as number) ?? ""}
          onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : null)}
          placeholder={question.placeholder}
          className={inputClass}
        />
      )}

      {question.question_type === "textarea" && (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={question.placeholder}
          rows={3}
          className={cn(inputClass, "resize-y min-h-[80px] h-auto")}
        />
      )}

      {question.question_type === "select" && (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value || null)}
          className={cn(inputClass, "appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat")}
        >
          <option value="">Select...</option>
          {question.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {question.question_type === "multi_select" && (
        <div className="flex flex-wrap gap-2">
          {question.options.map((opt) => {
            const selected = Array.isArray(value) && (value as string[]).includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = Array.isArray(value) ? (value as string[]) : []
                  handleChange(
                    selected ? current.filter((v) => v !== opt) : [...current, opt],
                  )
                }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm border transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-input hover:bg-muted",
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {question.question_type === "boolean" && (
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => {
            const boolVal = opt === "Yes"
            const selected = value === boolVal
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleChange(boolVal)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm border transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-input hover:bg-muted",
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {question.question_type === "date" && (
        <input
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  )
}

const inputClass =
  "w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground hover:border-ring/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors"
