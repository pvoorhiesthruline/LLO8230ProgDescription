// Shared building blocks for the Evaluation Purpose worksheet variations.
// Each variation imports these via window.WSCore.
const { useState, useEffect, useRef, useCallback } = React;

// ── The five evaluation-type categories the student selects from.
// Sourced from the LLO program description rubric — short label + tooltip
// description (description shown on hover).
const PURPOSE_CATEGORIES = [
  { id: "needs",    label: "Needs assessment",
    desc: "The gap between current conditions and desired outcomes. Answers ‘what is’ v ‘what should be’." },
  { id: "process",  label: "Process evaluation",
    desc: "How a program is operating. Supports decisions about changing or improving program delivery." },
  { id: "outcome",  label: "Outcome evaluation",
    desc: "Whether a program’s goals are being met — short-term results (changes in knowledge, skills, behavior). Supports similar decisions as process evaluation." },
  { id: "impact",   label: "Impact evaluation",
    desc: "Whether long-term, broad changes are happening as a result of a program. Supports high-stakes decisions like continuing or scaling." },
  { id: "economic", label: "Economic evaluation",
    desc: "Assessment of costs associated with a need or a program. Supports decisions about cost effectiveness and cost-benefit analysis." },
];

// ── Default content (LLO-program-flavored placeholders the student can replace)
const DEFAULTS = {
  purposeCategories: [],   // student selects
  purposeSentence: "",
  users: ["", "", ""],
  uses:  ["", "", ""],
  aim:        "",
  ultimately: "",
};

