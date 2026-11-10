#!/usr/bin/env python3
"""Genera el póster arquitectónico en español de Diccionarios de Datos, Flujos de Información y Repositorios de AegisAI.

Construye un documento HTML autocontenido (3840x2160 4K) y lo renderiza con Google Chrome headless y pdftocairo:
  docs/architecture/AegisAI_Diccionario_Flujos_Repositorios.html      fuente editable autocontenida
  docs/architecture/AegisAI_Diccionario_Flujos_Repositorios.png       imagen PNG alta resolución (3840x2160)
  docs/architecture/AegisAI_Diccionario_Flujos_Repositorios_4K.png    imagen PNG 4K (3840x2160)
  docs/architecture/AegisAI_Diccionario_Flujos_Repositorios_8K.png    imagen PNG 8K (7680x4320)
  docs/architecture/AegisAI_Diccionario_Flujos_Repositorios.pdf       documento PDF vectorial
  docs/architecture/AegisAI_Diccionario_Flujos_Repositorios.svg       gráfico vectorial SVG
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
BASENAME = "AegisAI_Diccionario_Flujos_Repositorios"


# --------------------------------------------------------------------------------------
# Helpers HTML e Iconografía
# --------------------------------------------------------------------------------------

def G(name: str, size: int = 34) -> str:
    """Icono oficial de Google Cloud embebido en base64."""
    data = base64.b64encode((ICONS_GCP / f"{name}.svg").read_bytes()).decode()
    return f'<img class="ic" style="width:{size}px;height:{size}px" src="data:image/svg+xml;base64,{data}" alt="">'


def L(name: str, size: int = 20, color: str = "#1A73E8", stroke: float = 2.0) -> str:
    """Icono vectorial Lucide inline."""
    svg = (ICONS_LUCIDE / f"{name}.svg").read_text()
    svg = svg[svg.index("<svg"):].strip()
    svg = svg.replace('width="24" height="24"', f'width="{size}" height="{size}"', 1)
    svg = svg.replace('stroke-width="2"', f'stroke-width="{stroke}"', 1)
    return svg.replace("<svg ", f'<svg style="color:{color};flex:none" ', 1)


def LB(name: str, color: str, bg: str, box: int = 34, size: int = 20) -> str:
    """Icono Lucide dentro de contenedor cuadrado redondeado."""
    return (f'<span class="lic" style="width:{box}px;height:{box}px;background:{bg}">'
            f'{L(name, size, color)}</span>')


def pill(text: str, cls: str = "p-blue") -> str:
    return f'<span class="pill {cls}">{text}</span>'


def hdr(icon: str, title: str, sub: str = "", right_badge: str = "") -> str:
    sub_html = f'<div class="cs">{sub}</div>' if sub else ""
    return f'<div class="ch">{icon}<div class="cht"><div class="ct">{title}</div>{sub_html}</div>{right_badge}</div>'


def box(el_id: str, x: int, y: int, w: int, h: int, inner: str, cls: str = "card", extra: str = "") -> str:
    return (f'<div id="{el_id}" class="{cls}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;{extra}">'
            f"{inner}</div>")


def zone(el_id: str, x: int, y: int, w: int, h: int, cls: str, title: str, sub: str = "", icon: str = "") -> str:
    sub_html = f'<span class="zs">{sub}</span>' if sub else ""
    return (f'<div id="{el_id}" class="zone {cls}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
            f'<div class="zh">{icon}<span>{title}</span>{sub_html}</div></div>')


def schema_table(headers: list[str], rows: list[tuple[str, ...]], compact: bool = False) -> str:
    cls = "t sm" if compact else "t"
    th = "".join(f"<th>{h}</th>" for h in headers)
    trs = []
    for r in rows:
        tds = "".join(f"<td>{c}</td>" for c in r)
        trs.append(f"<tr>{tds}</tr>")
    return f'<table class="{cls}"><thead><tr>{th}</tr></thead><tbody>{"".join(trs)}</tbody></table>'


# --------------------------------------------------------------------------------------
# Hoja de Estilos CSS (Diseño Editorial de Alta Densidad 4K)
# --------------------------------------------------------------------------------------

CSS = r"""
@page { size: 3840px 2160px; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 3840px; height: 2160px; overflow: hidden; }
body {
  background: #F4F6F9;
  font-family: Roboto, "Noto Sans", "Segoe UI", Arial, sans-serif;
  color: #202124;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  -webkit-font-smoothing: antialiased;
}
#canvas { position: relative; width: 3840px; height: 2160px; overflow: hidden; }

