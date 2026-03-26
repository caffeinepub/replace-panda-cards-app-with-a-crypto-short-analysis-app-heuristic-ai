# Specification

## Summary
**Goal:** Replace the existing Panda Cards UI with a crypto short-analysis app that lets users submit OHLCV/CSV market data for heuristic “AI” scoring, view transparent recommendations, and review their personal analysis history.

**Planned changes:**
- Remove all panda-card collection UI, modals, and panda-themed copy; update header/navigation branding for the crypto short-analysis purpose (English-only).
- Add an analysis workflow UI: inputs for crypto identifier and pasted OHLCV/CSV text, validation with clear English errors, and an analysis result panel showing recommendation, confidence/score, and signal breakdown.
- Implement a Motoko backend model + endpoints to submit analysis requests, store results per-caller principal, list analysis history, and fetch a past analysis by id (deterministic outputs for identical inputs).
- Implement on-canister heuristic scoring (no external LLM) that computes at minimum RSI and moving-average trend signals, returning a score/confidence plus human-readable English reasons; return a clear error for insufficient rows.
- Connect frontend to backend via React Query hooks with loading/error/empty states and a history view (asset, timestamp, recommendation/score, detail view).
- Add a prominent English disclaimer stating results are informational only and not financial advice.
- Apply a new dark “trading terminal” visual theme with neutral grays and neon green/amber accents across analysis, results, and history views.
- Add and render new static brand assets (logo + icon) from frontend public assets without backend involvement.

**User-visible outcome:** Users can paste market OHLCV/CSV data for a chosen crypto, run a deterministic heuristic short-opportunity analysis with a transparent score breakdown and disclaimer, and browse/view their own saved analysis history in a dark terminal-style UI.
