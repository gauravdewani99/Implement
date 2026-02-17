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
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
}

export function AddressFormInput({ question, value, onChange }: Props) {
  const config = question.field_config as { fields: FieldDef[] } | null
  const fields = config?.fields ?? []
  const data = typeof value === "object" && value !== null && !Array.isArray(value) ? value : {}

  const updateField = (key: string, val: string) => {
    onChange({ ...data, [key]: val })
  }

  // Group fields into rows for a cleaner layout
  // First field (location_name) gets full width
  // Street + house_number + suffix on one row
  // postal_code + city on one row
  // state + country on one row
  // phone + contact on one row
  // remarks gets full width
  const getFieldWidth = (key: string): string => {
    const wideFields = ["location_name", "remarks", "contact_details"]
    if (wideFields.includes(key)) return "col-span-2"
    return "col-span-1"
  }

  return (
    <div className="rounded-lg border border-input p-4 bg-muted/20">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.key} className={`space-y-1 ${getFieldWidth(field.key)}`}>
            <label className="text-xs font-medium text-muted-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-0.5">*</span>}
            </label>
            <input
              type="text"
              value={data[field.key] ?? ""}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder ?? ""}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
