import type { QuestionDefinition } from "@/api/types"

interface FieldDef {
  key: string
  label: string
  type: "text" | "number"
  placeholder?: string
  required?: boolean
}

interface Props {
  question: QuestionDefinition
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
}

export function ObjectInput({ question, value, onChange }: Props) {
  const config = question.field_config as { fields: FieldDef[] } | null
  const fields = config?.fields ?? []
  const data = typeof value === "object" && value !== null && !Array.isArray(value) ? value : {}

  const updateField = (key: string, val: string | number) => {
    onChange({ ...data, [key]: val })
  }

  return (
    <div className="space-y-3 rounded-lg border border-input p-4 bg-muted/20">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </label>
          <input
            type={field.type === "number" ? "number" : "text"}
            value={(data[field.key] as string | number) ?? ""}
            onChange={(e) =>
              updateField(
                field.key,
                field.type === "number" ? Number(e.target.value) : e.target.value,
              )
            }
            placeholder={field.placeholder ?? ""}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>
      ))}
    </div>
  )
}
