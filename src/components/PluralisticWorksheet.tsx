"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Editable } from "./Editable";

// ── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "problem" as const,
    title: "Problem",
    lead: "The issue or need the program addresses along with the significance and scope of the problem.",
    example: "Ex) Frontline leaders are not sharing critical issues in all hands meetings.",
  },
  {
    id: "program" as const,
    title: "Program",
    lead: "The ‘program’ is simply a coordinated set of activities, resources, and experiences designed to produce an outcome (CDC, 1999). It can be an intervention, a policy, a process, etc. Here, outline goals and objectives, describe key activities, and identify the target population and stakeholders.",
    example: "Ex) A single-session workshop addresses audience analysis and communication strategies for frontline leaders, with a goal of increasing information sharing and collaborative problem-solving in meetings.",
  },
  {
    id: "situation" as const,
    title: "Situation",
    lead: "The current circumstances that are immediate and directly observable, including any relevant environmental factors.",
    example: "Ex) The all-hands meeting format and agenda are new. The virtual format is unfamiliar and participant roles are unknown to frontline leaders.",
  },
  {
    id: "context" as const,
    title: "Context",
    lead: "The broader environment or background that gives meaning to the situation. This includes historical, cultural, and systemic factors, and provides a more comprehensive understanding.",
    example: "Ex) The meeting involves participants from multiple refinery locations in the southern U.S. for a large oil and gas company. The corporate culture values transparency but the climate encourages solving your own problems without asking for help.",
  },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const BOXES_PER_ROW = 6;
const STORAGE_KEY = "ws.pluralisticProgram.v1";

const INTRO =
  "The goal is to ‘tell the story’ of the program in context and from multiple perspectives. In the end, this should be both familiar and intriguing to your evaluation sponsors. The way that you weave the story of the program as related to the problem it addresses, the current situation, and the broader context will set the stage for the scope and focus of the evaluation design.";

// ── State ────────────────────────────────────────────────────────────────────
type WorksheetState = Record<SectionId, string[]>;

function makeDefaults(): WorksheetState {
  const o = {} as WorksheetState;
  for (const s of SECTIONS) {
    o[s.id] = Array.from({ length: BOXES_PER_ROW }, (_, i) => (i === 0 ? s.example : ""));
  }
  return o;
}

