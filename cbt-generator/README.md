# AnyNotes CBT — personal edition

Paste in notes on any subject, get back CBT-style multiple-choice questions
with shaded-bubble answers, just like a real practice test. Built for
**your own personal use** — no accounts, no other users, just you.

- **History** is saved right in your browser (no database) — every quiz you
  submit is stored so you can revisit it and see your score again.
- **Privacy**: if you ever put this on a live URL, set an `APP_PASSWORD` and
  the whole thing is locked behind a simple password page, so it's not open
  to the public internet — only to you.

---

## 1. What you need first

- A free [Anthropic Console](https://console.anthropic.com) account, to get an API key.
  - Sign up → "API Keys" → "Create Key" → copy it somewhere safe.
- [Node.js](https://nodejs.org) installed on your computer (LTS version).

## 2. Run it on your computer

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and paste in your Anthropic API key. You can leave
`APP_PASSWORD` blank for now — it's only needed if you deploy this somewhere
public.

```bash
npm run dev
```

Open **http://localhost:3000**. Paste in notes, generate a quiz, take it,
submit it — it'll now show up under "Past quizzes" any time you come back,
as long as you're using the same browser on the same computer.

> Note: because history lives in your browser (not a server database), it
> won't follow you to a different browser or device. If you'd rather have
> your history follow you everywhere, that's a small upgrade for later —
> just let me know.

## 3. Put it on a live website (optional)

Only do this if you want to reach it from your phone or another device.

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub.
3. "Add New Project" → pick this repo.
4. Add environment variables before deploying:
   - `ANTHROPIC_API_KEY` — your Anthropic key
   - `APP_PASSWORD` — any password you choose, so it's locked to just you
5. Deploy. You'll get a `.vercel.app` URL — when you open it, you'll be asked
   for the password once, then it remembers you for 30 days.

## Notes on cost

Each "Generate questions" click calls the Claude API — a small cost based on
usage (fractions of a cent per generation on `claude-sonnet-5`). To cut costs
further, swap the model in `app/api/generate/route.ts` from `claude-sonnet-5`
to `claude-haiku-4-5-20251001` — faster and cheaper, slightly less polished
questions.

## What's already built

- Notes → CBT questions, any subject
- OMR-style bubble answers, scoring, and explanations
- Personal history of past quizzes, saved locally
- Optional password lock for a live deployment

Let me know how it feels to use — from here we could add things like: quiz
history that follows you across devices, PDF/DOCX upload instead of pasting
text, or a timer for a more realistic exam feel.
