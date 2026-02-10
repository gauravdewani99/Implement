// Auth
export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface UserResponse {
  id: string
  email: string
  full_name: string | null
  role: string
}

// Clients
export interface ClientResponse {
  id: string
  name: string
  status: "draft" | "in_progress" | "completed"
  current_section: string
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

// Responses
export interface ConfigurationResponseOut {
  id: string
  question_key: string
  section: string
  subsection: string
  answer: unknown
  answer_text: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ResponseItem {
  question_key: string
  section: string
  subsection: string
  answer: unknown
  answer_text?: string | null
  notes?: string | null
}

// Progress
export interface ProgressDetail {
  answered: number
  total: number
  percentage: number
}

export interface ProgressResponse {
  overall: ProgressDetail
  sections: Record<string, ProgressDetail>
  subsections: Record<string, ProgressDetail>
}

// Questions
export type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "multi_select"
  | "boolean"
  | "number"
  | "date"
  | "email"

export interface QuestionDefinition {
  key: string
  section: string
  subsection: string
  question_text: string
  question_type: QuestionType
  options: string[]
  required: boolean
  depends_on: Record<string, unknown> | null
  help_text: string
  placeholder: string
  default_value: unknown
  order: number
  config_description: string | null
}

export interface SubsectionOut {
  key: string
  title: string
  order: number
  questions: QuestionDefinition[]
}

export interface SectionOut {
  key: string
  title: string
  description: string
  order: number
  subsections: SubsectionOut[]
}
