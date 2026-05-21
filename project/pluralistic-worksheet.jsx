// Pluralistic Program Description — 1920×1080 worksheet
// Four sections (Problem, Program, Situation, Context). Each section has a
// big italic-serif title in the left margin, a lead paragraph, and a row of
// six editable note cards. The first card in each section is pre-filled with
// an example (light/italic) the student can clear or edit.

const { useRef: useRefPPD } = React;
const WS = window.WSCore;

// ── Section definitions ─────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "problem",
    title: "Problem",
    lead: "The issue or need the program addresses along with the significance and scope of the problem.",
    example: "Ex) Frontline leaders are not sharing critical issues in all hands meetings.",
  },
  {
    id: "program",
    title: "Program",
    lead: "The ‘program’ is simply a coordinated set of activities, resources, and experiences designed to produce an outcome (CDC, 1999). It can be an intervention, a policy, a process, etc. Here, outline goals and objectives, describe key activities, and identify the target population and stakeholders.",
    example: "Ex) A single-session workshop addresses audience analysis and communication strategies for frontline leaders, with a goal of increasing information sharing and collaborative problem-solving in meetings.",
  },
  {
    id: "situation",
    title: "Situation",
    lead: "The current circumstances that are immediate and directly observable, including any relevant environmental factors.",
    example: "Ex) The all-hands meeting format and agenda are new. The virtual format is unfamiliar and participant roles are unknown to frontline leaders.",
  },
  {
    id: "context",
    title: "Context",
    lead: "The broader environment or background that gives meaning to the situation. This includes historical, cultural, and systemic factors, and provides a more comprehensive understanding.",
    example: "Ex) The meeting involves participants from multiple refinery locations in the southern U.S. for a large oil and gas company. The corporate culture values transparency but the climate encourages solving your own problems without asking for help.",
  },
];

const BOXES_PER_ROW = 6;

const INTRO_PPD = "The goal is to ‘tell the story’ of the program in context and from multiple perspectives. In the end, this should be both familiar and intriguing to your evaluation sponsors. The way that you weave the story of the program as related to the problem it addresses, the current situation, and the broader context will set the stage for the scope and focus of the evaluation design.";

// ── Styles ──────────────────────────────────────────────────────────────
const ppd = {
  root: {
    background: "var(--vu-paper)",
    display: "grid",
    gridTemplateColumns: "16px 1fr",
  },
  goldBar: {
    background: "linear-gradient(180deg, var(--vu-gold-d), var(--vu-gold))",
  },
  inner: {
    padding: "32px 72px 28px 72px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  // Header band
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--vu-muted)",
    fontWeight: 700,
  },
  eyebrowGold: { color: "var(--vu-oak)" },
  title: {
    margin: "6px 0 0",
    fontFamily: "var(--sans)",
    fontSize: 54,
    lineHeight: 0.95,
    letterSpacing: "-0.035em",
    fontWeight: 700,
    color: "var(--vu-black)",
  },
  intro: {
    margin: "10px 0 0",
    maxWidth: 1640,
    fontSize: 16.5,
    lineHeight: 1.45,
    color: "var(--vu-ink)",
  },

  // Sections stack
  sections: {
    flex: 1,
    display: "grid",
    gridTemplateRows: "repeat(4, 1fr)",
    gap: 10,
    marginTop: 4,
  },
  section: {
    display: "grid",
    gridTemplateRows: "auto 1fr",
    gap: 10,
    paddingTop: 10,
    borderTop: "1px solid var(--vu-rule)",
  },
  sectionHead: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    alignItems: "baseline",
    gap: 28,
  },
  sectionTitle: {
    margin: 0,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontWeight: 500,
    color: "var(--vu-oak)",
    fontSize: 44,
    lineHeight: 1,
    letterSpacing: "-0.02em",
  },
  sectionLead: {
    margin: 0,
    fontSize: 15.5,
    lineHeight: 1.4,
    color: "var(--vu-ink)",
    maxWidth: 1420,
  },

  // Box row
  boxRow: {
    display: "grid",
    gridTemplateColumns: `repeat(${BOXES_PER_ROW}, 1fr)`,
    gap: 14,
    alignItems: "stretch",
  },

  // Footer
  footer: {
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
    marginTop: 0,
  },
};

