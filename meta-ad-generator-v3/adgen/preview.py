"""Stage 4c — wrap rendered ads in a mobile Instagram feed preview.

Reads the 3 base HTML ads from clients/{domain}/html/ and produces
preview-feed.html — a single file showing each ad inside an Instagram-
style phone frame at ~320px width.

Open in a browser (Puppeteer with --disable-web-security or Edge with
--allow-file-access-from-files) to see pixel-perfect scaled previews.
"""
from __future__ import annotations

import json
import textwrap
from pathlib import Path

import click

from adgen import paths

_SCALE = 320 / 1080  # 0.29629… — iframe scale factor


def _file_uri(p: Path) -> str:
    return "file:///" + str(p.resolve()).replace("\\", "/")


def _phone_block(label: str, ad_path: Path) -> str:
    src = _file_uri(ad_path)
    scaled_h = round(1080 * _SCALE)  # = 320
    return textwrap.dedent(f"""\
    <div class="phone-wrap">
      <div class="phone-label">{label}</div>
      <div class="phone">
        <div class="dynamic-island"></div>
        <div class="ig-topbar">
          <span class="ig-logo">Instagram</span>
          <div class="ig-icons">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </div>
        </div>
        <div class="stories-row">
          <div class="story-item"><div class="story-ring"><div class="story-avatar story-you"></div></div><span>Your story</span></div>
          <div class="story-item"><div class="story-ring"><div class="story-avatar story-a"></div></div><span>sarah_m</span></div>
          <div class="story-item"><div class="story-ring"><div class="story-avatar story-b"></div></div><span>jan.k</span></div>
          <div class="story-item"><div class="story-ring"><div class="story-avatar story-c"></div></div><span>design</span></div>
        </div>
        <div class="post">
          <div class="post-header">
            <div class="post-avatar"></div>
            <div class="post-meta">
              <div class="post-username">Sponsored</div>
              <div class="post-sub">Sponsored · <span class="sponsored-badge">Ad</span></div>
            </div>
            <div class="post-more">···</div>
          </div>
          <div class="post-img-wrap">
            <iframe src="{src}" scrolling="no" loading="lazy"></iframe>
          </div>
          <div class="engagement-row">
            <div class="eng-left">
              <svg class="eng-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <svg class="eng-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <svg class="eng-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <svg class="eng-icon eng-save" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="likes-row">1,284 likes</div>
          <div class="caption-row"><span class="cap-user">sponsor</span> <span class="cap-text">Tap to learn more ↗</span></div>
          <div class="comments-row">View all 47 comments</div>
          <div class="timestamp-row">2 HOURS AGO</div>
        </div>
        <div class="ig-nav">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <div class="nav-avatar"></div>
        </div>
        <div class="home-indicator"></div>
      </div>
    </div>
    """)


