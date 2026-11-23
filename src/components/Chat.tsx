
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { getHistory, sendMessage } from "../services/chatService";
import {
  getActivePhone,
  getSavedPhones,
  normalizePhone,
  removePhone,
  savePhone,
} from "../services/phoneStorage";

import type { ChatMessage } from "../types/chat";

export default function Chat() {
  const [phone, setPhone] = useState(getActivePhone);
  const [phoneInput, setPhoneInput] = useState(getActivePhone);
  const [savedPhones, setSavedPhones] = useState(getSavedPhones);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef(0);
  const sendingRef = useRef(false);
  const temporaryIdRef = useRef(-1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!phone) {
      setMessages([]);
      return;
    }

    const currentConversation = ++conversationRef.current;

    setMessages([]);
    setError("");
    setLoadingHistory(true);

    getHistory(phone)
      .then((data) => {
        if (conversationRef.current !== currentConversation) return;

        setMessages(data.messages);
      })
      .catch(() => {
        if (conversationRef.current !== currentConversation) return;

        setError("Não foi possível carregar o histórico.");
      })
      .finally(() => {
        if (conversationRef.current === currentConversation) {
          setLoadingHistory(false);
          messageInputRef.current?.focus();
        }
      });

    return () => {
      conversationRef.current++;
    };
  }, [phone]);

  function changePhone(newPhone: string) {
    if (loading || loadingHistory) return;

    const normalized = normalizePhone(newPhone);

    if (!normalized) {
      setError("Informe um número de telefone.");
      return;
    }

    try {
      const selected = savePhone(normalized);

      setSavedPhones(getSavedPhones());
      setPhoneInput(selected);
      setMessageInput("");
      setError("");

      if (selected === phone) {
        messageInputRef.current?.focus();
        return;
      }

      setPhone(selected);
    } catch {
      setError("Não foi possível salvar o telefone.");
    }
  }

  function selectPhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    changePhone(phoneInput);
  }

  function handleRemovePhone(phoneToRemove: string) {
    if (loading || loadingHistory) return;

    try {
      const nextPhone = removePhone(phoneToRemove);

      setSavedPhones(getSavedPhones());
      setPhoneInput(nextPhone);
      setError("");
      setMessageInput("");

      if (nextPhone !== phone) {
        setPhone(nextPhone);
      } else {
        messageInputRef.current?.focus();
      }
    } catch {
      setError("Não foi possível remover o telefone.");
    }
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = messageInput.trim();

    if (!content || !phone || sendingRef.current || loadingHistory) return;

    const currentConversation = conversationRef.current;
    const currentPhone = phone;

    sendingRef.current = true;
    setLoading(true);
    setError("");
    setMessageInput("");

    messageInputRef.current?.focus();

    const temporaryId = temporaryIdRef.current--;

    const temporaryMessage: ChatMessage = {
      id: temporaryId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, temporaryMessage]);

    try {
      const response = await sendMessage({
        phone: currentPhone,
        message: content,
      });

      if (conversationRef.current !== currentConversation) return;

      const assistantMessage: ChatMessage = {
        id: temporaryIdRef.current--,
        role: "assistant",
        content: response.message,
        created_at: new Date().toISOString(),
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch {
      if (conversationRef.current !== currentConversation) return;

      setMessages((previous) =>
        previous.filter((message) => message.id !== temporaryId)
      );

      setMessageInput((previous) => previous || content);
      setError("Não foi possível enviar a mensagem. Tente novamente.");
    } finally {
      sendingRef.current = false;
      setLoading(false);
      messageInputRef.current?.focus();
    }
  }

  function formatTime(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="chat-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🔥</div>

          <div>
            <h1>RevGás</h1>
            <p>Assistente virtual</p>
          </div>
        </div>

        <div className="sidebar-content">
          <h2>Identificação do cliente</h2>

          <p>
            Selecione um telefone salvo ou informe um novo número
            para iniciar uma conversa.
          </p>

          <form onSubmit={selectPhone} className="phone-form">
            <label htmlFor="phone">Número de telefone</label>

            <input
              id="phone"
              type="tel"
              value={phoneInput}
              onChange={(event) => setPhoneInput(event.target.value)}
              placeholder="5586999999999"
              disabled={loading || loadingHistory}
            />

            <button
              type="submit"
              disabled={loading || loadingHistory}
            >
              {phone ? "Selecionar conversa" : "Iniciar conversa"}
            </button>
          </form>

          <div className="saved-phones">
            <h3>Suas conversas</h3>

            {savedPhones.length === 0 ? (
              <p className="no-phones">Nenhum número salvo.</p>
            ) : (
              <div className="phone-list">
                {savedPhones.map((savedPhone) => (
                  <div
                    key={savedPhone}
                    className={`phone-item ${
                      savedPhone === phone ? "selected" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="phone-select"
                      onClick={() => changePhone(savedPhone)}
                      disabled={loading || loadingHistory}
                    >
                      <span>📱</span>
                      <span>{savedPhone}</span>
                    </button>

                    <button
                      type="button"
                      className="phone-remove"
                      title="Remover número salvo"
                      aria-label={`Remover ${savedPhone}`}
                      onClick={() => handleRemovePhone(savedPhone)}
                      disabled={loading || loadingHistory}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <span className="status-dot" />
          API RevGás
        </div>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div className="avatar">🔥</div>

          <div>
            <h2>Atendimento RevGás</h2>
            <p>
              {phone
                ? `Conversa com ${phone}`
                : "Selecione um telefone para começar"}
            </p>
          </div>
        </header>

        <div className="messages-container">
          {!phone ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>

              <h2>Bem-vindo ao atendimento RevGás</h2>

              <p>
                Informe seu número de telefone para conversar
                com nosso assistente virtual.
              </p>
            </div>
          ) : loadingHistory ? (
            <div className="empty-state">
              <p>Carregando histórico...</p>
            </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👋</div>

                  <h2>Conversa iniciada!</h2>

                  <p>
                    Envie uma mensagem para começar o atendimento.
                  </p>
                </div>
              )}

              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`message-row ${
                      isUser ? "user-row" : "assistant-row"
                    }`}
                  >
                    <div
                      className={`message-bubble ${
                        isUser ? "user-message" : "assistant-message"
                      }`}
                    >
                      <p>{message.content}</p>

                      <span>{formatTime(message.created_at)}</span>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="message-row assistant-row">
                  <div className="message-bubble assistant-message typing">
                    RevGás está digitando...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            ref={messageInputRef}
            type="text"
            placeholder={
              phone
                ? "Digite sua mensagem..."
                : "Selecione um telefone primeiro"
            }
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            disabled={!phone || loadingHistory}
          />

          <button
            type="submit"
            disabled={
              !phone ||
              !messageInput.trim() ||
              loading ||
              loadingHistory
            }
          >
            Enviar ➤
          </button>
        </form>
      </section>
    </main>
  );
}
