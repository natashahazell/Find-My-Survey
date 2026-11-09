# Find My Survey — clickable prototype (v2, case file)

Open `index.html` in any browser (double-click it). No build step, no server, nothing leaves the device.

## Concept
"Your survey is missing. Let's find it." Each visit opens a **case file**: a brief, then numbered stages
(01 Brief · 02 Property · 03 Concerns · 04 Timeline · 05 Located). The case file panel fills in as you answer,
with a locator status ("Searching", "Narrowing", then "Located").

## Files
- `js/content.js` — everything a surveyor reviewer edits: outcomes (scope, designations, rules), questions,
  weights, red-flag minimums, follow-ups, case notes, brief keywords. Scope wording follows the RICS
  "Description of the RICS Home Survey" PDFs in `../RICS Documents/`.
- `js/app.js` — engine (scoring, Level 1 rule, timeline guidance, warranty guidance, result).
- `css/styles.css` — minimal, architectural styling (light and dark, mobile-first, print to PDF).

## Rules worth knowing
- Level 1 is only located for homes built in the last 10 years (`TEN_YEARS_AGO` in content.js).
- `min: "L3"` on an answer sets a floor (listed, pre-1900, non-standard, walls removed, cracking 5 mm+…).
- "Not sure" shows an explainer and never lowers the level.
- A wanted valuation upgrades Level 1 to Level 2 with valuation; for Level 3 it is an agreed extra service.
- No prices are shown.

## Not in this version
House illustration (on hold), prices, badges and quiz (removed for a calmer, professional tone).
