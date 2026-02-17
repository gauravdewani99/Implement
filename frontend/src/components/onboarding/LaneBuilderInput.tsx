import type { QuestionDefinition } from "@/api/types"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LaneRow {
  [key: string]: string
}

interface Column {
  key: string
  label: string
  type: "select" | "text"
  options?: string[]
}

interface Props {
  question: QuestionDefinition
  value: LaneRow[]
  onChange: (value: LaneRow[]) => void
}

export function LaneBuilderInput({ question, value, onChange }: Props) {
  const config = question.field_config as {
    columns: Column[]
    min_rows?: number
    max_rows?: number
  } | null

  const columns = config?.columns ?? []
  const maxRows = config?.max_rows ?? 50
  const rows = Array.isArray(value) ? value : []

  const addRow = () => {
    if (rows.length >= maxRows) return
    const emptyRow: LaneRow = {}
    columns.forEach((col) => {
      emptyRow[col.key] = ""
    })
    onChange([...rows, emptyRow])
  }

  const updateRow = (rowIndex: number, colKey: string, val: string) => {
    const updated = rows.map((row, i) =>
      i === rowIndex ? { ...row, [colKey]: val } : row,
    )
    onChange(updated)
  }

  const removeRow = (rowIndex: number) => {
    onChange(rows.filter((_, i) => i !== rowIndex))
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-input">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-input">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="w-10 px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-6 text-center text-muted-foreground text-sm"
                >
                  No lanes added yet. Click "Add Lane" to get started.
                </td>
              </tr>
            )}
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-input last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-2 py-1.5">
                    {col.type === "select" && col.options ? (
                      <select
                        value={row[col.key] ?? ""}
                        onChange={(e) =>
                          updateRow(rowIndex, col.key, e.target.value)
                        }
                        className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="">Select...</option>
                        {col.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={row[col.key] ?? ""}
                        onChange={(e) =>
                          updateRow(rowIndex, col.key, e.target.value)
                        }
                        className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    )}
                  </td>
                ))}
                <td className="px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => removeRow(rowIndex)}
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Remove lane"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        disabled={rows.length >= maxRows}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-colors",
          rows.length >= maxRows
            ? "opacity-50 cursor-not-allowed border-input text-muted-foreground"
            : "border-primary/30 text-primary hover:bg-primary/5",
        )}
      >
        <Plus className="w-4 h-4" />
        Add Lane
      </button>

      {rows.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {rows.length} lane{rows.length !== 1 ? "s" : ""} configured
          {maxRows < 999 && ` (max ${maxRows})`}
        </p>
      )}
    </div>
  )
}
