#!/usr/bin/env python3
"""Generate the AegisAI Google Cloud architecture poster.

Builds a self-contained HTML page (absolute layout on a 3840x2160 canvas, connectors routed
in the browser) and renders it with headless Google Chrome:

  docs/architecture/AegisAI_GCP_Architecture.html      editable source (self-contained)
  docs/architecture/AegisAI_GCP_Architecture_8K.png    7680x4320 (print / zoom)
  docs/architecture/AegisAI_GCP_Architecture_4K.png    3840x2160 (slides)
  docs/architecture/AegisAI_GCP_Architecture.pdf       vector poster (40 x 22.5 in)
  docs/architecture/AegisAI_GCP_Architecture.svg       vector (needs pdftocairo / poppler)

Usage:
  python3 scripts/architecture_diagram/generate_architecture_diagram.py [--out DIR] [--no-render] [--debug]

Content reflects the as-built deployment (server.ts, deploy_cloud_run.sh, cloudbuild.yaml, Dockerfile,
firestore.rules, scripts/argolis/*). Cards with a dashed, phase-coloured outline are the Google Cloud
AI Protection Stack controls (ISO/IEC 42001 phases 3-5) that are enabled per environment.

Icons: Google Cloud official product icons (icons/gcp) and Lucide (ISC license, icons/lucide).
"""
from __future__ import annotations

import argparse
import base64
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
ICONS_GCP = HERE / "icons" / "gcp"
ICONS_LUCIDE = HERE / "icons" / "lucide"
W, H = 3840, 2160
BASENAME = "AegisAI_GCP_Architecture"

# ISO/IEC 42001 lifecycle phase colours: (stroke/text, tint)
P3 = ("#1A73E8", "#E8F0FE")
P4 = ("#188038", "#E6F4EA")
P5 = ("#E8710A", "#FEEFE3")

# --------------------------------------------------------------------------------------
# Small HTML helpers
# --------------------------------------------------------------------------------------

def G(name: str, size: int = 36) -> str:
    """Official Google Cloud icon as an isolated <img> (their SVGs reuse CSS class names)."""
    data = base64.b64encode((ICONS_GCP / f"{name}.svg").read_bytes()).decode()
    return f'<img class="ic" style="width:{size}px;height:{size}px" src="data:image/svg+xml;base64,{data}" alt="">'


def L(name: str, size: int = 22, color: str = "#1A73E8", stroke: float = 2.0) -> str:
    """Inline Lucide icon (stroke = currentColor)."""
    svg = (ICONS_LUCIDE / f"{name}.svg").read_text()
    svg = svg[svg.index("<svg"):].strip()
    svg = svg.replace('width="24" height="24"', f'width="{size}" height="{size}"', 1)
    svg = svg.replace('stroke-width="2"', f'stroke-width="{stroke}"', 1)
    return svg.replace("<svg ", f'<svg style="color:{color};flex:none" ', 1)


def LB(name: str, color: str, bg: str, box: int = 36, size: int = 22) -> str:
    """Lucide icon inside a tinted rounded square (same footprint as a product icon)."""
    return (f'<span class="lic" style="width:{box}px;height:{box}px;background:{bg}">'
            f'{L(name, size, color)}</span>')


def live() -> str:
    return '<span class="live">Active</span>'


def hdr(icon: str, title: str, sub: str = "", tag: str = "") -> str:
    sub_html = f'<div class="cs">{sub}</div>' if sub else ""
    return f'<div class="ch">{icon}<div class="cht"><div class="ct">{title}</div>{sub_html}</div>{tag}</div>'


def ul(items: list[str], cls: str = "b", color: str | None = None) -> str:
    style = f' style="--bc:{color}"' if color else ""
    return f'<ul class="{cls}"{style}>' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def bd(*specs: tuple[str, str]) -> str:
    return '<div class="badges">' + "".join(f'<span class="bd {k}">{t}</span>' for k, t in specs) + "</div>"


def band(phase: tuple[str, str], text: str) -> str:
    return f'<div class="band">{text}</div>'


def box(el_id: str, x: int, y: int, w: int, h: int, inner: str, cls: str = "card", extra: str = "") -> str:
    return (f'<div id="{el_id}" class="{cls}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;{extra}">'
            f"{inner}</div>")


def stack(el_id: str, x: int, y: int, w: int, h: int, phase: tuple[str, str], band_text: str, inner: str) -> str:
    pc, pt = phase
    return box(el_id, x, y, w, h, band(phase, band_text) + inner, cls="card stack", extra=f"--pc:{pc};--pt:{pt};")


def zone(el_id: str, x: int, y: int, w: int, h: int, cls: str, title: str, sub: str = "", icon: str = "") -> str:
    sub_html = f'<span class="zs">{sub}</span>' if sub else ""
    return (f'<div id="{el_id}" class="zone {cls}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
            f'<div class="zh">{icon}<span>{title}</span>{sub_html}</div></div>')


def step_badge(n: int, x: int, y: int) -> str:
    return f'<div class="step" style="left:{x}px;top:{y}px">{n}</div>'


# --------------------------------------------------------------------------------------
# CSS
# --------------------------------------------------------------------------------------

