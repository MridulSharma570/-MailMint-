# MailMint ✉️🌿 — Executive AI Email Studio

![Python](https://img.shields.io/badge/Python-3.9%2B-10B981?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Backend-Flask-040406?style=flat-square&logo=flask&logoColor=34D399)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%E2%80%A2%20CSS3%20%E2%80%A2%20JS-F59E0B?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)

> **Type rough thoughts. Send executive emails.**  
> **MailMint** transforms informal bullet points and casual notes into structured, ready-to-send professional correspondence — styled in a sleek **Jet Black, Electric Mint & Champagne Gold** multi-page studio and powered by **5 completely free AI engines**.

---

## ✨ Key Features

- **🗂️ Multi-Page Studio Architecture:**
  - **`/` — Welcome Entry Page:** Interactive *Before → After* email transformation showcase & quick-launch workspace cards.
  - **`/studio` — AI Email Studio:** Side-by-side 2-column composer & live inline editor with **5 Tones**, **6 Categories**, **Length Control** (`Short / Standard / Detailed`), and **6 Output Languages** (`English, Hindi, Punjabi, Spanish, French, German`).
  - **`/templates` — Smart Templates Library:** 12 searchable, filterable real-world email blueprints across *Career, Workplace, Business, Support,* and *Networking* with 1-click **Load in Studio →**.
  - **`/api-keys` — Bring-Your-Own Free API Key Vault:** Step-by-step 60-second setup guides, smart key prefix auto-detection (`AIza...`, `gsk_...`, `sk-or-...`), and live key verification.
  - **`/history` — Local Drafts & Favorites Vault:** Browser-only `localStorage` vault with search, **★ Starred Favorites**, JSON export, and 1-click Studio reopen.
  - **`/about` — Architecture & Team:** Zero-database privacy design and creator credits.
- **🎯 Executive Polish Tools:**
  - **1-Click Alternative Subject Lines:** Every generated email includes alternative subjects you can swap in instantly.
  - **1-Click AI Quick-Refine Toolbar:** Polish any draft with `✂️ Shorter`, `🎩 More Executive`, `🌿 Warmer`, or `🎯 Stronger CTA`.
  - **Rich Export Suite:** Copy Full Email, Copy Subject, **Open in Gmail Web**, **Open Default Mail App (`mailto:`)**, **Download `.eml` Draft** (opens directly as an editable draft in Outlook / Apple Mail / Thunderbird), and **Download `.txt`**.
- **🔒 100% Browser-Local Privacy:** Zero database, zero server-side key storage, zero subscription lock-in.

---

## 🔑 Supported 100% Free AI Providers

Connect any free API key directly inside **`/api-keys`** on the website (no credit card required):

| Provider | Key Prefix | Default Free Model | Official Free Key Portal |
| :--- | :--- | :--- | :--- |
| **Google Gemini** | `AIzaSy...` | `gemini-2.5-flash` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **Groq Cloud** | `gsk_...` | `llama-3.3-70b-versatile` | [console.groq.com/keys](https://console.groq.com/keys) |
| **OpenRouter** | `sk-or-v1-...` | Smart Free Waterfall (`gemma-4`, `nemotron`, `openrouter/free`) | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **Mistral AI** | Alphanumeric | `mistral-small-latest` | [console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) |
| **Cohere** | Alphanumeric | `command-a-03-2025` | [dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys) |

---

## 📁 Project Structure

```text
MailMint/
├── app.py                      # Multi-page Python Flask web server & REST API
├── lib/
│   └── llm_providers.py        # Multi-LLM adapter, OpenRouter free waterfall & parser
├── templates/
│   ├── base.html               # Shared Jet Black + Mint + Gold navigation & footer shell
│   ├── entry.html              # Dedicated Welcome / Entry page (/)
│   ├── studio.html             # 2-Column AI Email Writer Studio (/studio)
│   ├── templates_library.html  # 12 Curated Email Templates Gallery (/templates)
│   ├── api_keys.html           # Free API Key Vault & Step-by-Step Guide (/api-keys)
│   ├── history.html            # Local Saved Drafts & Favorites Vault (/history)
│   └── about.html              # Architecture, Privacy & Creators (/about)
├── static/
│   ├── css/style.css           # Custom Jet Black + Electric Mint + Champagne Gold CSS
│   └── js/app.js               # Multi-page client state, BYOK vault, toasts & exports
├── .env.example                # Optional server-side fallback key template
├── requirements.txt            # Lightweight Python dependencies
└── LICENSE                     # MIT License
```

---

## 🚀 Run Locally in 3 Steps

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/MridulSharma570/-MailMint-.git
cd -MailMint-
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python app.py
```

### 3. Open in Your Browser
Visit **`http://localhost:5000`**, connect any free API key in **API Keys**, and start crafting executive emails in **Studio**!

---

## 👨‍💻 Creators

- **Anmolpreet Singh** — *Developer*
- **Mridul Sharma** — *Co-Developer*

Licensed under the [MIT License](LICENSE).
