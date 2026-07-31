# Igor Stojanov - Portfolio

A single-page, static portfolio site. Plain HTML5 + CSS3 + vanilla JS - no framework, no build step, no bundler. Any static host will serve it with zero configuration.

```
/index.html
/css/style.css
/js/main.js
/assets/resume.pdf      # placeholder - replace with your real CV
/assets/favicon.svg
```

## Preview locally

Just open `index.html` directly in a browser:

```bash
open index.html
```

Or serve it with a simple local server (recommended, avoids any `file://` quirks):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Adding your real content

- **Résumé** - replace `assets/resume.pdf` with your real CV PDF, keeping the same filename. The nav and hero/contact buttons already point at this path and will download it as `Igor Stojanov - CV.pdf`.

The hero is intentionally text-only (no headshot slot) by design choice.

## Wiring up the contact form (Formspree)

The contact form posts to Formspree so it works without any backend of your own:

1. Create a free form at [formspree.io](https://formspree.io) and grab its endpoint (looks like `https://formspree.io/f/abcdwxyz`).
2. In `index.html`, find the `<form id="contactForm" ... action="https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT">` and replace `YOUR_FORMSPREE_ENDPOINT` with your real endpoint id.

That's the only change needed - the form already does client-side validation and shows an inline success/error state via JavaScript (`js/main.js`), with no page reload.

## Wiring up "Book a Call" (Calendly)

The contact section has a "Book a Call" banner linking out to Calendly:

1. Create a free Calendly account at [calendly.com](https://calendly.com) (the free tier covers one event type with unlimited bookings, no credit card required) and set up an event (e.g. a 15/30-minute call).
2. Copy your event's booking link (looks like `https://calendly.com/your-username/15min`).
3. In `index.html`, find `<a class="book-call" href="https://calendly.com/YOUR_CALENDLY_LINK" ...>` and replace `YOUR_CALENDLY_LINK` with your real link.

No other code changes needed - it's a plain link that opens in a new tab.

## Deploying

**Netlify (recommended)** - the simplest option for a static site like this. Either drag-and-drop the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or connect the repo in the Netlify dashboard; there's no build command and no output directory to configure since the site is already static.

**GitHub Pages** - push this folder to a GitHub repo, then enable Pages in the repo's Settings → Pages, pointing it at the `main` branch root. The site will be live at `https://<username>.github.io/<repo>/`.

**Vercel** - import the repo at [vercel.com/new](https://vercel.com/new) and deploy with the "Other" framework preset (no build step); Vercel will serve the static files as-is.