/* ---------- Barra Superior y Encabezado ---------- */
.gbar { position: absolute; left: 0; top: 0; width: 3840px; height: 8px; display: flex; }
.gbar i { flex: 1; }
.hdr {
  position: absolute; left: 0; top: 8px; width: 3840px; height: 120px;
  background: #FFFFFF; border-bottom: 1.5px solid #DADCE0;
  box-shadow: 0 2px 8px rgba(60,64,67,.06);
}
.logo {
  position: absolute; left: 40px; top: 18px; width: 82px; height: 82px; border-radius: 20px;
  background: linear-gradient(135deg, #1A73E8 0%, #174EA6 60%, #0D2E63 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(26,115,232,.32);
}
.title {
  position: absolute; left: 144px; top: 16px;
  font: 700 40px/1.12 Roboto, sans-serif; letter-spacing: -.01em; color: #202124; white-space: nowrap;
}
.title .ai { color: #1A73E8; }
.title .sep { color: #9AA0A6; font-weight: 300; margin: 0 8px; }
.title .subt { color: #174EA6; font-weight: 600; }
.subtitle {
  position: absolute; left: 146px; top: 70px;
  font: 400 18.5px/1.3 Roboto, sans-serif; color: #5F6368; white-space: nowrap;
}
.chips {
  position: absolute; right: 40px; top: 15px; width: 1380px;
  display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px 10px;
}
.chip {
  display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 14px;
  border: 1px solid #DADCE0; border-radius: 19px; background: #F8F9FA;
  font: 500 14.5px/1 Roboto, sans-serif; color: #3C4043; white-space: nowrap;
}
.chip b { font: 700 11px/1 Roboto, sans-serif; color: #5F6368; letter-spacing: .07em; text-transform: uppercase; }
.chip code { font-size: 14px; background: none; padding: 0; color: #174EA6; font-weight: 700; }

/* ---------- Zonas Principales ---------- */
.zone { position: absolute; border-radius: 18px; border: 2px solid #DADCE0; }
.zh {
  position: absolute; left: 18px; top: 11px; right: 18px; height: 28px;
  display: flex; align-items: center; gap: 10px;
  font: 700 16.5px/1 Roboto, sans-serif; letter-spacing: .07em; text-transform: uppercase; white-space: nowrap;
}
.zh .zs {
  font: 500 13.5px/1 Roboto, sans-serif; letter-spacing: 0; text-transform: none; color: #5F6368;
  margin-left: 8px; padding-left: 10px; border-left: 1.5px solid #BDC1C6;
}
.z-flows { background: linear-gradient(180deg, #EDF3FE 0%, #F5F8FF 100%); border-color: #8AB4F8; }
.z-flows .zh { color: #174EA6; }
.z-dicts { background: #FFFFFF; border-color: #BDC1C6; }
.z-dicts .zh { color: #1E3A8A; }
.z-repos { background: linear-gradient(180deg, #FFF9EB 0%, #FFFDF7 100%); border-color: #FCD34D; }
.z-repos .zh { color: #92400E; }

/* ---------- Tarjetas de Flujo de Información (Fila Superior) ---------- */
.fcard {
  position: absolute; background: #FFFFFF; border: 1.5px solid #AECBFA; border-radius: 12px;
  padding: 10px 12px; z-index: 12; overflow: hidden;
  box-shadow: 0 2px 5px rgba(26,115,232,.08);
}
.fcard.ai { border-color: #D7AEFB; background: #FDFAFF; }
.fcard.repo { border-color: #FCD34D; background: #FFFDF9; }
.fcard.sec { border-color: #F6AEA9; background: #FFFBFB; }
.fcard .fhead { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid #E8EAED; }
.fcard .fnum {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 3px 7px; border-radius: 6px; background: #1A73E8; color: #fff;
  font: 700 11.5px/1 Roboto, sans-serif; letter-spacing: .04em; flex: none;
}
.fcard.ai .fnum { background: #8430CE; }
.fcard.repo .fnum { background: #D97706; }
.fcard.sec .fnum { background: #C5221F; }
.fcard .ftitle { font: 700 14.5px/1.18 Roboto, sans-serif; color: #202124; }
.fcard .fmeta { font: 500 11px/1.2 Roboto, sans-serif; color: #5F6368; margin-bottom: 5px; }
.fcard ul.fl { list-style: none; font: 400 11.8px/1.33 Roboto, sans-serif; color: #3C4043; }
.fcard ul.fl li { position: relative; padding-left: 11px; margin: 2px 0; }
.fcard ul.fl li::before {
  content: ""; position: absolute; left: 0; top: .52em; width: 5px; height: 5px;
  border-radius: 50%; background: #1A73E8;
}
.fcard.ai ul.fl li::before { background: #8430CE; }
.fcard.repo ul.fl li::before { background: #D97706; }
.fcard.sec ul.fl li::before { background: #C5221F; }
.fcard .ffoot {
  position: absolute; left: 12px; right: 12px; bottom: 8px;
  padding-top: 4px; border-top: 1px dashed #DADCE0;
  display: flex; align-items: center; justify-content: space-between;
  font: 600 10.5px/1 Roboto, sans-serif; color: #174EA6;
}

/* ---------- Tarjetas de Diccionario de Datos y Repositorios ---------- */
.card {
  position: absolute; background: #FFFFFF; border: 1.5px solid #DADCE0; border-radius: 12px;
  z-index: 10; box-shadow: 0 1px 3px rgba(60,64,67,.09), 0 2px 6px rgba(60,64,67,.05);
  padding: 10px 13px 9px; overflow: hidden;
}
.card.dict-primary { border-top: 4px solid #1A73E8; }
.card.dict-sub { border-top: 4px solid #0284C7; }
.card.dict-cat { border-top: 4px solid #0D9488; }
.card.dict-byof { border-top: 4px solid #7C3AED; }
.card.dict-api { border-top: 4px solid #D97706; }
.card.dict-cfg { border-top: 4px solid #4F46E5; }
.card.dict-gcp { border-top: 4px solid #059669; }
.card.dict-sec { border-top: 4px solid #DC2626; }
.card.dict-ram { border-top: 4px solid #9333EA; }

.card.repo-fs { border-top: 4px solid #EA580C; background: #FFFFFF; }
.card.repo-ro { border-top: 4px solid #2563EB; background: #FFFFFF; }
.card.repo-tmp { border-top: 4px solid #7C3AED; background: #FFFFFF; }
.card.repo-cat { border-top: 4px solid #0D9488; background: #FFFFFF; }
.card.repo-mem { border-top: 4px solid #DC2626; background: #FFFFFF; }
.card.repo-gov { border-top: 4px solid #1E293B; background: #FFFFFF; }

.ch { display: flex; align-items: center; gap: 9px; margin-bottom: 4px; }
.cht { min-width: 0; flex: 1; }
.ch .ic { flex: none; }
.lic { display: inline-flex; align-items: center; justify-content: center; border-radius: 9px; flex: none; }
.ct { font: 700 15.5px/1.15 Roboto, sans-serif; color: #202124; white-space: nowrap; }
.cs { font: 500 11.2px/1.2 Roboto, sans-serif; color: #5F6368; margin-top: 2px; white-space: nowrap; }

/* ---------- Píldoras y Etiquetas Semánticas ---------- */
.pill {
  display: inline-flex; align-items: center; gap: 4px; flex: none;
  font: 700 10px/1 Roboto, sans-serif; letter-spacing: .04em; text-transform: uppercase;
  padding: 3px 7px; border-radius: 6px; white-space: nowrap;
}
.p-blue { background: #E8F0FE; color: #1967D2; }
.p-green { background: #E6F4EA; color: #137333; }
.p-amber { background: #FEF3C7; color: #B45309; }
.p-red { background: #FCE8E6; color: #C5221F; }
.p-purple { background: #F3E8FD; color: #7627BB; }
.p-teal { background: #CCFBF1; color: #0F766E; }
.p-slate { background: #F1F3F4; color: #3C4043; }

.tag {
  display: inline-block; font: 700 9.2px/1 Roboto, sans-serif; padding: 2px 5px;
  border-radius: 4px; text-transform: uppercase; letter-spacing: .03em; white-space: nowrap;
}
.t-pk { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
.t-fk { background: #E0E7FF; color: #3730A3; border: 1px solid #C7D2FE; }
.t-pii { background: #FCE8E6; color: #C5221F; border: 1px solid #FAD2CF; }
.t-sec { background: #F3E8FD; color: #6B21A8; border: 1px solid #E9D5FF; }
.t-worm { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
.t-req { background: #E8F0FE; color: #1967D2; }
.t-opt { background: #F1F3F4; color: #5F6368; }

/* ---------- Tablas de Diccionario de Datos y Repositorios ---------- */
table.t {
  width: 100%; border-collapse: separate; border-spacing: 0;
  font: 400 11.2px/1.22 Roboto, sans-serif; color: #3C4043;
}
table.t.sm { font: 400 10.1px/1.15 Roboto, sans-serif; }
table.t th {
  text-align: left; font: 700 9.5px/1.1 Roboto, sans-serif; letter-spacing: .05em;
  text-transform: uppercase; color: #475569; padding: 3.5px 5px;
  background: #F8FAFC; border-bottom: 1.5px solid #CBD5E1; white-space: nowrap;
}
table.t td {
  padding: 3.1px 5px; border-bottom: 1px solid #EEF2F6; vertical-align: top;
  word-break: normal; overflow-wrap: break-word;
}
table.t.sm td { padding: 2.0px 4px; }
table.t tr:last-child td { border-bottom: none; }
table.t td:first-child { font-weight: 600; color: #1E293B; }
table.t td:nth-child(4) { white-space: nowrap; }

code {
  font-family: "Noto Sans Mono", "DejaVu Sans Mono", monospace;
  font-size: .88em; background: #F1F5F9; border-radius: 4px; padding: 1px 3px; color: #0F172A;
  word-break: normal; overflow-wrap: break-word;
}
code.k { color: #0369A1; background: #E0F2FE; font-weight: 700; }
code.tp { color: #6D28D9; background: #F3E8FF; font-weight: 600; }
code.pa { color: #B45309; background: #FEF3C7; font-weight: 600; }

.subhdr {
  font: 700 10.5px/1 Roboto, sans-serif; letter-spacing: .06em; text-transform: uppercase;
  color: #1E40AF; background: #EFF6FF; padding: 4px 8px; border-radius: 5px;
  margin: 5px 0 3px; display: flex; align-items: center; justify-content: space-between;
}
.subhdr span { font-weight: 500; text-transform: none; letter-spacing: 0; color: #475569; }

.note-bar {
  margin-top: 5px; padding: 4px 8px; background: #F8FAFC; border: 1px dashed #CBD5E1;
  border-radius: 6px; font: 500 10.8px/1.25 Roboto, sans-serif; color: #475569;
}
.note-bar b { color: #1E293B; }

/* ---------- Matriz de Gobernanza y Leyenda ---------- */
.gov-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 12px; margin-top: 4px; }
.gov-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 7px 10px; }
.gov-box .gt { font: 700 11.5px/1.2 Roboto, sans-serif; color: #0F172A; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 5px; }
.lg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
.lg-row { display: flex; align-items: center; gap: 7px; font: 400 11.2px/1.2 Roboto, sans-serif; color: #334155; height: 19px; white-space: nowrap; }

/* ---------- Pie de Página ---------- */
.foot {
  position: absolute; left: 40px; right: 40px; top: 2124px;
  display: flex; justify-content: space-between;
  font: 400 12.5px/1.3 Roboto, sans-serif; color: #64748B;
}
.foot code { background: none; color: #334155; font-weight: 600; }

/* ---------- Capa SVG de Conectores ---------- */
#wires { position: absolute; left: 0; top: 0; width: 3840px; height: 2160px; z-index: 30; overflow: visible; pointer-events: none; }
#qa { display: none; }
"""


# --------------------------------------------------------------------------------------
# Enrutador de Conectores SVG y Verificador QA en el Navegador
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
    flow:   { c: '#1A73E8', w: 2.8 },
    ai:     { c: '#8430CE', w: 2.8 },
    repo:   { c: '#D97706', w: 2.8 },
    sec:    { c: '#C5221F', w: 2.5, dash: '8 5' },
    sync:   { c: '#0D9488', w: 2.5, dash: '6 4' },
    schema: { c: '#4F46E5', w: 2.2, dash: '4 4' }
  };
  const markers = {};
  function marker(color) {
    if (markers[color]) return markers[color];
    const id = 'mk' + Object.keys(markers).length;
    const m = document.createElementNS(NS, 'marker');
    m.setAttribute('id', id); m.setAttribute('viewBox', '0 0 12 12'); m.setAttribute('refX', '10.2'); m.setAttribute('refY', '6');
    m.setAttribute('markerWidth', '11'); m.setAttribute('markerHeight', '11'); m.setAttribute('markerUnits', 'userSpaceOnUse');
    m.setAttribute('orient', 'auto-start-reverse');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M0.5,1.2 L11.2,6 L0.5,10.8 L3,6 Z'); p.setAttribute('fill', color);
    m.appendChild(p); defs.appendChild(m); markers[color] = id; return id;
  }
  function rect(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error('connector target missing: ' + id);
    const r = el.getBoundingClientRect();
    return { l: r.left - CR.left, t: r.top - CR.top, r: r.right - CR.left, b: r.bottom - CR.top, w: r.width, h: r.height };
  }
  function anchor(id, side, at) {
    const R = rect(id);
    if (side === 'l' || side === 'r') return [side === 'l' ? R.l : R.r, at <= 1 ? R.t + at * R.h : at];
    return [at <= 1 ? R.l + at * R.w : at, side === 't' ? R.t : R.b];
  }
  function route(c) {
    const p0 = anchor(c.frm, c.fs, c.fa === undefined ? 0.5 : c.fa);
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
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('font-family', 'Roboto, Arial, sans-serif');
    t.setAttribute('font-size', '11');
    t.setAttribute('font-weight', '600');
    t.setAttribute('fill', '#1E293B');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('x', x);
    t.setAttribute('y', y + 4);
    t.textContent = text;
    g.appendChild(t); svg.appendChild(g);
    const bb = t.getBBox();
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', bb.x - 6); r.setAttribute('y', bb.y - 2);
    r.setAttribute('width', bb.width + 12); r.setAttribute('height', bb.height + 4);
    r.setAttribute('rx', 5); r.setAttribute('fill', '#FFFFFF');
    r.setAttribute('stroke', color); r.setAttribute('stroke-width', '1.2');
    g.insertBefore(r, t);
  }
  const later = [];
  (window.WIRES || []).forEach(c => {
    const st = STY[c.k];
    const pts = route(c);
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', pathD(pts, 10)); p.setAttribute('fill', 'none'); p.setAttribute('stroke', st.c);
    p.setAttribute('stroke-width', st.w); p.setAttribute('stroke-linejoin', 'round');
    if (st.dash) p.setAttribute('stroke-dasharray', st.dash);
    if (c.end !== false) p.setAttribute('marker-end', 'url(#' + marker(st.c) + ')');
    if (c.both) p.setAttribute('marker-start', 'url(#' + marker(st.c) + ')');
    svg.appendChild(p);
    if (c.label) {
      let pos = c.lp;
      if (!pos) {
        const len = p.getTotalLength();
        const q = p.getPointAtLength(len * (c.lt === undefined ? .5 : c.lt));
        pos = [q.x, q.y];
      }
      later.push(() => label(c.label, pos[0], pos[1], st.c));
    }
  });
  later.forEach(f => f());

  // QA: verificar que ningún contenedor tenga desbordamiento de texto
  const issues = [];
  document.querySelectorAll('.card, .fcard, .zone .zh, .chip, .gov-box').forEach(el => {
    if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
      issues.push((el.id || el.className) + ' :: ' + el.scrollWidth + 'x' + el.scrollHeight + ' > ' + el.clientWidth + 'x' + el.clientHeight);
      if (location.hash === '#debug') el.style.outline = '4px solid #ff00aa';
    }
  });
  document.getElementById('qa').textContent = JSON.stringify(issues);
})();
"""


# --------------------------------------------------------------------------------------
# Construcción de Secciones del Póster
# --------------------------------------------------------------------------------------

def build_header() -> str:
    gbar = ('<div class="gbar"><i style="background:#4285F4"></i><i style="background:#EA4335"></i>'
            '<i style="background:#FBBC05"></i><i style="background:#34A853"></i></div>')
    shield = L("shield-check", 48, "#FFFFFF", 2.0)
    chips = [
        (L("database", 17, "#1A73E8"), "DICCIONARIOS / MODELOS", "<code>15 Esquemas</code> · 120 Campos"),
        (G("firestore", 20), "CLOUD FIRESTORE", "<code>aegis-ai-db</code> · 8 Colecciones (nam5)"),
        (L("layers", 17, "#D97706"), "REPOSITORIOS", "<code>20 Almacenes</code> en 5 Capas"),
        (L("workflow", 17, "#8430CE"), "FLUJOS DE INFORMACIÓN", "<code>10 Etapas E2E</code> · SSE + Map-Reduce"),
        (L("fingerprint", 17, "#137333"), "INTEGRIDAD &amp; AUDITORÍA", "<code>SHA-256 (C01.4)</code> + WORM Inmutable"),
        (L("lock", 17, "#C5221F"), "GOBERNANZA PII &amp; RBAC", "<code>TLS 1.3 · AES-256</code> · Multi-Tenant"),
    ]
    chip_html = "".join(f'<div class="chip">{ic}<b>{k}</b><span>{v}</span></div>' for ic, k, v in chips)
    return (
        gbar
        + '<header class="hdr">'
        + f'<div class="logo">{shield}</div>'
        + '<div class="title">Aegis<span class="ai">AI</span> Enterprise<span class="sep">·</span>'
        + '<span class="subt">Diccionarios de Datos, Flujos de Información y Repositorios</span></div>'
        + '<div class="subtitle">Arquitectura de Datos As-Built · Esquemas Tipados (TypeScript / Firestore Rules) · '
        + 'Orquestación Map-Reduce Multi-Normativa · Persistencia Dual Resiliente (Cloud Firestore + Local FS + tmpfs + RAM)</div>'
        + f'<div class="chips">{chip_html}</div>'
        + '</header>'
    )


def build_flows_section() -> str:
    out = zone(
        "z-flows", 40, 144, 3760, 314, "z-flows",
        "1 · Flujos de Información End-to-End (Ingesta Multimodal, Validación Zero-Trust, Evaluación Map-Reduce, Persistencia Dual y Streaming SSE)",
        "10 etapas secuenciales y reactivas que transforman evidencia arquitectónica y telemetría GCP en dictámenes inmutables",
        L("workflow", 22, "#174EA6")
    )

    flows = [
        ("f1", "", "F-01", "Ingesta Multimodal", "React 19 SPA / API v1 → Express", [
            "<code>POST /api/evaluate</code> y <code>/api/v1/audits</code>",
            "Payload <code>AuditRequestPayload</code> + Multipart ≤30 MB",
            "Extracción en RAM: <code>pdf-parse</code> (.pdf) y <code>JSZip</code> (.zip, .md, .json, .yaml, código)",
            "Aislamiento en sandbox XML <code>&lt;user_candidate_architecture&gt;</code>",
        ], "Origen: Cliente Web / CI-CD", "DD-1 · RAM"),
        ("f2", "sec", "F-02", "Identidad Zero-Trust", "Cloud IAP + Firebase Auth + API Key", [
            "<code>extractUserSecurityContext(req)</code> valida cabeceras",
            "Verifica JWT Firebase o <code>x-goog-authenticated-user-email</code>",
            "Valida <code>x-api-key</code> (<code>aisvs_*</code>) en <code>/apiKeys</code>",
            "Comparación en tiempo constante SHA-256 (<code>C05.3</code>)",
        ], "Genera: UserSecurityContext", "DD-5 · DD-8"),
        ("f3", "sec", "F-03", "Guardrails y Anti-DoW", "Inspección Crescendo + Cuotas + SSRF", [
            "<code>inspectPromptAndTrackSession()</code> (ventana 15m, score &lt;115)",
            "<code>acquireAntiDoWQuota()</code>: máx 30 req/15m, 3 evals, 2.5M tok",
            "<code>validateOutboundEndpoint()</code> bloquea IMDS <code>169.254.169.254</code>",
            "Sanitización inline con <b>Google Cloud Model Armor</b>",
        ], "Control: C02.10 · C04.3 · C11.1", "DD-9 · RAM"),
        ("f4", "", "F-04", "Escaneo GCP en Vivo", "Zero-Footprint Read-Only Scanner", [
            "<code>POST /api/gcp/scan</code> y <code>/api/gcp/audit</code>",
            "Modos: ADC (Cloud Run SA), OAuth Token o JSON Key en RAM",
            "Inspecciona IAM, GCS, Cloud Run, Vertex AI, KMS, Secrets y Logs",
            "Sintetiza <code>GCPScanTelemetry</code> y manifiesto Markdown",
        ], "Origen: APIs GCP Read-Only", "DD-7 · R-5"),
        ("f5", "repo", "F-05", "Catálogos y BYOF SHA-256", "Verificación Criptográfica e Ingesta", [
            "<code>verifyNormativeSnapshotsIntegrity()</code> valida SHA-256 (<code>C01.4</code>)",
            "Carga catálogos desde <code>/app/config/frameworks</code> y <code>/tmp</code>",
            "<code>POST /api/frameworks/ingest</code> descompone leyes con IA",
            "Filtra marcos por ACL de dominio <code>allowedDomains</code> (<code>C08.1</code>)",
        ], "Lectura: R-1 · R-2 · R-3 · R-4", "DD-3 · DD-4"),
        ("f6", "ai", "F-06", "Motor Map-Reduce IA", "Evaluación Paralela Multi-Normativa", [
            "<b>MAP</b>: Particiona capítulos en 3–4 lotes concurrentes",
            "<code>executeAIWithFallback()</code> → Vertex AI Gemini / OpenRouter / Local",
            "Determinismo estricto: <code>temperature: 0.0</code>, JSON Schema",
            "<b>REDUCE</b>: Calcula <code>overallScore</code>, nivel <code>L1–L3</code> y desglose",
        ], "Motor: Gemini 3.8 / Multi-LLM", "DD-1 · DD-2"),
        ("f7", "ai", "F-07", "Síntesis de Remediación", "Generador de Arquitectura 100%", [
            "<code>generateRemediatedArchitecture()</code> post-evaluación",
            "Integra controles <code>Fallido</code> y <code>Falta Evidencia</code>",
            "Aplica herencia de plataforma <code>PlatformProfile</code> (SaaS/PaaS)",
            "Genera guía 4D (<code>RemediationGuidance</code>) + doc ≤200 KB",
        ], "Salida: remediatedArchitectureDoc", "DD-1 · DD-2"),
        ("f8", "repo", "F-08", "Persistencia Dual + Saga", "Coordinador Transaccional C09.4", [
            "<code>runCompensatingSaga()</code> asegura atomicidad o rollback",
            "Escritura primaria en Firestore <code>/audits</code> y <code>/asyncAudits</code>",
            "Espejo en caché efímero <code>/tmp/aegis-runtime-cache</code>",
            "Inmutabilidad WORM en dictámenes (<code>allow delete: if false</code>)",
        ], "Destino: Firestore nam5 + /tmp", "R-1 · R-3"),
        ("f9", "", "F-09", "Streaming SSE y Reportes", "Canal Reactivo y Exportación Ejecutiva", [
            "Stream <code>text/event-stream</code> con latidos cada 12s",
            "Sincronización en vivo <code>onSnapshot(db, 'audits')</code> en UI",
            "Notificación opcional vía <code>webhookUrl</code> en API asíncrona",
            "Exportación cliente: Dictamen PDF (<code>jsPDF</code>), Plan RACI y <code>.md</code>",
        ], "Destino: Cliente React / Webhook", "DD-1 · UI"),
        ("f10", "sec", "F-10", "Telemetría AIMS y SIEM", "Observabilidad continua y SOC Alerting", [
            "<code>recordAimsEvaluationMetrics()</code> mide citas literales (SLO ≥95%)",
            "<code>emitSecurityAlert()</code> despacha 8 tipos de alertas críticas",
            "Persiste en Firestore <code>/security_alerts</code> y Cloud Logging",
            "Envía hallazgos a <b>SCC AI Protection</b> y <code>SECURITY_ALERT_WEBHOOK_URL</code>",
        ], "Destino: Cloud Logging / SIEM", "DD-8 · DD-9"),
    ]

    for idx, (fid, cls_mod, code_lbl, title, meta, bullets, foot_l, foot_r) in enumerate(flows):
        x = 56 + idx * 373
        w = 358
        lis = "".join(f"<li>{b}</li>" for b in bullets)
        inner = (
            f'<div class="fhead"><span class="fnum">{code_lbl}</span><div class="ftitle">{title}</div></div>'
            f'<div class="fmeta">{meta}</div>'
            f'<ul class="fl">{lis}</ul>'
            f'<div class="ffoot"><span>{foot_l}</span><code>{foot_r}</code></div>'
        )
        out += box(fid, x, 190, w, 250, inner, cls=f"fcard {cls_mod}".strip())

    return out


def build_dictionaries_section() -> str:
    out = zone(
        "z-dicts", 40, 480, 2360, 1632, "z-dicts",
        "2 · Diccionarios de Datos y Esquemas de Entidades (src/types.ts · server.ts · firestore.rules · firebase-blueprint.json)",
        "Definición exhaustiva de atributos, tipos de datos, restricciones de longitud/formato, llaves primarias, clasificación PII y mutabilidad",
        L("database", 22, "#1E3A8A")
    )

    # ---------------- COLUMNA 1 (x=58, w=762) ----------------
    # DD-1: AuditReport
    dd1_rows = [
        ('<code>id</code> <span class="tag t-pk">PK</span>', '<code class="tp">string</code>', '<code>&lt;= 128</code> · Obligatorio', '<span class="tag t-worm">Inmutable</span>', 'Identificador único del dictamen (inmutable en updates).'),
        ('<code>date</code>', '<code class="tp">string</code>', '<code>ISO-8601 &lt;= 100</code> · Oblig.', 'Público Interno', 'Fecha/hora UTC de ejecución de la auditoría.'),
        ('<code>systemName</code>', '<code class="tp">string</code>', '<code>1..500 chars</code> · Oblig.', 'Interno', 'Nombre del sistema o arquitectura de IA auditada.'),
        ('<code>technicalLead</code>', '<code class="tp">string</code>', '<code>&lt;= 200 chars</code> · Opcional', '<span class="tag t-pii">PII Nombre</span>', 'Nombre del líder técnico o arquitecto responsable.'),
        ('<code>email</code>', '<code class="tp">string</code>', '<code>&lt;= 200 chars</code> · Opcional', '<span class="tag t-pii">PII Email</span>', 'Correo electrónico de contacto para seguimiento.'),
        ('<code>description</code>', '<code class="tp">string</code>', '<code>&lt;= 100,000 chars</code> · Oblig.', '<span class="tag t-sec">Confidencial</span>', 'Manifiesto de arquitectura y evidencia técnica consolidada.'),
        ('<code>overallScore</code>', '<code class="tp">number</code>', '<code>0 .. 100</code> · Obligatorio', 'Interno', 'Calificación global ponderada de cumplimiento (%).'),
        ('<code>executiveSummary</code>', '<code class="tp">string</code>', '<code>&lt;= 100,000 chars</code> · Oblig.', 'Confidencial', 'Resumen ejecutivo de brechas y postura de riesgo.'),
        ('<code>chapters</code>', '<code class="tp">AISVSChapter[]</code>', '<code>list &lt;= 500</code> · Oblig.', 'Confidencial', 'Arreglo de capítulos evaluados y controles probados.'),
        ('<code>standard</code> / <code>standards</code>', '<code class="tp">enum / string[]</code>', '<code>AI-SVS | ISO-42001 | FULL | CUSTOM | MULTI</code>', 'Interno', 'Normativa primaria o lista multi-estándar seleccionada.'),
        ('<code>standardsBreakdown</code>', '<code class="tp">Breakdown[]</code>', '<code>list &lt;= 20</code> · Opcional', 'Interno', 'Métricas por estándar: <code>score, passed, failed, missing</code>.'),
        ('<code>customFrameworkId</code>', '<code class="tp">string</code> <span class="tag t-fk">FK</span>', '<code>&lt;= 200 chars</code> · Opcional', 'Interno', 'Referencia al marco personalizado en <code>custom_frameworks</code>.'),
        ('<code>targetLevel</code> / <code>assessedLevel</code>', '<code class="tp">enum</code>', '<code>AUTO | L1 | L2 | L3</code>', 'Interno', 'Nivel de madurez objetivo vs. nivel real alcanzado.'),
        ('<code>techPlatform</code> / <code>deploymentType</code>', '<code class="tp">string / enum</code>', '<code>SaaS | PaaS | Self-Hosted | Hybrid</code>', 'Interno', 'Plataforma base (Vertex AI, Gemini, Bedrock, Azure, On-Prem).'),
        ('<code>remediatedArchitectureDoc</code>', '<code class="tp">string</code>', '<code>&lt;= 200,000 chars</code> · Opc.', '<span class="tag t-sec">Confidencial</span>', 'Documento Markdown de Arquitectura Remediada al 100%.'),
        ('<code>isLiveGcpScan</code> / <code>gcpProjectId</code>', '<code class="tp">bool / string</code>', '<code>&lt;= 200 chars</code> · Opcional', 'Confidencial', 'Bandera e ID de proyecto de escaneo GCP en vivo.'),
        ('<code>gcpTelemetry</code>', '<code class="tp">GCPScanTelemetry</code>', '<code>map</code> · Opcional', 'Confidencial', 'Inventario y hallazgos recolectados en vivo desde GCP.'),
        ('<code>ownerUid</code> / <code>ownerEmail</code> / <code>tenantDomain</code>', '<code class="tp">string</code>', '<code>&lt;= 200 chars</code> · Inmutable', '<span class="tag t-pii">PII / RBAC</span>', 'Propiedad multi-tenant verificada por IAP / Firebase Auth.'),
        ('<code>modelUsed</code> / <code>latencyMs</code> / <code>*Tokens</code>', '<code class="tp">string / number</code>', '<code>0..100,000,000</code> · Opc.', 'Telemetría', 'Modelo LLM utilizado, latencia (ms) y tokens consumidos.'),
    ]
    out += box(
        "dd-audit", 58, 526, 762, 658,
        hdr(G("firestore", 30), "DD-01 · AuditReport", "Colección Firestore: /audits/{auditId} · Entidad Primaria de Dictamen", pill("WORM · 26 Atributos", "p-blue"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd1_rows, compact=True),
        cls="card dict-primary"
    )

    # DD-2: AISVSChapter, PuntoProbado & RemediationGuidance
    dd2_rows = [
        ('<code>chapterId</code> / <code>chapterName</code>', '<code class="tp">string</code>', '<code>1..200 chars</code> · Oblig.', 'Interno', 'ID (ej. <code>C1</code>, <code>ISO-A.6</code>) y título del capítulo evaluado.'),
        ('<code>standardId</code> / <code>remediated</code>', '<code class="tp">string / bool</code>', 'Opcional', 'Interno', 'Marco origen del capítulo e indicador de remediación.'),
        ('<code>puntosProbados[].id</code> <span class="tag t-pk">PK</span>', '<code class="tp">string</code>', '<code>ej. C1.1.1, A.6.2.6</code> · Oblig.', 'Interno', 'Código oficial del control normativo auditado.'),
        ('<code>puntosProbados[].status</code>', '<code class="tp">enum</code>', '<code>Aprobado | Fallido | Falta Evidencia</code>', 'Crítico', 'Veredicto determinista basado en evidencia documental.'),
        ('<code>level</code> / <code>isMandatoryForTargetLevel</code>', '<code class="tp">enum / bool</code>', '<code>L1 | L2 | L3</code> · Oblig.', 'Interno', 'Nivel de aseguramiento del control y obligatoriedad.'),
        ('<code>isInheritedFromPlatform</code>', '<code class="tp">boolean</code>', ' + <code>inheritedPlatformName</code>', 'Interno', 'Indica si el control se hereda del proveedor Cloud (SaaS/PaaS).'),
        ('<code>comoSeAprobo</code> / <code>comoFallo</code>', '<code class="tp">string</code>', 'Justificación técnica · Oblig.', 'Confidencial', 'Explicación forense del cumplimiento o brecha detectada.'),
        ('<code>fuenteEvidencia</code> / <code>textoEvidencia</code>', '<code class="tp">string</code>', 'Cita textual verificable · Oblig.', '<span class="tag t-sec">Anti-Alucinación</span>', 'Sección/archivo fuente y fragmento literal extraído.'),
        ('<code>riskImpact</code> / <code>remediation</code>', '<code class="tp">enum / string</code>', '<code>Alto | Medio | Bajo</code> · Oblig.', 'Confidencial', 'Severidad del riesgo y resumen ejecutivo de mitigación.'),
        ('<code>remediationDetails.strategy</code>', '<code class="tp">string</code>', 'Guía 4D · Opcional', 'Confidencial', 'Estrategia arquitectónica detallada de remediación.'),
        ('<code>remediationDetails.actionableSteps</code>', '<code class="tp">string[]</code>', 'Lista ordenada (3–5 pasos)', 'Confidencial', 'Pasos técnicos accionables de implementación.'),
        ('<code>codeOrConfigExample</code> / <code>verificationRecipe</code>', '<code class="tp">string</code>', 'Snippet Terraform/YAML/TS + Test', 'Confidencial', 'Código listo para producción y receta de verificación.'),
        ('<code>effortLevel</code> / <code>recommendedTools</code>', '<code class="tp">enum / string[]</code>', '<code>Bajo(1-3d) | Medio(1-2s) | Alto(&gt;2s)</code>', 'Interno', 'Estimación de esfuerzo e inventario de herramientas.'),
    ]
    out += box(
        "dd-chapter", 58, 1196, 762, 488,
        hdr(LB("list-checks", "#0284C7", "#E0F2FE"), "DD-02 · AISVSChapter · PuntoProbado · RemediationGuidance", "Sub-esquemas anidados en AuditReport.chapters[] · Evaluación por control y Guía 4D", pill("Sub-Esquema · 20 Campos", "p-teal"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd2_rows, compact=True),
        cls="card dict-sub"
    )

    # DD-3: StandardChapter & StandardControl
    dd3_rows = [
        ('<code>chapterId</code> <span class="tag t-pk">PK</span>', '<code class="tp">string</code>', '<code>== docId (&lt;= 32 chars)</code>', '<span class="tag t-worm">Inmutable</span>', 'ID del capítulo normativo (ej. <code>C01</code>..<code>C12</code>, <code>CLAUSE-4</code>..<code>ANNEX-A</code>).'),
        ('<code>title</code>', '<code class="tp">string</code>', '<code>1..200 chars</code> · Oblig.', 'Público', 'Título oficial del dominio o cláusula normativa.'),
        ('<code>shortDescription</code>', '<code class="tp">string</code>', '<code>&lt;= 1,000 chars</code> · Oblig.', 'Público', 'Resumen ejecutivo del objetivo de seguridad del capítulo.'),
        ('<code>fullDescription</code>', '<code class="tp">string</code>', '<code>&lt;= 10,000 chars</code> · Oblig.', 'Público', 'Descripción normativa completa e intención arquitectónica.'),
        ('<code>order</code>', '<code class="tp">number</code>', 'Entero secuencial · Opcional', 'Público', 'Orden de visualización y particionamiento en lotes Map-Reduce.'),
        ('<code>controls</code>', '<code class="tp">StandardControl[]</code>', '<code>list &lt;= 200</code> · Oblig.', 'Público', 'Lista de controles verificables pertenecientes al capítulo.'),
        ('<code>controls[].id</code> <span class="tag t-pk">PK</span> / <code>title</code>', '<code class="tp">string</code>', 'Código oficial + nombre', 'Público', 'Identificador único del control y nombre descriptivo.'),
        ('<code>controls[].description</code> / <code>level</code>', '<code class="tp">string / enum</code>', 'Requisito + <code>L1 | L2 | L3</code>', 'Público', 'Requisito normativo verificable y nivel de madurez exigible.'),
        ('<code>objective</code> / <code>*Guidance</code>', '<code class="tp">string</code>', 'Guía de auditoría y remediación', 'Público', 'Objetivo de control, criterios de prueba y guía de mitigación.'),
    ]
    out += box(
        "dd-catalog", 58, 1696, 762, 400,
        hdr(LB("file-check", "#0D9488", "#CCFBF1"), "DD-03 · StandardChapter &amp; StandardControl", "Colecciones: /standards_aisvs/{id} (90 ctrls) · /standards_iso42001/{id} (38 ctrls) · src/lib/*Data.ts", pill("Catálogo · 14 Campos", "p-teal"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd3_rows, compact=True),
        cls="card dict-cat"
    )

    # ---------------- COLUMNA 2 (x=838, w=762) ----------------
    # DD-4: CustomFramework & SnapshotIntegrityStatus
    dd4_rows = [
        ('<code>id</code> <span class="tag t-pk">PK</span>', '<code class="tp">string</code>', '<code>^[a-zA-Z0-9_\\-\\.]+$</code>', '<span class="tag t-worm">PK Dual</span>', 'ID del marco (ej. <code>fw-lfpdppp-mex-2026</code>, <code>fw-eu-ai-act-*</code>).'),
        ('<code>shortCode</code> / <code>version</code>', '<code class="tp">string</code>', '<code>ej. LFPDPPP-MX, v1.0</code>', 'Público Interno', 'Código corto para badges UI y versión de la regulación.'),
        ('<code>name</code> / <code>jurisdiction</code>', '<code class="tp">string</code>', 'Nombre oficial + país/región', 'Público Interno', 'Nombre de la ley/estándar y jurisdicción legal (México, UE, Global).'),
        ('<code>description</code>', '<code class="tp">string</code>', 'Resumen legal y técnico', 'Público Interno', 'Alcance normativo extraído durante la ingesta BYOF.'),
        ('<code>createdAt</code> / <code>createdBy</code>', '<code class="tp">string</code>', '<code>ISO-8601</code> + Email autor', '<span class="tag t-pii">PII Autor</span>', 'Fecha de creación e identidad del usuario que subió el marco.'),
        ('<code>totalChapters</code> / <code>totalControls</code>', '<code class="tp">number</code>', 'Conteos enteros &gt;= 1', 'Interno', 'Total de capítulos y controles estructurados por Gemini.'),
        ('<code>chapters</code>', '<code class="tp">StandardChapter[]</code>', 'Estructura jerárquica completa', 'Interno', 'Capítulos y controles descompuestos del documento legal.'),
        ('<code>allowedDomains</code> / <code>tenantDomain</code>', '<code class="tp">string[] / string</code>', 'Filtro ACL Multi-Tenant (<code>C08.1</code>)', '<span class="tag t-sec">ACL Tenant</span>', 'Dominios autorizados para consultar y auditar con este marco.'),
        ('<code>sha256Signature</code>', '<code class="tp">string</code>', '<code>64 hex chars (SHA-256)</code>', '<span class="tag t-worm">Firma C01.4</span>', 'Resumen criptográfico SHA-256 calculado sobre <code>id+shortCode+chapters</code>.'),
        ('<code>SnapshotIntegrityStatus</code>', '<code class="tp">interface</code>', '<code>verified, checkedAt, mismatches[]</code>', 'Seguridad', 'Estado de verificación SHA-256 contra <code>integrity-manifest.json</code>.'),
    ]
    out += box(
        "dd-byof", 838, 526, 762, 480,
        hdr(LB("fingerprint", "#7C3AED", "#F3E8FD"), "DD-04 · CustomFramework &amp; SnapshotIntegrityStatus", "Firestore: /custom_frameworks/{id} · Local FS: config/frameworks/*.json · Caché: /tmp/aegis-runtime-cache", pill("BYOF + SHA-256 · 18 Campos", "p-purple"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd4_rows, compact=True),
        cls="card dict-byof"
    )

    # DD-5: ApiKey & AsyncAuditJob
    dd5_rows = [
        ('<code>ApiKey.id</code> / <code>key</code> <span class="tag t-pk">PK</span>', '<code class="tp">string</code>', '<code>^aisvs_[a-zA-Z0-9]{32,64}$</code>', '<span class="tag t-sec">Secreto API</span>', 'Llave API para CI/CD; <code>docId == key</code>, sin updates permitidos.'),
        ('<code>ApiKey.name</code>', '<code class="tp">string</code>', '<code>1..200 chars</code> · Oblig.', 'Interno', 'Etiqueta descriptiva del pipeline o integración CI/CD.'),
        ('<code>createdAt</code> / <code>lastUsedAt</code>', '<code class="tp">string</code>', '<code>ISO-8601 &lt;= 100 chars</code>', 'Interno', 'Marcas de tiempo de emisión y último uso en <code>/api/v1/audits</code>.'),
        ('<code>ApiKey.status</code>', '<code class="tp">enum</code>', '<code>active | revoked</code>', 'Seguridad', 'Estado de vigencia; revocación inmediata mediante borrado.'),
        ('<code>ownerUid</code> / <code>ownerEmail</code> / <code>tenantDomain</code>', '<code class="tp">string</code>', 'Identidad propietaria RBAC', '<span class="tag t-pii">PII / RBAC</span>', 'Restringe borrado en <code>firestore.rules</code> al dueño o admin.'),
        ('<code>AsyncAuditJob.id</code> <span class="tag t-pk">PK</span>', '<code class="tp">string</code>', '<code>job_&lt;ts&gt;_&lt;rand&gt;</code>', 'Interno', 'ID de trabajo asíncrono devuelto con código <code>HTTP 202 Accepted</code>.'),
        ('<code>AsyncAuditJob.status</code>', '<code class="tp">enum</code>', '<code>PROCESSING | COMPLETED | FAILED</code>', 'Interno', 'Estado del ciclo de vida en la cola <code>/asyncAudits/{jobId}</code>.'),
        ('<code>systemName</code> / <code>technicalLead</code> / <code>email</code>', '<code class="tp">string</code>', 'Metadatos del sistema auditado', '<span class="tag t-pii">PII Contacto</span>', 'Datos del sistema y responsable enviados vía API programática.'),
        ('<code>standard</code> / <code>customFrameworkId</code>', '<code class="tp">string</code>', 'Normativa objetivo del job', 'Interno', 'Marco regulatorio evaluado en segundo plano.'),
        ('<code>webhookUrl</code>', '<code class="tp">string</code>', 'URL HTTPS validada por SSRF guard', 'Confidencial', 'Endpoint de callback notificado al concluir la auditoría.'),
        ('<code>result</code> / <code>error</code>', '<code class="tp">AuditReport / str</code>', 'Dictamen final o mensaje de fallo', 'Confidencial', 'Resultado completo sincronizado también en <code>/audits/{id}</code>.'),
    ]
    out += box(
        "dd-api", 838, 1020, 762, 518,
        hdr(LB("key-round", "#D97706", "#FEF3C7"), "DD-05 · ApiKey &amp; AsyncAuditJob (Motor API v1 CI/CD)", "Colecciones Firestore: /apiKeys/{keyId} (Cliente+Servidor) y /asyncAudits/{jobId} (Solo Admin SDK)", pill("API &amp; Jobs · 21 Campos", "p-amber"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd5_rows, compact=True),
        cls="card dict-api"
    )

    # DD-6: AdminSettings & PlatformProfile
    dd6_rows = [
        ('<code>provider</code>', '<code class="tp">enum</code>', '<code>gemini | anthropic | openrouter | openai | custom</code>', 'Configuración', 'Proveedor activo de IA para el motor Map-Reduce.'),
        ('<code>geminiBackend</code>', '<code class="tp">enum</code>', '<code>vertex_ai | api_key</code>', 'Configuración', 'Selecciona Vertex AI Enterprise (ADC/IAM) o Gemini Developer API.'),
        ('<code>geminiApiKey</code> / <code>maskedKey</code>', '<code class="tp">string</code>', 'Enmascarado <code>AIzaSy...xxxx</code> en UI', '<span class="tag t-sec">Secreto Crítico</span>', 'Llave API Gemini (inyectada desde Secret Manager o Admin UI).'),
        ('<code>preferredModel</code> / <code>fallbackModel</code>', '<code class="tp">string</code>', '<code>ej. gemini-3.8-flash</code>', 'Configuración', 'Modelo primario y modelo de respaldo automático ante errores 429/5xx.'),
        ('<code>openaiApiKey</code> / <code>maskedOpenaiKey</code>', '<code class="tp">string</code>', 'Enmascarado <code>sk-...xxxx</code> en UI', '<span class="tag t-sec">Secreto Crítico</span>', 'Credencial para OpenRouter, OpenAI, Anthropic o gateway corporativo.'),
        ('<code>openaiBaseUrl</code> / <code>openaiModel</code>', '<code class="tp">string</code>', 'Validado contra <code>ALLOWED_EGRESS_HOSTS</code>', 'Seguridad C04.3', 'Endpoint HTTPS compatible con OpenAI y identificador de modelo.'),
        ('<code>customHeaders</code>', '<code class="tp">Record&lt;str,str&gt;</code>', 'Cabeceras HTTP adicionales', 'Confidencial', 'Headers personalizados para proxies corporativos o gateways IA.'),
        ('<code>temperature</code> / <code>maxTokens</code>', '<code class="tp">number</code>', '<code>0.0</code> (determinista) / <code>8192</code>', 'Gobernanza AIMS', 'Parámetros de inferencia para garantizar repetibilidad (SLO 100%).'),
        ('<code>updatedAt</code> / <code>source</code>', '<code class="tp">string</code>', '<code>ISO-8601</code> + origen de hidratación', 'Auditoría', 'Marca de última modificación en Firestore <code>/system_config/admin_settings</code>.'),
        ('<code>PlatformProfile</code> (6 perfiles)', '<code class="tp">interface</code>', '<code>key, name, provider, deploymentType</code>', 'Catálogo Base', 'Define <code>inheritedCapabilities[]</code> y <code>customerResponsibilities[]</code>.'),
    ]
    out += box(
        "dd-cfg", 838, 1552, 762, 544,
        hdr(LB("user-cog", "#4F46E5", "#E0E7FF"), "DD-06 · AdminSettings &amp; PlatformProfile (Gobernanza Multi-LLM)", "Firestore: /system_config/admin_settings · Local: config/admin-settings.json · Caché: /tmp/aegis-runtime-cache", pill("Config &amp; Herencia · 20 Campos", "p-blue"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd6_rows, compact=True),
        cls="card dict-cfg"
    )

    # ---------------- COLUMNA 3 (x=1618, w=764) ----------------
    # DD-7: GCPScanTelemetry & GCPResourceItem
    dd7_rows = [
        ('<code>projectId</code> / <code>projectNumber</code>', '<code class="tp">string</code>', 'ID y número de proyecto GCP', 'Confidencial', 'Proyecto Google Cloud inspeccionado en vivo.'),
        ('<code>scanTime</code> / <code>authModeUsed</code>', '<code class="tp">string / enum</code>', '<code>adc | token | service_account | demo</code>', 'Auditoría', 'Timestamp UTC y mecanismo de autenticación efímera empleado.'),
        ('<code>totalResourcesFound</code>', '<code class="tp">number</code>', 'Conteo total de activos', 'Interno', 'Suma de recursos cloud e IA descubiertos en el proyecto.'),
        ('<code>componentsScanned</code>', '<code class="tp">string[]</code>', 'Lista de APIs consultadas', 'Interno', 'Servicios inspeccionados (IAM, GCS, Cloud Run, Vertex AI, KMS, Secrets).'),
        ('<code>findingsSummary</code>', '<code class="tp">object</code>', '<code>critical, high, medium, low, info</code>', 'Crítico', 'Conteo agregado de hallazgos de postura de seguridad por severidad.'),
        ('<code>resources.iamFindings</code>', '<code class="tp">GCPResourceItem[]</code>', 'Políticas IAM y Service Accounts', 'Confidencial', 'Detecta roles primitivos (Owner/Editor), llaves SA y acceso público.'),
        ('<code>resources.buckets</code> / <code>cloudRunServices</code>', '<code class="tp">GCPResourceItem[]</code>', 'Buckets GCS y servicios Cloud Run', 'Confidencial', 'Verifica Public Access Prevention, Uniform Bucket Access, IAP y egress.'),
        ('<code>resources.vertexEndpoints</code> / <code>Models</code>', '<code class="tp">GCPResourceItem[]</code>', 'Activos Vertex AI en producción', 'Confidencial', 'Audita endpoints públicos vs. privados (PSC/VPC-SC) y linaje de modelos.'),
        ('<code>resources.kmsKeys</code> / <code>secrets</code>', '<code class="tp">GCPResourceItem[]</code>', 'Criptografía KMS y Secret Manager', 'Confidencial', 'Verifica rotación de claves CMEK y políticas de secretos.'),
        ('<code>rawManifestMarkdown</code>', '<code class="tp">string</code>', 'Bloque XML/Markdown inyectado', 'Confidencial', 'Manifiesto técnico inyectado al prompt del evaluador Map-Reduce.'),
        ('<code>GCPResourceItem.*</code>', '<code class="tp">interface</code>', '<code>id, name, type, location, status, details</code>', 'Confidencial', 'Incluye <code>complianceImpact</code> y <code>recommendedControl</code> (AISVS/ISO).'),
    ]
    out += box(
        "dd-gcp", 1618, 526, 764, 515,
        hdr(G("cloud_asset_inventory", 30), "DD-07 · GCPScanTelemetry &amp; GCPResourceItem (Escáner GCP)", "Generado por src/services/gcpScannerService.ts y embebido en AuditReport.gcpTelemetry", pill("Telemetría Cloud · 22 Campos", "p-green"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd7_rows, compact=True),
        cls="card dict-gcp"
    )

    # DD-8: SecurityAlertEvent & UserSecurityContext
    dd8_rows = [
        ('<code>SecurityAlertEvent.id</code> <span class="tag t-pk">PK</span>', '<code class="tp">string</code>', '<code>SEC-&lt;timestamp&gt;-&lt;rand5&gt;</code>', '<span class="tag t-worm">Forense</span>', 'ID único de alerta en Firestore <code>/security_alerts</code> y Cloud Logging.'),
        ('<code>timestamp</code>', '<code class="tp">string</code>', '<code>ISO-8601 UTC</code> · Obligatorio', 'Forense', 'Instante exacto del evento de seguridad detectado.'),
        ('<code>eventType</code>', '<code class="tp">enum (8 tipos)</code>', '<code>PROMPT_INJECTION | SSRF | DOW | ...</code>', 'Crítico C12.2', 'Categoría mapeada a <code>sccAiProtection.findingCategory</code>.'),
        ('<code>severity</code>', '<code class="tp">enum</code>', '<code>INFO | WARNING | CRITICAL</code>', 'Crítico', 'Nivel de severidad; <code>WARNING/CRITICAL</code> disparan SIEM Webhook.'),
        ('<code>actor</code>', '<code class="tp">string</code>', 'Email IAP/Firebase o <code>system</code>', '<span class="tag t-pii">PII Actor</span>', 'Identidad autenticada asociada al evento o intento adversarial.'),
        ('<code>ip</code>', '<code class="tp">string</code>', '<code>x-forwarded-for</code> / socket IP', '<span class="tag t-pii">PII Red</span>', 'Dirección IP origen para correlación en SIEM y cortafuegos.'),
        ('<code>details</code>', '<code class="tp">Record&lt;str,any&gt;</code>', 'Contexto estructurado JSON', 'Confidencial', 'Indicadores regex, puntajes de riesgo, pasos de saga o URLs bloqueadas.'),
        ('<code>UserSecurityContext.authenticated</code>', '<code class="tp">boolean</code>', 'Estado de sesión verificada', 'Seguridad', 'Resultado de verificación criptográfica de identidad por request.'),
        ('<code>uid</code> / <code>email</code> / <code>tenantDomain</code>', '<code class="tp">string</code>', 'Extraído de JWT o cabecera IAP', '<span class="tag t-pii">PII / RBAC</span>', 'Atributos de identidad para aislamiento multi-tenant.'),
        ('<code>authSource</code>', '<code class="tp">enum</code>', '<code>firebase_id_token | iap_header | api_key | anon</code>', 'Seguridad', 'Fuente de autenticación validada por el middleware Zero-Trust.'),
    ]
    out += box(
        "dd-sec", 1618, 1055, 764, 495,
        hdr(G("security_command_center", 30), "DD-08 · SecurityAlertEvent &amp; UserSecurityContext (SIEM &amp; Auth)", "Firestore: /security_alerts/{id} · Cloud Logging JSON · SCC AI Protection · Middleware C05.3/C12.2", pill("Seguridad &amp; SOC · 12 Campos", "p-red"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd8_rows, compact=True),
        cls="card dict-sec"
    )

    # DD-9: AimsTelemetryState, ClientQuotaWindow & SessionRiskState
    dd9_rows = [
        ('<code>totalEvaluations</code> / <code>Batches</code>', '<code class="tp">number</code>', 'Contadores acumulativos RAM', 'Telemetría AIMS', 'Total de auditorías y lotes Map-Reduce ejecutados por instancia.'),
        ('<code>totalControlsEvaluated</code>', '<code class="tp">number</code>', 'Controles inspeccionados', 'Telemetría AIMS', 'Total de puntos de control procesados en todos los marcos.'),
        ('<code>controlsWithExactCitation</code>', '<code class="tp">number</code>', 'Citas &gt;10 chars verificadas', 'Calidad C08.4', 'Controles con fuente y texto de evidencia literal no vacío.'),
        ('<code>citationGroundedRatePercent</code>', '<code class="tp">number</code>', '<code>SLO &gt;= 95.0%</code> (ISO Cl. 9.1)', 'SLO Calidad', 'Porcentaje de fundamentación citatriz libre de alucinaciones.'),
        ('<code>deterministicTempEnforcedCount</code>', '<code class="tp">number</code>', '<code>SLO == 100.0%</code> (temp=0.0)', 'SLO AIMS', 'Auditorías ejecutadas con determinismo estricto.'),
        ('<code>avgLatencyMs</code> / <code>total*Tokens</code>', '<code class="tp">number</code>', '<code>SLO P95 &lt;= 900,000 ms</code>', 'FinOps / Rend.', 'Latencia promedio y consumo acumulado de tokens (Prompt/Completion).'),
        ('<code>ClientQuotaWindow.*</code> (<code>C11.1</code>)', '<code class="tp">interface</code>', '<code>requestCount&lt;=30, active&lt;=3, tok&lt;=2.5M</code>', 'Anti-DoW RAM', 'Ventana móvil de 15 min por cliente para prevenir Denial-of-Wallet.'),
        ('<code>SessionRiskState.*</code> (<code>C02.10</code>)', '<code class="tp">interface</code>', '<code>cumulativeRiskScore&lt;115, flaggedTurns</code>', 'Anti-Crescendo', 'Rastreador multi-turno (15m); bloquea sesión 10m si detecta escalamiento.'),
    ]
    out += box(
        "dd-ram", 1618, 1564, 764, 532,
        hdr(LB("gauge", "#9333EA", "#F3E8FD"), "DD-09 · AimsTelemetryState · ClientQuotaWindow · SessionRiskState", "Diccionarios de Estado en Memoria RAM (Node.js V8 Heap) · Expuesto en GET /api/admin/aims-telemetry y /api/security/posture", pill("Estado RAM · 20 Campos", "p-purple"))
        + schema_table(["Campo / Atributo", "Tipo", "Restricción / Regla", "Clasif.", "Descripción en el Diccionario"], dd9_rows, compact=True),
        cls="card dict-ram"
    )

    return out


def build_repositories_section() -> str:
    out = zone(
        "z-repos", 2420, 480, 1380, 1632, "z-repos",
        "3 · Repositorios de Datos Disponibles (5 Capas de Persistencia)",
        "Cloud Firestore nam5 · Local FS R/O (/app/config) · Caché Efímero tmpfs · Catálogos Semilla · Bóvedas GCP",
        G("firestore", 24)
    )

    # R-1: Capa 1 - Cloud Firestore Native (8 Colecciones)
    r1_rows = [
        ('<code class="pa">/audits/{auditId}</code>', '<code>AuditReport</code> (DD-01)', '<span class="tag t-worm">R / C / U (No Delete)</span>', 'Admin SDK + Saga', 'Inmutable WORM · Dominio verificado + validación estricta de esquema.'),
        ('<code class="pa">/standards_aisvs/{id}</code>', '<code>StandardChapter</code> (DD-03)', '<span class="tag t-worm">R / C / U (No Delete)</span>', 'Admin SDK', 'Catálogo en nube OWASP AISVS v1.0 (12 capítulos, 90 controles).'),
        ('<code class="pa">/standards_iso42001/{id}</code>', '<code>StandardChapter</code> (DD-03)', '<span class="tag t-worm">R / C / U (No Delete)</span>', 'Admin SDK', 'Catálogo en nube ISO/IEC 42001:2023 (Cláusulas 4–10 y Anexo A, 38 ctrls).'),
        ('<code class="pa">/apiKeys/{keyId}</code>', '<code>ApiKey</code> (DD-05)', '<code>R / C / D (No Update)</code>', 'Admin SDK (Auth v1)', 'Bóveda de llaves CI/CD (<code>aisvs_*</code>); borrado solo por dueño o admin.'),
        ('<code class="pa">/custom_frameworks/{id}</code>', '<code>CustomFramework</code> (DD-04)', '<span class="tag t-pii">DENEGADO (false)</span>', 'Solo Admin SDK', 'Marcos regulatorios BYOF con firma SHA-256 y ACL <code>allowedDomains</code>.'),
        ('<code class="pa">/asyncAudits/{jobId}</code>', '<code>AsyncAuditJob</code> (DD-05)', '<span class="tag t-pii">DENEGADO (false)</span>', 'Solo Admin SDK', 'Estado y resultados de auditorías asíncronas <code>/api/v1/audits</code>.'),
        ('<code class="pa">/system_config/admin_settings</code>', '<code>AdminSettings</code> (DD-06)', '<span class="tag t-pii">DENEGADO (false)</span>', 'Solo Admin SDK', 'Configuración activa del proveedor LLM hidratada al arranque.'),
        ('<code class="pa">/security_alerts/{alertId}</code>', '<code>SecurityAlertEvent</code> (DD-08)', '<span class="tag t-pii">DENEGADO (false)</span>', 'Solo Admin SDK', 'Registro forense de alertas de seguridad IA y eventos C12.2.'),
    ]
    out += box(
        "r-firestore", 2438, 526, 1344, 490,
        hdr(
            G("firestore", 32),
            "Capa 1 · Google Cloud Firestore Native (Base de Datos: aegis-ai-db · Multi-Región nam5)",
            "Persistencia NoSQL serverless primaria · Cifrado AES-256 en reposo y TLS 1.3 en tránsito · Reglas declarativas en firestore.rules",
            pill("8 Colecciones Activas", "p-amber")
        )
        + schema_table(["Colección / Ruta Firestore", "Diccionario Asociado", "Acceso Cliente (Web SDK)", "Acceso Servidor (Node.js)", "Política de Gobernanza, Retención y Reglas de Seguridad"], r1_rows, compact=False)
        + '<div class="note-bar"><b>Invariante Zero-Trust (firestore.rules):</b> El acceso desde navegador exige <code>isAuthenticated()</code> con correo verificado perteneciente a <code>ALLOWED_DOMAINS</code> (<code>google.com</code>). Las colecciones administrativas y de back-office están 100% bloqueadas al cliente y operan exclusivamente vía <b>Firebase Admin SDK (ADC)</b>.</div>',
        cls="card repo-fs"
    )

    # R-2: Capa 2 - Sistema de Archivos Local Inmutable (/app/config)
    r2_rows = [
        ('<code class="pa">config/frameworks/fw-lfpdppp-mex-2026.json</code>', '<code>CustomFramework</code>', 'LFPDPPP México / INAI (Protección de Datos Personales · 8 caps).'),
        ('<code class="pa">config/frameworks/fw-lfpc-mex-2026.json</code>', '<code>CustomFramework</code>', 'LFPC México / PROFECO (Protección al Consumidor en IA · 6 caps).'),
        ('<code class="pa">config/frameworks/fw-eu-ai-act-mtug5x39.json</code>', '<code>CustomFramework</code>', 'Reglamento Europeo de IA (EU AI Act 2024/1689 · Alto Riesgo).'),
        ('<code class="pa">config/frameworks/fw-dsm-01-mubn2f1y.json</code>', '<code>CustomFramework</code>', 'Marco de Seguridad Corporativo DSM-01 pre-empaquetado.'),
        ('<code class="pa">config/frameworks/integrity-manifest.json</code>', '<code>Manifest SHA-256</code>', 'Hashes SHA-256 de referencia verificados al inicio (Control C01.4).'),
        ('<code class="pa">config/admin-settings.json</code> &amp; <code>firebase-*.json</code>', '<code>AdminSettings</code>', 'Configuración semilla de proveedor LLM y enlace a proyecto Firebase.'),
    ]
    out += box(
        "r-local", 2438, 1030, 662, 370,
        hdr(
            LB("lock", "#2563EB", "#DBEAFE"),
            "Capa 2 · Repositorio Local Inmutable (/app/config)",
            "Sistema de archivos del contenedor endurecido en solo lectura (chmod -R a-w /app)",
            pill("6 Archivos · Solo Lectura", "p-blue")
        )
        + schema_table(["Ruta de Archivo en Contenedor", "Esquema", "Contenido y Propósito"], r2_rows, compact=True)
        + '<div class="note-bar"><b>Control OWASP AISVS C04.1:</b> Ningún proceso en producción puede modificar <code>/app/config</code>; previene persistencia de malware o alteración de catálogos.</div>',
        cls="card repo-ro"
    )

    # R-3: Capa 3 - Caché Efímero en Memoria (/tmp/aegis-runtime-cache)
    r3_rows = [
        ('<code class="pa">/tmp/aegis-runtime-cache/admin-settings.json</code>', '<code>AdminSettings</code>', 'Espejo escribible en RAM de la configuración LLM activa.'),
        ('<code class="pa">/tmp/aegis-runtime-cache/frameworks/*.json</code>', '<code>CustomFramework</code>', 'Caché de baja latencia de marcos BYOF subidos o leídos de Firestore.'),
        ('<b>Mecanismo de Lectura (Read-Through):</b>', '<code>getCustomFramework</code>', '1º <code>/tmp/cache</code> → 2º <code>/app/config</code> → 3º Firestore <code>custom_frameworks</code>.'),
        ('<b>Mecanismo de Escritura (Write-Through):</b>', '<code>saveCustomFramework</code>', 'Firma con SHA-256 → escribe en <code>/tmp/cache</code> → persiste en Firestore.'),
    ]
    out += box(
        "r-tmp", 3120, 1030, 662, 370,
        hdr(
            LB("split", "#7C3AED", "#F3E8FD"),
            "Capa 3 · Caché Efímero tmpfs (/tmp/aegis-runtime-cache)",
            "Patrón de Persistencia Dual Resiliente en memoria volátil del contenedor Cloud Run",
            pill("Persistencia Dual · tmpfs", "p-purple")
        )
        + schema_table(["Ruta / Operación en Caché Efímero", "Esquema", "Comportamiento Operativo"], r3_rows, compact=True)
        + '<div class="note-bar"><b>Alta Disponibilidad:</b> Garantiza velocidad de lectura sub-milisegundo y continuidad total incluso en entornos aislados sin salida a Firestore.</div>',
        cls="card repo-tmp"
    )

    # R-4: Capa 4 - Catálogos Semilla Compilados y Contextos Normativos
    r4_rows = [
        ('<code class="pa">owasp-aisvs-context.md</code>', '<code>Markdown Raw</code>', 'Contexto íntegro OWASP AISVS v1.0 precargado en RAM para prompts.'),
        ('<code class="pa">iso-42001-context.md</code>', '<code>Markdown Raw</code>', 'Contexto íntegro ISO/IEC 42001:2023 precargado en RAM para prompts.'),
        ('<code class="pa">src/lib/aisvsData.ts</code> &amp; <code>iso42001Data.ts</code>', '<code>StandardChapter[]</code>', 'Catálogos semilla tipados para hidratar la UI y poblar Firestore.'),
        ('<code class="pa">src/lib/sampleAudits.ts</code> &amp; <code>sampleAuditsEn.ts</code>', '<code>AuditReport[]</code>', 'Dictámenes de referencia pre-construidos (bilingües ES / EN).'),
        ('<code class="pa">src/lib/catalogTranslations.ts</code> &amp; <code>translationsDict.ts</code>', '<code>Record&lt;str,any&gt;</code>', 'Diccionarios de localización (ES / EN) de controles y cláusulas.'),
    ]
    out += box(
        "r-static", 2438, 1414, 662, 345,
        hdr(
            LB("package", "#0D9488", "#CCFBF1"),
            "Capa 4 · Catálogos Semilla y Contextos (src/lib/* &amp; Raíz)",
            "Artefactos estáticos compilados en el bundle TypeScript / Vite",
            pill("8 Módulos Estáticos", "p-teal")
        )
        + schema_table(["Archivo / Módulo en Repositorio", "Tipo / Esquema", "Rol en el Flujo de Información"], r4_rows, compact=True),
        cls="card repo-cat"
    )

    # R-5: Capa 5 - Almacenes en Memoria RAM y Bóvedas Cloud GCP
    r5_rows = [
        ('<code class="pa">RAM: clientQuotas</code> &amp; <code>sessionRiskTracker</code>', '<code>Map&lt;string, State&gt;</code>', 'Ventanas móviles de 15m para cuotas Anti-DoW (C11.1) y Crescendo (C02.10).'),
        ('<code class="pa">RAM: aimsTelemetry</code> &amp; <code>recentSecurityAlerts</code>', '<code>State / RingBuffer[200]</code>', 'Métricas de calidad citatriz AIMS (C08.4) y buffer circular de alertas.'),
        ('<code class="pa">RAM: multer.memoryStorage()</code>', '<code>UploadedFileInput[]</code>', 'Buffers efímeros (≤30 MB) de PDFs/ZIPs descartados tras la evaluación.'),
        ('<code class="pa">GCP Secret Manager</code>', '<code>aegis-gemini-key / admin-token</code>', 'Bóveda HSM de secretos montada como variables de entorno en Cloud Run.'),
        ('<code class="pa">GCP Cloud Logging &amp; Artifact Registry</code>', '<code>JSON Logs / Docker Img</code>', 'Auditoría estructurada (<code>aegis-security-alerting-c12-2</code>) e imágenes.'),
    ]
    out += box(
        "r-cloud", 3120, 1414, 662, 345,
        hdr(
            G("secret_manager", 30),
            "Capa 5 · Memoria RAM (V8 Heap) y Bóvedas Cloud GCP",
            "Estado volátil de seguridad en tiempo real y servicios gestionados Google Cloud",
            pill("5 Almacenes RAM + GCP", "p-red")
        )
        + schema_table(["Repositorio en Memoria / Servicio Cloud", "Estructura", "Función Operativa y de Seguridad"], r5_rows, compact=True),
        cls="card repo-mem"
    )

    # R-6: Matriz de Gobernanza PII y Leyenda de Flujos
    def svg_line(color: str, dash: str = "") -> str:
        d = f' stroke-dasharray="{dash}"' if dash else ""
        return (f'<svg width="34" height="12" style="flex:none"><line x1="2" y1="6" x2="25" y2="6" stroke="{color}" stroke-width="2.8"{d}/>'
                f'<path d="M23,1.5 L32,6 L23,10.5 L25,6 Z" fill="{color}"/></svg>')

    gov_html = (
        '<div class="gov-grid">'
        '<div class="gov-box">'
        '<div class="gt">Gobernanza de Datos, Privacidad (PII) y Retención</div>'
        '<table class="t sm">'
        '<thead><tr><th>Categoría de Dato</th><th>Campos Clave</th><th>Protección y Ciclo de Vida</th></tr></thead>'
        '<tbody>'
        '<tr><td><span class="tag t-pii">Datos Personales (PII)</span></td><td><code>email, technicalLead, ownerEmail, actor, ip</code></td><td>Cifrado TLS 1.3 + AES-256 · Acceso restringido por dominio IAP/Auth · LFPDPPP.</td></tr>'
        '<tr><td><span class="tag t-sec">Secretos y Credenciales</span></td><td><code>geminiApiKey, openaiApiKey, ApiKey.key</code></td><td>Secret Manager · Enmascarado en API (<code>sk-...xxxx</code>) · Comparación SHA-256 constante.</td></tr>'
        '<tr><td><span class="tag t-worm">Evidencia y Dictámenes</span></td><td><code>description, chapters, remediatedArchitectureDoc</code></td><td>Zero Data Retention en LLM · Regla WORM (<code>allow delete: if false</code>) en Firestore.</td></tr>'
        '</tbody></table>'
        '</div>'
        '<div class="gov-box">'
        '<div class="gt">Leyenda de Flujos y Símbolos del Diagrama</div>'
        '<div class="lg-grid">'
        f'<div class="lg-row">{svg_line("#1A73E8")}<span>Flujo de datos e ingesta HTTP / SSE</span></div>'
        f'<div class="lg-row">{svg_line("#8430CE")}<span>Flujo de inferencia IA Map-Reduce</span></div>'
        f'<div class="lg-row">{svg_line("#D97706")}<span>Persistencia y lectura en repositorios</span></div>'
        f'<div class="lg-row">{svg_line("#C5221F", "8 5")}<span>Validación Zero-Trust y alertas SOC</span></div>'
        f'<div class="lg-row">{svg_line("#0D9488", "6 4")}<span>Sincronización Persistencia Dual</span></div>'
        f'<div class="lg-row">{svg_line("#4F46E5", "4 4")}<span>Relación de llave foránea / esquema</span></div>'
        '<div class="lg-row"><span class="tag t-pk">PK</span><span>Llave Primaria / ID Documento</span></div>'
        '<div class="lg-row"><span class="tag t-pii">PII</span><span>Dato Personal / Identificador</span></div>'
        '<div class="lg-row"><span class="tag t-worm">Inmutable</span><span>Registro WORM (Sin borrado)</span></div>'
        '<div class="lg-row"><span class="tag t-sec">Secreto</span><span>Credencial / Contenido Protegido</span></div>'
        '</div></div></div>'
    )

    out += box(
        "r-gov", 2438, 1773, 1344, 323,
        hdr(
            LB("shield-check", "#1E293B", "#E2E8F0"),
            "Gobernanza de Datos, Clasificación de Sensibilidad (PII / Secretos) y Leyenda Arquitectónica",
            "Controles aplicados sobre el inventario de datos conforme a OWASP AI-SVS v1.0, ISO/IEC 42001:2023 y LFPDPPP México",
            pill("Inventario Auditado: 100%", "p-green")
        ) + gov_html,
        cls="card repo-gov"
    )

    return out


def build_footer() -> str:
    return (
        '<div class="foot">'
        '<span>Fuente de verdad del código: <code>src/types.ts</code> · <code>server.ts</code> · <code>firestore.rules</code> · '
        '<code>firebase-blueprint.json</code> · <code>config/frameworks/*</code> · <code>src/services/gcpScannerService.ts</code>. '
        'Acompañado por el libro Excel interactivo <code>docs/architecture/AegisAI_Inventario_Datos_y_Diccionario.xlsx</code>.</span>'
        '<span>Generado automáticamente por <code>scripts/architecture_diagram/generate_data_dictionary_diagram.py</code> · AegisAI Enterprise</span>'
        '</div>'
    )


def wires() -> list[dict]:
    return [
        # Cadena secuencial horizontal entre las 10 etapas de Flujo de Información (F-01 -> F-10)
        dict(k="flow", frm="f1", fs="r", fa=0.5, to="f2", ts="l", ta=0.5),
        dict(k="sec",  frm="f2", fs="r", fa=0.5, to="f3", ts="l", ta=0.5),
        dict(k="flow", frm="f3", fs="r", fa=0.5, to="f4", ts="l", ta=0.5),
        dict(k="repo", frm="f4", fs="r", fa=0.5, to="f5", ts="l", ta=0.5),
        dict(k="ai",   frm="f5", fs="r", fa=0.5, to="f6", ts="l", ta=0.5),
        dict(k="ai",   frm="f6", fs="r", fa=0.5, to="f7", ts="l", ta=0.5),
        dict(k="repo", frm="f7", fs="r", fa=0.5, to="f8", ts="l", ta=0.5),
        dict(k="flow", frm="f8", fs="r", fa=0.5, to="f9", ts="l", ta=0.5),
        dict(k="sec",  frm="f9", fs="r", fa=0.5, to="f10", ts="l", ta=0.5),

        # Conexiones verticales directas y limpias (sin cruzar títulos ni tarjetas)
        dict(k="flow", frm="f1", fs="b", fa=0.5, to="dd-audit",     ts="t", ta=0.23, my=468),
        dict(k="repo", frm="f4", fs="b", fa=0.5, to="dd-byof",      ts="t", ta=0.65, my=468),
        dict(k="ai",   frm="f6", fs="b", fa=0.5, to="dd-gcp",       ts="t", ta=0.52, my=468),
        dict(k="repo", frm="f8", fs="b", fa=0.5, to="r-firestore",  ts="t", ta=0.29, my=468, label="Saga Write /audits", lp=[2828, 466]),
        dict(k="sec",  frm="f10", fs="b", fa=0.5, to="r-firestore", ts="t", ta=0.85, my=468, label="/security_alerts", lp=[3580, 466]),

        # Relaciones de esquema por los pasillos limpios entre tarjetas de Diccionarios de Datos
        dict(k="schema", frm="dd-audit",   fs="b", fa=0.5, to="dd-chapter", ts="t", ta=0.5),
        dict(k="schema", frm="dd-chapter", fs="b", fa=0.5, to="dd-catalog", ts="t", ta=0.5),
        dict(k="schema", frm="dd-byof",    fs="b", fa=0.5, to="dd-api",     ts="t", ta=0.5),
        dict(k="schema", frm="dd-api",     fs="b", fa=0.5, to="dd-cfg",     ts="t", ta=0.5),
        dict(k="schema", frm="dd-gcp",     fs="b", fa=0.5, to="dd-sec",     ts="t", ta=0.5),
        dict(k="schema", frm="dd-sec",     fs="b", fa=0.5, to="dd-ram",     ts="t", ta=0.5),

        # Sincronización entre Capas de Repositorios (Persistencia Dual)
        dict(k="sync", frm="r-firestore", fs="b", fa=0.75, to="r-tmp",   ts="t", ta=0.5, both=True, label="Espejo Dual"),
        dict(k="repo", frm="r-local",     fs="r", fa=0.5,  to="r-tmp",   ts="l", ta=0.5, label="Seed Fallback"),
        dict(k="repo", frm="r-static",    fs="t", fa=0.5,  to="r-local", ts="b", ta=0.5),
        dict(k="sync", frm="r-tmp",       fs="b", fa=0.5,  to="r-cloud", ts="t", ta=0.5),
    ]


def build_html() -> str:
    body = build_header() + build_flows_section() + build_dictionaries_section() + build_repositories_section() + build_footer()
    return (
        "<!DOCTYPE html>\n<html lang=\"es\"><head><meta charset=\"utf-8\">"
        "<title>AegisAI · Diccionarios de Datos, Flujos de Información y Repositorios</title>"
        f"<style>{CSS}</style></head><body><div id=\"canvas\">{body}"
        "<svg id=\"wires\" xmlns=\"http://www.w3.org/2000/svg\"></svg><pre id=\"qa\"></pre></div>"
        f"<script>window.WIRES = {json.dumps(wires())};</script><script>{JS}</script></body></html>\n"
    )


# --------------------------------------------------------------------------------------
# Renderizado con Google Chrome Headless y pdftocairo
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
        sys.exit("Google Chrome / Chromium no encontrado para renderizar PNG / PDF.")
    base = [
        exe, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--no-default-browser-check", "--disable-extensions", "--mute-audio",
        f"--user-data-dir={profile}", "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=4000"
    ]
    return subprocess.run(base + args, capture_output=True, text=True, timeout=300)


def render(html_path: Path, out_dir: Path, debug: bool) -> None:
    url = html_path.resolve().as_uri() + ("#debug" if debug else "")
    with tempfile.TemporaryDirectory(prefix="aegis-datadict-chrome-") as profile:
        dom = chrome([f"--window-size={W},{H}", "--dump-dom", url], profile).stdout
        m = re.search(r'<pre id="qa">(.*?)</pre>', dom, re.S)
        issues = json.loads(m.group(1)) if m and m.group(1).strip() else None
        if issues is None:
            print("! Reporte QA no encontrado")
        elif issues:
            print(f"! {len(issues)} elemento(s) con desbordamiento detectado:")
            for i in issues:
                print("   -", i)
        else:
            print("✓ Layout QA: 0 elementos desbordados (ajuste perfecto)")

        # PNG estándar (4K 3840x2160) como archivo principal .png y _4K.png, más _8K.png
        png_main = out_dir / f"{BASENAME}.png"
        chrome([f"--window-size={W},{H}", "--force-device-scale-factor=1", f"--screenshot={png_main}", url], profile)
        print(("✓ " if png_main.exists() else "✗ ") + str(png_main.relative_to(REPO)))

        png_4k = out_dir / f"{BASENAME}_4K.png"
        if png_main.exists():
            shutil.copyfile(png_main, png_4k)
            print("✓ " + str(png_4k.relative_to(REPO)))

        png_8k = out_dir / f"{BASENAME}_8K.png"
        chrome([f"--window-size={W},{H}", "--force-device-scale-factor=2", f"--screenshot={png_8k}", url], profile)
        print(("✓ " if png_8k.exists() else "✗ ") + str(png_8k.relative_to(REPO)))

        pdf = out_dir / f"{BASENAME}.pdf"
        chrome([f"--window-size={W},{H}", "--no-pdf-header-footer", "--print-to-pdf-no-header", f"--print-to-pdf={pdf}", url], profile)
        print(("✓ " if pdf.exists() else "✗ ") + str(pdf.relative_to(REPO)))

    if pdf.exists() and shutil.which("pdftocairo"):
        svg = out_dir / f"{BASENAME}.svg"
        subprocess.run(["pdftocairo", "-svg", str(pdf), str(svg)], check=False)
        print(("✓ " if svg.exists() else "✗ ") + str(svg.relative_to(REPO)))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", default=str(REPO / "docs" / "architecture"), help="directorio de salida")
    ap.add_argument("--no-render", action="store_true", help="solo escribir el HTML")
    ap.add_argument("--debug", action="store_true", help="resaltar elementos con desbordamiento")
    args = ap.parse_args()
    out_dir = Path(args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    html_path = out_dir / f"{BASENAME}.html"
    html_path.write_text(build_html(), encoding="utf-8")
    print("✓ " + (str(html_path.relative_to(REPO)) if html_path.is_relative_to(REPO) else str(html_path)))
    if not args.no_render:
        render(html_path, out_dir, args.debug)


if __name__ == "__main__":
    main()
