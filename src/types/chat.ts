export interface ChatRequest {
  phone: string;
  message: string;
}

export interface ChatResponse {
  session_id: string;
  message: string;
}

export interface ChatMessage {
  id: number;
  role: string;
  content: string;
  created_at: string;
}

export interface ChatHistoryResponse {
  phone: string;
  messages: ChatMessage[];
}