import { useState, useRef, useEffect, useCallback } from "react";

export type SearchSuggestion = {
  /** Unique key for this suggestion */
  id: string;
  /** Primary text label */
  label: string;
  /** Optional sub-text (e.g. category · location) */
  sublabel?: string;
  /** Optional emoji or icon string */
  icon?: string;
};

export type SearchBarProps = {
  /** Placeholder text inside the input */
  placeholder?: string;
  /** Initial value */
  defaultValue?: string;
  /** List of suggestions to filter and display while typing */
  suggestions?: SearchSuggestion[];
  /**
   * Fires on every keystroke with the current query.
   * Use this to drive external async suggestion fetching.
   */
  onQueryChange?: (query: string) => void;
  /**
   * Fires when the user submits (Enter key or search icon click).
   * Receives the current query string.
   */
  onSearch?: (query: string) => void;
  /**
   * Fires when a suggestion is selected from the dropdown.
   * Also triggers onSearch with the suggestion label.
   */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  /** Extra className forwarded to the root element */
  className?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={styles.mark}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchBar({
  placeholder = "Search posts, food, tips…",
  defaultValue = "",
  suggestions = [],
  onQueryChange,
  onSearch,
  onSuggestionSelect,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // ─── Filtered suggestions ──────────────────────────────────────────────────

  const filtered = query.trim()
    ? suggestions.filter(
      (s) =>
        s.label.toLowerCase().includes(query.toLowerCase()) ||
        s.sublabel?.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    setActiveIndex(-1);
    onQueryChange?.(val);
  };

  const handleClear = () => {
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    onQueryChange?.("");
    inputRef.current?.focus();
  };

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setOpen(false);
      onSearch?.(query.trim());
    }
  }, [query, onSearch]);

  const handleSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label);
    setOpen(false);
    setActiveIndex(-1);
    onSuggestionSelect?.(suggestion);
    onSearch?.(suggestion.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) {
      if (e.key === "Enter") handleSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelect(filtered[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  // ─── Click outside to close ────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  const showDropdown = open && filtered.length > 0;

  return (
    <div ref={rootRef} className={className} style={styles.root}>
      {/* Input row */}
      <div style={styles.row}>
        <div
          style={{
            ...styles.field,
            ...(open && query ? styles.fieldFocused : {}),
          }}
        >
          {/* Search icon — clickable trigger */}
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
            style={styles.iconBtn}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="var(--color-text-tertiary, #bbb)"
              strokeWidth="1.5"
            >
              <circle cx="6.5" cy="6.5" r="4.5" />
              <path d="M10.5 10.5l3 3" strokeLinecap="round" />
            </svg>
          </button>

          <input>
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="sb-listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `sb-option-${activeIndex}` : undefined
            }
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            style={styles.input}
          </input>


          <button>
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={styles.clearBtn}


          </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showDropdown && (
        <ul
          id="sb-listbox"
          role="listbox"
          aria-label="Search suggestions"
          style={styles.dropdown}
        >
          {filtered.map((s, i) => (
            <li
              key={s.id}
              id={`sb-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                ...styles.item,
                ...(i === activeIndex ? styles.itemActive : {}),
                ...(i < filtered.length - 1 ? styles.itemBorder : {}),
              }}
            >
              {s.icon && (
                <span style={styles.itemIcon} aria-hidden="true">
                  {s.icon}
                </span>
              )}
              <div>
                <div style={styles.itemLabel}>{highlight(s.label, query)}</div>
                {s.sublabel && (
                  <div style={styles.itemSub}>{s.sublabel}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input[type="search"] { -webkit-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  root: {
    fontFamily: "var(--font-sans, system-ui, sans-serif)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    position: "relative",
  } as React.CSSProperties,

  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,

  field: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "0.5px solid var(--color-border-secondary, rgba(0,0,0,0.2))",
    background: "var(--color-background-primary, #fff)",
    transition: "border-color 0.15s",
  } as React.CSSProperties,

  fieldFocused: {
    borderColor: "#1D9E75",
  } as React.CSSProperties,

  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 14,
    color: "var(--color-text-primary, #111)",
    minWidth: 0,
  } as React.CSSProperties,

  clearBtn: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "none",
    background: "var(--color-border-secondary, rgba(0,0,0,0.15))",
    color: "var(--color-text-secondary, #666)",
    fontSize: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 0,
    lineHeight: 1,
  } as React.CSSProperties,

  iconBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  dropdown: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    border: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.1))",
    borderRadius: 12,
    background: "var(--color-background-primary, #fff)",
    overflow: "hidden",
  } as React.CSSProperties,

  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    cursor: "pointer",
    transition: "background 0.1s",
  } as React.CSSProperties,

  itemActive: {
    background: "var(--color-background-secondary, #f5f5f3)",
  } as React.CSSProperties,

  itemBorder: {
    borderBottom: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.07))",
  } as React.CSSProperties,

  itemIcon: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  itemLabel: {
    fontSize: 13,
    color: "var(--color-text-primary, #111)",
  } as React.CSSProperties,

  itemSub: {
    fontSize: 11,
    color: "var(--color-text-tertiary, #aaa)",
    marginTop: 1,
  } as React.CSSProperties,

  mark: {
    background: "transparent",
    color: "#1D9E75",
    fontWeight: 500,
  } as React.CSSProperties,
} satisfies Record<string, React.CSSProperties>;