CSS = r"""
@page { size: 3840px 2160px; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 3840px; height: 2160px; overflow: hidden; }
body { background: #F8F9FA; font-family: Roboto, "Noto Sans", Arial, sans-serif; color: #202124;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; -webkit-font-smoothing: antialiased; }
#canvas { position: relative; width: 3840px; height: 2160px; overflow: hidden; }

/* ---------- header ---------- */
.gbar { position: absolute; left: 0; top: 0; width: 3840px; height: 8px; display: flex; }
.gbar i { flex: 1; }
.hdr { position: absolute; left: 0; top: 8px; width: 3840px; height: 124px; background: #fff; border-bottom: 1px solid #DADCE0; }
.logo { position: absolute; left: 40px; top: 20px; width: 84px; height: 84px; border-radius: 22px;
  background: linear-gradient(135deg, #4285F4 0%, #1A73E8 45%, #174EA6 100%); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(26,115,232,.35); }
.title { position: absolute; left: 148px; top: 18px; font: 700 46px/1.1 Roboto; letter-spacing: -.01em; white-space: nowrap; }
.title .ai { color: #1A73E8; }
.title .thin { font-weight: 400; color: #5F6368; }
.subtitle { position: absolute; left: 150px; top: 78px; font: 400 21px/1.3 Roboto; color: #5F6368; white-space: nowrap; }
.chips { position: absolute; right: 40px; top: 16px; width: 1500px; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px 10px; }
.chip { display: inline-flex; align-items: center; gap: 9px; height: 40px; padding: 0 15px; border: 1px solid #DADCE0; border-radius: 20px;
  background: #F8F9FA; font: 500 15.5px/1 Roboto; color: #3C4043; white-space: nowrap; }
.chip b { font: 700 11.5px/1 Roboto; color: #5F6368; letter-spacing: .08em; text-transform: uppercase; }
.chip code { font-size: 15px; background: none; padding: 0; color: #174EA6; }

/* ---------- boundaries & zones ---------- */
.gcp-boundary { position: absolute; border-radius: 26px; background: rgba(232,240,254,.42); border: 2px solid #C6DAFC; }
.gcp-label { position: absolute; display: flex; align-items: center; gap: 10px; height: 32px; padding: 0 16px 0 8px; background: #fff;
  border: 1.5px solid #AECBFA; border-radius: 16px; font: 500 16px/1 Roboto; color: #3C4043; white-space: nowrap; z-index: 5; }
.gcp-label b { font-weight: 700; color: #1967D2; }
.gcp-label code { background: none; color: #174EA6; font-size: 15px; }
.zone { position: absolute; border-radius: 18px; border: 1.5px solid #DADCE0; }
.zh { position: absolute; left: 18px; top: 13px; right: 18px; height: 26px; display: flex; align-items: center; gap: 10px;
  font: 700 17px/1 Roboto; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
.zh .zs { font: 500 14px/1 Roboto; letter-spacing: 0; text-transform: none; color: #5F6368; }
.zh code { text-transform: none; letter-spacing: 0; font-size: 14px; }
.zh img.ic { width: 28px !important; height: 28px !important; }
.z-clients { background: #FFFFFF; border-color: #BDC1C6; } .z-clients .zh { color: #3C4043; }
.z-edge { background: #EDF3FE; border-color: #AECBFA; } .z-edge .zh { color: #1967D2; }
.z-run { background: #F3F7FF; border: 2.5px solid #4285F4; } .z-run .zh { color: #1967D2; }
.z-ai { background: #F7F0FE; border-color: #D7AEFB; } .z-ai .zh { color: #8430CE; }
.z-data { background: #FFF8E5; border-color: #FDD663; } .z-data .zh { color: #B06000; }
.z-sec { background: #EEF7F1; border-color: #A8DAB5; } .z-sec .zh { color: #137333; }
.z-ops { background: #FDF0EF; border-color: #F6AEA9; } .z-ops .zh { color: #C5221F; }
.z-ext { background: #FFFFFF; border: 2px dashed #BDC1C6; } .z-ext .zh { color: #5F6368; left: 48px; }
.z-cicd { background: #F1F3F4; border-color: #BDC1C6; } .z-cicd .zh { color: #3C4043; }
.z-iso { background: #FFFFFF; border-color: #BDC1C6; } .z-iso .zh { color: #3C4043; }
.z-life { background: #FFFFFF; border-color: #BDC1C6; } .z-life .zh { color: #1967D2; }
.z-legend { background: #FFFFFF; border-color: #BDC1C6; } .z-legend .zh { color: #3C4043; }
.subbound { position: absolute; border: 2px dashed #8AB4F8; border-radius: 16px; background: rgba(232,240,254,.55); }

/* ---------- cards ---------- */
.card { position: absolute; background: #fff; border: 1.5px solid #DADCE0; border-radius: 12px; z-index: 10;
  box-shadow: 0 1px 2px rgba(60,64,67,.10), 0 2px 6px rgba(60,64,67,.07); padding: 11px 14px 10px; overflow: hidden; }
.card.stack { border: 2.2px dashed var(--pc); }
.card.flat { box-shadow: none; }
.band { margin: -11px -14px 9px; padding: 6px 14px 5px; background: var(--pt); color: var(--pc); border-bottom: 1.5px dashed var(--pc);
  font: 700 10.5px/1.25 Roboto; letter-spacing: .07em; text-transform: uppercase; white-space: nowrap; }
.ch { display: flex; align-items: center; gap: 10px; margin-bottom: 7px; }
.cht { min-width: 0; }
.ch .ic { flex: none; }
.lic { display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; flex: none; }
.ct { font: 700 18px/1.15 Roboto; color: #202124; white-space: nowrap; }
.cs { font: 500 12.5px/1.25 Roboto; color: #5F6368; margin-top: 2px; }
.live { margin-left: auto; align-self: flex-start; display: inline-flex; align-items: center; gap: 5px; flex: none;
  font: 700 10px/1 Roboto; letter-spacing: .07em; text-transform: uppercase; color: #137333; background: #E6F4EA; border-radius: 10px; padding: 4px 8px 4px 7px; }
.live::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #1E8E3E; }
ul.b { list-style: none; font: 400 13.5px/1.36 Roboto; color: #3C4043; }
ul.b li { position: relative; padding-left: 13px; margin: 1.5px 0; }
ul.b li::before { content: ""; position: absolute; left: 1px; top: .58em; width: 5px; height: 5px; border-radius: 50%; background: var(--bc, #1A73E8); }
ul.b.sm { font-size: 12.5px; line-height: 1.34; }
ul.b.xs { font-size: 12px; line-height: 1.32; }
code { font-family: "Noto Sans Mono", "DejaVu Sans Mono", monospace; font-size: .86em; background: #F1F3F4; border-radius: 4px; padding: 0 3px; color: #202124; }
.nw { white-space: nowrap; }
code.wrap { word-break: break-all; }
.badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 7px; }
.bd { display: inline-flex; align-items: center; font: 700 10.5px/1 Roboto; padding: 3px 6px; border-radius: 5px; white-space: nowrap; letter-spacing: .02em; }
.bd.ow { background: #E8EAED; color: #3C4043; }
.bd.iso { background: #E6F4EA; color: #137333; }
.bd.zt { background: #E8F0FE; color: #1967D2; }
.bd.p3 { background: #E8F0FE; color: #1967D2; } .bd.p4 { background: #E6F4EA; color: #137333; } .bd.p5 { background: #FEEFE3; color: #B34D00; }
.status { margin-top: 7px; padding-top: 6px; border-top: 1px dashed #DADCE0; font: 500 11.5px/1.32 Roboto; color: #5F6368; }
.status b { color: #3C4043; }
.inner { background: #F8F9FA; border: 1px solid #E3E5E8; border-radius: 10px; padding: 9px 11px; }
.kv { display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; font: 400 12.5px/1.3 Roboto; color: #3C4043; align-items: baseline; }
.kv .k { font: 700 11px/1.3 Roboto; letter-spacing: .05em; text-transform: uppercase; color: #5F6368; white-space: nowrap; }
.sect { font: 700 11px/1 Roboto; letter-spacing: .08em; text-transform: uppercase; color: #5F6368; margin: 8px 0 5px; }
.domain { display: inline-flex; align-items: center; height: 26px; padding: 0 10px; border-radius: 13px; background: #E8F0FE; color: #174EA6;
  font: 500 13.5px/1 "Noto Sans Mono", monospace; margin: 0 6px 4px 0; }
.mods { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin: 6px 0 8px; }
.mod { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #DADCE0; border-radius: 8px; padding: 5px 7px; font: 500 12px/1.2 Roboto; color: #3C4043; }

/* ---------- step badges ---------- */
.step { position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #1A73E8; color: #fff; font: 700 15px/30px Roboto; text-align: center;
  box-shadow: 0 0 0 3px #fff, 0 2px 5px rgba(0,0,0,.28); z-index: 40; }

/* ---------- middleware pipeline ---------- */
.pipe { display: flex; gap: 3px; margin-top: 8px; }
.stg { position: relative; flex: 1; height: 136px; padding: 9px 18px 8px 24px; background: linear-gradient(180deg, #E8F0FE, #D2E3FC);
  clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%); }
.stg:first-child { padding-left: 13px; clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%); }
.stg .n { display: inline-flex; width: 19px; height: 19px; border-radius: 50%; background: #1A73E8; color: #fff; font: 700 11px/19px Roboto; justify-content: center; margin-bottom: 4px; }
.stg .t { font: 700 13px/1.15 Roboto; color: #174EA6; margin-bottom: 3px; }
.stg .d { font: 400 11.5px/1.28 Roboto; color: #3C4043; }
.stg .bd { position: absolute; left: 24px; bottom: 9px; background: #fff; color: #1967D2; }
.stg:first-child .bd { left: 13px; }
.pipe-title { display: flex; align-items: center; gap: 8px; font: 700 12px/1 Roboto; letter-spacing: .08em; text-transform: uppercase; color: #1967D2; }
.pipe-title span { font: 500 12.5px/1 Roboto; letter-spacing: 0; text-transform: none; color: #5F6368; }

/* ---------- API surface ---------- */
.api { display: grid; grid-template-columns: 88px 1fr; gap: 5px 10px; font: 400 12px/1.35 Roboto; color: #3C4043; }
.api .g { font: 700 11px/1.5 Roboto; letter-spacing: .05em; text-transform: uppercase; color: #1967D2; }
.api code { font-size: 11.5px; }

/* ---------- mini grid (governance) ---------- */
.mini { display: grid; grid-template-columns: 1fr 1fr; gap: 7px 10px; }
.mi { background: #F8F9FA; border: 1px solid #E3E5E8; border-radius: 9px; padding: 7px 9px; }
.mi .t { display: flex; align-items: center; gap: 6px; font: 700 12.5px/1.2 Roboto; color: #202124; }
.mi .t .bd { margin-left: auto; }
.mi .d { font: 400 11.5px/1.3 Roboto; color: #3C4043; margin-top: 3px; }

/* ---------- tables ---------- */
table.t { width: 100%; border-collapse: separate; border-spacing: 0; font: 400 12px/1.28 Roboto; color: #3C4043; }
table.t th { text-align: left; font: 700 10.5px/1 Roboto; letter-spacing: .07em; text-transform: uppercase; color: #5F6368; padding: 6px 7px;
  background: #F8F9FA; border-bottom: 1.5px solid #DADCE0; white-space: nowrap; }
table.t td { padding: 7px 7px; border-bottom: 1px solid #EEF0F2; vertical-align: top; }
table.t tr:last-child td { border-bottom: none; }
table.t td:first-child code { font-size: 11.5px; font-weight: 700; color: #B06000; background: #FEF7E0; }
.ok { color: #137333; font-weight: 700; } .no { color: #C5221F; font-weight: 700; }
.srv { display: inline-block; font: 700 10px/1 Roboto; letter-spacing: .05em; text-transform: uppercase; color: #5F6368; background: #F1F3F4; border-radius: 4px; padding: 3px 5px; }

/* ---------- lifecycle list ---------- */
.life { position: absolute; list-style: none; }
.life li { display: flex; gap: 10px; align-items: flex-start; font: 400 13.5px/1.32 Roboto; color: #3C4043; margin-bottom: 7px; }
.life li .s { flex: none; width: 24px; height: 24px; border-radius: 50%; background: #1A73E8; color: #fff; font: 700 12.5px/24px Roboto; text-align: center; }
.life li b { color: #202124; }

/* ---------- CI/CD ---------- */
.cd { position: absolute; background: #fff; border: 1.5px solid #DADCE0; border-radius: 12px; padding: 11px 12px; z-index: 10; overflow: hidden;
  box-shadow: 0 1px 2px rgba(60,64,67,.10), 0 2px 6px rgba(60,64,67,.07); }
.cd .top { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; }
.cd .num { position: absolute; right: 10px; top: 10px; font: 700 12px/1 Roboto; color: #9AA0A6; }
.cd .t { font: 700 16px/1.18 Roboto; color: #202124; }
.cd .d { font: 400 13.5px/1.4 Roboto; color: #3C4043; }
.gates { position: absolute; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px 10px; }
.gate { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #DADCE0; border-radius: 9px; padding: 7px 10px; font: 400 12.5px/1.25 Roboto; color: #3C4043; }
.gate b { color: #202124; }

/* ---------- ISO phases ---------- */
.phase { position: absolute; background: #fff; border: 1.5px solid #DADCE0; border-radius: 14px; overflow: hidden; z-index: 10; }
.phase .ph { padding: 10px 14px 9px; color: #fff; background: var(--pc); clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%); }
.phase .ph .k { font: 700 12px/1 Roboto; letter-spacing: .12em; opacity: .92; }
.phase .ph .n { font: 700 19px/1.2 Roboto; margin-top: 3px; }
.phase .ph .s { font: 400 12.5px/1.2 Roboto; opacity: .95; margin-top: 2px; }
.phase .items { padding: 6px 14px 0; }
.phase .it { display: flex; gap: 10px; align-items: flex-start; padding: 5px 0; border-bottom: 1px dashed #E3E5E8; }
.phase .it:last-child { border-bottom: none; }
.phase .it .t { font: 700 14.5px/1.2 Roboto; color: #202124; display: flex; align-items: center; gap: 6px; }
.phase .it .d { font: 400 13.5px/1.34 Roboto; color: #3C4043; margin-top: 3px; }
.phase .cl { position: absolute; left: 14px; right: 14px; bottom: 12px; }

/* ---------- legend ---------- */
.lg { position: absolute; display: grid; grid-template-columns: 1fr 1.15fr; gap: 0 22px; }
.lg .r { display: flex; align-items: center; gap: 9px; font: 400 12.5px/1.25 Roboto; color: #3C4043; height: 20px; white-space: nowrap; }
.lg .sw { width: 30px; height: 16px; flex: none; border-radius: 4px; background: #fff; }

/* ---------- footer ---------- */
.foot { position: absolute; left: 40px; right: 40px; top: 2128px; display: flex; justify-content: space-between; font: 400 13px/1.3 Roboto; color: #80868B; }
.foot code { background: none; color: #5F6368; }

/* ---------- connectors ---------- */
#wires { position: absolute; left: 0; top: 0; width: 3840px; height: 2160px; z-index: 30; overflow: visible; pointer-events: none; }
#qa { display: none; }
"""

