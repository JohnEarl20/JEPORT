"""Streamlit entry point for John Earl Conde's portfolio.

The portfolio is a static single-page site: `index.html` + `style.css` + `script.js`.
Streamlit Community Cloud serves a Python app, not raw static files, so this wraps the
site in a `components.html` iframe: the three files are inlined into one document and
handed to the browser unchanged.

Why inline instead of serving the files over HTTP:
  * the page has no local assets — Inter/Fira Code, Font Awesome and the profile photo
    are all CDN URLs — so inlining needs nothing else shipped alongside
  * an inlined document has no relative-path resolution to get wrong

Why the frame is fixed rather than auto-resized to the content height:
  `style.css` gives the hero `min-height:100vh`. An iframe grown to the full content
  height would make 100vh mean that height, and the hero would swallow the whole page.
  A viewport-sized frame keeps 100vh meaning the visible area, as designed.
"""

from pathlib import Path
import re

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent

# Sized to a viewport, not to the content: see the module docstring.
FRAME_HEIGHT = 840

# Runs before script.js. Streamlit's `components.html` renders into a sandboxed iframe;
# today that sandbox includes allow-same-origin so localStorage works, but if it ever
# drops it, localStorage *throws* and script.js dies on its first theme read — taking
# the nav, modals and animations down with it. A memory-backed stand-in keeps the page
# working either way.
STORAGE_SHIM = """
(function () {
  try {
    window.localStorage.getItem('__probe__');
    return; // storage is usable, leave it alone
  } catch (e) { /* fall through to the in-memory shim */ }
  var mem = {};
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem: function (k, v) { mem[k] = String(v); },
      removeItem: function (k) { delete mem[k]; },
      clear: function () { mem = {}; }
    }
  });
})();
"""


def build_document() -> str:
    """Return index.html with style.css and script.js inlined."""
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "style.css").read_text(encoding="utf-8")
    js = (ROOT / "script.js").read_text(encoding="utf-8")

    # A callable replacement, so backslashes in the CSS/JS are never read as escapes.
    html, n_css = re.subn(
        r'<link[^>]*href="style\.css[^"]*"[^>]*/?>',
        lambda _m: "<style>\n" + css + "\n</style>",
        html,
    )
    html, n_js = re.subn(
        r'<script[^>]*src="script\.js[^"]*"[^>]*></script>',
        lambda _m: "<script>\n" + js + "\n</script>",
        html,
    )

    # Fail loudly here rather than deploying a page with no styling or no behaviour.
    if n_css != 1 or n_js != 1:
        raise RuntimeError(
            f"inlining expected exactly 1 css and 1 js reference, "
            f"found {n_css} css and {n_js} js — index.html changed shape"
        )

    html = html.replace("<head>", "<head>\n<script>" + STORAGE_SHIM + "</script>", 1)
    return html


st.set_page_config(
    page_title="John Earl Conde | Portfolio",
    page_icon="🧑‍💻",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Streamlit draws its own chrome over the canvas; keep it out of the way and dark so it
# matches the portfolio's default theme.
st.markdown(
    """
    <style>
      #MainMenu, header, footer, [data-testid="stToolbar"], [data-testid="stDecoration"],
      [data-testid="stStatusWidget"] { display: none !important; }
      .block-container { padding: 0 !important; max-width: 100% !important; }
      [data-testid="stAppViewContainer"] { background: #0b0f19; }
      [data-testid="stVerticalBlock"] { gap: 0 !important; }
      iframe[title="st.iframe"] { display: block; }
    </style>
    """,
    unsafe_allow_html=True,
)

components.html(build_document(), height=FRAME_HEIGHT, scrolling=True)