def _build_preview_html(brand_name: str, ads: list[tuple[str, Path]]) -> str:
    phones = "\n".join(_phone_block(label, p) for label, p in ads)
    return textwrap.dedent(f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>{brand_name} — Feed Preview</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap" rel="stylesheet">
    <style>
    * {{ margin:0; padding:0; box-sizing:border-box; }}
    body {{
      background:#111; min-height:100vh;
      display:flex; align-items:flex-start; justify-content:center;
      gap:32px; padding:48px 32px;
      font-family:'DM Sans', -apple-system, sans-serif;
    }}

    /* ── Phone wrap ─────────────────────────────────────────────── */
    .phone-wrap {{ flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:10px; }}
    .phone-label {{
      font-size:11px; font-weight:600; color:#666;
      text-transform:uppercase; letter-spacing:0.14em;
    }}

    /* ── Phone shell ─────────────────────────────────────────────── */
    .phone {{
      width:320px; background:#0d0d0d;
      border-radius:44px;
      border:2px solid #2a2a2a;
      box-shadow:
        0 0 0 1px #1a1a1a,
        0 30px 80px rgba(0,0,0,0.8),
        inset 0 1px 0 rgba(255,255,255,0.04);
      overflow:hidden; position:relative;
    }}

    /* Dynamic island */
    .dynamic-island {{
      width:86px; height:26px; background:#000;
      border-radius:20px; margin:10px auto 0;
    }}

    /* ── Instagram top bar ───────────────────────────────────────── */
    .ig-topbar {{
      display:flex; align-items:center; justify-content:space-between;
      padding:8px 14px 6px; color:#fff;
    }}
    .ig-logo {{ font-size:20px; font-weight:700; letter-spacing:-0.02em; font-style:italic; }}
    .ig-icons {{ display:flex; gap:16px; color:#fff; }}
    .ig-icons svg {{ display:block; }}

    /* ── Stories ─────────────────────────────────────────────────── */
    .stories-row {{
      display:flex; gap:10px; padding:4px 12px 10px; overflow-x:hidden;
      border-bottom:1px solid rgba(255,255,255,0.08);
    }}
    .story-item {{ display:flex; flex-direction:column; align-items:center; gap:3px; flex-shrink:0; }}
    .story-item span {{ font-size:8px; color:#aaa; max-width:44px; text-align:center; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }}
    .story-ring {{
      width:44px; height:44px; border-radius:50%; padding:2px;
      background:linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    }}
    .story-avatar {{ width:40px; height:40px; border-radius:50%; border:2px solid #0d0d0d; background:#333; }}
    .story-you {{ background:#555; }}
    .story-a  {{ background:linear-gradient(135deg,#667eea,#764ba2); }}
    .story-b  {{ background:linear-gradient(135deg,#f093fb,#f5576c); }}
    .story-c  {{ background:linear-gradient(135deg,#4facfe,#00f2fe); }}

    /* ── Post header ─────────────────────────────────────────────── */
    .post-header {{ display:flex; align-items:center; gap:10px; padding:10px 12px; }}
    .post-avatar {{ width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#667eea,#764ba2); flex-shrink:0; }}
    .post-meta {{ flex:1; }}
    .post-username {{ font-size:12px; font-weight:600; color:#fff; line-height:1.2; }}
    .post-sub {{ font-size:10px; color:#888; line-height:1.2; }}
    .sponsored-badge {{
      background:rgba(255,255,255,0.12); color:#aaa;
      font-size:9px; padding:1px 5px; border-radius:3px; font-weight:600;
    }}
    .post-more {{ font-size:16px; color:#aaa; letter-spacing:0.02em; padding:0 2px; }}

    /* ── Ad image (scaled iframe) ────────────────────────────────── */
    .post-img-wrap {{
      width:320px; height:320px;
      overflow:hidden; position:relative; background:#222;
    }}
    .post-img-wrap iframe {{
      width:1080px; height:1080px;
      transform:scale({_SCALE:.5f}); transform-origin:top left;
      border:none; display:block; pointer-events:none;
    }}

    /* ── Engagement row ──────────────────────────────────────────── */
    .engagement-row {{
      display:flex; align-items:center; justify-content:space-between;
      padding:8px 12px 4px;
    }}
    .eng-left {{ display:flex; gap:14px; }}
    .eng-icon {{ width:22px; height:22px; color:#fff; display:block; }}
    .eng-save {{ color:#fff; }}

    .likes-row {{ font-size:12px; font-weight:600; color:#fff; padding:0 12px 2px; }}
    .caption-row {{ font-size:11px; color:#ddd; padding:0 12px 2px; }}
    .cap-user {{ font-weight:700; color:#fff; }}
    .comments-row {{ font-size:11px; color:#888; padding:0 12px 2px; }}
    .timestamp-row {{ font-size:9px; color:#555; padding:0 12px 8px; text-transform:uppercase; letter-spacing:0.08em; }}

    /* ── Bottom nav ──────────────────────────────────────────────── */
    .ig-nav {{
      display:flex; align-items:center; justify-content:space-around;
      padding:10px 14px 4px;
      border-top:1px solid rgba(255,255,255,0.08); color:#fff;
    }}
    .nav-avatar {{ width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,#667eea,#764ba2); border:1px solid #fff; }}

    /* Home indicator */
    .home-indicator {{
      width:100px; height:4px; background:rgba(255,255,255,0.28);
      border-radius:3px; margin:6px auto 10px;
    }}
    </style>
    </head>
    <body>
    {phones}
    </body>
    </html>
    """)


def render_preview(domain: str) -> Path:
    """Generate preview-feed.html with all 3 base ads in phone frames.

    Raises FileNotFoundError if html/ directory doesn't exist.
    """
    html_dir = paths.client_dir(domain) / "html"
    if not html_dir.exists():
        raise FileNotFoundError(
            f"No html/ directory found for {domain}. Run 'render' first."
        )

    manifest_path = paths.scrape_dir(domain) / "manifest.json"
    brand_name = domain
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        brand_name = manifest.get("brand_name", domain)

    candidates = [
        ("Editorial", html_dir / "ad-1-editorial.html"),
        ("Dark",      html_dir / "ad-2-dark.html"),
        ("Offer",     html_dir / "ad-3-offer.html"),
    ]
    ads = [(label, p) for label, p in candidates if p.exists()]
    if not ads:
        raise FileNotFoundError(
            f"No ad HTML files found in {html_dir}. Run 'render' first."
        )

    html = _build_preview_html(brand_name, ads)
    out = html_dir / "preview-feed.html"
    out.write_text(html, encoding="utf-8")
    return out


@click.command("preview")
@click.argument("domain")
def cli(domain: str) -> None:
    """Generate a mobile Instagram feed preview of rendered ads."""
    try:
        out = render_preview(domain)
        click.echo(f"Done. Preview written to: {out.resolve()}")
    except FileNotFoundError as exc:
        click.echo(f"Error: {exc}", err=True)
        raise SystemExit(1)