# --------------------------------------------------------------------------------------
# Connector router (runs in the browser; uses live element geometry)
# --------------------------------------------------------------------------------------

JS = r"""
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const canvas = document.getElementById('canvas');
  const CR = canvas.getBoundingClientRect();
  const svg = document.getElementById('wires');
  const defs = document.createElementNS(NS, 'defs');
  svg.appendChild(defs);
  const STY = {
    req:    { c: '#1A73E8', w: 3 },
    ai:     { c: '#9334E6', w: 3 },
    data:   { c: '#E37400', w: 3 },
    sec:    { c: '#D93025', w: 2.6, dash: '9 6' },
    cicd:   { c: '#5F6368', w: 2.6 },
    egress: { c: '#80868B', w: 2.6, dash: '1 7', cap: 'round' },
    gov:    { c: '#188038', w: 2.6, dash: '8 6' },
    cfg:    { c: '#137333', w: 2.6 }
  };
  const markers = {};
  function marker(color) {
    if (markers[color]) return markers[color];
    const id = 'mk' + Object.keys(markers).length;
    const m = document.createElementNS(NS, 'marker');
    m.setAttribute('id', id); m.setAttribute('viewBox', '0 0 12 12'); m.setAttribute('refX', '10.5'); m.setAttribute('refY', '6');
    m.setAttribute('markerWidth', '13'); m.setAttribute('markerHeight', '13'); m.setAttribute('markerUnits', 'userSpaceOnUse');
    m.setAttribute('orient', 'auto-start-reverse');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M0.5,1 L11.5,6 L0.5,11 L3.2,6 Z'); p.setAttribute('fill', color);
    m.appendChild(p); defs.appendChild(m); markers[color] = id; return id;
  }
  function rect(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error('connector target missing: ' + id);
    const r = el.getBoundingClientRect();
    return { l: r.left - CR.left, t: r.top - CR.top, r: r.right - CR.left, b: r.bottom - CR.top, w: r.width, h: r.height };
  }
  // at <= 1 : fraction along the side; at > 1 : absolute canvas coordinate (y for l/r, x for t/b)
  function anchor(id, side, at) {
    const R = rect(id);
    if (side === 'l' || side === 'r') return [side === 'l' ? R.l : R.r, at <= 1 ? R.t + at * R.h : at];
    return [at <= 1 ? R.l + at * R.w : at, side === 't' ? R.t : R.b];
  }
  function route(c) {
    const p0 = anchor(c.from, c.fs, c.fa === undefined ? 0.5 : c.fa);
    const p1 = anchor(c.to, c.ts, c.ta === undefined ? 0.5 : c.ta);
    const pts = [p0];
    if (c.pts) c.pts.forEach(p => pts.push(p.slice()));
    else {
      const h0 = c.fs === 'l' || c.fs === 'r', h1 = c.ts === 'l' || c.ts === 'r';
      if (h0 && h1) { if (Math.abs(p0[1] - p1[1]) > .5) { const mx = c.mx !== undefined ? c.mx : (p0[0] + p1[0]) / 2; pts.push([mx, p0[1]], [mx, p1[1]]); } }
      else if (!h0 && !h1) { if (Math.abs(p0[0] - p1[0]) > .5) { const my = c.my !== undefined ? c.my : (p0[1] + p1[1]) / 2; pts.push([p0[0], my], [p1[0], my]); } }
      else if (h0) pts.push([p1[0], p0[1]]);
      else pts.push([p0[0], p1[1]]);
    }
    pts.push(p1);
    return pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > .5);
  }
  function pathD(pts, r) {
    let d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      d += ' L' + (x1 - (x1 - x0) / l1 * rr) + ',' + (y1 - (y1 - y0) / l1 * rr) +
           ' Q' + x1 + ',' + y1 + ' ' + (x1 + (x2 - x1) / l2 * rr) + ',' + (y1 + (y2 - y1) / l2 * rr);
    }
    const e = pts[pts.length - 1];
    return d + ' L' + e[0] + ',' + e[1];
  }
  function label(text, x, y, color) {
    const g = document.createElementNS(NS, 'g');
    const lines = text.split('\n');
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('font-family', 'Roboto, Arial, sans-serif'); t.setAttribute('font-size', '12.5'); t.setAttribute('font-weight', '500');
    t.setAttribute('fill', '#3C4043'); t.setAttribute('text-anchor', 'middle');
    lines.forEach((ln, i) => {
      const s = document.createElementNS(NS, 'tspan');
      s.setAttribute('x', x); s.setAttribute('dy', i === 0 ? (-(lines.length - 1) * 8 + 4.3) : 16); s.textContent = ln; t.appendChild(s);
    });
    t.setAttribute('y', y);
    g.appendChild(t); svg.appendChild(g);
    const bb = t.getBBox();
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', bb.x - 8); r.setAttribute('y', bb.y - 4); r.setAttribute('width', bb.width + 16); r.setAttribute('height', bb.height + 8);
    r.setAttribute('rx', 7); r.setAttribute('fill', '#fff'); r.setAttribute('stroke', color); r.setAttribute('stroke-width', '1.2');
    g.insertBefore(r, t);
  }
  function badge(n, x, y) {
    const g = document.createElementNS(NS, 'g');
    const halo = document.createElementNS(NS, 'circle');
    halo.setAttribute('cx', x); halo.setAttribute('cy', y); halo.setAttribute('r', 18); halo.setAttribute('fill', '#fff');
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 15); c.setAttribute('fill', '#1A73E8');
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y + 5.3); t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#fff');
    t.setAttribute('font-family', 'Roboto, Arial, sans-serif'); t.setAttribute('font-size', '15'); t.setAttribute('font-weight', '700');
    t.textContent = n;
    g.appendChild(halo); g.appendChild(c); g.appendChild(t); svg.appendChild(g);
  }
  const later = [];
  (window.WIRES || []).forEach(c => {
    const st = STY[c.k];
    const pts = route(c);
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', pathD(pts, 12)); p.setAttribute('fill', 'none'); p.setAttribute('stroke', st.c);
    p.setAttribute('stroke-width', st.w); p.setAttribute('stroke-linejoin', 'round'); p.setAttribute('stroke-linecap', st.cap || 'butt');
    if (st.dash) p.setAttribute('stroke-dasharray', st.dash);
    if (c.end !== false) p.setAttribute('marker-end', 'url(#' + marker(st.c) + ')');
    if (c.both) p.setAttribute('marker-start', 'url(#' + marker(st.c) + ')');
    svg.appendChild(p);
    const len = p.getTotalLength();
    if (c.label) {
      let pos = c.lp;
      if (!pos) { const q = p.getPointAtLength(len * (c.lt === undefined ? .5 : c.lt)); pos = [q.x, q.y]; }
      later.push(() => label(c.label, pos[0], pos[1], st.c));
    }
    if (c.step) {
      let pos = c.sp;
      if (!pos) { const q = p.getPointAtLength(len * (c.st === undefined ? .5 : c.st)); pos = [q.x, q.y]; }
      later.push(() => badge(c.step, pos[0], pos[1]));
    }
  });
  later.forEach(f => f());

  // QA: report any element whose content overflows its box
  const issues = [];
  document.querySelectorAll('.card, .cd, .phase, .stg, .mi, .gate, .zone .zh, .chip, .mod').forEach(el => {
    if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
      issues.push((el.id || el.className) + ' :: ' + el.scrollWidth + 'x' + el.scrollHeight + ' > ' + el.clientWidth + 'x' + el.clientHeight +
        ' :: ' + (el.textContent || '').trim().slice(0, 60));
      if (location.hash === '#debug') el.style.outline = '4px solid #ff00aa';
    }
  });
  document.getElementById('qa').textContent = JSON.stringify(issues);
})();
"""

# --------------------------------------------------------------------------------------
# Connectors (k = style; fs/ts = side l|r|t|b; fa/ta = fraction or absolute coordinate)
# --------------------------------------------------------------------------------------

