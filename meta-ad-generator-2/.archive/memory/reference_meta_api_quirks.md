---
name: Meta API quirks and known errors
description: Common Meta Graph API errors and their fixes — deprecated fields, Advantage Audience age rules, THRUPLAY optimization, PAUSED status rules.
type: reference
originSessionId: 5095a699-8fca-4ecf-b9e6-6a0d7e74c0bd
---
Reference for Meta Graph API (v21.0) quirks hit in Sharpify ad creation:

## Deprecated fields
- **Do NOT include `degrees_of_freedom_spec.standard_enhancements.enroll_status`** when creating ad creatives — returns 400 with `error_subcode: 3858504`.

## Advantage Audience + age_max
- If `targeting_automation.advantage_audience: 1`, Meta enforces `age_max >= 65` regardless of target demographic. Use **65 as hard max** when Advantage Audience is enabled.
- Error if violated: `error_subcode: 1870189` "Maximum age is below threshold."

## Optimization goals
- **THRUPLAY** = 15-second video views. Use for video campaigns where goal is max eyeballs on video content. NOT reach, NOT offsite_conversions.
- **LEAD_GENERATION** = lead form submissions (LV default for MP Risinājums).
- **LINK_CLICKS** / **LANDING_PAGE_VIEWS** = for website-destination ads (ENG default for B2B Playbook).

## Status
- **Always create as `status: "PAUSED"`** via API. Never launch ACTIVE without explicit user approval. Applies to API creation, not just UI uploads.
- Verify ad language ↔ landing page language, targeting geography ↔ market, and ad copy ↔ current landing page offer BEFORE user flips to ACTIVE.

## Latvian Sharpify identifiers
- **Page ID:** `116359515734204`
- **Instagram User ID:** `17841401853795292`
- Use these in `object_story_spec` when creating video/image ad creatives on `META_ACCOUNT_LV` (act_549172712351324).

## Encoding
- Use **Python urllib**, NOT `curl -F`, when creating ads with Latvian text — special characters break multipart form encoding.
