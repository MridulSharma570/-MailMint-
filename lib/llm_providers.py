"""
MailMint — Multi-Provider Free LLM API Integration Module
Developers: Anmolpreet Singh (Developer) & Mridul Sharma (Co-Developer)

Supports 100% FREE API keys from:
1. Google Gemini (Google AI Studio Free Tier)
2. Groq Cloud (Free Developer Tier)
3. OpenRouter (Free `:free` Models & `openrouter/free` Router)
4. Mistral AI (La Plateforme Free Tier)
5. Cohere (Free Trial API Key)
"""

import os
import re
from typing import Dict, Any, List, Optional, Tuple
import requests


class LLMProviderError(Exception):
    """Structured exception for clean frontend toast error handling."""

    def __init__(self, code: str, message: str, status_code: int = 400):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


PROVIDERS_CATALOG: Dict[str, Dict[str, Any]] = {
    "gemini": {
        "id": "gemini",
        "name": "Google Gemini",
        "badge": "100% Free • Recommended",
        "speed": "Fast (~1.5s)",
        "card_required": "No",
        "env_var": "GEMINI_API_KEY",
        "key_prefix": "AIza",
        "key_placeholder": "AIzaSy...",
        "portal_url": "https://aistudio.google.com/apikey",
        "portal_label": "aistudio.google.com/apikey",
        "free_tier_note": "Free forever tier • No credit card needed • 15 RPM / 1,000+ req/day",
        "default_model": "gemini-2.5-flash",
        "models": [
            {"id": "gemini-2.5-flash", "label": "Gemini 2.5 Flash (Fast & Smart — Free)"},
            {"id": "gemini-2.5-flash-lite", "label": "Gemini 2.5 Flash-Lite (High Quota — Free)"},
            {"id": "gemini-2.0-flash", "label": "Gemini 2.0 Flash (Free)"},
        ],
        "steps": [
            "Open Google AI Studio at https://aistudio.google.com/apikey and sign in with your Google account.",
            "Click 'Create API Key' (no credit card or billing setup is required).",
            "Copy the generated key string (starts with 'AIzaSy...').",
            "Paste the key into MailMint above and click 'Save Key' — you're ready to craft emails!",
        ],
    },
    "groq": {
        "id": "groq",
        "name": "Groq Cloud",
        "badge": "100% Free • Ultra Fast",
        "speed": "Instant (<0.8s)",
        "card_required": "No",
        "env_var": "GROQ_API_KEY",
        "key_prefix": "gsk_",
        "key_placeholder": "gsk_...",
        "portal_url": "https://console.groq.com/keys",
        "portal_label": "console.groq.com/keys",
        "free_tier_note": "Free developer plan • No credit card needed • Blazing LPU inference speed",
        "default_model": "llama-3.3-70b-versatile",
        "models": [
            {"id": "llama-3.3-70b-versatile", "label": "Llama 3.3 70B Versatile (Best Quality — Free)"},
            {"id": "llama-3.1-8b-instant", "label": "Llama 3.1 8B Instant (Fastest — Free)"},
        ],
        "steps": [
            "Visit https://console.groq.com/keys and sign up or log in with Google or GitHub.",
            "Click 'Create API Key' in the top-right corner and name it 'MailMint'.",
            "Copy your secret key immediately (starts with 'gsk_...').",
            "Paste it into MailMint above and click 'Save Key'.",
        ],
    },
    "openrouter": {
        "id": "openrouter",
        "name": "OpenRouter",
        "badge": "Free Models (:free)",
        "speed": "Moderate (~2s)",
        "card_required": "No (:free models)",
        "env_var": "OPENROUTER_API_KEY",
        "key_prefix": "sk-or-",
        "key_placeholder": "sk-or-v1-...",
        "portal_url": "https://openrouter.ai/keys",
        "portal_label": "openrouter.ai/keys",
        "free_tier_note": "Access Llama, Gemma, Mistral & Qwen ':free' models at $0 cost",
        "default_model": "openrouter/free",
        "models": [
            {"id": "openrouter/free", "label": "Auto Free Router (openrouter/free — Always Available)"},
            {"id": "meta-llama/llama-3.3-70b-instruct:free", "label": "Meta Llama 3.3 70B Instruct (:free)"},
            {"id": "google/gemma-3-27b-it:free", "label": "Google Gemma 3 27B IT (:free)"},
            {"id": "mistralai/mistral-small-3.1-24b-instruct:free", "label": "Mistral Small 3.1 24B (:free)"},
            {"id": "google/gemma-pro-1.1-it:free", "label": "Google Gemma Pro 1.1 IT (:free — Legacy)"},
        ],
        "steps": [
            "Go to https://openrouter.ai/keys and sign in using Google, GitHub, or email.",
            "Click 'Create Key', name it 'MailMint', and leave credit limit blank (free models cost $0).",
            "Copy the generated API key (starts with 'sk-or-v1-...').",
            "Paste it into MailMint above, keep any ':free' model selected, and click 'Save Key'.",
        ],
    },
    "mistral": {
        "id": "mistral",
        "name": "Mistral AI",
        "badge": "Free Experiment Tier",
        "speed": "Fast (~1.3s)",
        "card_required": "No (Experiment plan)",
        "env_var": "MISTRAL_API_KEY",
        "key_prefix": "",
        "key_placeholder": "Paste your Mistral API key...",
        "portal_url": "https://console.mistral.ai/api-keys",
        "portal_label": "console.mistral.ai/api-keys",
        "free_tier_note": "Free 'Experiment' plan available on Mistral La Plateforme",
        "default_model": "mistral-small-latest",
        "models": [
            {"id": "mistral-small-latest", "label": "Mistral Small Latest (Free Tier)"},
            {"id": "open-mistral-nemo", "label": "Open Mistral Nemo (Free Tier)"},
        ],
        "steps": [
            "Open https://console.mistral.ai/api-keys and create a free Mistral account.",
            "Select the free 'Experiment' plan on La Plateforme (no payment required).",
            "Click 'Create new key', copy the key string, and paste it into MailMint above.",
            "Click 'Save Key' to start generating polished emails.",
        ],
    },
    "cohere": {
        "id": "cohere",
        "name": "Cohere",
        "badge": "Free Trial Key",
        "speed": "Fast (~1.4s)",
        "card_required": "No (Trial key)",
        "env_var": "COHERE_API_KEY",
        "key_prefix": "",
        "key_placeholder": "Paste your Cohere Trial API key...",
        "portal_url": "https://dashboard.cohere.com/api-keys",
        "portal_label": "dashboard.cohere.com/api-keys",
        "free_tier_note": "Free Trial API key automatically created on signup • 20 req/min",
        "default_model": "command-a-03-2025",
        "models": [
            {"id": "command-a-03-2025", "label": "Command A (Free Trial Key)"},
            {"id": "command-r-08-2024", "label": "Command R (Free Trial Key)"},
        ],
        "steps": [
            "Visit https://dashboard.cohere.com/api-keys and sign up with Google or GitHub.",
            "Under 'Trial keys', copy your ready-made Free Trial key (or click 'Create Trial key').",
            "Paste the key into MailMint above and click 'Save Key'.",
            "Head over to the Studio page and generate your email!",
        ],
    },
}


