# Portfolio Website — John Earl Conde

Single-page portfolio: `index.html` + `style.css` + `script.js`.

## Run locally

Open `index.html` in a browser — no build step, no dependencies.

Note: opening via `file://` works, but some browsers block a couple of APIs on that
origin. If something looks off, serve it instead:

```bash
python -m http.server 8000
```

## Deploy to Streamlit Community Cloud

Streamlit Cloud serves a Python app rather than raw static files, so `app.py` wraps the
site: it inlines `style.css` and `script.js` into `index.html` and renders the result
through `components.html`.

```bash
python -m streamlit run app.py
```

To publish: on [share.streamlit.io](https://share.streamlit.io) choose **Create app** →
**Deploy a public app from GitHub**, then point it at this repo with:

| Field | Value |
| --- | --- |
| Repository | `JohnEarl20/JEPORT` |
| Branch | `main` |
| Main file path | `app.py` |

`requirements.txt` and `.streamlit/config.toml` are picked up automatically. Python
version is selectable under **Advanced settings**; 3.11 or newer is required.

## Customize

- **Name / info** → the sections in `index.html`
- **Colors / font** → `style.css` (change `--primary` and `--secondary` in `:root`)
- **Skills & projects** → the `algorithms` and project data in `script.js`
- **Social links** → the `contact` and `footer` sections of `index.html`
- **Profile photo** → `index.html`, the `<img class="profile-img">` in the About section

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page — all content and sections |
| `style.css` | All styling, accent colors, responsive rules |
| `script.js` | Typing animation, theme toggle, scroll effects, modals |
| `app.py` | Streamlit wrapper that serves the site above |
| `requirements.txt` | Pinned dependency range for the Streamlit deploy |
| `.streamlit/config.toml` | Dark theme + hidden chrome so Streamlit's UI stays out of the way |
| `.github/workflows/deploy.yml` | Optional GitHub Pages deploy (needs Pages enabled once, in repo Settings) |