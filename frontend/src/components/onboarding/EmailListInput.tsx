import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailListInput({ value, onChange, placeholder }: Props) {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const emails = Array.isArray(value) ? value : []

  const addEmail = (raw: string) => {
    const email = raw.trim().toLowerCase()
    if (!email) return
    if (!EMAIL_REGEX.test(email)) {
      setError("Invalid email format")
      return
    }
    if (emails.includes(email)) {
      setError("Email already added")
      return
    }
    setError("")
    onChange([...emails, email])
    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault()
      addEmail(input)
    }
    if (e.key === "Backspace" && input === "" && emails.length > 0) {
      onChange(emails.slice(0, -1))
    }
  }

  const removeEmail = (index: number) => {
    onChange(emails.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "flex flex-wrap gap-1.5 min-h-[40px] rounded-lg border border-input bg-background px-3 py-2 transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
        )}
      >
        {emails.map((email, i) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-sm"
          >
            {email}
            <button
              type="button"
              onClick={() => removeEmail(i)}
              className="hover:text-destructive transition-colors"
              title={`Remove ${email}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="email"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError("")
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (input.trim()) addEmail(input)
          }}
          placeholder={emails.length === 0 ? (placeholder ?? "Type email and press Enter") : "Add another..."}
          className="flex-1 min-w-[200px] h-6 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {emails.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {emails.length} email{emails.length !== 1 ? "s" : ""} added. Press Enter or comma to add more.
        </p>
      )}
    </div>
  )
}