PLACEHOLDER_KEYS = {
    "",
    "sk-or-xxxxx",
    "your_api_key_here",
    "paste_your_key_here",
    "none",
    "null",
}

LENGTH_GUIDANCE = {
    "Short": "Keep the body crisp, concise, and direct (60-95 words).",
    "Standard": "Keep the body balanced and polished (110-175 words).",
    "Detailed": "Write a comprehensive, well-structured body (185-260 words) with clear paragraphs.",
}


def resolve_api_key(provider_id: str, client_api_key: Optional[str] = None) -> str:
    """Resolve API key from client request first, falling back to server .env."""
    provider = PROVIDERS_CATALOG.get(provider_id)
    if not provider:
        raise LLMProviderError(
            code="INVALID_PROVIDER",
            message=f"Unsupported AI provider '{provider_id}'.",
            status_code=400,
        )

    candidate = (client_api_key or "").strip()
    if not candidate or candidate.lower() in PLACEHOLDER_KEYS:
        env_key = os.getenv(provider["env_var"], "").strip()
        candidate = env_key

    if not candidate or candidate.lower() in PLACEHOLDER_KEYS:
        raise LLMProviderError(
            code="MISSING_API_KEY",
            message="Please set your API key",
            status_code=401,
        )

    return candidate


def build_email_prompts(
    user_input: str,
    tone: str,
    email_type: str,
    sender_name: str = "",
    recipient_name: str = "",
    length: str = "Standard",
    language: str = "English",
    refine_instruction: str = "",
    current_draft: str = "",
    variation_seed: int = 0,
) -> Tuple[str, str]:
    """Build system and user prompts enforcing structured, placeholder-free emails."""
    clean_sender = sender_name.strip() or "Alex Morgan"
    length_rule = LENGTH_GUIDANCE.get(length, LENGTH_GUIDANCE["Standard"])
    lang_rule = (
        f"Write the entire email (Subject, Greeting, Body, and Sign-off) in {language}."
        if language and language != "English"
        else "Write in clear, natural professional English."
    )
    recipient_hint = (
        f"Address the recipient as '{recipient_name.strip()}'."
        if recipient_name and recipient_name.strip()
        else "Use a natural, context-appropriate greeting (e.g., 'Dear Hiring Team,' or 'Hello Team,') without bracketed placeholders."
    )
    variation_note = (
        f"\nRegeneration attempt #{variation_seed}: Offer a fresh angle, distinct opening sentence, and refined flow while keeping all facts accurate."
        if variation_seed > 0
        else ""
    )

    system_prompt = f"""You are MailMint, an executive-grade professional email writer.
Generate emails in this EXACT plain-text format:

Subject: [primary compelling subject line]
Alt-Subject-1: [concise alternative subject line]
Alt-Subject-2: [action-oriented alternative subject line]

[Greeting],

[Body paragraphs]

[Sign-off],
{clean_sender}

Strict Rules:
- Always start with "Subject: " on line 1, followed by two optional alternative subject lines ("Alt-Subject-1:" and "Alt-Subject-2:").
- Match the requested tone ({tone}) and category ({email_type}) seamlessly.
- {length_rule}
- {lang_rule}
- {recipient_hint}
- Sign off with the exact sender name "{clean_sender}".
- NEVER output bracketed placeholders like [Your Name], [Company Name], [Date], or [Recipient]. Write smooth, complete prose ready to send immediately.
- Output ONLY the formatted email text — no markdown code fences and no commentary."""

    if refine_instruction and current_draft:
        user_prompt = (
            f"Refine the existing email draft below according to this instruction: {refine_instruction}\n"
            f"Target Tone: {tone} | Category: {email_type} | Length: {length}\n\n"
            f"Original casual context: {user_input.strip()}\n\n"
            f"Current Draft to Refine:\n{current_draft.strip()}"
        )
    else:
        user_prompt = (
            f"Write a {tone} '{email_type}' email ({length} length) in {language}.\n"
            f"Casual situation described by user: {user_input.strip()}"
            f"{variation_note}"
        )

    return system_prompt, user_prompt


