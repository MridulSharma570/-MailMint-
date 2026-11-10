# MailMint ✉️🌿 — Executive AI Email Studio

> **Type rough thoughts. Send executive emails.**  
> **Developer:** Anmolpreet Singh | **Co-Developer:** Mridul Sharma  
> **Stack:** HTML5 • CSS3 • Vanilla JavaScript (ES6+) • Python 3 (Flask) • Multi-LLM Free BYOK APIs

---

## 🌟 Overview

**MailMint** is a multi-page AI email studio styled in **Jet Black (`#040406`), Electric Mint (`#10B981`), and Champagne Gold (`#F59E0B`)**. It transforms informal rough notes into structured, ready-to-send correspondence complete with a primary **Subject Line**, **2 Alternative Subject Lines**, **Greeting**, **Body**, and **Sign-off** — with zero bracketed placeholders.

### Key Highlights & Enhancements
- **6 Dedicated Multi-Page Views:**
  1. **`/` — Welcome / Entry Page:** Interactive live Before → After email showcase, key stats, and workspace portal cards.
  2. **`/studio` — AI Email Writer Studio:** Side-by-side Composer & Live Output workspace with 5 Tones, 6 Categories, Length Control (`Short / Standard / Detailed`), 6 Languages (`English, Hindi, Punjabi, Spanish, French, German`), 1-Click AI Quick-Refine (`Shorter`, `More Executive`, `Warmer`, `Stronger CTA`), inline editing, and `.eml` / `.txt` / Gmail export.
  3. **`/templates` — Smart Templates Library:** 12 searchable, filterable real-world email blueprints that load straight into `/studio` in one click.
  4. **`/api-keys` — Free API Key Vault & Setup Guide:** Connect free keys from **Google Gemini, Groq Cloud, OpenRouter (`:free` models), Mistral AI, or Cohere** with 60-second step-by-step instructions, smart key prefix auto-detection, and live key verification.
  5. **`/history` — Saved Drafts & Favorites Vault:** Client-side browser vault (`localStorage`) with search, Starred Favorites filter, JSON export, and 1-click reopen in Studio.
  6. **`/about` — Architecture & Team:** Stateless privacy design and creator credits.

---

## 🔑 Supported 100% Free AI Providers

| Provider | Key Prefix | Default Free Model | Official Free Key Portal |
| :--- | :--- | :--- | :--- |
| **Google Gemini** | `AIzaSy...` | `gemini-2.5-flash` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **Groq Cloud** | `gsk_...` | `llama-3.3-70b-versatile` | [console.groq.com/keys](https://console.groq.com/keys) |
| **OpenRouter** | `sk-or-v1-...` | `openrouter/free` & `:free` models | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **Mistral AI** | Alphanumeric | `mistral-small-latest` | [console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) |
| **Cohere** | Alphanumeric | `command-a-03-2025` | [dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys) |

---

## 🚀 Quick Start

```bash
pip install -r requirements.txt
python app.py
```

Open **`http://localhost:5000`** in your browser!

---

## 👨‍💻 Creators

- **Anmolpreet Singh** — *Developer*
- **Mridul Sharma** — *Co-Developer*

Licensed under the [MIT License](LICENSE).