def wires() -> list[dict]:
    w: list[dict] = [
        # Ingress through the Zero-Trust perimeter
        dict(k="req", frm="a-admin", fs="r", fa=303, to="b-iap", ts="l", ta=303),
        dict(k="req", frm="a-cicd", fs="r", fa=494, to="b-iap", ts="l", ta=494),
        dict(k="req", frm="a-users", fs="r", fa=720, to="b-iap", ts="l", ta=720, step=1),
        dict(k="req", frm="a-users", fs="r", fa=1040, to="b-fbauth", ts="l", ta=1040, step=2, both=True),
        dict(k="req", frm="b-iap", fs="r", fa=509, to="c-pipeline", ts="l", ta=509, step=3),
        # Inside Cloud Run
        dict(k="req", frm="c-api", fs="r", fa=742, to="c-engine", ts="l", ta=742),
        dict(k="ai", frm="c-engine", fs="r", fa=742, to="c-router", ts="l", ta=742),
        # Inference path through the Model Armor control point
        dict(k="ai", frm="c-router", fs="r", fa=660, to="d-armor", ts="l", ta=660, step=6),
        dict(k="ai", frm="d-armor", fs="l", fa=752, to="c-router", ts="r", ta=752),
        dict(k="ai", frm="d-armor", fs="r", fa=660, to="d-gemini", ts="l", ta=660),
        dict(k="ai", frm="d-gemini", fs="l", fa=752, to="d-armor", ts="r", ta=752),
        # Model supply chain & evaluation governance
        dict(k="gov", frm="d-garden", fs="b", fa=2884, to="d-gemini", ts="t", ta=2884),
        dict(k="gov", frm="d-gemini", fs="b", fa=2884, to="d-eval", ts="t", ta=2884),
        # Persistence
        dict(k="data", frm="c-gov", fs="b", fa=1200, to="f-table", ts="t", ta=1200, step=7, both=True,
             label="Admin SDK · roles/datastore.user", lp=[1338, 1196]),
        dict(k="data", frm="a-users", fs="r", fa=1140, to="f-table", ts="l", ta=1292, pts=[[482, 1140], [482, 1292]],
             step=8, st=.44, both=True),
        # Secret reference
        dict(k="cfg", frm="s-secret", fs="t", fa=2200, to="c-zone", ts="b", ta=2200,
             label="ADMIN_API_TOKEN · secret ref", lp=[2200, 1196]),
        # Security telemetry
        dict(k="sec", frm="c-zone", fs="r", fa=1120, to="o-logging", ts="l", ta=1300, pts=[[2376, 1120], [2376, 1300]],
             step=9, st=.5),
        dict(k="sec", frm="o-logging", fs="r", fa=1330, to="o-scc", ts="l", ta=1330),
        dict(k="sec", frm="o-logging", fs="b", fa=2558, to="o-monitoring", ts="t", ta=2558),
        dict(k="sec", frm="o-scc", fs="r", fa=1300, to="x-soc", ts="l", ta=1300),
        dict(k="sec", frm="d-zone", fs="b", fa=2990, to="o-scc", ts="t", ta=2990),
        # Optional egress (allowlisted)
        dict(k="egress", frm="c-zone", fs="t", fa=2290, to="x-llm", ts="l", ta=378, pts=[[2290, 166], [3146, 166], [3146, 378]],
             label="Outbound egress allowlist (C04.3) · HTTPS only · IMDS & private ranges blocked", lp=[2700, 166]),
        dict(k="egress", frm="c-zone", fs="t", fa=2290, to="x-translate", ts="l", ta=609, pts=[[2290, 166], [3146, 166], [3146, 609]]),
        dict(k="egress", frm="c-zone", fs="t", fa=2290, to="x-projects", ts="l", ta=927, pts=[[2290, 166], [3146, 166], [3146, 927]]),
        # CI/CD into the platform
        dict(k="cicd", frm="cd7", fs="t", fa=1660, to="c-zone", ts="b", ta=1660, label="deploy new revision", lp=[1660, 1615]),
        dict(k="cicd", frm="cd6", fs="t", fa=1440, to="f-zone", ts="b", ta=1440, label="publish firestore.rules", lp=[1440, 1615]),
        # ISO 42001 continual improvement loop
        dict(k="gov", frm="iso-p5", fs="b", fa=3554, to="iso-p3", ts="b", ta=2638, pts=[[3554, 2097], [2638, 2097]],
             label="Clause 10 · continual improvement — findings feed back into Phase 3", lp=[3096, 2097]),
    ]
    for i in range(1, 9):
        w.append(dict(k="cicd", frm=f"cd{i}", fs="r", fa=1826, to=f"cd{i + 1}", ts="l", ta=1826))
    for c in w:  # 'from' is a Python keyword
        c["from"] = c.pop("frm")
    return w


# --------------------------------------------------------------------------------------
# Page body
# --------------------------------------------------------------------------------------

def header() -> str:
    gbar = '<div class="gbar"><i style="background:#4285F4"></i><i style="background:#EA4335"></i><i style="background:#FBBC04"></i><i style="background:#34A853"></i></div>'
    chips = [
        ("Project", "<code>computeengine-506321</code>"),
        ("Region", "<code>us-central1</code>"),
        ("Cloud Run", "<code>aegis-ai</code>"),
        ("Firestore", "<code>aegis-ai-db</code> · nam5"),
        ("Model", "<code>gemini-3.8-flash</code> · global"),
        ("Access", "Cloud IAP + Firebase Auth"),
        ("Domains", "google.com · fjhuerta.altostrat.com"),
        ("Baseline", "<code>main@c6af106</code> · Oct 2026"),
    ]
    chips_html = "".join(f'<span class="chip"><b>{k}</b>{v}</span>' for k, v in chips)
    return (
        gbar
        + '<div class="hdr">'
        + f'<div class="logo">{L("shield-check", 50, "#FFFFFF", 2.2)}</div>'
        + '<div class="title">Aegis<span class="ai">AI</span> Enterprise <span class="thin">·</span> Google Cloud Architecture</div>'
        + '<div class="subtitle">AI security &amp; compliance auditor · OWASP AISVS v1.0 · ISO/IEC 42001:2023 · EU AI Act · Mexico LFPDPPP / LFPC'
          ' — as-built deployment + Google Cloud AI Protection Stack</div>'
        + f'<div class="chips">{chips_html}</div>'
        + "</div>"
    )


def clients() -> str:
    out = zone("a-zone", 40, 180, 430, 1000, "z-clients", "Users &amp; clients", "outside Google Cloud")
    out += box("a-admin", 56, 228, 398, 150,
               hdr(LB("user-cog", "#1A73E8", "#E8F0FE"), "Administrators &amp; Ops", "Admin panel · CLI automation")
               + ul(["<code>/api/admin/*</code> with <code>x-admin-token</code> (SHA-256 <code>timingSafeEqual</code>) or an allowed-domain identity",
                     "Token value read from Secret Manager (<code>aegis-admin-token</code>)"], "b sm"))
    out += box("a-cicd", 56, 392, 398, 205,
               hdr(LB("workflow", "#1A73E8", "#E8F0FE"), "CI/CD pipelines", "GitHub Actions · GitLab CI · Jenkins")
               + ul(["<code>POST /api/v1/audits</code> → <code>202 Accepted</code> + <code>jobId</code>; poll <code>GET /api/v1/audits/:jobId</code>",
                     "AegisAI API key (<code>apiKeys</code>, status <code>active</code>) + Google-signed OIDC token for IAP",
                     "Quality gate: fail the build below the target compliance score"], "b sm")
               + bd(("ow", "C11.1 quotas"), ("ow", "C09.4 saga")))
    spa = (
        '<div class="inner" style="margin-top:8px">'
        + hdr(LB("monitor-smartphone", "#1A73E8", "#FFFFFF", 34, 20), "AegisAI web app (SPA)", "React 19 · Vite 6 · Tailwind CSS 4 · Recharts · jsPDF")
        + '<div class="mods">'
        + "".join(f'<div class="mod">{L(i, 15, "#1A73E8")}{t}</div>' for i, t in [
            ("gauge", "Executive dashboard"), ("list-checks", "Audit wizard · AISVS / ISO / Full / Custom"),
            ("file-text", "Report viewer + PDF export"), ("scan-search", "GCP Live Scanner"),
            ("layers", "Normative catalog"), ("map", "Architecture &amp; remediation"),
            ("key-round", "API keys for CI/CD"), ("user-cog", "Admin settings · LLM providers")])
        + "</div>"
        + ul(["Served by Cloud Run (<code>dist/</code>) behind Cloud IAP",
              "Sends <code>Authorization: Bearer &lt;Firebase ID token&gt;</code>; live audit progress over SSE",
              "Firebase JS SDK v12: realtime <code>onSnapshot</code> reads &amp; validated writes under Security Rules",
              "i18n ES / EN · runtime translation PT / FR / DE"], "b xs")
        + "</div>"
    )
    out += box("a-users", 56, 611, 398, 553,
               hdr(LB("users", "#1A73E8", "#E8F0FE"), "Corporate users", "Google identities · modern browser")
               + '<div><span class="domain">@google.com</span><span class="domain">@fjhuerta.altostrat.com</span></div>'
               + spa)
    return out


def edge() -> str:
    out = zone("b-zone", 530, 180, 430, 1000, "z-edge", "Edge &amp; identity", "Zero Trust")
    gfe = ('<div class="inner" style="margin:2px 0 8px">'
           + hdr(LB("globe", "#1A73E8", "#FFFFFF", 32, 19), "Google Front End · HTTPS", "TLS 1.3 · Google-managed certificate")
           + '<div style="font:400 11.5px/1.3 Roboto;color:#3C4043"><code>aegis-ai-607603788049.us-central1.run.app</code></div></div>')
    out += box("b-iap", 546, 228, 398, 572,
               hdr(G("identity-aware_proxy", 38), "Cloud Identity-Aware Proxy", "Perimeter sign-in #1 · Cloud Run IAP", live())
               + gfe
               + ul(["Only <code>domain:google.com</code> and <code>domain:fjhuerta.altostrat.com</code> hold <code>roles/iap.httpsResourceAccessor</code>",
                     "Custom OAuth client (Google Auth Platform · External · In production) for identities outside the org",
                     "IAP service agent is the only <code>roles/run.invoker</code>; legacy user / <code>allUsers</code> grants removed at deploy",
                     "Cloud Run flags: <code>--iap</code> · <code>--no-allow-unauthenticated</code> · <code>--invoker-iam-check</code>",
                     "Forwards the verified identity: <code>x-goog-authenticated-user-email</code> / <code>-id</code> → tenant context",
                     "CI/CD and CLI callers present Google-signed OIDC identity tokens",
                     "Deploy smoke test: anonymous <code>GET /api/health</code> must return 302 / 401 / 403"], "b sm")
               + bd(("zt", "Zero Trust"), ("ow", "C05.3"), ("ow", "C05.4")))
    out += box("b-fbauth", 546, 814, 398, 350,
               hdr(G("identity_platform", 38), "Firebase Authentication", "Identity Platform · in-app sign-in #2", live())
               + ul(["Google provider (<code>signInWithPopup</code>) → Firebase ID token (JWT, 1 h, refreshed by the SDK)",
                     "Exact domain allowlist in the SPA (<code>VITE_ALLOWED_DOMAINS</code>) + verified email in Security Rules",
                     "Token sent as <code>Authorization: Bearer</code> to <code>/api/*</code>; server verifies with Admin SDK <code>verifyIdToken</code> → uid, email, tenant domain",
                     "Same identity authorizes direct Firestore access (<code>request.auth</code> in Security Rules)",
                     "Authorized domains (<code>*.run.app</code> hosts) synced at deploy via the Identity Toolkit API",
                     "Demo mode disabled in production (<code>VITE_ENABLE_DEMO_MODE=false</code>)"], "b sm")
               + bd(("ow", "C05.3"), ("ow", "C05.4")))
    return out