// ── Note card — an editable square that holds one fragment of the story.
// First card per row may be pre-filled (`isExample`) with a placeholder
// instructor example in a lighter weight; student replaces it with their own.
function NoteCard({ value, onChange, placeholderExample, isExample }) {
  return (
    <div
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
      className="note-card"
    >
      <WS.Editable
        tag="div"
        multiline
        value={value}
        onChange={onChange}
        placeholder={isExample ? placeholderExample : ""}
        className="note-card__text"
        style={{
          width: "100%",
          minHeight: 48,
          outline: "none",
          fontFamily: "var(--sans)",
          fontSize: isExample ? 12 : 13,
          lineHeight: 1.35,
          color: "var(--vu-ink)",
          fontWeight: isExample ? 500 : 500,
          textAlign: isExample ? "center" : "left",
          letterSpacing: "-0.005em",
          cursor: "text",
        }}
      />
    </div>
  );
}

// ── Persisted state hook (one row per section × box)
function usePPDState() {
  const storageKey = "ws.pluralisticProgram.v1";
  const defaults = React.useMemo(() => {
    const o = {};
    for (const s of SECTIONS) {
      o[s.id] = Array.from({ length: BOXES_PER_ROW }, (_, i) => i === 0 ? s.example : "");
    }
    return o;
  }, []);

  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch (_) {}
    return defaults;
  });

  const setBox = React.useCallback((sectionId, idx, value) => {
    setState(prev => {
      const arr = [...(prev[sectionId] || [])]; arr[idx] = value;
      const next = { ...prev, [sectionId]: arr };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, []);

  return [state, setBox];
}

// ── Section row ─────────────────────────────────────────────────────────
function Section({ def, values, setBox }) {
  return (
    <section style={ppd.section}>
      <div style={ppd.sectionHead}>
        <h2 style={ppd.sectionTitle}>{def.title}</h2>
        <p style={ppd.sectionLead}>{def.lead}</p>
      </div>
      <div style={ppd.boxRow}>
        {Array.from({ length: BOXES_PER_ROW }).map((_, i) => (
          <NoteCard
            key={i}
            value={values[i] || ""}
            onChange={(v) => setBox(def.id, i, v)}
            placeholderExample={def.example}
            isExample={i === 0}
          />
        ))}
      </div>
    </section>
  );
}

// ── Top-level worksheet ────────────────────────────────────────────────
function PluralisticDescription() {
  const [state, setBox] = usePPDState();
  const targetRef = useRefPPD(null);

  return (
    <div ref={targetRef} className="ws" style={ppd.root}>
      <WS.ExportButton getTarget={() => targetRef.current} pageClass="print-slide" />
      <div style={ppd.goldBar}></div>

      <div style={ppd.inner}>
        <header>
          <div style={ppd.eyebrow}>
            <span>Vanderbilt Peabody College</span>
            <span style={{ opacity: 0.4 }}>—</span>
            <span style={ppd.eyebrowGold}>LLO 8230: Program Evaluation</span>
          </div>
          <h1 style={ppd.title}>Pluralistic Program Description.</h1>
          <p style={ppd.intro}>{INTRO_PPD}</p>
        </header>

        <div style={ppd.sections}>
          {SECTIONS.map(def => (
            <Section
              key={def.id}
              def={def}
              values={state[def.id] || []}
              setBox={setBox}
            />
          ))}
        </div>

        <footer style={ppd.footer}>
          <span>Program Evaluation Design Portfolio Project</span>
        </footer>
      </div>
    </div>
  );
}

window.PluralisticDescription = PluralisticDescription;
