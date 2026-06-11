---
name: Delete HTML when deleting PNG
description: The export-png.js script regenerates PNGs from any HTML in the html/ folder. When removing unwanted ads, delete BOTH the HTML and the PNG or the next export will resurrect the "ghost" ad.
type: feedback
originSessionId: 5095a699-8fca-4ecf-b9e6-6a0d7e74c0bd
---
When the user deletes an unwanted PNG ad, **also delete the matching HTML file** in the same folder. The `scripts/export-png.js` script rebuilds PNGs from every HTML it finds — so a leftover HTML will regenerate a PNG you already threw away.

**Why:** User got frustrated after deleting ads that kept reappearing. Said "some ads are getting generated again and again. After I've deleted them, I will delete them one more time. Next time, don't regenerate them again."

**How to apply:** Whenever deleting `output/{slug}/png/ad-N.png`, also delete `output/{slug}/html/ad-N.html`. If the user asks to "get rid of ad X," scrub both folders.
