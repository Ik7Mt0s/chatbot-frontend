
const PHONE_STORAGE_KEY = "revgas:phones";
const ACTIVE_PHONE_KEY = "revgas:active-phone";

export const DEFAULT_PHONE = "5586999999999";

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getSavedPhones(): string[] {
  try {
    const stored = localStorage.getItem(PHONE_STORAGE_KEY);

    if (!stored) return [DEFAULT_PHONE];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [DEFAULT_PHONE];

    const phones = parsed
      .filter((value): value is string => typeof value === "string")
      .map(normalizePhone)
      .filter(Boolean);

    return [...new Set(phones)];
  } catch {
    return [DEFAULT_PHONE];
  }
}

export function getActivePhone(): string {
  try {
    const saved = localStorage.getItem(ACTIVE_PHONE_KEY);
    const phones = getSavedPhones();

    if (saved && phones.includes(normalizePhone(saved))) {
      return normalizePhone(saved);
    }

    return phones[0] ?? "";
  } catch {
    return DEFAULT_PHONE;
  }
}

export function savePhone(phone: string): string {
  const normalized = normalizePhone(phone);

  if (!normalized) {
    throw new Error("Informe um número de telefone válido.");
  }

  const phones = getSavedPhones();

  if (!phones.includes(normalized)) {
    localStorage.setItem(
      PHONE_STORAGE_KEY,
      JSON.stringify([...phones, normalized])
    );
  }

  localStorage.setItem(ACTIVE_PHONE_KEY, normalized);

  return normalized;
}

export function removePhone(phone: string): string {
  const normalized = normalizePhone(phone);

  const phones = getSavedPhones().filter(
    (saved) => saved !== normalized
  );

  localStorage.setItem(PHONE_STORAGE_KEY, JSON.stringify(phones));

  const active = getActivePhone();

  if (active === normalized || !phones.includes(active)) {
    const nextPhone = phones[0] ?? "";

    if (nextPhone) {
      localStorage.setItem(ACTIVE_PHONE_KEY, nextPhone);
    } else {
      localStorage.removeItem(ACTIVE_PHONE_KEY);
    }

    return nextPhone;
  }

  return active;
}