def cloud_run() -> str:
    out = zone("c-zone", 1000, 180, 1350, 1000, "z-run", "Google Cloud Run",
               "service <code>aegis-ai</code> · <code>us-central1</code> · Node.js 22 · Express 4 · TypeScript (esbuild → <code>dist/server.cjs</code>)",
               G("cloud_run", 28))
    out += box("c-container", 1016, 236, 434, 168,
               hdr(LB("lock", "#1A73E8", "#E8F0FE", 32, 19), "Hardened container", "", live())
               + ul(["<code>node:22-slim</code> multi-stage build · production deps only",
                     "Non-root <code>aegisuser</code> · <code>/app</code> read-only (<code>chmod -R a-w</code>) — C04.1",
                     "Ephemeral <code>/tmp/aegis-runtime-cache</code>; settings persisted in Firestore",
                     "Sandboxed runtime isolation · <code>--dns-result-order=ipv4first</code>"], "b sm"))
    out += box("c-revision", 1458, 236, 434, 168,
               hdr(LB("gauge", "#1A73E8", "#E8F0FE", 32, 19), "Revision &amp; scaling")
               + ul(["2 vCPU · 2 GiB · concurrency 40 · timeout 3600 s · port 8080",
                     "min 0 / max 1 instance (in-memory cache backed by Firestore)",
                     "CPU always allocated (async 202 jobs) · startup CPU boost",
                     "Ingress only through IAP · invoker IAM check enforced"], "b sm"))
    out += box("c-identity", 1900, 236, 434, 168,
               hdr(LB("key-round", "#1A73E8", "#E8F0FE", 32, 19), "Identity &amp; configuration")
               + ul(["Runtime SA <code>aegis-runner-sa</code> · keyless ADC · no API keys (C05.2)",
                     "<code>GOOGLE_GENAI_USE_ENTERPRISE=true</code> · <code>GEMINI_MODEL=gemini-3.8-flash</code>",
                     "<code>GOOGLE_CLOUD_LOCATION=global</code> · <code>FIRESTORE_DATABASE_ID=aegis-ai-db</code>",
                     "<code>ADMIN_API_TOKEN</code> ← Secret Manager <code>aegis-admin-token:latest</code>"], "b xs"))
    stages = [
        ("Security headers", "nosniff · SAMEORIGIN · Referrer &amp; Permissions policies", "OWASP"),
        ("DNS-rebinding guard", "Host &amp; Origin allowlist (<code>*.run.app</code>)", "C10.5"),
        ("Anti-probing", "dotfiles · <code>.env .key .pem .ts .lock</code> → 404", "Hardening"),
        ("Payload limits", "JSON 15 MB · uploads ≤ 30 MB · file-type allowlist", "Multer"),
        ("Identity context", "Firebase ID token · IAP headers · API key · admin token", "C05.3 · C05.4"),
        ("Anti-DoW quotas", "30 req / 15 min · 3 concurrent · 2.5 M tokens / window", "C11.1"),
        ("Injection guard", "multi-turn crescendo score · session block ≥ 115", "C02.10"),
        ("SSRF egress control", "HTTPS only · IMDS &amp; RFC 1918 blocked · allowlist", "C04.3"),
    ]
    pipe = "".join(f'<div class="stg"><div class="n">{i}</div><div class="t">{t}</div><div class="d">{d}</div><span class="bd">{b}</span></div>'
                   for i, (t, d, b) in enumerate(stages, 1))
    out += box("c-pipeline", 1016, 416, 1318, 186,
               f'<div class="pipe-title">{L("shield-check", 16, "#1967D2")}Security control pipeline <span>— Express middleware &amp; route guards on <code>/api/*</code> (OWASP AISVS)</span></div>'
               f'<div class="pipe">{pipe}</div>', extra="padding:10px 12px")
    api_rows = [
        ("Audits", "<code>POST /api/evaluate</code> multipart + SSE · <code>POST /api/v1/audits</code> 202 · <code>GET /api/v1/audits/:jobId</code>"),
        ("Frameworks", "<code>POST /api/frameworks/ingest</code> · <code>GET</code> / <code>DELETE /api/frameworks/:id</code>"),
        ("GCP scan", "<code>POST /api/gcp/test-connection</code> · <code>/scan</code> · <code>/audit</code> (SSE)"),
        ("Admin", "<code>GET</code> / <code>POST /api/admin/settings</code> · <code>/test-connection</code> · <code>/aims-telemetry</code>"),
        ("Trust", "<code>GET /api/security/posture</code> · <code>POST /api/mcp/verify</code>"),
        ("Platform", "<code>POST /api/translate-batch</code> · <code>GET /api/health</code> · SPA <code>dist/</code> · <code>/docs/manuales_pdf</code>"),
    ]
    out += box("c-api", 1016, 614, 520, 256,
               hdr(LB("server", "#1A73E8", "#E8F0FE", 32, 19), "REST API surface", "Express routes served by the container")
               + '<div class="api">' + "".join(f'<div class="g">{g}</div><div>{r}</div>' for g, r in api_rows) + "</div>")
    out += box("c-engine", 1570, 614, 370, 256,
               hdr(LB("brain-circuit", "#9334E6", "#F3E8FD", 32, 19), "Audit evaluation engine")
               + ul(["Evidence extraction: pdf-parse · JSZip · code &amp; Markdown",
                     "Risk level L1 / L2 / L3 + platform shared-responsibility profile",
                     "Chapter batches: AISVS C1–C13 · ISO 42001 Cl. 4–10 &amp; Annex A · EU AI Act · Mexico · custom",
                     "Untrusted input fenced in <code>&lt;user_candidate_architecture&gt;</code> (LLM01)",
                     "Evidence-cited gap map + remediated architecture document"], "b sm", "#9334E6"))
    out += box("c-router", 1974, 614, 360, 256,
               hdr(LB("split", "#9334E6", "#F3E8FD", 32, 19), "Multi-provider LLM router")
               + ul(["Default <code>gemini</code> → Vertex AI via ADC (keyless)",
                     "10-model fallback chain · 2 attempts per model · abort timeouts",
                     "Strict JSON <code>responseSchema</code> · temperature 0 · topK 1 · no logprobs (C11.4)",
                     "Optional <code>anthropic</code> · <code>openrouter</code> · <code>openai</code> · <code>custom_openai_compatible</code>",
                     "Every outbound URL validated by the egress allowlist (C04.3)"], "b sm", "#9334E6"))
    gov_items = [
        ("Normative integrity", "C01.4", "SHA-256 manifest verifies 6 bundled framework snapshots at startup"),
        ("Framework ingestion", "C09.4", "Legal documents → controls, with compensating saga rollback"),
        ("AIMS telemetry", "ISO 9.1", "Citation-grounding rate (SLO ≥ 95 %), determinism, latency, tokens"),
        ("Security alerting", "C12.2", "8 event types → Cloud Logging JSON · <code>security_alerts</code> · SIEM webhook"),
        ("MCP manifest checks", "C10.1 · C10.2", "HMAC-SHA256 signature verification · OAuth2 scope checks"),
        ("Posture attestation", "Evidence", "<code>GET /api/security/posture</code> returns live control evidence"),
    ]
    out += box("c-gov", 1016, 882, 650, 282,
               hdr(LB("shield-check", "#137333", "#E6F4EA", 32, 19), "Governance, trust &amp; telemetry services")
               + '<div class="mini">' + "".join(
                   f'<div class="mi"><div class="t">{t}<span class="bd {"iso" if k.startswith("ISO") or k == "Evidence" else "ow"}">{k}</span></div><div class="d">{d}</div></div>'
                   for t, k, d in gov_items) + "</div>")
    out += box("c-scanner", 1684, 882, 650, 282,
               hdr(LB("scan-search", "#1A73E8", "#E8F0FE", 32, 19), "GCP Live Scanner", "Read-only posture discovery of audited projects")
               + ul(["Per-scan credentials: OAuth access token · SA key JSON · ADC (off: <code>ENABLE_LIVE_SCANNER_ADC=false</code>) · demo telemetry",
                     "Inventories IAM policy · Cloud Storage · Cloud Run · Vertex AI endpoints &amp; Model Registry (4 regions) · Model Armor templates · Secret Manager",
                     "Flags public endpoints, missing Model Monitoring, models outside Garden / Registry, public buckets, primitive roles, unrotated secrets",
                     "Builds an architecture manifest → evaluation engine (ISO 42001 / AISVS mapping)"], "b sm"))
    out += step_badge(4, 1004, 402)
    out += step_badge(5, 1555, 600)
    return out


