import { SavedQuiz } from "./types";

const KEY = "anynotes_cbt_history";

export function getQuizzes(): SavedQuiz[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedQuiz[];
    return parsed.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function getQuiz(id: string): SavedQuiz | undefined {
  return getQuizzes().find((q) => q.id === id);
}

export function saveQuiz(quiz: SavedQuiz) {
  if (typeof window === "undefined") return;
  const existing = getQuizzes();
  window.localStorage.setItem(KEY, JSON.stringify([quiz, ...existing]));
}

export function deleteQuiz(id: string) {
  if (typeof window === "undefined") return;
  const existing = getQuizzes().filter((q) => q.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(existing));
}

export function makeTitleFromNotes(notes: string): string {
  const firstLine = notes.trim().split("\n")[0] || notes.trim();
  return firstLine.length > 60 ? firstLine.slice(0, 57) + "…" : firstLine;
}