function usePPDState(): [WorksheetState, (sectionId: SectionId, idx: number, value: string) => void] {
  const defaults = makeDefaults();

  const [state, setState] = useState<WorksheetState>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch (_) {}
    return defaults;
  });

  const setBox = useCallback((sectionId: SectionId, idx: number, value: string) => {
    setState((prev) => {
      const arr = [...(prev[sectionId] ?? [])];
      arr[idx] = value;
      const next = { ...prev, [sectionId]: arr };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, []);

  return [state, setBox];
}

// ── Note card ────────────────────────────────────────────────────────────────
function NoteCard({
  value, onChange, placeholderExample, isExample,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholderExample: string;
  isExample: boolean;
}) {
  return (
    <div
      className="note-card"
      style={{
        background: "var(--vu-cream)",
        border: "1px solid var(--vu-rule)",
        borderRadius: 14,
        padding: "10px 12px",
        minHeight: 96,
        display: "flex",
        alignItems: isExample ? "center" : "flex-start",
        position: "relative",
      }}
    >
      <Editable
        multiline
        value={value}
        onChange={onChange}
        placeholder={isExample ? placeholderExample : ""}
        className="note-card__text"
        style={{
          width: "100%",
          minHeight: 48,
          outline: "none",
          fontFamily: "var(--font-inter-tight), 'Inter Tight', sans-serif",
          fontSize: isExample ? 12 : 13,
          lineHeight: 1.35,
          color: "var(--vu-ink)",
          fontWeight: 500,
          textAlign: isExample ? "center" : "left",
          letterSpacing: "-0.005em",
          cursor: "text",
        }}
      />
    </div>
  );
}

// ── Section row ──────────────────────────────────────────────────────────────
function Section({
  def, values, setBox,
}: {
  def: (typeof SECTIONS)[number];
  values: string[];
  setBox: (id: SectionId, i: number, v: string) => void;
}) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: 10,
        paddingTop: 10,
        borderTop: "1px solid var(--vu-rule)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          alignItems: "baseline",
          gap: 28,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-source-serif-4), 'Source Serif 4', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "var(--vu-oak)",
            fontSize: 44,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {def.title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 15.5,
            lineHeight: 1.4,
            color: "var(--vu-ink)",
            maxWidth: 1420,
          }}
        >
          {def.lead}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOXES_PER_ROW}, 1fr)`,
          gap: 14,
          alignItems: "stretch",
        }}
      >
        {Array.from({ length: BOXES_PER_ROW }).map((_, i) => (
          <NoteCard
            key={i}
            value={values[i] ?? ""}
            onChange={(v) => setBox(def.id, i, v)}
            placeholderExample={def.example}
            isExample={i === 0}
          />
        ))}
      </div>
    </section>
  );
}

// ── Export button ────────────────────────────────────────────────────────────
function ExportButton({ getTarget }: { getTarget: () => HTMLElement | null }) {
  const onClick = () => {
    const target = getTarget();
    if (!target) return;
    target.classList.add("print-target");
    document.body.classList.add("print-slide");
    requestAnimationFrame(() => {
      window.print();
      setTimeout(() => {
        target.classList.remove("print-target");
        document.body.classList.remove("print-slide");
      }, 200);
    });
  };
  return (
    <button className="ws-export" onClick={onClick} title="Print or save as PDF">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
        <path d="M4 3h8v4H4z" />
        <path d="M4 11h8v3H4z" />
        <path d="M2 7h12v4H2z" />
        <circle cx="11.5" cy="9" r=".6" fill="currentColor" stroke="none" />
      </svg>
      Export PDF
    </button>
  );
}

// ── Scale-to-fit ─────────────────────────────────────────────────────────────
function useSlideScale(frameRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const W = 1920, H = 1080;
    const fit = () => {
      const frame = frameRef.current;
      if (!frame) return;
      const s = Math.min(window.innerWidth / W, window.innerHeight / H);
      frame.style.transform = `scale(${s})`;
    };
    window.addEventListener("resize", fit);
    fit();
    return () => window.removeEventListener("resize", fit);
  }, [frameRef]);
}

// ── Top-level worksheet ──────────────────────────────────────────────────────
export function PluralisticWorksheet() {
  const [state, setBox] = usePPDState();
  const frameRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<HTMLDivElement>(null);
  useSlideScale(frameRef);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#1c1c1c",
      }}
    >
      <div
        ref={frameRef}
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "center center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.25)",
          position: "relative",
          background: "var(--vu-paper)",
        }}
      >
        {/* Worksheet root */}
        <div
          ref={wsRef}
          style={{
            width: "100%",
            height: "100%",
            background: "var(--vu-paper)",
            display: "grid",
            gridTemplateColumns: "16px 1fr",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            fontFamily: "var(--font-inter-tight), 'Inter Tight', sans-serif",
            color: "var(--vu-ink)",
          }}
        >
          <ExportButton getTarget={() => wsRef.current} />

          {/* Gold gradient bar */}
          <div
            aria-hidden="true"
            style={{ background: "linear-gradient(180deg, var(--vu-gold-d), var(--vu-gold))" }}
          />

          {/* Content */}
          <div
            style={{
              padding: "32px 72px 28px 72px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 0,
            }}
          >
            {/* Header */}
            <header>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--vu-muted)",
                  fontWeight: 700,
                }}
              >
                <span>Vanderbilt Peabody College</span>
                <span style={{ opacity: 0.4 }}>&mdash;</span>
                <span style={{ color: "var(--vu-oak)" }}>LLO 8230: Program Evaluation</span>
              </div>
              <h1
                style={{
                  margin: "6px 0 0",
                  fontFamily: "var(--font-inter-tight), 'Inter Tight', sans-serif",
                  fontSize: 54,
                  lineHeight: 0.95,
                  letterSpacing: "-0.035em",
                  fontWeight: 700,
                  color: "var(--vu-black)",
                }}
              >
                Pluralistic Program Description.
              </h1>
              <p
                style={{
                  margin: "10px 0 0",
                  maxWidth: 1640,
                  fontSize: 16.5,
                  lineHeight: 1.45,
                  color: "var(--vu-ink)",
                }}
              >
                {INTRO}
              </p>
            </header>

            {/* Sections */}
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateRows: "repeat(4, 1fr)",
                gap: 10,
                marginTop: 4,
                minHeight: 0,
              }}
            >
              {SECTIONS.map((def) => (
                <Section
                  key={def.id}
                  def={def}
                  values={state[def.id] ?? []}
                  setBox={setBox}
                />
              ))}
            </div>

            {/* Footer */}
            <footer
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--vu-muted)",
                fontWeight: 600,
                paddingTop: 6,
                borderTop: "1px solid var(--vu-rule)",
              }}
            >
              <span>Program Evaluation Design Portfolio Project</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
