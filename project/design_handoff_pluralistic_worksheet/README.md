# Handoff: Pluralistic Program Description Worksheet

## Overview
A single-slide editable worksheet for students in **LLO 8230: Program Evaluation** (Vanderbilt Peabody College) to complete the "Pluralistic Program Description" stage of their Program Evaluation Design Portfolio. Students fill in note cards across four perspectives — **Problem, Program, Situation, Context** — to articulate the story of their program from multiple angles before scoping an evaluation design.

The worksheet is designed to be opened in a browser, filled in inline, and exported as a PDF (1920×1080 landscape) for submission.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look and behavior. They are not necessarily production code to ship as-is.

The task is to **recreate this HTML design in the target codebase's existing environment** (React/Vue/Next.js/etc.) using its established patterns and libraries. If no environment exists yet, choose the most appropriate framework for the project. The current implementation uses React 18 via inline Babel, which is fine for a static-host classroom tool but would normally be replaced with a proper build in a real app.

## Fidelity
**High-fidelity.** Exact colors, typography, spacing, and interactions are specified below. Recreate pixel-perfectly using the target codebase's libraries.

## Screenshots

See `screenshots/`:
- `01-empty.png` — initial state, each row's first card pre-filled with the faculty example, the other five blank.
- `02-filled.png` — example of a completed worksheet, showing typical content density and visual rhythm.

## Screens / Views

### One screen: Pluralistic Program Description (1920×1080 landscape)

**Purpose:** A student fills in 4 rows × 6 note cards with short fragments describing their program from four perspectives. The first card in each row is pre-filled with a faculty-provided example to anchor the student's thinking; the student can edit or clear it.

**Overall layout:**
- Fixed canvas: 1920×1080, scaled to fit the viewport via CSS `transform: scale()` (letterboxed on `#1c1c1c`).
- Two-column grid at the canvas root:
  - **Column 1:** 16px wide vertical gold gradient bar (`linear-gradient(180deg, #B49248, #CFAE70)`).
  - **Column 2:** Inner content area with `padding: 32px 72px 28px 72px`.
- Floating Export-PDF button anchored top-right (`position: absolute; top:18px; right:18px`).

**Inner content (vertical flex, `gap: 12px`):**

1. **Header band** (~140px tall)
   - **Eyebrow line** (small caps, letter-spacing tracked):
     - `font-size: 12px`, `letter-spacing: 0.18em`, `text-transform: uppercase`, `font-weight: 700`
     - `color: #6F6A60` (muted)
     - Three spans separated by an em-dash: `Vanderbilt Peabody College` — `LLO 8230: Program Evaluation` (the LLO span uses `color: #946E24` oak)
   - **Title** `Pluralistic Program Description.` (with trailing period)
     - `font-family: "Inter Tight"`, `font-size: 54px`, `font-weight: 700`, `line-height: 0.95`, `letter-spacing: -0.035em`
     - `color: #1C1C1C`
   - **Intro paragraph** (max-width 1640):
     - `font-size: 16.5px`, `line-height: 1.45`, `color: #2A2825`
     - Copy: *"The goal is to 'tell the story' of the program in context and from multiple perspectives. In the end, this should be both familiar and intriguing to your evaluation sponsors. The way that you weave the story of the program as related to the problem it addresses, the current situation, and the broader context will set the stage for the scope and focus of the evaluation design."*

2. **Sections grid** (4 equal rows, `display: grid; grid-template-rows: repeat(4, 1fr); gap: 10px; flex: 1`)
   - Each section is separated from the previous by a 1px hairline rule `border-top: 1px solid #D8D2C5` and 10px padding-top.
   - Each section is a 2-row grid: `[head][box row]` with `gap: 10px`.

3. **Footer band**
   - Hairline rule above, single line of text:
     - `font-size: 11px`, `letter-spacing: 0.16em`, `text-transform: uppercase`, `font-weight: 600`, `color: #6F6A60`
     - Copy: *"Program Evaluation Design Portfolio Project"*

### Per-section anatomy

A section is structured as:

```
┌────────────────────────────────────────────────────────────┐
│  [Big Italic Serif Title]   [Section description text]     │  ← head row (220px | 1fr)
├────────────────────────────────────────────────────────────┤
│  [Card] [Card] [Card] [Card] [Card] [Card]                 │  ← 6 cards, equal columns, 14px gap
└────────────────────────────────────────────────────────────┘
```

**Section head row:**
- Two-column grid: `220px 1fr`, `align-items: baseline`, `gap: 28px`.
- **Title** (left col):
  - `font-family: "Source Serif 4"`, `font-style: italic`, `font-weight: 500`
  - `font-size: 44px`, `line-height: 1`, `letter-spacing: -0.02em`
  - `color: #946E24` (oak)
- **Lead paragraph** (right col):
  - `font-size: 15.5px`, `line-height: 1.4`, `color: #2A2825`, `max-width: 1420px`

