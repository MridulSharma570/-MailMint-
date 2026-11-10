"""
MailMint ✉️🌿 — AI Professional Email Writer Platform
Backend Multi-Page Web Server & REST API (Python + Flask)

Developer:    Anmolpreet Singh
Co-Developer: Mridul Sharma
"""

import os
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from dotenv import load_dotenv

from lib.llm_providers import (
    LLMProviderError,
    PLACEHOLDER_KEYS,
    PROVIDERS_CATALOG,
    generate_professional_email,
    verify_provider_api_key,
)

load_dotenv()

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

VALID_TONES = {"Formal", "Friendly", "Urgent", "Apologetic", "Persuasive"}
VALID_EMAIL_TYPES = {
    "Job Application",
    "Leave Request",
    "Follow-Up",
    "Complaint",
    "Thank You",
    "General",
}
VALID_LENGTHS = {"Short", "Standard", "Detailed"}
VALID_LANGUAGES = {"English", "Hindi", "Punjabi", "Spanish", "French", "German"}


@app.after_request
def apply_preview_friendly_headers(response):
    """Ensure responses work seamlessly inside browser previews and iframes."""
    response.headers.pop("X-Frame-Options", None)
    return response


# ==================== MULTI-PAGE ROUTES ====================

@app.route("/", methods=["GET"])
def entry_page():
    """Serve the dedicated MailMint Entry / Welcome Landing Page."""
    return render_template("entry.html", active_page="entry")


@app.route("/studio", methods=["GET"])
def studio_page():
    """Serve the interactive AI Email Writer Studio workspace."""
    return render_template("studio.html", active_page="studio")


@app.route("/templates", methods=["GET"])
def templates_page():
    """Serve the curated Smart Email Templates & Scenarios Library."""
    return render_template("templates_library.html", active_page="templates")


@app.route("/api-keys", methods=["GET"])
def api_keys_page():
    """Serve the Bring-Your-Own Free API Key Hub & Step-by-Step Guide."""
    return render_template("api_keys.html", active_page="api_keys")


@app.route("/history", methods=["GET"])
def history_page():
    """Serve the client-side Saved Drafts & Favorites Vault."""
    return render_template("history.html", active_page="history")


@app.route("/about", methods=["GET"])
def about_page():
    """Serve the How MailMint Works, Privacy & Team Credits page."""
    return render_template("about.html", active_page="about")


# ==================== JSON REST API ROUTES ====================

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "app": "MailMint",
        "pages": ["/", "/studio", "/templates", "/api-keys", "/history", "/about"],
        "developers": ["Anmolpreet Singh", "Mridul Sharma"],
    })


@app.route("/api/providers", methods=["GET"])
def list_providers():
    """Return metadata and step-by-step free API key instructions for all 5 providers."""
    providers_out = []
    for _, meta in PROVIDERS_CATALOG.items():
        env_val = os.getenv(meta["env_var"], "").strip()
        has_server_key = bool(env_val and env_val.lower() not in PLACEHOLDER_KEYS)
        providers_out.append({
            "id": meta["id"],
            "name": meta["name"],
            "badge": meta["badge"],
            "speed": meta["speed"],
            "cardRequired": meta["card_required"],
            "keyPrefix": meta["key_prefix"],
            "keyPlaceholder": meta["key_placeholder"],
            "portalUrl": meta["portal_url"],
            "portalLabel": meta["portal_label"],
            "freeTierNote": meta["free_tier_note"],
            "defaultModel": meta["default_model"],
            "models": meta["models"],
            "steps": meta["steps"],
            "hasServerKey": has_server_key,
        })

    return jsonify({"success": True, "providers": providers_out})


@app.route("/api/verify-key", methods=["POST"])
def verify_key():
    """Verify a user-supplied (or server .env) API key with a lightweight ping."""
    payload = request.get_json(silent=True) or {}
    provider_id = (payload.get("provider") or "gemini").strip().lower()
    api_key = (payload.get("apiKey") or "").strip()
    model = (payload.get("model") or "").strip()

    try:
        result = verify_provider_api_key(
            provider_id=provider_id,
            api_key=api_key,
            model=model,
        )
        return jsonify({"success": True, **result})
    except LLMProviderError as err:
        return (
            jsonify({
                "success": False,
                "errorCode": err.code,
                "message": err.message,
            }),
            err.status_code,
        )
    except Exception:
        return (
            jsonify({
                "success": False,
                "errorCode": "SERVER_ERROR",
                "message": "Unexpected error while verifying API key.",
            }),
            500,
        )


@app.route("/api/generate", methods=["POST"])
def generate_email():
    """Generate or refine a polished professional email using the selected free AI provider."""
    payload = request.get_json(silent=True) or {}

    user_input = (payload.get("userInput") or "").strip()
    tone = (payload.get("tone") or "Formal").strip()
    email_type = (payload.get("emailType") or "General").strip()
    provider_id = (payload.get("provider") or "gemini").strip().lower()
    api_key = (payload.get("apiKey") or "").strip()
    model = (payload.get("model") or "").strip()
    sender_name = (payload.get("senderName") or "").strip()
    recipient_name = (payload.get("recipientName") or "").strip()
    length = (payload.get("length") or "Standard").strip()
    language = (payload.get("language") or "English").strip()
    refine_instruction = (payload.get("refineInstruction") or "").strip()
    current_draft = (payload.get("currentDraft") or "").strip()
    variation_seed = int(payload.get("variationSeed") or 0)

    if not user_input:
        return (
            jsonify({
                "success": False,
                "errorCode": "EMPTY_INPUT",
                "message": "Please describe your email situation before generating.",
            }),
            400,
        )

    if len(user_input) > 3000:
        return (
            jsonify({
                "success": False,
                "errorCode": "INPUT_TOO_LONG",
                "message": "Please keep your description under 3,000 characters.",
            }),
            400,
        )

    if tone not in VALID_TONES:
        tone = "Formal"
    if email_type not in VALID_EMAIL_TYPES:
        email_type = "General"
    if length not in VALID_LENGTHS:
        length = "Standard"
    if language not in VALID_LANGUAGES:
        language = "English"

    try:
        email_data = generate_professional_email(
            provider_id=provider_id,
            api_key=api_key,
            user_input=user_input,
            tone=tone,
            email_type=email_type,
            model=model,
            sender_name=sender_name,
            recipient_name=recipient_name,
            length=length,
            language=language,
            refine_instruction=refine_instruction,
            current_draft=current_draft,
            variation_seed=variation_seed,
        )
        return jsonify({"success": True, "data": email_data})

    except LLMProviderError as err:
        return (
            jsonify({
                "success": False,
                "errorCode": err.code,
                "message": err.message,
            }),
            err.status_code,
        )
    except Exception:
        return (
            jsonify({
                "success": False,
                "errorCode": "SERVER_ERROR",
                "message": "Something went wrong while generating your email. Please try again.",
            }),
            500,
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
