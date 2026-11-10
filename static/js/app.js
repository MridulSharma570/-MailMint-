/**
 * MailMint ✉️🌿 — Multi-Page Frontend Application Engine (Vanilla JS ES6+)
 * Developer:    Anmolpreet Singh
 * Co-Developer: Mridul Sharma
 *
 * Powers all separated pages: Welcome (/), Studio (/studio), Templates (/templates),
 * Free API Keys (/api-keys), Saved Drafts (/history), and About (/about).
 */

(function () {
  "use strict";

  // ==================== STORAGE KEYS ====================
  const STORAGE_KEYS = {
    API_KEYS: "mailmint_api_keys_v1",
    SELECTED_PROVIDER: "mailmint_selected_provider_v1",
    SELECTED_MODELS: "mailmint_selected_models_v1",
    SENDER_NAME: "mailmint_sender_name_v1",
    VAULT_DRAFTS: "mailmint_saved_vault_v1",
    STUDIO_PRELOAD: "mailmint_preload_draft_v1",
  };

  // ==================== PROVIDER CATALOG FALLBACK ====================
  const DEFAULT_PROVIDERS = {
    gemini: {
      id: "gemini",
      name: "Google Gemini",
      badge: "100% Free • Recommended",
      keyPrefix: "AIza",
      keyPlaceholder: "AIzaSy...",
      portalUrl: "https://aistudio.google.com/apikey",
      freeTierNote: "Free forever tier • No credit card needed • 15 RPM / 1,000+ req/day",
      defaultModel: "gemini-2.5-flash",
      hasServerKey: false,
      models: [
        { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Fast & Smart — Free)" },
        { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite (High Quota — Free)" },
        { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash (Free)" },
      ],
      steps: [
        "Open Google AI Studio at https://aistudio.google.com/apikey and sign in with your Google account.",
        "Click 'Create API Key' (no credit card or billing setup is required).",
        "Copy the generated key string (starts with 'AIzaSy...').",
        "Paste the key into MailMint on the left and click 'Save Key & Activate'!",
      ],
    },
    groq: {
      id: "groq",
      name: "Groq Cloud",
      badge: "100% Free • Ultra Fast",
      keyPrefix: "gsk_",
      keyPlaceholder: "gsk_...",
      portalUrl: "https://console.groq.com/keys",
      freeTierNote: "Free developer plan • No credit card needed • Sub-second LPU speed",
      defaultModel: "llama-3.3-70b-versatile",
      hasServerKey: false,
      models: [
        { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile (Best Quality — Free)" },
        { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant (Fastest — Free)" },
      ],
      steps: [
        "Visit https://console.groq.com/keys and sign up or log in with Google or GitHub.",
        "Click 'Create API Key' in the top-right corner and name it 'MailMint'.",
        "Copy your secret key immediately (starts with 'gsk_...').",
        "Paste it into MailMint on the left and click 'Save Key & Activate'.",
      ],
    },
    openrouter: {
      id: "openrouter",
      name: "OpenRouter",
      badge: "Free Models (:free)",
      keyPrefix: "sk-or-",
      keyPlaceholder: "sk-or-v1-...",
      portalUrl: "https://openrouter.ai/keys",
      freeTierNote: "Smart auto-fallback across Gemma 4, Nemotron & OpenRouter ':free' models at $0 cost",
      defaultModel: "openrouter/free",
      hasServerKey: false,
      models: [
        { id: "openrouter/free", label: "Smart Free Router (Auto-Fallback — Always Available)" },
        { id: "google/gemma-4-26b-a4b-it:free", label: "Google Gemma 4 26B MoE (:free — Fast)" },
        { id: "google/gemma-4-31b-it:free", label: "Google Gemma 4 31B IT (:free — High Quality)" },
        { id: "nvidia/nemotron-3.5-lightning:free", label: "NVIDIA Nemotron 3.5 Lightning (:free — Fast)" },
        { id: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "NVIDIA Nemotron 3 Ultra 550B (:free)" },
        { id: "xingchen-agi/xing4.0-29b-a4b:free", label: "Xing 4.0 29B MoE (:free)" },
      ],
      steps: [
        "Go to https://openrouter.ai/keys and sign in using Google, GitHub, or email.",
        "Click 'Create Key', name it 'MailMint', and leave credit limit blank (free models cost $0).",
        "Copy the generated API key (starts with 'sk-or-v1-...').",
        "Paste it into MailMint, keep 'Smart Free Router' or any ':free' model selected, and click 'Save Key & Activate'.",
      ],
    },
    mistral: {
      id: "mistral",
      name: "Mistral AI",
      badge: "Free Experiment Tier",
      keyPrefix: "",
      keyPlaceholder: "Paste your Mistral API key...",
      portalUrl: "https://console.mistral.ai/api-keys",
      freeTierNote: "Free 'Experiment' plan available on Mistral La Plateforme",
      defaultModel: "mistral-small-latest",
      hasServerKey: false,
      models: [
        { id: "mistral-small-latest", label: "Mistral Small Latest (Free Tier)" },
        { id: "open-mistral-nemo", label: "Open Mistral Nemo (Free Tier)" },
      ],
      steps: [
        "Open https://console.mistral.ai/api-keys and create a free Mistral account.",
        "Select the free 'Experiment' plan on La Plateforme (no payment required).",
        "Click 'Create new key', copy the key string, and paste it into MailMint.",
        "Click 'Save Key & Activate' to start crafting emails.",
      ],
    },
    cohere: {
      id: "cohere",
      name: "Cohere",
      badge: "Free Trial Key",
      keyPrefix: "",
      keyPlaceholder: "Paste your Cohere Trial API key...",
      portalUrl: "https://dashboard.cohere.com/api-keys",
      freeTierNote: "Free Trial API key automatically created on signup • 20 req/min",
      defaultModel: "command-a-03-2025",
      hasServerKey: false,
      models: [
        { id: "command-a-03-2025", label: "Command A (Free Trial Key)" },
        { id: "command-r-08-2024", label: "Command R (Free Trial Key)" },
      ],
      steps: [
        "Visit https://dashboard.cohere.com/api-keys and sign up with Google or GitHub.",
        "Under 'Trial keys', copy your ready-made Free Trial key.",
        "Paste the key into MailMint on the left and click 'Save Key & Activate'.",
        "Switch to the Studio page to generate polished emails!",
      ],
    },
  };

  // ==================== ENTRY PAGE LIVE SHOWCASE DATA ====================
  const ENTRY_DEMOS = {
    offer: {
      toneTag: "Persuasive • Job Application",
      tone: "Persuasive",
      emailType: "Job Application",
      recipient: "Hiring Team",
      raw: `"Tell HR I'm super excited about the Senior Frontend offer, ask if base salary can move from 18 LPA to 20 LPA given my 4 years React experience, ready to sign this week."`,
      rawClean:
        "Super excited about the Senior Frontend Engineer offer. Ask if base salary can move from 18 LPA to 20 LPA given my 4 years of production React architecture experience. Ready to sign this week.",
      subject: "Offer Discussion — Senior Frontend Engineer Role",
      body: `Dear Hiring Team,\n\nThank you very much for extending the offer for the Senior Frontend Engineer position. I am thrilled about the opportunity to contribute to your product engineering team.\n\nBefore finalizing, I wanted to ask whether there is flexibility to adjust the base compensation from 18 LPA to 20 LPA, reflecting my four years of production React architecture experience. If we can align on this, I am ready to sign this week.\n\nWarm regards,\nAnmolpreet Singh`,
    },
    leave: {
      toneTag: "Apologetic • Leave Request",
      tone: "Apologetic",
      emailType: "Leave Request",
      recipient: "Rajesh Kumar",
      raw: `"Woke up with high viral fever, need 2 days sick leave today & tomorrow, briefed Mridul on urgent release tickets, available on phone for emergencies."`,
      rawClean:
        "Woke up with high viral fever today. Need 2 days sick leave today and tomorrow. Briefed Mridul on urgent release tickets and reachable by phone for emergencies.",
      subject: "Medical Leave Request — Today & Tomorrow",
      body: `Dear Rajesh,\n\nI am writing to let you know that I woke up with a high viral fever this morning and need to take two days of medical leave today and tomorrow to recover.\n\nTo keep our sprint on schedule, I have already briefed Mridul Sharma on the urgent release tickets. I will remain reachable by phone in case anything critical comes up.\n\nSincerely,\nAnmolpreet Singh`,
    },
    client: {
      toneTag: "Friendly • Follow-Up",
      tone: "Friendly",
      emailType: "Follow-Up",
      recipient: "Neha Verma",
      raw: `"Check in with Neha on Q4 website redesign proposal sent Tuesday, ask if she wants a 15-min walkthrough call this Friday afternoon."`,
      rawClean:
        "Checking in on the Q4 website redesign proposal sent on Tuesday. Ask if she would like a quick 15-minute walkthrough call this Friday afternoon.",
      subject: "Quick Follow-Up: Q4 Website Redesign Proposal",
      body: `Hi Neha,\n\nI hope your week is going well! I wanted to follow up on the Q4 website redesign proposal I shared on Tuesday and see if your team had a chance to look it over.\n\nIf helpful, I would be happy to hop on a brief 15-minute call this Friday afternoon to walk through the timeline and deliverables together.\n\nBest regards,\nMridul Sharma`,
    },
  };

  // ==================== 12 CURATED SMART TEMPLATES ====================
  const CURATED_TEMPLATES = [
    {
      id: "tpl-job-fullstack",
      category: "Career",
      icon: "💼",
      title: "Full-Stack Engineer Application",
      tone: "Persuasive",
      emailType: "Job Application",
      recipient: "Engineering Hiring Team",
      prompt:
        "Applying for the Full-Stack Software Engineer opening. Skilled in Python, JavaScript, REST APIs, and modern responsive UI design. Built production AI tools and eager to contribute from day one.",
    },
    {
      id: "tpl-salary-negotiation",
      category: "Career",
      icon: "💎",
      title: "Job Offer & Compensation Discussion",
      tone: "Persuasive",
      emailType: "Job Application",
      recipient: "Talent Acquisition Lead",
      prompt:
        "Grateful for receiving the job offer. Very excited to join the team, and politely asking whether there is room for a 12% upward adjustment in base compensation based on specialized project experience.",
    },
    {
      id: "tpl-interview-thankyou",
      category: "Career",
      icon: "🌿",
      title: "Post-Interview Executive Thank You",
      tone: "Formal",
      emailType: "Thank You",
      recipient: "Interview Panel",
      prompt:
        "Thanking the interview panel for today's technical discussion. Enjoyed learning about the upcoming product roadmap and reiterating strong enthusiasm for the role.",
    },
    {
      id: "tpl-sick-leave",
      category: "Workplace",
      icon: "🤒",
      title: "Urgent Medical / Sick Leave",
      tone: "Apologetic",
      emailType: "Leave Request",
      recipient: "Engineering Manager",
      prompt:
        "Down with severe migraine and fever this morning, requesting medical leave for today and tomorrow. Handed over active sprint deliverables to teammates and reachable for urgent blockers.",
    },
    {
      id: "tpl-annual-vacation",
      category: "Workplace",
      icon: "✈️",
      title: "Planned Vacation Leave Request",
      tone: "Formal",
      emailType: "Leave Request",
      recipient: "Team Lead",
      prompt:
        "Requesting 4 days of planned leave next month (18th to 21st) for a family commitment. Will complete all sprint documentation beforehand and assign backup coverage.",
    },
    {
      id: "tpl-resignation",
      category: "Workplace",
      icon: "🤝",
      title: "Graceful Resignation Notice",
      tone: "Formal",
      emailType: "General",
      recipient: "Reporting Manager",
      prompt:
        "Submitting formal two-week notice of resignation from my current position. Expressing sincere gratitude for mentorship and committing to a smooth handover of all responsibilities.",
    },
    {
      id: "tpl-client-proposal",
      category: "Business",
      icon: "📊",
      title: "Client Proposal Follow-Up",
      tone: "Friendly",
      emailType: "Follow-Up",
      recipient: "Client Product Director",
      prompt:
        "Following up warmly on the software architecture proposal shared last week. Offering a 15-minute call on Thursday to clarify scope, milestones, or pricing.",
    },
    {
      id: "tpl-overdue-invoice",
      category: "Business",
      icon: "🧾",
      title: "Polite Overdue Invoice Reminder",
      tone: "Urgent",
      emailType: "Follow-Up",
      recipient: "Accounts Payable Team",
      prompt:
        "Following up on Invoice #INV-2084 which was due 7 days ago for completed web redesign milestones. Requesting payment confirmation or expected processing date today.",
    },
    {
      id: "tpl-deadline-extension",
      category: "Business",
      icon: "⏳",
      title: "Proactive Deliverable Extension",
      tone: "Apologetic",
      emailType: "General",
      recipient: "Project Stakeholder",
      prompt:
        "Updating stakeholders that third-party API testing revealed edge cases requiring 48 additional hours to resolve properly. Requesting deadline shift from Wednesday to Friday morning.",
    },
    {
      id: "tpl-delayed-order",
      category: "Support",
      icon: "📦",
      title: "Delayed Shipment Escalation",
      tone: "Urgent",
      emailType: "Complaint",
      recipient: "Customer Operations",
      prompt:
        "Order #MM-40928 placed 10 days ago with express shipping still hasn't arrived and tracking is stuck. Requesting immediate dispatch confirmation within 24 hours or a full refund.",
    },
    {
      id: "tpl-billing-dispute",
      category: "Support",
      icon: "💳",
      title: "Duplicate Subscription Charge Refund",
      tone: "Formal",
      emailType: "Complaint",
      recipient: "Billing Support Team",
      prompt:
        "Noticed two identical charges on my statement this morning for my annual plan renewal. Requesting immediate reversal of the duplicate charge and confirmation receipt.",
    },
    {
      id: "tpl-mentor-outreach",
      category: "Networking",
      icon: "🚀",
      title: "Cold Coffee-Chat / Mentor Outreach",
      tone: "Friendly",
      emailType: "General",
      recipient: "VP of Engineering",
      prompt:
        "Admired their recent talk on scalable distributed systems. Reaching out concisely to ask if they have 15 minutes next week for a virtual coffee chat and career advice.",
    },
  ];

  // ==================== QUICK STUDIO SAMPLES ====================
  const STUDIO_SAMPLES = {
    leave: {
      tone: "Apologetic",
      type: "Leave Request",
      recipient: "Project Manager",
      text: "Woke up with a viral fever and severe throat infection this morning. Need 2 days sick leave today and tomorrow. Handed over urgent frontend fixes to Mridul and reachable on Slack for emergencies.",
    },
    job: {
      tone: "Persuasive",
      type: "Job Application",
      recipient: "Hiring Team",
      text: "Applying for the Full-Stack Software Developer role. Skilled in Python, JavaScript, HTML/CSS, and REST APIs. Built MailMint multi-engine AI email studio and passionate about clean developer products.",
    },
    followup: {
      tone: "Friendly",
      type: "Follow-Up",
      recipient: "Neha Verma",
      text: "Checking in on the Q4 product partnership proposal we discussed last Thursday. Wanted to see if your team reviewed the timeline and if we can hop on a quick 15-minute call.",
    },
    complaint: {
      tone: "Urgent",
      type: "Complaint",
      recipient: "Customer Support Team",
      text: "Ordered a wireless mechanical keyboard (Order #MM-40928) 9 days ago with 3-day express shipping. Tracking hasn't updated since Tuesday — need immediate dispatch today or a full refund.",
    },
    thankyou: {
      tone: "Formal",
      type: "Thank You",
      recipient: "Interview Panel",
      text: "Thanking the engineering panel for interviewing me today for the Software Engineer role. Enjoyed our conversation about clean system design and excited about contributing to the team.",
    },
  };

  // ==================== GLOBAL STATE ====================
  const state = {
    page: document.body.getAttribute("data-page") || "entry",
    providers: { ...DEFAULT_PROVIDERS },
    selectedProvider: "gemini",
    savedKeys: {},
    selectedModels: {},
    vaultDrafts: [],

    // Studio state
    selectedLength: "Standard",
    isGenerating: false,
    isVerifying: false,
    variationSeed: 0,
    inputTouched: false,
    currentEmail: null,
    sessionDrafts: [],
    activeSessionIdx: -1,
    activeEntryDemo: "offer",
  };

  // ==================== STORAGE HELPERS ====================
  function loadJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJSON(key, val) {
    try {
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch (_) {
      // Ignore quota errors
    }
  }

  function loadSessionJSON(key) {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (!raw) return null;
      window.sessionStorage.removeItem(key);
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function saveSessionJSON(key, val) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(val));
    } catch (_) {}
  }

  // ==================== TOAST ENGINE (NEVER CONSOLE-ONLY) ====================
  function showToast(message, type = "info", durationMs = 4500) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const icons = {
      error: "⚠️",
      warning: "⏳",
      success: "✓",
      info: "✦",
    };

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");

    const iconEl = document.createElement("span");
    iconEl.textContent = icons[type] || icons.info;

    const msgEl = document.createElement("span");
    msgEl.className = "toast-msg";
    msgEl.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "toast-close";
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => toast.remove());

    toast.appendChild(iconEl);
    toast.appendChild(msgEl);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    if (durationMs > 0) {
      window.setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, durationMs);
    }
  }

  // ==================== CLIPBOARD & DOWNLOAD HELPERS ====================
  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {}
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  }

  function triggerFileDownload(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ==================== GLOBAL NAVBAR & KEY STATE ====================
  function detectProviderFromKeyPrefix(rawKey) {
    const t = (rawKey || "").trim();
    if (t.startsWith("AIza")) return "gemini";
    if (t.startsWith("gsk_")) return "groq";
    if (t.startsWith("sk-or-")) return "openrouter";
    return null;
  }

  function hasUsableKey(providerId) {
    const meta = state.providers[providerId];
    return Boolean(state.savedKeys[providerId]) || Boolean(meta && meta.hasServerKey);
  }

  function updateGlobalChrome() {
    // 1. Update API Status Pill in Navbar
    const pill = document.getElementById("globalApiStatusPill");
    const pillText = document.getElementById("globalApiStatusText");
    const activeMeta = state.providers[state.selectedProvider] || DEFAULT_PROVIDERS.gemini;
    const ready = hasUsableKey(state.selectedProvider);

    if (pill && pillText) {
      pill.classList.toggle("pill-ready", ready);
      pill.classList.toggle("pill-unconfigured", !ready);
      pillText.textContent = ready ? `${activeMeta.name} Ready` : "Setup Free Key";
    }

    // 2. Update Studio Provider Badge if on /studio
    const studioLabel = document.getElementById("studioProviderLabel");
    if (studioLabel) {
      studioLabel.textContent = ready
        ? `🟢 Engine: ${activeMeta.name}`
        : "🔑 Configure Free API Key";
    }

    // 3. Update Drafts Counter Badge in Navbar
    const draftBadge = document.getElementById("navDraftCount");
    if (draftBadge) {
      const count = state.vaultDrafts.length;
      draftBadge.textContent = String(count);
      draftBadge.classList.toggle("hidden", count === 0);
    }
  }

  function bindGlobalNavbar() {
    const menuBtn = document.getElementById("mobileMenuToggle");
    const nav = document.getElementById("primaryNav");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", () => {
        const open = nav.classList.toggle("nav-open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  async function syncProvidersCatalog() {
    try {
      const resp = await fetch("/api/providers");
      if (!resp.ok) return;
      const json = await resp.json();
      if (json.success && Array.isArray(json.providers)) {
        json.providers.forEach((p) => {
          state.providers[p.id] = p;
        });
        updateGlobalChrome();
        if (state.page === "api_keys") {
          renderApiKeysPage();
        }
      }
    } catch (_) {}
  }

  // ==================== PAGE 1: ENTRY / WELCOME PAGE (/) ====================
  function initEntryPage() {
    const tabsWrap = document.getElementById("entryDemoTabs");
    const toneTag = document.getElementById("demoToneTag");
    const rawText = document.getElementById("demoRawText");
    const subjText = document.getElementById("demoSubjText");
    const polishedText = document.getElementById("demoPolishedText");
    const tryBtn = document.getElementById("tryThisDemoBtn");

    if (!tabsWrap) return;

    function renderDemo(key) {
      const d = ENTRY_DEMOS[key];
      if (!d) return;
      state.activeEntryDemo = key;
      tabsWrap.querySelectorAll(".demo-tab").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-demo") === key);
      });
      toneTag.textContent = d.toneTag;
      rawText.textContent = d.raw;
      subjText.innerHTML = `<span>Subject:</span> ${d.subject}`;
      polishedText.textContent = d.body;
    }

    tabsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".demo-tab");
      if (!btn) return;
      renderDemo(btn.getAttribute("data-demo"));
    });

    if (tryBtn) {
      tryBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const d = ENTRY_DEMOS[state.activeEntryDemo];
        if (d) {
          saveSessionJSON(STORAGE_KEYS.STUDIO_PRELOAD, {
            userInput: d.rawClean,
            tone: d.tone,
            emailType: d.emailType,
            recipient: d.recipient,
          });
        }
        window.location.href = "/studio";
      });
    }
  }

  // ==================== PAGE 2: STUDIO WORKSPACE (/studio) ====================
  function initStudioPage() {
    const form = document.getElementById("emailForm");
    if (!form) return;

    const situationInput = document.getElementById("situationInput");
    const charCount = document.getElementById("charCount");
    const clearInputBtn = document.getElementById("clearInputBtn");
    const inputErrorHint = document.getElementById("inputErrorHint");
    const toneSelect = document.getElementById("toneSelect");
    const typeSelect = document.getElementById("typeSelect");
    const lengthSelector = document.getElementById("lengthSelector");
    const languageSelect = document.getElementById("languageSelect");
    const senderNameInput = document.getElementById("senderNameInput");
    const recipientNameInput = document.getElementById("recipientNameInput");
    const generateBtn = document.getElementById("generateBtn");
    const generateSpinner = document.getElementById("generateSpinner");
    const generateSparkleIcon = document.getElementById("generateSparkleIcon");
    const generateBtnText = document.getElementById("generateBtnText");

    const studioEmptyState = document.getElementById("studioEmptyState");
    const outputActiveWrap = document.getElementById("outputActiveWrap");
    const outputMetaBar = document.getElementById("outputMetaBar");
    const outTonePill = document.getElementById("outTonePill");
    const outTypePill = document.getElementById("outTypePill");
    const outProviderPill = document.getElementById("outProviderPill");
    const outStatsPill = document.getElementById("outStatsPill");
    const starCurrentBtn = document.getElementById("starCurrentBtn");

    const subjectText = document.getElementById("subjectText");
    const copySubjectBtn = document.getElementById("copySubjectBtn");
    const copySubjectText = document.getElementById("copySubjectText");
    const altSubjectsWrap = document.getElementById("altSubjectsWrap");
    const altSubjectButtons = document.getElementById("altSubjectButtons");
    const emailBodyDisplay = document.getElementById("emailBodyDisplay");

    const copyFullEmailBtn = document.getElementById("copyFullEmailBtn");
    const copyFullBtnText = document.getElementById("copyFullBtnText");
    const regenerateBtn = document.getElementById("regenerateBtn");
    const regenSpinner = document.getElementById("regenSpinner");
    const regenBtnText = document.getElementById("regenBtnText");
    const gmailComposeBtn = document.getElementById("gmailComposeBtn");
    const mailtoLinkBtn = document.getElementById("mailtoLinkBtn");
    const downloadEmlBtn = document.getElementById("downloadEmlBtn");
    const downloadTxtBtn = document.getElementById("downloadTxtBtn");
    const historyStrip = document.getElementById("historyStrip");
    const historyButtons = document.getElementById("historyButtons");

    // Pre-fill saved sender name
    const savedSender = loadJSON(STORAGE_KEYS.SENDER_NAME, "");
    if (savedSender) senderNameInput.value = savedSender;

    // Pre-load template or reopened draft if passed via sessionStorage
    const preloaded = loadSessionJSON(STORAGE_KEYS.STUDIO_PRELOAD);
    if (preloaded) {
      if (preloaded.userInput) situationInput.value = preloaded.userInput;
      if (preloaded.tone) toneSelect.value = preloaded.tone;
      if (preloaded.emailType) typeSelect.value = preloaded.emailType;
      if (preloaded.recipient) recipientNameInput.value = preloaded.recipient;
      state.inputTouched = true;

      if (preloaded.renderedEmail) {
        state.sessionDrafts.push(preloaded.renderedEmail);
        state.activeSessionIdx = 0;
        renderStudioOutput(preloaded.renderedEmail, true);
      }
    }

    function validateInput(forceVisualError = false) {
      const val = situationInput.value;
      const trimmed = val.trim();
      charCount.textContent = `${val.length} / 3000`;
      clearInputBtn.classList.toggle("hidden", val.length === 0);

      const isEmpty = trimmed.length === 0;
      generateBtn.disabled = isEmpty || state.isGenerating;

      if (isEmpty && (forceVisualError || state.inputTouched)) {
        situationInput.classList.add("input-invalid");
        inputErrorHint.classList.remove("hidden");
      } else {
        situationInput.classList.remove("input-invalid");
        inputErrorHint.classList.add("hidden");
      }
      return !isEmpty;
    }

    function setLoadingState(loading) {
      state.isGenerating = loading;
      generateBtn.disabled = loading || situationInput.value.trim().length === 0;
      regenerateBtn.disabled = loading;
      document.querySelectorAll(".refine-chip").forEach((c) => {
        c.disabled = loading;
      });

      if (loading) {
        generateSpinner.classList.remove("hidden");
        generateSparkleIcon.classList.add("hidden");
        generateBtnText.textContent = "Generating...";
        regenSpinner.classList.remove("hidden");
        regenBtnText.textContent = "Generating...";
      } else {
        generateSpinner.classList.add("hidden");
        generateSparkleIcon.classList.remove("hidden");
        generateBtnText.textContent = "Generate Email";
        regenSpinner.classList.add("hidden");
        regenBtnText.textContent = "🔄 Regenerate";
      }
    }

    function updateShareLinks() {
      const subj = subjectText.textContent.trim();
      const body = emailBodyDisplay.innerText.trim();
      const encSubj = encodeURIComponent(subj);
      const encBody = encodeURIComponent(body);
      mailtoLinkBtn.href = `mailto:?subject=${encSubj}&body=${encBody}`;
      gmailComposeBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&su=${encSubj}&body=${encBody}`;
    }

    function persistDraftToVault(draftObj) {
      state.vaultDrafts.unshift(draftObj);
      if (state.vaultDrafts.length > 30) {
        state.vaultDrafts = state.vaultDrafts.slice(0, 30);
      }
      saveJSON(STORAGE_KEYS.VAULT_DRAFTS, state.vaultDrafts);
      updateGlobalChrome();
    }

    function renderStudioOutput(entry, animate = true) {
      state.currentEmail = entry;

      studioEmptyState.classList.add("hidden");
      outputActiveWrap.classList.remove("hidden");
      outputMetaBar.classList.remove("hidden");

      outTonePill.textContent = entry.tone;
      outTypePill.textContent = entry.emailType;
      outProviderPill.textContent = entry.provider;
      outStatsPill.textContent = `${entry.wordCount}w • ~${entry.readingTimeSec || 35}s read`;

      starCurrentBtn.classList.toggle("starred", Boolean(entry.starred));
      starCurrentBtn.textContent = entry.starred ? "★" : "☆";

      subjectText.textContent = entry.subject;
      emailBodyDisplay.textContent = entry.emailBodyFull;
      updateShareLinks();

      // Render Alternative Subjects if available
      const allSubjects = [entry.subject, ...(entry.altSubjects || [])].filter(Boolean);
      if (allSubjects.length > 1) {
        altSubjectsWrap.classList.remove("hidden");
        altSubjectButtons.innerHTML = "";
        allSubjects.forEach((sText, i) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `alt-pill ${sText === subjectText.textContent ? "active" : ""}`;
          btn.textContent = i === 0 ? "Primary" : `Option ${i + 1}: ${sText.slice(0, 34)}${sText.length > 34 ? "…" : ""}`;
          btn.title = sText;
          btn.addEventListener("click", () => {
            subjectText.textContent = sText;
            entry.subject = sText;
            altSubjectButtons.querySelectorAll(".alt-pill").forEach((p) => p.classList.remove("active"));
            btn.classList.add("active");
            updateShareLinks();
            showToast("Swapped active subject line!", "info", 2000);
          });
          altSubjectButtons.appendChild(btn);
        });
      } else {
        altSubjectsWrap.classList.add("hidden");
      }

      if (animate) {
        outputActiveWrap.classList.remove("animate-reveal");
        void outputActiveWrap.offsetWidth;
        outputActiveWrap.classList.add("animate-reveal");
      }

      // Render Session Variations
      if (state.sessionDrafts.length > 1) {
        historyStrip.classList.remove("hidden");
        historyButtons.innerHTML = "";
        state.sessionDrafts.forEach((item, idx) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = `alt-pill ${idx === state.activeSessionIdx ? "active" : ""}`;
          b.textContent = `v${idx + 1}`;
          b.addEventListener("click", () => {
            state.activeSessionIdx = idx;
            renderStudioOutput(state.sessionDrafts[idx], false);
          });
          historyButtons.appendChild(b);
        });
      } else {
        historyStrip.classList.add("hidden");
      }
    }

    async function runGeneration({ isRegenerate = false, refineInstruction = "" } = {}) {
      if (state.isGenerating) return;

      state.inputTouched = true;
      if (!validateInput(true)) {
        showToast("Please describe your email situation before generating.", "error");
        situationInput.focus();
        return;
      }

      const activeKey = state.savedKeys[state.selectedProvider] || "";
      const providerMeta = state.providers[state.selectedProvider];

      // Mandatory Error #1: Missing API Key -> Toast!
      if (!activeKey && !providerMeta?.hasServerKey) {
        showToast("Please set your API key", "error");
        const badge = document.getElementById("studioProviderBadge");
        if (badge) {
          badge.focus();
        }
        return;
      }

      if (isRegenerate) {
        state.variationSeed += 1;
      } else if (!refineInstruction) {
        state.variationSeed = 0;
      }

      const senderVal = senderNameInput.value.trim();
      if (senderVal) saveJSON(STORAGE_KEYS.SENDER_NAME, senderVal);

      const chosenModel =
        state.selectedModels[state.selectedProvider] || providerMeta?.defaultModel || "";

      const currentDraftText =
        refineInstruction && state.currentEmail
          ? `Subject: ${subjectText.textContent.trim()}\n\n${emailBodyDisplay.innerText.trim()}`
          : "";

      setLoadingState(true);

      try {
        const resp = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userInput: situationInput.value.trim(),
            tone: toneSelect.value,
            emailType: typeSelect.value,
            provider: state.selectedProvider,
            apiKey: activeKey,
            model: chosenModel,
            senderName: senderVal,
            recipientName: recipientNameInput.value.trim(),
            length: state.selectedLength,
            language: languageSelect.value,
            refineInstruction,
            currentDraft: currentDraftText,
            variationSeed: state.variationSeed,
          }),
        });

        let payload = null;
        try {
          payload = await resp.json();
        } catch (_) {}

        if (!resp.ok || !payload || !payload.success) {
          const code = payload?.errorCode || "";
          const msg = payload?.message || "Failed to generate email.";
          if (code === "MISSING_API_KEY") {
            showToast("Please set your API key", "error");
          } else if (code === "RATE_LIMIT" || resp.status === 429) {
            showToast("Too many requests, try again in 30s", "warning");
          } else if (code === "NETWORK_ERROR" || resp.status === 503) {
            showToast("Connection failed, check internet", "error");
          } else {
            showToast(msg, "error");
          }
          return;
        }

        const draftRecord = {
          id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
          starred: false,
          userInput: situationInput.value.trim(),
          recipient: recipientNameInput.value.trim(),
          tone: toneSelect.value,
          emailType: typeSelect.value,
          ...payload.data,
        };

        state.sessionDrafts.push(draftRecord);
        if (state.sessionDrafts.length > 6) state.sessionDrafts.shift();
        state.activeSessionIdx = state.sessionDrafts.length - 1;

        persistDraftToVault(draftRecord);
        renderStudioOutput(draftRecord, true);

        showToast(
          refineInstruction
            ? "Draft polished with AI!"
            : isRegenerate
            ? "Fresh variation generated!"
            : "Executive email ready!",
          "success",
          2800
        );
      } catch (_) {
        showToast("Connection failed, check internet", "error");
      } finally {
        setLoadingState(false);
      }
    }

    // Event bindings in Studio
    document.getElementById("sampleChips")?.addEventListener("click", (e) => {
      const chip = e.target.closest(".mini-chip");
      if (!chip) return;
      const sample = STUDIO_SAMPLES[chip.getAttribute("data-sample")];
      if (!sample) return;
      situationInput.value = sample.text;
      toneSelect.value = sample.tone;
      typeSelect.value = sample.type;
      recipientNameInput.value = sample.recipient;
      state.inputTouched = true;
      validateInput(false);
      situationInput.focus();
    });

    lengthSelector?.addEventListener("click", (e) => {
      const btn = e.target.closest(".seg-btn");
      if (!btn) return;
      state.selectedLength = btn.getAttribute("data-length") || "Standard";
      lengthSelector.querySelectorAll(".seg-btn").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
    });

    situationInput.addEventListener("input", () => {
      state.inputTouched = true;
      validateInput(false);
    });

    situationInput.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runGeneration({ isRegenerate: false });
      }
    });

    clearInputBtn.addEventListener("click", () => {
      situationInput.value = "";
      state.inputTouched = true;
      validateInput(true);
      situationInput.focus();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      runGeneration({ isRegenerate: false });
    });

    regenerateBtn.addEventListener("click", () => {
      runGeneration({ isRegenerate: true });
    });

    document.querySelectorAll(".refine-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const instruction = chip.getAttribute("data-refine") || "";
        runGeneration({ refineInstruction: instruction });
      });
    });

    emailBodyDisplay.addEventListener("input", () => {
      const text = emailBodyDisplay.innerText.trim();
      const wc = text.split(/\s+/).filter(Boolean).length;
      const rt = Math.max(10, Math.round((wc / 200) * 60));
      outStatsPill.textContent = `${wc}w • ~${rt}s read`;
      if (state.currentEmail) {
        state.currentEmail.emailBodyFull = text;
        saveJSON(STORAGE_KEYS.VAULT_DRAFTS, state.vaultDrafts);
      }
      updateShareLinks();
    });

    starCurrentBtn.addEventListener("click", () => {
      if (!state.currentEmail) return;
      state.currentEmail.starred = !state.currentEmail.starred;
      starCurrentBtn.classList.toggle("starred", state.currentEmail.starred);
      starCurrentBtn.textContent = state.currentEmail.starred ? "★" : "☆";
      saveJSON(STORAGE_KEYS.VAULT_DRAFTS, state.vaultDrafts);
      showToast(
        state.currentEmail.starred ? "Added to Starred Favorites!" : "Removed from Favorites.",
        "info",
        2200
      );
    });

    copyFullEmailBtn.addEventListener("click", async () => {
      const full = `Subject: ${subjectText.textContent.trim()}\n\n${emailBodyDisplay.innerText.trim()}`;
      const ok = await copyToClipboard(full);
      if (ok) {
        copyFullBtnText.textContent = "Copied to Clipboard!";
        showToast("Full email copied to clipboard!", "success", 2500);
        window.setTimeout(() => {
          copyFullBtnText.textContent = "Copy to Clipboard";
        }, 2200);
      }
    });

    copySubjectBtn.addEventListener("click", async () => {
      const ok = await copyToClipboard(subjectText.textContent.trim());
      if (ok) {
        copySubjectText.textContent = "Copied!";
        showToast("Subject line copied!", "success", 2000);
        window.setTimeout(() => {
          copySubjectText.textContent = "Copy Subject";
        }, 1800);
      }
    });

    downloadTxtBtn.addEventListener("click", () => {
      const subj = subjectText.textContent.trim();
      const full = `Subject: ${subj}\n\n${emailBodyDisplay.innerText.trim()}\n`;
      triggerFileDownload("mailmint-email.txt", full, "text/plain;charset=utf-8");
      showToast("Downloaded mailmint-email.txt", "success", 2200);
    });

    downloadEmlBtn.addEventListener("click", () => {
      const subj = subjectText.textContent.trim();
      const body = emailBodyDisplay.innerText.trim().replace(/\r?\n/g, "\r\n");
      const eml = [
        "X-Unsent: 1",
        `Subject: ${subj}`,
        "MIME-Version: 1.0",
        'Content-Type: text/plain; charset="UTF-8"',
        "",
        body,
      ].join("\r\n");
      triggerFileDownload("mailmint-draft.eml", eml, "message/rfc822");
      showToast("Downloaded .eml draft (opens directly in Outlook / Mail)!", "success", 2800);
    });

    validateInput(false);
  }

  // ==================== PAGE 3: TEMPLATES LIBRARY (/templates) ====================
  function initTemplatesPage() {
    const grid = document.getElementById("templatesGrid");
    const searchInput = document.getElementById("templateSearchInput");
    const categoryTabs = document.getElementById("templateCategoryTabs");
    if (!grid) return;

    let activeCategory = "all";

    function renderGrid() {
      const query = (searchInput?.value || "").trim().toLowerCase();
      const filtered = CURATED_TEMPLATES.filter((t) => {
        const matchCat = activeCategory === "all" || t.category === activeCategory;
        const matchQuery =
          !query ||
          t.title.toLowerCase().includes(query) ||
          t.prompt.toLowerCase().includes(query) ||
          t.tone.toLowerCase().includes(query) ||
          t.emailType.toLowerCase().includes(query);
        return matchCat && matchQuery;
      });

      grid.innerHTML = "";
      if (filtered.length === 0) {
        grid.innerHTML = `<div class="jet-card" style="grid-column: 1 / -1; text-align:center;">No templates matched your search. Try another keyword!</div>`;
        return;
      }

      filtered.forEach((tpl) => {
        const card = document.createElement("article");
        card.className = "jet-card tpl-card";
        card.innerHTML = `
          <div>
            <div class="tpl-head">
              <span class="tpl-icon">${tpl.icon}</span>
              <div class="meta-pills">
                <span class="meta-badge gold">${tpl.tone}</span>
                <span class="meta-badge mint">${tpl.emailType}</span>
              </div>
            </div>
            <h3 class="tpl-title">${tpl.title}</h3>
            <p class="tpl-prompt">${tpl.prompt}</p>
          </div>
          <div class="tpl-footer">
            <span class="vault-time">${tpl.category}</span>
            <button type="button" class="btn btn-mint btn-xs use-tpl-btn">Load in Studio →</button>
          </div>
        `;
        card.querySelector(".use-tpl-btn").addEventListener("click", () => {
          saveSessionJSON(STORAGE_KEYS.STUDIO_PRELOAD, {
            userInput: tpl.prompt,
            tone: tpl.tone,
            emailType: tpl.emailType,
            recipient: tpl.recipient,
          });
          window.location.href = "/studio";
        });
        grid.appendChild(card);
      });
    }

    searchInput?.addEventListener("input", renderGrid);
    categoryTabs?.addEventListener("click", (e) => {
      const pill = e.target.closest(".cat-pill");
      if (!pill) return;
      activeCategory = pill.getAttribute("data-category") || "all";
      categoryTabs.querySelectorAll(".cat-pill").forEach((p) => p.classList.toggle("active", p === pill));
      renderGrid();
    });

    renderGrid();
  }

  // ==================== PAGE 4: API KEYS HUB (/api-keys) ====================
  function renderApiKeysPage() {
    const providerTabs = document.getElementById("providerTabs");
    if (!providerTabs) return;

    const meta = state.providers[state.selectedProvider] || DEFAULT_PROVIDERS.gemini;
    const apiKeyLabel = document.getElementById("apiKeyLabel");
    const apiKeyInput = document.getElementById("apiKeyInput");
    const keySavedBadge = document.getElementById("keySavedBadge");
    const modelSelect = document.getElementById("modelSelect");
    const howToBadge = document.getElementById("howToBadge");
    const howToTitle = document.getElementById("howToTitle");
    const howToPortalLink = document.getElementById("howToPortalLink");
    const howToSteps = document.getElementById("howToSteps");
    const howToQuotaNote = document.getElementById("howToQuotaNote");

    providerTabs.querySelectorAll(".provider-card-tab").forEach((card) => {
      const pid = card.getAttribute("data-provider");
      card.classList.toggle("active", pid === state.selectedProvider);
      card.classList.toggle("has-key", hasUsableKey(pid));
      card.setAttribute("aria-selected", pid === state.selectedProvider ? "true" : "false");
    });

    apiKeyLabel.textContent = `${meta.name} API Key`;
    apiKeyInput.placeholder = meta.hasServerKey
      ? `Server .env key active (or paste your own ${meta.keyPlaceholder})`
      : meta.keyPlaceholder;

    const savedVal = state.savedKeys[state.selectedProvider] || "";
    apiKeyInput.value = savedVal;
    const isReady = Boolean(savedVal) || Boolean(meta.hasServerKey);
    keySavedBadge.classList.toggle("hidden", !isReady);
    keySavedBadge.textContent = savedVal ? "✓ Saved Locally" : "✓ Server .env Key Active";

    modelSelect.innerHTML = "";
    const currentModel = state.selectedModels[state.selectedProvider] || meta.defaultModel;
    (meta.models || []).forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.label;
      if (m.id === currentModel) opt.selected = true;
      modelSelect.appendChild(opt);
    });

    howToBadge.textContent = meta.badge;
    howToTitle.textContent = `How to get your free ${meta.name} key`;
    howToPortalLink.href = meta.portalUrl;
    howToQuotaNote.textContent = meta.freeTierNote;

    howToSteps.innerHTML = "";
    (meta.steps || []).forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      howToSteps.appendChild(li);
    });
  }

  function initApiKeysPage() {
    const providerTabs = document.getElementById("providerTabs");
    if (!providerTabs) return;

    const apiKeyInput = document.getElementById("apiKeyInput");
    const toggleVisBtn = document.getElementById("toggleKeyVisibilityBtn");
    const modelSelect = document.getElementById("modelSelect");
    const saveKeyBtn = document.getElementById("saveKeyBtn");
    const verifyKeyBtn = document.getElementById("verifyKeyBtn");
    const verifySpinner = document.getElementById("verifyBtnSpinner");
    const verifyText = document.getElementById("verifyBtnText");
    const clearKeyBtn = document.getElementById("clearKeyBtn");

    renderApiKeysPage();

    providerTabs.addEventListener("click", (e) => {
      const card = e.target.closest(".provider-card-tab");
      if (!card) return;
      const pid = card.getAttribute("data-provider");
      if (state.providers[pid]) {
        state.selectedProvider = pid;
        saveJSON(STORAGE_KEYS.SELECTED_PROVIDER, pid);
        renderApiKeysPage();
        updateGlobalChrome();
      }
    });

    apiKeyInput.addEventListener("input", () => {
      const val = apiKeyInput.value.trim();
      const detected = detectProviderFromKeyPrefix(val);
      if (detected && detected !== state.selectedProvider) {
        state.selectedProvider = detected;
        state.savedKeys[detected] = val;
        saveJSON(STORAGE_KEYS.SELECTED_PROVIDER, detected);
        renderApiKeysPage();
        apiKeyInput.value = val;
        updateGlobalChrome();
        showToast(`Auto-detected ${state.providers[detected].name} key!`, "info", 2800);
      }
    });

    toggleVisBtn.addEventListener("click", () => {
      apiKeyInput.type = apiKeyInput.type === "password" ? "text" : "password";
    });

    modelSelect.addEventListener("change", () => {
      state.selectedModels[state.selectedProvider] = modelSelect.value;
      saveJSON(STORAGE_KEYS.SELECTED_MODELS, state.selectedModels);
      showToast("Default model updated!", "info", 2000);
    });

    saveKeyBtn.addEventListener("click", () => {
      const raw = apiKeyInput.value.trim();
      if (!raw) {
        showToast("Please paste a valid free API key first.", "warning");
        apiKeyInput.focus();
        return;
      }
      const detected = detectProviderFromKeyPrefix(raw);
      if (detected) state.selectedProvider = detected;
      state.savedKeys[state.selectedProvider] = raw;
      saveJSON(STORAGE_KEYS.SELECTED_PROVIDER, state.selectedProvider);
      saveJSON(STORAGE_KEYS.API_KEYS, state.savedKeys);
      renderApiKeysPage();
      updateGlobalChrome();
      showToast(`${state.providers[state.selectedProvider].name} key saved & activated!`, "success");
    });

    clearKeyBtn.addEventListener("click", () => {
      delete state.savedKeys[state.selectedProvider];
      apiKeyInput.value = "";
      saveJSON(STORAGE_KEYS.API_KEYS, state.savedKeys);
      renderApiKeysPage();
      updateGlobalChrome();
      showToast("Removed saved key from this browser.", "info");
    });

    verifyKeyBtn.addEventListener("click", async () => {
      if (state.isVerifying) return;
      const currentKey = apiKeyInput.value.trim() || state.savedKeys[state.selectedProvider] || "";
      const meta = state.providers[state.selectedProvider];

      if (!currentKey && !meta?.hasServerKey) {
        showToast("Please set your API key", "error");
        apiKeyInput.focus();
        return;
      }

      state.isVerifying = true;
      verifyKeyBtn.disabled = true;
      verifySpinner.classList.remove("hidden");
      verifyText.textContent = "Verifying...";

      try {
        const resp = await fetch("/api/verify-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: state.selectedProvider,
            apiKey: currentKey,
            model: modelSelect.value,
          }),
        });
        const json = await resp.json();
        if (!resp.ok || !json.success) {
          showToast(json.message || "Key verification failed.", "error");
          return;
        }
        if (currentKey) {
          state.savedKeys[state.selectedProvider] = currentKey;
          saveJSON(STORAGE_KEYS.API_KEYS, state.savedKeys);
          renderApiKeysPage();
          updateGlobalChrome();
        }
        showToast(json.message || "API key verified!", "success");
      } catch (_) {
        showToast("Connection failed, check internet", "error");
      } finally {
        state.isVerifying = false;
        verifyKeyBtn.disabled = false;
        verifySpinner.classList.add("hidden");
        verifyText.textContent = "⚡ Test & Verify Key";
      }
    });
  }

  // ==================== PAGE 5: SAVED DRAFTS VAULT (/history) ====================
  function initHistoryPage() {
    const grid = document.getElementById("vaultListGrid");
    const emptyState = document.getElementById("vaultEmptyState");
    const searchInput = document.getElementById("vaultSearchInput");
    const filterTabs = document.getElementById("vaultFilterTabs");
    const exportBtn = document.getElementById("exportVaultBtn");
    const clearBtn = document.getElementById("clearVaultBtn");
    if (!grid) return;

    let filterMode = "all";

    function renderVault() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const items = state.vaultDrafts.filter((d) => {
        if (filterMode === "starred" && !d.starred) return false;
        if (!q) return true;
        return (
          (d.subject || "").toLowerCase().includes(q) ||
          (d.emailBodyFull || "").toLowerCase().includes(q) ||
          (d.tone || "").toLowerCase().includes(q) ||
          (d.emailType || "").toLowerCase().includes(q)
        );
      });

      grid.innerHTML = "";
      if (state.vaultDrafts.length === 0) {
        emptyState.classList.remove("hidden");
        return;
      }
      emptyState.classList.add("hidden");

      if (items.length === 0) {
        grid.innerHTML = `<div class="jet-card" style="grid-column: 1 / -1; text-align:center;">No saved drafts match your current filter.</div>`;
        return;
      }

      items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "jet-card vault-item-card";
        const dateStr = item.createdAt
          ? new Date(item.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
          : "Saved Draft";

        card.innerHTML = `
          <div class="vault-item-top">
            <div class="meta-pills">
              <span class="meta-badge mint">${item.tone || "Formal"}</span>
              <span class="meta-badge">${item.emailType || "General"}</span>
              <span class="meta-badge gold">${item.provider || "AI"}</span>
            </div>
            <span class="vault-time">${dateStr}</span>
          </div>
          <h3 class="vault-subj">Subject: ${item.subject}</h3>
          <p class="vault-snippet">${item.emailBodyFull}</p>
          <div class="vault-actions">
            <button type="button" class="btn btn-mint btn-xs act-copy">Copy Email</button>
            <button type="button" class="btn btn-jet-border btn-xs act-open">Open in Studio →</button>
            <button type="button" class="btn btn-gold-subtle btn-xs act-star">${item.starred ? "★ Starred" : "☆ Star"}</button>
            <button type="button" class="btn btn-danger-ghost btn-xs act-del" style="margin-left:auto;">Delete</button>
          </div>
        `;

        card.querySelector(".act-copy").addEventListener("click", async () => {
          const ok = await copyToClipboard(`Subject: ${item.subject}\n\n${item.emailBodyFull}`);
          if (ok) showToast("Copied draft to clipboard!", "success", 2200);
        });

        card.querySelector(".act-open").addEventListener("click", () => {
          saveSessionJSON(STORAGE_KEYS.STUDIO_PRELOAD, {
            userInput: item.userInput || "",
            tone: item.tone || "Formal",
            emailType: item.emailType || "General",
            recipient: item.recipient || "",
            renderedEmail: item,
          });
          window.location.href = "/studio";
        });

        card.querySelector(".act-star").addEventListener("click", () => {
          item.starred = !item.starred;
          saveJSON(STORAGE_KEYS.VAULT_DRAFTS, state.vaultDrafts);
          renderVault();
        });

        card.querySelector(".act-del").addEventListener("click", () => {
          state.vaultDrafts = state.vaultDrafts.filter((x) => x.id !== item.id);
          saveJSON(STORAGE_KEYS.VAULT_DRAFTS, state.vaultDrafts);
          updateGlobalChrome();
          renderVault();
          showToast("Draft deleted.", "info", 2000);
        });

        grid.appendChild(card);
      });
    }

    searchInput?.addEventListener("input", renderVault);
    filterTabs?.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-pill");
      if (!btn) return;
      filterMode = btn.getAttribute("data-filter") || "all";
      filterTabs.querySelectorAll(".cat-pill").forEach((b) => b.classList.toggle("active", b === btn));
      renderVault();
    });

    exportBtn?.addEventListener("click", () => {
      if (state.vaultDrafts.length === 0) {
        showToast("No saved drafts to export yet.", "warning");
        return;
      }
      triggerFileDownload(
        "mailmint-saved-drafts.json",
        JSON.stringify(state.vaultDrafts, null, 2),
        "application/json"
      );
      showToast("Exported saved drafts as JSON!", "success");
    });

    clearBtn?.addEventListener("click", () => {
      if (state.vaultDrafts.length === 0) return;
      state.vaultDrafts = [];
      saveJSON(STORAGE_KEYS.VAULT_DRAFTS, []);
      updateGlobalChrome();
      renderVault();
      showToast("Cleared all saved drafts from browser vault.", "info");
    });

    renderVault();
  }

  // ==================== BOOTSTRAP ====================
  function init() {
    state.savedKeys = loadJSON(STORAGE_KEYS.API_KEYS, {});
    state.selectedModels = loadJSON(STORAGE_KEYS.SELECTED_MODELS, {});
    state.vaultDrafts = loadJSON(STORAGE_KEYS.VAULT_DRAFTS, []);

    const storedProvider = loadJSON(STORAGE_KEYS.SELECTED_PROVIDER, "gemini");
    if (state.providers[storedProvider]) {
      state.selectedProvider = storedProvider;
    }

    bindGlobalNavbar();
    updateGlobalChrome();
    syncProvidersCatalog();

    if (state.page === "entry") initEntryPage();
    else if (state.page === "studio") initStudioPage();
    else if (state.page === "templates") initTemplatesPage();
    else if (state.page === "api_keys") initApiKeysPage();
    else if (state.page === "history") initHistoryPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