def _handle_http_errors(response: requests.Response, provider_name: str) -> None:
    """Inspect non-2xx HTTP responses and raise structured LLMProviderError."""
    status = response.status_code
    body_text = ""
    try:
        body_text = str(response.json())
    except Exception:
        body_text = response.text[:300]

    if status == 429:
        raise LLMProviderError(
            code="RATE_LIMIT",
            message="Too many requests, try again in 30s",
            status_code=429,
        )

    if status in (401, 403) or "API_KEY_INVALID" in body_text or "invalid_api_key" in body_text.lower():
        raise LLMProviderError(
            code="INVALID_API_KEY",
            message=f"Invalid API key for {provider_name}. Please check your key in API Keys setup.",
            status_code=401,
        )

    if status >= 500:
        raise LLMProviderError(
            code="PROVIDER_UNAVAILABLE",
            message=f"{provider_name} server is temporarily busy. Please try again shortly.",
            status_code=502,
        )

    detail = f"{provider_name} returned status {status}."
    try:
        data = response.json()
        if isinstance(data, dict):
            err = data.get("error")
            if isinstance(err, dict) and err.get("message"):
                detail = err["message"]
            elif isinstance(err, str):
                detail = err
            elif data.get("message"):
                detail = data["message"]
    except Exception:
        pass

    raise LLMProviderError(code="API_ERROR", message=detail, status_code=400)