**Section box row:**
- 6-column grid with `gap: 14px`, `align-items: stretch`.
- Each cell is a **Note Card** (see Components).

### The four sections (exact copy)

| # | Title | Lead paragraph | First-card example |
|---|---|---|---|
| 1 | **Problem** | The issue or need the program addresses along with the significance and scope of the problem. | Ex) Frontline leaders are not sharing critical issues in all hands meetings. |
| 2 | **Program** | The 'program' is simply a coordinated set of activities, resources, and experiences designed to produce an outcome (CDC, 1999). It can be an intervention, a policy, a process, etc. Here, outline goals and objectives, describe key activities, and identify the target population and stakeholders. | Ex) A single-session workshop addresses audience analysis and communication strategies for frontline leaders, with a goal of increasing information sharing and collaborative problem-solving in meetings. |
| 3 | **Situation** | The current circumstances that are immediate and directly observable, including any relevant environmental factors. | Ex) The all-hands meeting format and agenda are new. The virtual format is unfamiliar and participant roles are unknown to frontline leaders. |
| 4 | **Context** | The broader environment or background that gives meaning to the situation. This includes historical, cultural, and systemic factors, and provides a more comprehensive understanding. | Ex) The meeting involves participants from multiple refinery locations in the southern U.S. for a large oil and gas company. The corporate culture values transparency but the climate encourages solving your own problems without asking for help. |

(All curly quotes in copy use typographic Unicode: `'…'` and `"…"`.)

## Components

### Note Card

A square-ish editable container holding one fragment of the program description.

- **Box**:
  - `background: #F5F3EF` (cream)
  - `border: 1px solid #D8D2C5` (rule)
  - `border-radius: 14px`
  - `padding: 10px 12px`
  - `min-height: 96px`
  - `position: relative`
  - The card width is fluid (1/6 of the row minus gaps).
- **Editable inner text region** (`contenteditable="true"`):
  - `font-family: "Inter Tight"`, `font-weight: 500`, `line-height: 1.35`
  - `color: #2A2825`
  - `outline: none`
  - `min-height: 48px`, `width: 100%`
  - `cursor: text`

**Two variants of the card:**

- **Example card** (index 0 in each row — pre-filled with the faculty example):
  - `font-size: 12px`
  - `text-align: center`
  - Content aligned vertically center (`align-items: center` on the card)
  - Text is editable; if the student clears it, the placeholder (the same example text) re-appears in muted color `#8E8779` (see Placeholder behavior below).

- **Blank card** (indices 1–5):
  - `font-size: 13px`
  - `text-align: left`
  - Content aligned to top (`align-items: flex-start`)
  - No placeholder text shown — the card is intentionally blank to invite input.

### Placeholder behavior on empty cards

Implemented via CSS `:empty::before`:

```css
.note-card .note-card__text:empty::before {
  content: attr(data-placeholder);
  color: #8E8779;
  font-weight: 500;
  text-align: center;
  display: block;
  width: 100%;
}
```

Only the example cards (index 0) carry a `data-placeholder` attribute, so blank cards remain visually empty when cleared.

### Export-PDF button (`.ws-export`)

- `position: absolute; top: 18px; right: 18px; z-index: 50`
- Pill: `padding: 9px 14px`, `border-radius: 999px`
- `background: #1C1C1C` (black), `color: #F5F3EF` (cream)
- `font-size: 13px`, `font-weight: 600`, `letter-spacing: 0.02em`
- Drop shadow `box-shadow: 0 6px 20px rgba(28,28,28,0.18)`
- Hover: lifts 1px and deepens the shadow
- Small printer icon (14×14 SVG) + label text "Export PDF"

## Interactions & Behavior

- **Editing**: Each note card is `contenteditable`. Clicking anywhere in the card focuses the text region; the cursor sits where clicked. Typing immediately updates the on-screen text.
- **Saving**: On every edit, the entire state object (4 sections × 6 strings) is serialized to `localStorage` under key `ws.pluralisticProgram.v1`. On reload, the state is rehydrated.
- **Reset to example**: There's no explicit "reset" button — if a student clears card 0, the gray placeholder example reappears (it's stored in `data-placeholder`, not in the editable text content).
- **Export PDF**:
  - Click the Export PDF button.
  - The handler adds class `print-target` to the worksheet's root element, adds class `print-slide` to `<body>`, then calls `window.print()`.
  - Print stylesheet (in `styles.css`) hides all other DOM, makes only `.print-target` and its descendants visible, removes the `transform: scale()`, and sets `@page { size: 1920px 1080px; margin: 0; }`.
  - After the print dialog closes (200ms timeout), classes are removed.
- **Scaling for any viewport**: A small inline script reads `window.innerWidth/innerHeight`, computes `Math.min(vw/1920, vh/1080)` and applies it as `transform: scale(s)` to the `#slide-frame` element. Re-runs on `resize`.

