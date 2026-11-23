import type {
  ChatRequest,
  ChatResponse,
  ChatHistoryResponse,
} from "../types/chat";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function sendMessage(
  data: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<ChatResponse>(response);
}

export async function getHistory(
  phone: string
): Promise<ChatHistoryResponse> {
  const response = await fetch(
    `${API_URL}/api/chat/history/${encodeURIComponent(phone)}`
  );

  return handleResponse<ChatHistoryResponse>(response);
}