def _call_gemini(api_key: str, model: str, system_prompt: str, user_prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 750},
    }
    resp = requests.post(
        url,
        params={"key": api_key},
        headers={"Content-Type": "application/json"},
        json=payload,
        timeout=35,
    )
    if not resp.ok:
        _handle_http_errors(resp, "Google Gemini")

    data = resp.json()
    candidates = data.get("candidates") or []
    if not candidates:
        raise LLMProviderError("EMPTY_RESPONSE", "Google Gemini returned an empty response.", 502)
    parts = candidates[0].get("content", {}).get("parts", [])
    text = "".join(p.get("text", "") for p in parts).strip()
    if not text:
        raise LLMProviderError("EMPTY_RESPONSE", "Google Gemini returned no text content.", 502)
    return text


def _call_openai_compatible(
    endpoint: str,
    api_key: str,
    provider_name: str,
    model: str,
    system_prompt: str,
    user_prompt: str,
    extra_headers: Optional[Dict[str, str]] = None,
) -> str:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    if extra_headers:
        headers.update(extra_headers)

    if "gemma" in model.lower():
        messages = [{"role": "user", "content": f"{system_prompt}\n\n---\n\n{user_prompt}"}]
    else:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 700,
    }
    resp = requests.post(endpoint, headers=headers, json=payload, timeout=35)
    if not resp.ok:
        _handle_http_errors(resp, provider_name)

    data = resp.json()
    choices = data.get("choices") or []
    if not choices:
        raise LLMProviderError("EMPTY_RESPONSE", f"{provider_name} returned no choices.", 502)
    text = (choices[0].get("message", {}).get("content") or "").strip()
    if not text:
        raise LLMProviderError("EMPTY_RESPONSE", f"{provider_name} returned an empty message.", 502)
    return text


def _call_openrouter(api_key: str, model: str, system_prompt: str, user_prompt: str) -> Tuple[str, str]:
    endpoint = "https://openrouter.ai/api/v1/chat/completions"
    extra_headers = {
        "HTTP-Referer": "https://mailmint.app",
        "X-Title": "MailMint AI",
    }
    try:
        text = _call_openai_compatible(
            endpoint=endpoint,
            api_key=api_key,
            provider_name="OpenRouter",
            model=model,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            extra_headers=extra_headers,
        )
        return text, model
    except LLMProviderError as exc:
        if exc.code in ("INVALID_API_KEY", "MISSING_API_KEY"):
            raise
        if model != "openrouter/free":
            text = _call_openai_compatible(
                endpoint=endpoint,
                api_key=api_key,
                provider_name="OpenRouter",
                model="openrouter/free",
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                extra_headers=extra_headers,
            )
            return text, "openrouter/free"
        raise


def _call_cohere(api_key: str, model: str, system_prompt: str, user_prompt: str) -> str:
    endpoint = "https://api.cohere.com/v2/chat"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 700,
    }
    resp = requests.post(endpoint, headers=headers, json=payload, timeout=35)
    if not resp.ok:
        _handle_http_errors(resp, "Cohere")

    data = resp.json()
    content_blocks = data.get("message", {}).get("content", [])
    text = "".join(block.get("text", "") for block in content_blocks if isinstance(block, dict)).strip()
    if not text:
        raise LLMProviderError("EMPTY_RESPONSE", "Cohere returned an empty response.", 502)
    return text