## State Management

Single in-memory object, mirrored to localStorage:

```ts
type WorksheetState = {
  problem:   [string, string, string, string, string, string];
  program:   [string, string, string, string, string, string];
  situation: [string, string, string, string, string, string];
  context:   [string, string, string, string, string, string];
};
```

Initial state: each row is `[exampleText, '', '', '', '', '']`. The example text comes from the section definition table above.

**Setter:** `setBox(sectionId, idx, value)` — shallow-copies the row, replaces index, persists via `localStorage.setItem(STORAGE_KEY, JSON.stringify(next))`.

**No other state.** No server, no auth, no validation — this is a single-student, browser-local worksheet.

## Design Tokens

Defined in `styles.css` as CSS custom properties under `:root`:

| Token | Value | Usage |
|---|---|---|
| `--vu-black` | `#1C1C1C` | Title, Export button bg |
| `--vu-ink` | `#2A2825` | Body text |
| `--vu-cream` | `#F5F3EF` | Note card background |
| `--vu-paper` | `#FBFAF7` | Page background |
| `--vu-sand` | `#E0D5C0` | (Available for accents) |
| `--vu-gold` | `#CFAE70` | Gradient stop |
| `--vu-gold-d` | `#B49248` | Gradient stop, focus rings |
| `--vu-oak` | `#946E24` | Section titles, brand accent |
| `--vu-rule` | `#D8D2C5` | Hairlines, card borders |
| `--vu-muted` | `#6F6A60` | Eyebrow, footer text |

**Typography stack:**
- `--sans`: `"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- `--serif`: `"Source Serif 4", "Source Serif Pro", Georgia, serif`
- `--mono`: `"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace` (not used on this worksheet but inherited from the design system)

Both fonts are loaded from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500;1,8..60,600&display=swap
```

**Spacing scale used:** 4, 6, 8, 10, 12, 14, 16, 18, 20, 28, 32, 44, 72 (px). No formal scale — values chosen ad-hoc to fit 1080px height.

**Radius scale:** 14px (note cards), 999px (pill buttons), 4px / 8px (used elsewhere in the system but not on this worksheet).

**Shadows:**
- Export button rest: `0 6px 20px rgba(28,28,28,0.18)`
- Export button hover: `0 10px 26px rgba(28,28,28,0.24)`
- Slide frame (page chrome only — not in the printed worksheet): `0 30px 80px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.25)`

## Assets
- No images or raster assets.
- One inline SVG icon: a 16×16 printer icon in the Export-PDF button (`<path d="M4 3h8v4H4z"/><path d="M4 11h8v3H4z"/><path d="M2 7h12v4H2z"/><circle cx="11.5" cy="9" r=".6"/>` strokes at 1.6px).
- Fonts loaded via Google Fonts CDN (Inter Tight, Source Serif 4).

## Files

Bundled in this handoff:

- **`Pluralistic Program Description.html`** — Entry HTML. Sets up the React + Babel runtime, the letterboxed `#slide-frame`, and mounts the worksheet. Replace this with the target codebase's standard page/route shell.
- **`pluralistic-worksheet.jsx`** — The worksheet React component (`PluralisticDescription`), section definitions, note card sub-component, and localStorage persistence hook. This is the file to port most carefully — copy is here.
- **`worksheet-core.jsx`** — Shared reusable primitives from the broader Evaluation Purpose worksheet system: `Editable` (contenteditable wrapper that doesn't reset caret), `Chip`, `Blank`, `EditableChipList`, `CategoryGroup`, `ExportButton`. Only `Editable` and `ExportButton` are used by this worksheet — feel free to inline-port just those.
- **`styles.css`** — Vanderbilt-Peabody design-system stylesheet (CSS custom properties, `.chip`, `.cat-chip`, `.chip-list`, `.ws-export`, and the print rules). Most of this is shared infra; the worksheet-specific bits are the print rules (`@media print`, `.print-target`, `@page` sizes) and the `.ws-export` button.

### Things to be aware of when porting

- The **caret-stability trick** in `Editable`: it pushes a new `textContent` into the DOM only when the *external* value changed (initial mount or reset). On every keystroke it just forwards `e.currentTarget.textContent` upward without re-setting the DOM — otherwise React would re-render and jam the caret to the end of the field. Preserve this pattern in whatever framework you target (Vue, Svelte, vanilla, etc.).
- The **print pipeline** relies on toggling classes on `<body>` and the target element, plus a `@page { size: 1920px 1080px; }` rule. If your target framework uses Shadow DOM or scoped styles, you'll need to lift these globals.
- The **scale-to-fit** script is a one-off `window.resize` listener. If the target codebase has a deck/slide presentation system, plug into that instead of re-implementing.
- **localStorage key** is `ws.pluralisticProgram.v1`. Bump the `v1` suffix if you change the state shape.