// ── Persisted-state hook ───────────────────────────────────────────────
// One row per variation key so each artboard remembers its own edits.
function useWorksheetState(variantKey) {
  const storageKey = `ws.evalPurpose.${variantKey}`;
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (_) {}
    return DEFAULTS;
  });
  const set = useCallback((patch) => {
    setState(prev => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, [storageKey]);
  // also a setter for array entries
  const setArr = useCallback((field, idx, value) => {
    set(prev => {
      const arr = [...prev[field]]; arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  }, [set]);
  return [state, set, setArr];
}

// ── Editable pieces ────────────────────────────────────────────────────
// contentEditable spans that fire onChange on blur — keeps caret stable
// during typing (vs. controlled re-render on every keystroke).

function Editable({ value, onChange, className, placeholder, style, tag = "span", multiline = false }) {
  const ref = useRef(null);

  // Push value in only when it changed from the outside (e.g. reset).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.textContent !== value) el.textContent = value || "";
  }, [value]);

  const onInput = (e) => {
    // Don't re-set textContent on every keystroke — would jump caret to end.
    // Just forward the raw text upward; parent will store it.
    onChange(e.currentTarget.textContent);
  };

  const onKeyDown = (e) => {
    if (!multiline && e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
  };

  const Tag = tag;
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={onInput}
      onKeyDown={onKeyDown}
      className={className}
      style={style}
      data-placeholder={placeholder}
    />
  );
}

function Chip({ value, onChange, placeholder = "type…", style }) {
  return <Editable value={value} onChange={onChange} className="chip" placeholder={placeholder} style={style} />;
}

function Blank({ value, onChange, placeholder = "fill in…", minWidth = 240, style }) {
  return <Editable value={value} onChange={onChange} className="blank" placeholder={placeholder}
                   style={{ minWidth, ...style }} />;
}

// ── Editable list of free-text chips with add/remove ──────────────────
// Wraps each chip in a hover-revealed × button and appends a dashed "+ Add"
// pill at the end. `minItems` (default 1) keeps the list from emptying out.
// `variant` ("default" | "compact") scales the add-button + remove-button.

function EditableChipList({
  items, onChange,
  placeholder = (i) => `item ${i + 1}`,
  chipStyle, addLabel = "Add",
  minItems = 1, maxItems = 8,
  variant = "default",
}) {
  const compact = variant === "compact";
  const update = (i, v) => onChange(items.map((x, idx) => idx === i ? v : x));
  const remove = (i)    => onChange(items.filter((_, idx) => idx !== i));
  const add    = ()     => onChange([...items, ""]);
  return (
    <div className={"chip-list" + (compact ? " chip-list--compact" : "")}>
      {items.map((v, i) => (
        <span key={i} className="chip-wrap">
          <Chip value={v} placeholder={placeholder(i)} style={chipStyle}
                onChange={(x) => update(i, x)} />
          {items.length > minItems && (
            <button type="button" className={"chip-remove" + (compact ? " chip-remove--compact" : "")}
                    onClick={() => remove(i)}
                    aria-label={`Remove ${v || "item"}`}
                    title="Remove">
              <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
                <path d="M2 2 L8 8 M8 2 L2 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </span>
      ))}
      {items.length < maxItems && (
        <button type="button" className={"chip-add" + (compact ? " chip-add--compact" : "")}
                onClick={add} title="Add a new item">
          <span className="chip-add__plus" aria-hidden="true">+</span>
          <span>{addLabel}</span>
        </button>
      )}
    </div>
  );
}


// Click a chip to toggle. Active chips fill with Vanderbilt gold; inactive
// chips are outlined. Hover reveals the description in a tooltip card.
// `variant` controls visual scale: "default" (slide) | "compact" (letter).

function CategoryGroup({ selected, onToggle, variant = "default" }) {
  const compact = variant === "compact";
  return (
    <div className={"cat-group" + (compact ? " cat-group--compact" : "")}>
      {PURPOSE_CATEGORIES.map(cat => {
        const active = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            className={"cat-chip" + (active ? " is-active" : "") + (compact ? " cat-chip--compact" : "")}
            aria-pressed={active}
            onClick={() => onToggle(cat.id)}
            title={cat.desc}
          >
            <span className="cat-chip__dot" aria-hidden="true"></span>
            <span className="cat-chip__label">{cat.label}</span>
            <span className="cat-chip__tip" role="tooltip">{cat.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Export-to-PDF button ───────────────────────────────────────────────
// Click → host the artboard's DOM node as .print-target, set body class for
// page size, window.print(), then revert. Each variation passes its target
// element and its page size.

function ExportButton({ getTarget, pageClass = "print-slide", label = "Export PDF" }) {
  const onClick = () => {
    const target = getTarget();
    if (!target) return;
    target.classList.add("print-target");
    document.body.classList.add(pageClass);
    // Defer print to next frame so the class hits the stylesheet
    requestAnimationFrame(() => {
      window.print();
      // Clean up after the print dialog closes
      setTimeout(() => {
        target.classList.remove("print-target");
        document.body.classList.remove(pageClass);
      }, 200);
    });
  };
  return (
    <button className="ws-export" onClick={onClick} title="Print or save as PDF">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3h8v4H4z"/><path d="M4 11h8v3H4z"/><path d="M2 7h12v4H2z"/>
        <circle cx="11.5" cy="9" r=".6" fill="currentColor" stroke="none"/>
      </svg>
      {label}
    </button>
  );
}

// ── Footer copy (operating principles — fixed text from the original) ──
const OPERATING_PRINCIPLES_HTML = (
  <>
    Consider establishing <b>operating principles</b> to guide the evaluation.
    The principle of <b>utility</b> ensures that the evaluation prioritizes findings that
    can directly guide next steps and that the evaluation sponsors are ready and willing to
    champion the evaluation process. <b>Feasibility</b> ensures that the evaluation can be
    completed within a reasonable timeframe and that appropriate resources are available
    (or can be made available). Other principles may be agreed upon with stakeholders.
  </>
);

const INTRO_COPY = "The evaluation purpose is a brief paragraph that sets the frame for everything that is to come. This template helps to clearly articulate the goals, users, and intended outcomes of the evaluation. It helps us ‘keep the end in mind’ by encouraging thoughtful consideration of how evaluation results will be applied and what specific actions or decisions they will inform.";

window.WSCore = {
  DEFAULTS,
  PURPOSE_CATEGORIES,
  useWorksheetState,
  Editable, Chip, Blank, CategoryGroup, EditableChipList,
  ExportButton,
  OPERATING_PRINCIPLES_HTML,
  INTRO_COPY,
};
