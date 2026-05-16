# ShowNOut Pro Wash — shownout.net

Single-page marketing site for ShowNOut Pro Wash, a pressure washing company in Wilmington, NC. Owned by Ron and Tony.

## Stack

- **`index.html`** — the entire site. Inline CSS + JS. Zero frameworks, zero build step.
- **`netlify/functions/chat.js`** — Netlify serverless function that powers the AI chat widget using the Anthropic Claude API. Falls back to scripted bot if not configured.
- **`manifest.webmanifest`** — PWA manifest so the site can be installed as an app on phones.
- **`netlify.toml`** — Netlify config (security headers, cache rules, function path).
- **`package.json`** — only there so Netlify auto-installs `@anthropic-ai/sdk` for the chat function.

## Deploy

See `DEPLOY.md` for step-by-step GitHub + Netlify + domain instructions.

## Key features

- **Instant Estimate widget** in the hero — pick service, drag slider, see a live price range.
- **AI Chat** powered by Claude (Haiku model — fast and cheap). Falls back to scripted Q&A if not configured.
- **Sticky mobile CTA bar** — Call + Quote, always visible on phones.
- **Live activity ticker** — rotating social-proof toast bottom-left.
- **Scroll progress bar** — top edge.
- **Exit-intent modal** — $25-off coupon for first-time visitors leaving the page.
- **Quote form** — Formspree-powered, with confetti burst on submit.
- **PWA installable** — works as an app on phones via "Add to Home Screen."
- **JSON-LD LocalBusiness schema** — local SEO punch.

## Editing

Edit `index.html` directly. All styles, scripts, and content live in one file. To push changes:

```bash
git add .
git commit -m "Describe your change"
git push
```

Netlify auto-deploys within ~30 seconds.

## Wiring up the AI chat (optional but recommended)

The chat works WITHOUT setup — it falls back to a scripted estimator. To enable real AI:

1. Get an Anthropic API key at https://console.anthropic.com (set up billing, prepay $5–$10 to start)
2. In Netlify → your site → Site settings → Environment variables → Add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your key)
3. Trigger a new deploy (push any change, or click "Trigger deploy" in Netlify)
4. The chat will now use Claude Haiku 4.5 for free-text answers. Roughly $0.001 per chat.

## Wiring up the quote form

The form uses Formspree (free tier).

1. Sign up at https://formspree.io
2. Create a new form, name it "ShowNOut Quotes", point notifications to your real email
3. Copy the form endpoint (looks like `https://formspree.io/f/xabc1234`)
4. In `index.html` search for `REPLACE_WITH_YOUR_ID` and replace with your form's ID
5. Commit and push

Until that's done, the form shows a success state without actually sending — fine for demo.

## Brand rules (don't break these)

- ShowNOut wordmark: italic navy `Show` + upright orange `N` + italic navy `Out`, with `PRO WASH` tagged below in 5px letter-spaced gray
- Phone: `910.367.2767` (use this exact format in display copy; `tel:+19103672767` in links)
- Service area copy: "Wilmington & the Beaches" — never "Cape Fear Coast"
- "No upfront cost" — never "no cost" (commission/owner economics exist)
- Colors: `--orange: #FF6A1A`, `--navy: #0A1B3D`, `--bg: #FFFFFF`

## Performance budget

- Single HTML file under 200KB raw / 35KB gzipped
- One external request (Google Fonts), preconnected
- Zero JS frameworks
- Target: LCP < 1s on 4G mobile

## Pre-launch verification checklist

Before pointing shownout.net at this site for real customers, walk through these with Ron and Tony. Every item is a claim on the site that should be verifiable.

### Legal-weight claims
- [x] **General Liability insurance is active.** Confirmed by RJ on 2026-05-15. Site's "Fully Insured" mentions in the Why Us card and footer are accurate. Keep a copy of the Certificate of Insurance on file for customers who ask.
- [ ] **Business is registered.** If they're operating as an LLC or sole prop, confirm the entity name and registration. NC Secretary of State search: sosnc.gov.
- [ ] **Phone number is monitored.** 910.367.2767 needs to ring through to someone who can answer between 7 AM and 7 PM, Mon-Sat. The site commits to this.
- [ ] **Email is monitored.** hello@shownout.net needs to forward somewhere they actually check daily.

### Service commitments (aspirational but should be honored)
- [ ] **24-hour quote turnaround.** The Why Us card and hero stat say "most quotes back same day, we aim for under 24 hours always." If they can't honor this, soften to "within a few days" or remove the stat.
- [ ] **Owner-operated business.** Confirm Ron and Tony actually operate the business themselves. If they hire employees later, the "Owner-Led" framing in the Meet Ron & Tony section may need updating.
- [ ] **Service area.** The site lists Wilmington, Wrightsville Beach, Carolina Beach, Kure Beach, Masonboro, Castle Hayne. Confirm they actually serve all of these. Easier to remove a city now than to disappoint a customer later.

### Pricing (verify they match Ron & Tony's actual numbers)

The site shows these Wilmington-market ranges, based on competitor research, not direct input from Ron and Tony:

| Service | Site shows | Confirm with owners |
| --- | --- | --- |
| House Wash | Typically $275 – $650 | |
| Driveway | Typically $150 – $300 | |
| Deck / Patio | Typically $200 – $450 | |
| Roof Soft Wash | Typically $450 – $750 | |
| Gutter Cleaning | Typically $125 – $225 | |
| Fleet | $50 – $150 per vehicle | |
| Commercial | Custom quote | |

If their actual pricing differs significantly, edit the Pricing Guide section AND the hero estimate widget's `data-min`/`data-max` chip attributes AND the AI chat system prompt in `netlify/functions/chat.js`.

### Method claims (industry-standard, generally safe)
- [ ] **Soft wash PSI claim (<500 PSI).** This is industry standard for soft wash. Verify Ron and Tony use this method on siding and roofs.
- [ ] **High-pressure PSI claim (3,000 PSI).** Standard commercial-grade rating. Verify their equipment.
- [ ] **"Biodegradable, pet/plant safe with normal precautions"** in the FAQ. Verify their cleaning products match this.

### Things that need real content later
- [ ] **Real reviews.** The fake testimonials section is gone. Once 2-3 real Google or Facebook reviews come in, add a testimonials section back. I can rebuild it whenever you have the content.
- [ ] **Real before/after photos.** When Ron and Tony shoot job photos, we can add a gallery section. Until then there are no images on the site &mdash; better than fake placeholders.
- [ ] **Anthropic API key for the AI chat.** Without it, the chat falls back to a scripted bot (still works, just less smart). See instructions above.
- [ ] **Formspree form ID** for the quote form to actually deliver to Ron and Tony's inbox.
