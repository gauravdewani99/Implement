import type { QuestionDefinition } from "@/api/types"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface KVPair {
  key: string
  value: string
}

interface Props {
  question: QuestionDefinition
  value: KVPair[]
  onChange: (value: KVPair[]) => void
}

export function KeyValueInput({ question, value, onChange }: Props) {
  const config = question.field_config as {
    key_label?: string
    value_label?: string
    key_placeholder?: string
    value_placeholder?: string
    max_rows?: number
  } | null

  const keyLabel = config?.key_label ?? "Key"
  const valueLabel = config?.value_label ?? "Value"
  const keyPlaceholder = config?.key_placeholder ?? "Key"
  const valuePlaceholder = config?.value_placeholder ?? "Value"
  const maxRows = config?.max_rows ?? 10
  const pairs = Array.isArray(value) ? value : []

  const addPair = () => {
    if (pairs.length >= maxRows) return
    onChange([...pairs, { key: "", value: "" }])
  }

  const updatePair = (index: number, field: "key" | "value", val: string) => {
    const updated = pairs.map((pair, i) =>
      i === index ? { ...pair, [field]: val } : pair,
    )
    onChange(updated)
  }

  const removePair = (index: number) => {
    onChange(pairs.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {pairs.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_40px] gap-2 text-xs font-medium text-muted-foreground px-1">
            <span>{keyLabel}</span>
            <span>{valueLabel}</span>
            <span />
          </div>
          {pairs.map((pair, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center">
              <input
                type="text"
                value={pair.key}
                onChange={(e) => updatePair(index, "key", e.target.value)}
                placeholder={keyPlaceholder}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                type="text"
                value={pair.value}
                onChange={(e) => updatePair(index, "value", e.target.value)}
                placeholder={valuePlaceholder}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => removePair(index)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addPair}
        disabled={pairs.length >= maxRows}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-colors",
          pairs.length >= maxRows
            ? "opacity-50 cursor-not-allowed border-input text-muted-foreground"
            : "border-primary/30 text-primary hover:bg-primary/5",
        )}
      >
        <Plus className="w-4 h-4" />
        Add {keyLabel}
      </button>
    </div>
  )
}