def ai_platform() -> str:
    out = zone("d-zone", 2400, 180, 670, 1000, "z-ai", "AI platform", "Vertex AI + Model Armor · global endpoint", G("vertexai", 28))
    out += stack("d-garden", 2416, 228, 638, 168, P3, "ISO/IEC 42001 · Phase 3 · model supply chain",
                 hdr(G("ai_platform", 34), "Vertex AI Model Garden &amp; Model Registry")
                 + ul(["<b>Active:</b> Gemini is consumed as a Google first-party, verified publisher model from Model Garden",
                       "Model Registry: versioned, lineage-tracked private models — no unvetted internet weights or backdoors",
                       "Live Scanner flags models outside Garden / Registry in audited projects"], "b sm", P3[0])
                 + bd(("iso", "ISO A.6.1.2"), ("iso", "A.7.3"), ("ow", "C01.4"), ("ow", "C13.1")))
    out += stack("d-armor", 2416, 432, 260, 348, P3, "ISO 42001 · Phase 3 · inline",
                 hdr(G("security", 34), "Model Armor", "In front of every LLM call")
                 + ul(["In → <code>sanitizeUserPrompt</code>", "Out → <code>sanitizeModelResponse</code>",
                       "Prompt-injection &amp; jailbreak detection", "Malicious URL detection",
                       "RAI filters: hate · harassment · sexual · dangerous",
                       "Sensitive Data Protection: PII &amp; secrets"], "b sm", P3[0])
                 + bd(("iso", "A.6.2.6"), ("ow", "C02.10"), ("ow", "C07.1"))
                 + '<div class="status"><b>Control point</b> — enabled per environment (API on the egress allowlist). '
                   'In-app C02.10 guard is active today.</div>')
    out += box("d-gemini", 2714, 432, 340, 348,
               hdr(G("vertexai", 38), "Vertex AI · Gemini", "Gemini Enterprise Agent Platform", live())
               + ul(["Primary <code>gemini-3.8-flash</code> · global endpoint",
                     "Fallbacks <code>3.1-flash-lite</code> → <code>3.5-flash-lite</code> → <code>3.7-flash</code> → … → <code>3.1-pro-preview</code>",
                     "Keyless IAM: <code>aegis-runner-sa</code> holds <code>roles/aiplatform.user</code>",
                     "Structured JSON output · deterministic decoding (temp 0, topK 1)",
                     "Enterprise data governance: prompts and outputs are not used for training"], "b sm", "#9334E6")
               + bd(("ow", "C11.4"), ("ow", "C04.3"), ("zt", "Keyless ADC")))
    out += stack("d-eval", 2416, 816, 638, 174, P4, "ISO/IEC 42001 · Phase 4 · evaluation",
                 hdr(LB("badge-check", P4[0], P4[1], 34, 20), "Vertex AI Evaluation Service · AutoSxS")
                 + ul(["AutoSxS autorater compares responses side by side — like a teacher grading homework",
                       "Safety metrics: hate speech · harassment · sexually explicit · dangerous content · immutable evaluation audit trail"], "b sm", P4[0])
                 + bd(("iso", "ISO Cl. 9.1"), ("iso", "A.6.2.4"), ("ow", "C08.4"), ("p4", "Quality gate before promotion")))
    out += stack("d-monitor", 2416, 1004, 638, 160, P5, "ISO/IEC 42001 · Phase 5 · deployment",
                 hdr(LB("activity", P5[0], P5[1], 34, 20), "Vertex AI Model Monitoring")
                 + ul(["Training-serving skew &amp; prediction / feature drift detection · immediate alerts when safety degrades",
                       "Live Scanner flags Vertex AI endpoints without monitoring jobs"], "b sm", P5[0])
                 + bd(("iso", "ISO Cl. 9.1"), ("iso", "A.6.2.6"), ("ow", "C08.4")))
    return out


def external() -> str:
    out = zone("x-zone", 3125, 180, 675, 1000, "z-ext", "External services", "outside the project boundary")
    rows = [("Anthropic Claude", "api.anthropic.com", "claude-opus-5-5-max"),
            ("OpenRouter", "openrouter.ai", "anthropic/claude-3.7-sonnet"),
            ("OpenAI", "api.openai.com", "gpt-4o"),
            ("OpenAI-compatible · Ollama", "custom base URL", "llama3.3:latest")]
    table = ('<table class="t"><tr><th>Provider</th><th>Endpoint</th><th>Default model</th></tr>'
             + "".join(f"<tr><td><b>{a}</b></td><td><code>{b}</code></td><td><code>{c}</code></td></tr>" for a, b, c in rows)
             + "</table>")
    out += box("x-llm", 3172, 228, 612, 300,
               hdr(LB("bot", "#5F6368", "#F1F3F4"), "Optional third-party LLM providers", "Off by default · provider = <code>gemini</code> (Vertex AI)")
               + table
               + ul(["Admin-set keys stay server-side (<code>system_config</code>) and are masked in the UI",
                     "HTTPS only in production; host must be on the egress allowlist (C04.3)",
                     "Per-provider connection test before saving: <code>POST /api/admin/test-connection</code>",
                     "JSON mode (<code>response_format: json_object</code>) · temperature 0 · fallback model · 2 attempts · 180 s timeout"], "b xs", "#80868B"))
    out += box("x-translate", 3172, 544, 612, 130,
               hdr(G("cloud_translation_api", 34), "Google Translate (gtx endpoint)", "i18n fallback")
               + ul(["<code>translate.googleapis.com</code> — per-string fallback for <code>/api/translate-batch</code>",
                     "Gemini on Vertex AI is the primary translator · in-memory cache"], "b sm", "#80868B"))
    out += box("x-projects", 3172, 690, 612, 474,
               hdr(G("project", 36), "Audited Google Cloud projects", "Customer environments · read-only REST")
               + ul(["<b>Resource Manager</b> — project metadata &amp; <code>getIamPolicy</code>: owner / editor grants, <code>allUsers</code> members",
                     "<b>Cloud Storage</b> — uniform bucket-level access, public access prevention, CMEK, versioning",
                     "<b>Cloud Run v2</b> — default compute SA, all-ingress services, VPC connectors",
                     "<b>Vertex AI</b> — endpoints in 4 regions (public vs. private, Model Monitoring jobs) &amp; Model Registry",
                     "<b>Model Armor</b> — inline templates per region",
                     "<b>Secret Manager</b> — secrets without rotation policies",
                     "Findings mapped to OWASP AISVS, ISO/IEC 42001 and LFPDPPP → audit report",
                     "Scan-to-audit streams progress over SSE (<code>POST /api/gcp/audit</code>)",
                     "Workshop mode: synthetic demo telemetry, no credentials needed"], "b sm", "#80868B")
               + bd(("ow", "C04.1"), ("ow", "C05.1"), ("ow", "C05.2"), ("ow", "C08.1"), ("ow", "C08.4"), ("iso", "ISO A.6.2.6")))
    return out