def parse_generated_email(raw_text: str) -> Dict[str, Any]:
    """
    Parse raw LLM text into structured email components:
    subject, altSubjects, greeting, body, signOff, emailBodyFull, fullEmail, wordCount, readingTimeSec.
    """
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```(?:text|markdown|email)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    lines = [line.rstrip() for line in cleaned.splitlines()]

    subject = "Professional Inquiry"
    alt_subjects: List[str] = []
    body_lines: List[str] = []
    header_zone = True

    for line in lines:
        stripped = line.strip()
        if header_zone:
            m_subj = re.match(r"^(?:\*\*|#+\s*)?subject\s*:\s*(.+)$", stripped, flags=re.IGNORECASE)
            if m_subj:
                subject = re.sub(r"\*\*$", "", m_subj.group(1)).strip()
                continue
            m_alt = re.match(r"^(?:\*\*|#+\s*)?alt[-_\s]*subject(?:[-_\s]*\d+)?\s*:\s*(.+)$", stripped, flags=re.IGNORECASE)
            if m_alt:
                alt_val = re.sub(r"\*\*$", "", m_alt.group(1)).strip()
                if alt_val and alt_val != subject:
                    alt_subjects.append(alt_val)
                continue
            if not stripped:
                continue
            header_zone = False

        body_lines.append(line)

    body_section_text = "\n".join(body_lines).strip()
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body_section_text) if p.strip()]

    greeting = ""
    sign_off = ""
    body_paragraphs = []

    if len(paragraphs) >= 3:
        greeting = paragraphs[0]
        sign_off = paragraphs[-1]
        body_paragraphs = paragraphs[1:-1]
    elif len(paragraphs) == 2:
        greeting = paragraphs[0]
        body_paragraphs = [paragraphs[1]]
    elif len(paragraphs) == 1:
        body_paragraphs = [paragraphs[0]]

    body_only = "\n\n".join(body_paragraphs).strip()
    composed_parts = [p for p in [greeting, body_only, sign_off] if p]
    email_without_subject = "\n\n".join(composed_parts).strip()
    full_email = f"Subject: {subject}\n\n{email_without_subject}".strip()

    word_count = len(re.findall(r"\b\w+\b", email_without_subject))
    reading_time_sec = max(10, round((word_count / 200.0) * 60))

    return {
        "subject": subject,
        "altSubjects": alt_subjects[:2],
        "greeting": greeting,
        "body": body_only,
        "signOff": sign_off,
        "emailBodyFull": email_without_subject,
        "fullEmail": full_email,
        "wordCount": word_count,
        "readingTimeSec": reading_time_sec,
    }


def generate_professional_email(
    provider_id: str,
    api_key: Optional[str],
    user_input: str,
    tone: str,
    email_type: str,
    model: Optional[str] = None,
    sender_name: str = "",
    recipient_name: str = "",
    length: str = "Standard",
    language: str = "English",
    refine_instruction: str = "",
    current_draft: str = "",
    variation_seed: int = 0,
) -> Dict[str, Any]:
    """Validate inputs & key, invoke chosen free LLM provider, and parse structured output."""
    provider_id = (provider_id or "gemini").strip().lower()
    if provider_id not in PROVIDERS_CATALOG:
        raise LLMProviderError("INVALID_PROVIDER", f"Unknown provider: {provider_id}", 400)

    resolved_key = resolve_api_key(provider_id, api_key)
    provider_meta = PROVIDERS_CATALOG[provider_id]
    chosen_model = (model or "").strip() or provider_meta["default_model"]

    system_prompt, user_prompt = build_email_prompts(
        user_input=user_input,
        tone=tone,
        email_type=email_type,
        sender_name=sender_name,
        recipient_name=recipient_name,
        length=length,
        language=language,
        refine_instruction=refine_instruction,
        current_draft=current_draft,
        variation_seed=variation_seed,
    )

    try:
        used_model = chosen_model
        if provider_id == "gemini":
            raw_output = _call_gemini(resolved_key, chosen_model, system_prompt, user_prompt)
        elif provider_id == "groq":
            raw_output = _call_openai_compatible(
                endpoint="https://api.groq.com/openai/v1/chat/completions",
                api_key=resolved_key,
                provider_name="Groq Cloud",
                model=chosen_model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
            )
        elif provider_id == "openrouter":
            raw_output, used_model = _call_openrouter(
                resolved_key, chosen_model, system_prompt, user_prompt
            )
        elif provider_id == "mistral":
            raw_output = _call_openai_compatible(
                endpoint="https://api.mistral.ai/v1/chat/completions",
                api_key=resolved_key,
                provider_name="Mistral AI",
                model=chosen_model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
            )
        elif provider_id == "cohere":
            raw_output = _call_cohere(resolved_key, chosen_model, system_prompt, user_prompt)
        else:
            raise LLMProviderError("INVALID_PROVIDER", f"Unsupported provider: {provider_id}", 400)

    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as exc:
        raise LLMProviderError(
            code="NETWORK_ERROR",
            message="Connection failed, check internet",
            status_code=503,
        ) from exc
    except LLMProviderError:
        raise
    except requests.exceptions.RequestException as exc:
        raise LLMProviderError(
            code="NETWORK_ERROR",
            message="Connection failed, check internet",
            status_code=503,
        ) from exc

    parsed = parse_generated_email(raw_output)
    parsed["provider"] = provider_meta["name"]
    parsed["providerId"] = provider_id
    parsed["model"] = used_model
    parsed["length"] = length
    parsed["language"] = language
    return parsed


def verify_provider_api_key(
    provider_id: str,
    api_key: Optional[str],
    model: Optional[str] = None,
) -> Dict[str, Any]:
    """Lightweight verification ping so users can test their pasted free API key."""
    provider_id = (provider_id or "gemini").strip().lower()
    if provider_id not in PROVIDERS_CATALOG:
        raise LLMProviderError("INVALID_PROVIDER", f"Unknown provider: {provider_id}", 400)

    resolved_key = resolve_api_key(provider_id, api_key)
    provider_meta = PROVIDERS_CATALOG[provider_id]
    chosen_model = (model or "").strip() or provider_meta["default_model"]

    sys_msg = "Reply with the single word READY."
    usr_msg = "Ping"

    try:
        used_model = chosen_model
        if provider_id == "gemini":
            _call_gemini(resolved_key, chosen_model, sys_msg, usr_msg)
        elif provider_id == "groq":
            _call_openai_compatible(
                endpoint="https://api.groq.com/openai/v1/chat/completions",
                api_key=resolved_key,
                provider_name="Groq Cloud",
                model=chosen_model,
                system_prompt=sys_msg,
                user_prompt=usr_msg,
            )
        elif provider_id == "openrouter":
            _, used_model = _call_openrouter(resolved_key, chosen_model, sys_msg, usr_msg)
        elif provider_id == "mistral":
            _call_openai_compatible(
                endpoint="https://api.mistral.ai/v1/chat/completions",
                api_key=resolved_key,
                provider_name="Mistral AI",
                model=chosen_model,
                system_prompt=sys_msg,
                user_prompt=usr_msg,
            )
        elif provider_id == "cohere":
            _call_cohere(resolved_key, chosen_model, sys_msg, usr_msg)
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as exc:
        raise LLMProviderError("NETWORK_ERROR", "Connection failed, check internet", 503) from exc

    return {
        "valid": True,
        "provider": provider_meta["name"],
        "providerId": provider_id,
        "model": used_model,
        "message": f"{provider_meta['name']} API key verified! Ready to craft emails.",
    }