def row2() -> str:
    # Audit request lifecycle
    out = zone("life", 40, 1210, 430, 390, "z-life", "Audit request lifecycle")
    steps = [
        "<b>Perimeter sign-in</b> at Cloud IAP (allowed domains only)",
        "<b>In-app Google sign-in</b> → Firebase ID token",
        "<code>POST /api/evaluate</code> (multipart + SSE) → Cloud Run",
        "<b>Guards:</b> identity, anti-DoW quotas, injection guard",
        "<b>Engine</b> extracts evidence, sets L1–L3, batches chapters",
        "<b>Router</b> → Model Armor control point → Gemini 3.8 Flash",
        "Streamed results; report stored in Firestore <code>audits</code>",
        "<b>Dashboard</b> syncs via Firebase SDK under Security Rules",
        "<b>Security events</b> → Cloud Logging → SCC / SOC",
    ]
    out += ('<ol class="life" style="left:58px;top:1256px;width:398px">'
            + "".join(f'<li><span class="s">{i}</span><span>{s}</span></li>' for i, s in enumerate(steps, 1)) + "</ol>")
    out += ('<div class="inner" style="position:absolute;left:58px;top:1528px;width:396px;font:400 12.5px/1.35 Roboto;color:#3C4043;padding:7px 10px">'
            '<b>CI/CD variant:</b> <code>POST /api/v1/audits</code> → <code>202</code> + <code>jobId</code> (<code>asyncAudits</code>) → same guards &amp; engine '
            '→ server saves the report (Admin SDK) → client polls <code>GET /api/v1/audits/:jobId</code></div>')

    # Firestore
    out += zone("f-zone", 530, 1210, 1110, 390, "z-data", "Data · Cloud Firestore",
                "<code>aegis-ai-db</code> · Native mode · <code>nam5</code>", G("firestore", 28))
    rows = [
        ("audits", "Audit reports, gap matrices, remediated architecture", '<span class="ok">list · get · create · update</span> (schema-validated) · <span class="no">delete ✗</span> immutable trail · <code>ownerUid</code> immutable'),
        ("standards_aisvs<br>standards_iso42001", "Normative catalog chapters", '<span class="ok">read</span> · validated create / update · <span class="no">delete ✗</span>'),
        ("apiKeys", "CI/CD API keys (<code>status: active</code>)", '<span class="ok">read · create</span> · delete by owner / admin · <span class="no">update ✗</span>'),
        ("asyncAudits", "Async CI/CD audit jobs (202 → result)", '<span class="srv">server only</span>'),
        ("custom_frameworks", "Ingested frameworks + SHA-256 signature", '<span class="srv">server only</span>'),
        ("system_config", "<code>admin_settings</code>: provider, model, keys", '<span class="srv">server only</span> · replaces writable <code>/app/config</code> (C04.1)'),
        ("security_alerts", "C12.2 security events", '<span class="srv">server only</span> · default deny'),
    ]
    table = ('<table class="t"><tr><th>Collection</th><th>Holds</th><th>Browser access · Security Rules</th></tr>'
             + "".join(f"<tr><td><code>{a.replace('<br>', '</code><br><code>')}</code></td><td>{b}</td><td>{c}</td></tr>" for a, b, c in rows)
             + "</table>")
    out += box("f-table", 546, 1256, 780, 330, table, extra="padding:8px 10px")
    out += box("f-rules", 1340, 1256, 284, 330,
               hdr(LB("lock", "#B06000", "#FEF7E0", 30, 17), "Security Rules")
               + ul(["<code>isAllowedUser()</code> = signed in ∧ email verified ∧ domain matches <code class=\"wrap\">@(google[.]com|fjhuerta[.]altostrat[.]com)$</code>",
                     "Default deny on every other path",
                     "Unit-tested (<code>@firebase/rules-unit-testing</code>) &amp; published at deploy"], "b xs", "#E37400")
               + '<div class="sect">Server · Admin SDK</div>'
               + ul(["Runs as <code>aegis-runner-sa</code> (<code>roles/datastore.user</code>), bypasses rules for jobs, configs &amp; alerts",
                     "Saga rollback deletes partial audits (C09.4)",
                     "Multi-region <code>nam5</code> · encrypted at rest &amp; in transit"], "b xs", "#E37400")
               + bd(("ow", "C05.4"), ("ow", "C09.4")))

    # Secrets & IAM
    out += zone("s-zone", 1680, 1210, 670, 390, "z-sec", "Secrets &amp; identity", "least privilege", G("identity_and_access_management", 28))
    out += box("s-secret", 1696, 1252, 638, 120,
               hdr(G("secret_manager", 34), "Secret Manager", "", live())
               + ul(["<code>aegis-admin-token</code> (random 48-hex, created by <code>bootstrap.sh</code>) · <code>secretAccessor</code> only for <code>aegis-runner-sa</code>",
                     "Injected as <code>ADMIN_API_TOKEN</code> (<code>:latest</code>) — never baked into the image or the repo"], "b sm", "#137333"))
    out += box("s-iam", 1696, 1384, 638, 202,
               hdr(G("identity_and_access_management", 34), "Cloud IAM · service accounts", "", live())
               + ul(["<code>aegis-runner-sa</code> (runtime) — <code>roles/aiplatform.user</code> · <code>roles/datastore.user</code> · secret accessor (resource-level)",
                     "<code>aegis-build-sa</code> (build) — <code>roles/cloudbuild.builds.builder</code> · <code>roles/logging.logWriter</code> · <code>artifactregistry.writer</code> on the repo",
                     "IAP service agent — sole <code>roles/run.invoker</code>; users get <code>iap.httpsResourceAccessor</code> by domain",
                     "Legacy broad grants pruned (<code>roles/viewer</code>, <code>storage.admin</code>, …)"], "b sm", "#137333")
               + bd(("ow", "C05.2")))

    # Security operations & observability
    out += zone("o-zone", 2400, 1210, 670, 390, "z-ops", "Security operations &amp; observability", "", G("security_command_center", 28))
    out += box("o-logging", 2416, 1252, 284, 158,
               hdr(G("cloud_logging", 32), "Cloud Logging", "", live())
               + ul(["Structured JSON security events (<code>severity</code>, <code>eventType</code>, <code>sccAiProtection</code>)",
                     "Cloud Audit Logs · Cloud Build &amp; request logs"], "b xs", "#D93025"))
    out += box("o-monitoring", 2416, 1440, 284, 146,
               hdr(G("cloud_monitoring", 32), "Cloud Monitoring", "", live())
               + ul(["Cloud Run requests, latency, instances, CPU",
                     "Log-based metrics &amp; alerting policies"], "b xs", "#D93025"))
    out += stack("o-scc", 2734, 1252, 320, 334, P5, "ISO 42001 · Phase 5 · deployment",
                 hdr(G("security_command_center", 34), "Security Command Center", "AI Protection")
                 + ul(["AI asset inventory &amp; posture for Vertex AI models, endpoints and Model Armor",
                       "Real-time threat detection: prompt-injection attempts surface as SOC alerts",
                       "Vulnerability findings on endpoints, RAG buckets &amp; IAM",
                       "Event Threat Detection over Cloud Audit Logs"], "b sm", P5[0])
                 + bd(("iso", "ISO A.6.2.8"), ("iso", "Cl. 10.1"), ("ow", "C12.2")))

    # SOC (outside) and legend
    out += box("x-soc", 3125, 1210, 675, 180,
               hdr(LB("siren", "#D93025", "#FCE8E6"), "Security Operations Center · SIEM", "Outside the project · people &amp; tooling")
               + ul(["Real-time triage of SCC AI Protection findings and CRITICAL / WARNING AegisAI events",
                     "Event types: prompt injection · crescendo escalation · SSRF · DoW quota · admin auth failure · DNS rebinding · integrity failure · saga compensation",
                     "Optional push: <code>SECURITY_ALERT_WEBHOOK_URL</code> (CRITICAL / WARNING)"], "b sm", "#D93025"),
               extra="border:2px dashed #BDC1C6")
    out += legend()
    return out


def legend() -> str:
    def line(color: str, dash: str = "", width: float = 3, cap: str = "butt") -> str:
        d = f' stroke-dasharray="{dash}"' if dash else ""
        return (f'<svg width="38" height="14" style="flex:none"><line x1="2" y1="7" x2="28" y2="7" stroke="{color}" stroke-width="{width}"{d} stroke-linecap="{cap}"/>'
                f'<path d="M26,2 L36,7 L26,12 L28.5,7 Z" fill="{color}"/></svg>')
    left = [
        (line("#1A73E8"), "User request · HTTPS"),
        (line("#9334E6"), "AI inference"),
        (line("#E37400"), "Data persistence (both ways)"),
        (line("#D93025", "9 6", 2.6), "Security events &amp; alerts"),
        (line("#5F6368", "", 2.6), "Build &amp; deploy"),
        (line("#80868B", "1 7", 2.6, "round"), "Optional egress (allowlisted)"),
        (line("#188038", "8 6", 2.6), "Model supply / evaluation / improvement"),
    ]
    right = [
        ('<span class="sw" style="border:1.5px solid #9AA0A6"></span>', "Deployed component (as-built) · <span class=\"live\" style=\"margin:0\">Active</span>"),
        ('<span class="sw" style="border:2px dashed #1A73E8"></span>', "AI Protection Stack control · ISO 42001 phase colour"),
        ('<span class="sw" style="border:none;background:#E8F0FE"></span>', "<span style=\"color:#1A73E8\"><b>■</b></span> Phase 3 · <span style=\"color:#188038\"><b>■</b></span> Phase 4 · <span style=\"color:#E8710A\"><b>■</b></span> Phase 5"),
        ('<span class="bd ow" style="width:46px;justify-content:center">C04.3</span>', "OWASP AISVS v1.0 control"),
        ('<span class="bd iso" style="width:46px;justify-content:center">A.6.2.6</span>', "ISO/IEC 42001:2023 clause / Annex A"),
        ('<span class="step" style="position:static;width:22px;height:22px;font-size:12px;line-height:22px;box-shadow:none;margin:0 12px 0 8px">1</span>', "Audit request lifecycle step"),
        ('<span class="sw" style="border:2px dashed #BDC1C6"></span>', "Outside the Google Cloud project"),
    ]
    rows_l = "".join(f'<div class="r">{s}<span>{t}</span></div>' for s, t in left)
    rows_r = "".join(f'<div class="r">{s}<span>{t}</span></div>' for s, t in right)
    out = zone("legend", 3125, 1405, 675, 195, "z-legend", "Legend")
    out += f'<div class="lg" style="left:3143px;top:1446px;width:640px"><div>{rows_l}</div><div>{rows_r}</div></div>'
    return out


def cicd() -> str:
    out = zone("cd-zone", 40, 1630, 2310, 490, "z-cicd", "CI/CD &amp; software supply chain",
               "<code>deploy_cloud_run.sh</code> · idempotent · Argolis-ready (<code>scripts/argolis/bootstrap.sh</code>, <code>preflight.sh</code>)")
    out += '<div class="subbound" style="left:806px;top:1686px;width:1524px;height:278px"></div>'
    out += ('<div class="gcp-label" style="left:1964px;top:1672px;height:28px;font-size:14px">'
            f'{G("project", 20)}<b>Google Cloud</b><code>computeengine-506321</code></div>')
    steps = [
        (LB("laptop", "#3C4043", "#F1F3F4", 34, 20), "Developer workstation",
         "TypeScript · <code>npm run lint</code> (<code>tsc --noEmit</code>) · rules &amp; OWASP test suites · <code>git push</code>"),
        (LB("github", "#3C4043", "#F1F3F4", 34, 20), "GitHub repository",
         "<code>fjhuerta-67/AegisAI</code> · branch <code>main</code> · SSH deploy key · reviewed commits"),
        (LB("terminal", "#3C4043", "#F1F3F4", 34, 20), "<code>deploy_cloud_run.sh</code>",
         "Pre-checks: Firebase config ↔ project · rules ↔ <code>ALLOWED_DOMAINS</code> · runtime SA &amp; secret exist"),
        (G("cloud_build", 34), "Cloud Build",
         "<code>cloudbuild.yaml</code> as <code>aegis-build-sa</code> · Docker multi-stage: <code>npm ci</code> → <code>tsc</code> → Vite + esbuild → prod deps"),
        (G("artifact_registry", 34), "Artifact Registry",
         "<code>us-central1-docker.pkg.dev/…/cloud-run-source-deploy/aegis-ai:&lt;UTC-tag&gt;</code> · immutable timestamp tags"),
        (G("firestore", 34), "Firebase Rules API",
         "Publishes <code>firestore.rules</code> to <code>aegis-ai-db</code> (new ruleset + release)"),
        (G("cloud_run", 34), "Cloud Run deploy",
         "<code>gcloud run deploy</code> · new revision · env vars, secret ref, IAP flags · 100 % traffic"),
        (G("identity-aware_proxy", 34), "Access configuration",
         "IAP domain bindings · prune legacy invokers · Firebase Auth authorized domains (Identity Toolkit API)"),
        (LB("badge-check", "#137333", "#E6F4EA", 34, 20), "Smoke test",
         "Anonymous <code>GET /api/health</code> must be stopped by IAP (302 / 401 / 403)"),
    ]
    for i, (ic, t, d) in enumerate(steps, 1):
        x = 56 + (i - 1) * 254
        out += (f'<div id="cd{i}" class="cd" style="left:{x}px;top:1700px;width:228px;height:252px">'
                f'<span class="num">{i:02d}</span><div class="top">{ic}<div class="t">{t}</div></div><div class="d">{d}</div></div>')
    gates = [
        ("check", "<b>Strict type check</b> · <code>tsc --noEmit</code> fails the image build"),
        ("test-tube-diagonal", "<b>Firestore rules tests</b> · <code>@firebase/rules-unit-testing</code>"),
        ("shield-check", "<b>OWASP AI security suite</b> · <code>npm run test:security</code>"),
        ("list-checks", "<b>Integration verification</b> · <code>npm run test:integration</code>"),
        ("bot", "<b>LLM provider tests</b> · <code>npm run test:llm</code>"),
        ("scan-search", "<b>Live Scanner tests</b> · <code>npm run test:gcp</code>"),
        ("fingerprint", "<b>SHA-256 normative manifest</b> (C01.4) re-generated on change"),
        ("languages", "<b>Bilingual manuals &amp; decks</b> (EN / ES) generated from scripts"),
    ]
    out += ('<div class="sect" style="position:absolute;left:58px;top:1978px;margin:0">Quality gates &amp; assurance</div>'
            '<div class="gates" style="left:56px;top:2000px;width:2278px">'
            + "".join(f'<div class="gate">{L(i, 18, "#137333")}<span>{t}</span></div>' for i, t in gates) + "</div>")
    return out


def iso_strip() -> str:
    out = zone("iso-zone", 2400, 1630, 1400, 490, "z-iso", "ISO/IEC 42001 AI lifecycle", "Google Cloud AI Protection Stack mapped to phases 3 – 5")
    phases = [
        ("iso-p3", 2416, P3, "PHASE 3", "Development &amp; protections", "AI system design &amp; development", [
            (LB("map", P3[0], P3[1], 30, 17), "Evidence-based gap map " + live(), "Visual current-vs-target map with L1 / L2 / L3 levels (AegisAI engine)"),
            (G("ai_platform", 30), "Model Garden / Model Registry", "Signed &amp; verified model supply chain — no backdoored internet models"),
            (G("security", 30), "Model Armor", "Inline input / output sanitization · blocks prompt injection &amp; jailbreaks · filters toxic content"),
            (LB("file-text", P3[0], P3[1], 30, 17), "Remediated architecture " + live(), "Target-state design document with the missing controls, generated per audit"),
        ], [("iso", "A.6.1.2"), ("iso", "A.7.3"), ("iso", "A.6.2.6"), ("ow", "C01.4"), ("ow", "C13.1"), ("ow", "C02.10"), ("ow", "C07.1")]),
        ("iso-p4", 2874, P4, "PHASE 4", "Evaluation", "Review of applied controls", [
            (LB("badge-check", P4[0], P4[1], 30, 17), "Vertex AI Evaluation Service", "AutoSxS autorater + safety metrics: hate speech, harassment, sexually explicit, dangerous"),
            (LB("file-check", P4[0], P4[1], 30, 17), "Evaluation audit trail", "Reproducible evidence for certification · quality gate before promotion"),
            (LB("gauge", P4[0], P4[1], 30, 17), "AIMS telemetry " + live(), "Citation grounding (SLO ≥ 95 %), determinism, latency and token metrics"),
            (LB("list-checks", P4[0], P4[1], 30, 17), "AegisAI control audits " + live(), "Chapter-by-chapter verdicts with verbatim evidence (AISVS, ISO 42001, EU AI Act, Mexico)"),
        ], [("iso", "Cl. 9.1"), ("iso", "A.6.2.4"), ("ow", "C08.4")]),
        ("iso-p5", 3332, P5, "PHASE 5", "Deployment", "Controlled production deployment", [
            (LB("activity", P5[0], P5[1], 30, 17), "Vertex AI Model Monitoring", "Training-serving skew &amp; drift · immediate alerts when safety degrades"),
            (G("security_command_center", 30), "SCC · AI Protection", "Real-time threat &amp; vulnerability detection · prompt-injection attempts become SOC alerts"),
            (LB("siren", P5[0], P5[1], 30, 17), "AegisAI security events " + live(), "8 event types → Cloud Logging, <code>security_alerts</code> and SIEM webhook"),
            (LB("rocket", P5[0], P5[1], 30, 17), "Controlled releases " + live(), "Immutable image tags · new Cloud Run revision per deploy · IAP smoke test"),
        ], [("iso", "Cl. 9.1"), ("iso", "A.6.2.6"), ("iso", "A.6.2.8"), ("iso", "Cl. 10.1"), ("ow", "C08.4"), ("ow", "C12.2")]),
    ]
    for pid, x, (pc, pt), k, n, s, items, chips in phases:
        its = "".join(f'<div class="it">{ic}<div><div class="t">{t}</div><div class="d">{d}</div></div></div>' for ic, t, d in items)
        out += (f'<div id="{pid}" class="phase" style="left:{x}px;top:1684px;width:444px;height:392px;--pc:{pc};--pt:{pt}">'
                f'<div class="ph"><div class="k">{k}</div><div class="n">{n}</div><div class="s">{s}</div></div>'
                f'<div class="items">{its}</div><div class="cl">{bd(*chips)}</div></div>')
    return out


def boundary() -> str:
    return ('<div class="gcp-boundary" style="left:506px;top:150px;width:2589px;height:1462px"></div>'
            f'<div class="gcp-label" style="left:528px;top:135px">{G("project", 22)}<b>Google Cloud</b>'
            'project <code>computeengine-506321</code> · Argolis · <code>us-central1</code></div>')


def footer() -> str:
    return ('<div class="foot"><span>Derived from <code>server.ts</code> · <code>deploy_cloud_run.sh</code> · <code>cloudbuild.yaml</code> · '
            '<code>Dockerfile</code> · <code>firestore.rules</code> · <code>scripts/argolis/*</code> (main @ c6af106). '
            'Dashed AI Protection Stack controls are enabled per environment and verified by the Live Scanner.</span>'
            '<span>Icons: Google Cloud official product icons · Lucide (ISC). '
            'Generated by <code>scripts/architecture_diagram/generate_architecture_diagram.py</code></span></div>')


def build_html() -> str:
    body = (header() + boundary() + clients() + edge() + cloud_run() + ai_platform() + external()
            + row2() + cicd() + iso_strip() + footer())
    return ("<!DOCTYPE html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">"
            "<title>AegisAI Enterprise · Google Cloud Architecture</title>"
            f"<style>{CSS}</style></head><body><div id=\"canvas\">{body}"
            "<svg id=\"wires\" xmlns=\"http://www.w3.org/2000/svg\"></svg><pre id=\"qa\"></pre></div>"
            f"<script>window.WIRES = {json.dumps(wires())};</script><script>{JS}</script></body></html>\n")


# --------------------------------------------------------------------------------------
# Rendering
# --------------------------------------------------------------------------------------

def find_chrome() -> str | None:
    for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
        path = shutil.which(name)
        if path:
            return path
    return None


def chrome(args: list[str], profile: str) -> subprocess.CompletedProcess:
    exe = find_chrome()
    if not exe:
        sys.exit("Google Chrome / Chromium not found (needed for PNG / PDF rendering).")
    base = [exe, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
            "--disable-extensions", "--mute-audio", f"--user-data-dir={profile}", "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=4000"]
    return subprocess.run(base + args, capture_output=True, text=True, timeout=300)


def render(html_path: Path, out_dir: Path, debug: bool) -> None:
    url = html_path.resolve().as_uri() + ("#debug" if debug else "")
    with tempfile.TemporaryDirectory(prefix="aegis-diagram-chrome-") as profile:
        dom = chrome([f"--window-size={W},{H}", "--dump-dom", url], profile).stdout
        m = re.search(r'<pre id="qa">(.*?)</pre>', dom, re.S)
        issues = json.loads(m.group(1)) if m and m.group(1).strip() else None
        if issues is None:
            print("! QA report not found (connectors may have failed to render)")
        elif issues:
            print(f"! {len(issues)} element(s) overflow their boxes:")
            for i in issues:
                print("   -", i)
        else:
            print("✓ Layout QA: no overflowing elements")
        for scale, suffix in ((2, "8K"), (1, "4K")):
            png = out_dir / f"{BASENAME}_{suffix}.png"
            chrome([f"--window-size={W},{H}", f"--force-device-scale-factor={scale}", f"--screenshot={png}", url], profile)
            print(("✓ " if png.exists() else "✗ ") + str(png.relative_to(REPO)))
        pdf = out_dir / f"{BASENAME}.pdf"
        chrome([f"--window-size={W},{H}", "--no-pdf-header-footer", "--print-to-pdf-no-header", f"--print-to-pdf={pdf}", url], profile)
        print(("✓ " if pdf.exists() else "✗ ") + str(pdf.relative_to(REPO)))
    if pdf.exists() and shutil.which("pdftocairo"):
        svg = out_dir / f"{BASENAME}.svg"
        subprocess.run(["pdftocairo", "-svg", str(pdf), str(svg)], check=False)
        print(("✓ " if svg.exists() else "✗ ") + str(svg.relative_to(REPO)))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default=str(REPO / "docs" / "architecture"), help="output directory")
    ap.add_argument("--no-render", action="store_true", help="only write the HTML source")
    ap.add_argument("--debug", action="store_true", help="outline overflowing elements in the renders")
    args = ap.parse_args()
    out_dir = Path(args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    html_path = out_dir / f"{BASENAME}.html"
    html_path.write_text(build_html(), encoding="utf-8")
    print("✓ " + str(html_path.relative_to(REPO)) if html_path.is_relative_to(REPO) else str(html_path))
    if not args.no_render:
        render(html_path, out_dir, args.debug)


if __name__ == "__main__":
    main()
