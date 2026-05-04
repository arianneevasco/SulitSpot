import { useState, useCallback } from "react"

export type Category = {
    /** Unique identifier used in onChange callback */
    id: string;
    /** Display label shown on the chip */
    label: string;
    /** Optional emoji or short icon string rendered before the label */
    icon?: string;
    /** Post count shown as a small badge on the chip */
    count?: number;
};

export type CategoryFilterProps = {
    /** List of categories to render as filter chips */
    categories: Category[];
    /** Total post count displayed on the "All" chip badge */
    totalCount?: number;
    /**
     * Allow selecting multiple categories simultaneously.
     * When false, selecting a chip deselects all others.
     * @default true
     */
    multiSelect?: boolean;
    /**
     * Called whenever the active selection changes.
     * Receives an array of the selected category IDs.
     * An empty array signals that "All" is active.
     */
    onChange?: (selectedIds: string[]) => void;
    /** Extra className forwarded to the root element */
    className?: string;
};

// ─── Internal constant ────────────────────────────────────────────────────────

const ALL_ID = "__cf_all__";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CategoryFilter
 *
 * A horizontal strip of pill-shaped filter chips.
 * Supports multi-select, a dedicated "All" chip, per-category count badges,
 * a clear button, and an accessible live-region status line.
 *
 * @example
 * <CategoryFilter
 *   totalCount={24}
 *   categories={[
 *     { id: "food",  label: "Food",  icon: "🍱", count: 6 },
 *     { id: "items", label: "Items", icon: "🏷️", count: 11 },
 *     { id: "tips",  label: "Tips",  icon: "📍", count: 7 },
 *   ]}
 *   onChange={(ids) => console.log("selected:", ids)}
 * />
 */
export default function CategoryFilter({
    categories,
    totalCount,
    multiSelect = true,
    onChange,
    className = "",
}: CategoryFilterProps) {
    // Internal selection state — starts with ALL_ID selected
    const [selected, setSelected] = useState<Set<string>>(new Set([ALL_ID]));

    const toggle = useCallback(
        (id: string) => {
            setSelected((prev) => {
                const next = new Set(prev);

                if (id === ALL_ID) {
                    next.clear();
                    next.add(ALL_ID);
                } else {
                    next.delete(ALL_ID);
                    if (next.has(id)) {
                        next.delete(id);
                        if (next.size === 0) next.add(ALL_ID); // fallback to "All"
                    } else {
                        if (!multiSelect) next.clear(); // single-select: clear others first
                        next.add(id);
                    }
                }

                onChange?.(next.has(ALL_ID) ? [] : [...next]);
                return next;
            });
        },
        [multiSelect, onChange]
    );

    const clearAll = useCallback(() => {
        setSelected(new Set([ALL_ID]));
        onChange?.([]);
    }, [onChange]);

    // ─── Derived state ──────────────────────────────────────────────────────────

    const isAll = selected.has(ALL_ID);

    const selectedCount = isAll
        ? (totalCount ?? 0)
        : [...selected].reduce((sum, id) => {
            const cat = categories.find((c) => c.id === id);
            return sum + (cat?.count ?? 0);
        }, 0);

    const selectedLabels = isAll
        ? []
        : [...selected]
            .map((id) => categories.find((c) => c.id === id)?.label)
            .filter((l): l is string => Boolean(l));

    // ─── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className={`cf ${className}`} aria-label="Category filter">

            {/* Chip strip */}
            <div className="cf-row" role="group" aria-label="Filter by category">

                {/* "All" chip */}
                <button>
                    type="button"
                    className={`cf-chip${isAll ? " cf-chip--on" : ""}`}
                    onClick={() => toggle(ALL_ID)}
                    aria-pressed={isAll}

                    All
                    {totalCount !== undefined && (
                        <span className={`cf-badge${isAll ? " cf-badge--on" : ""}`}>
                            {totalCount}
                        </span>
                    )}
                </button>

                <span className="cf-sep" aria-hidden="true" />

                {/* Category chips */}
                {categories.map((cat) => {
                    const on = selected.has(cat.id);
                    return (
                        <button>
                            key={cat.id}
                            type="button"
                            className={`cf-chip${on ? " cf-chip--on" : ""}`}
                            onClick={() => toggle(cat.id)}
                            aria-pressed={on}

                            {cat.icon && (
                                <span className="cf-icon" aria-hidden="true">
                                    {cat.icon}
                                </span>
                            )}
                            {cat.label}
                            {cat.count !== undefined && (
                                <span className={`cf-badge${on ? " cf-badge--on" : ""}`}>
                                    {cat.count}
                                </span>
                            )}
                        </button>
                    );
                })}

                {/* Clear button — only shown when a specific category is active */}
                {!isAll && (
                    <>
                        <span className="cf-sep" aria-hidden="true" />
                        <button
                            type="button"
                            className="cf-clear"
                            onClick={clearAll}
                            aria-label="Clear all filters"
                        >
                            ✕ Clear
                        </button>
                    </>
                )}
            </div>

            {/* Accessible status line */}
            <p className="cf-status" aria-live="polite" aria-atomic="true">
                {isAll
                    ? `Showing all${totalCount !== undefined ? ` ${totalCount}` : ""} posts`
                    : `Showing ${selectedCount} post${selectedCount !== 1 ? "s" : ""}${selectedLabels.length ? ` in ${selectedLabels.join(", ")}` : ""
                    }`}
            </p>

            {/* Scoped styles */}
            <style>{`
        .cf {
          font-family: var(--font-sans, system-ui, sans-serif);
          padding: 1rem 0;
        }

        .cf-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
        }

        /* ── Chip base ── */
        .cf-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 13px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
          border: 0.5px solid var(--color-border-secondary, rgba(0,0,0,0.18));
          background: var(--color-background-primary, #fff);
          color: var(--color-text-secondary, #666);
          transition:
            background 0.14s ease,
            border-color 0.14s ease,
            color 0.14s ease,
            transform 0.1s ease;
          user-select: none;
          white-space: nowrap;
        }
        .cf-chip:hover {
          background: var(--color-background-secondary, #f5f5f3);
          color: var(--color-text-primary, #111);
          border-color: var(--color-border-primary, rgba(0,0,0,0.32));
        }
        .cf-chip:active {
          transform: scale(0.96);
        }
        .cf-chip:focus-visible {
          outline: 2px solid #1D9E75;
          outline-offset: 2px;
        }

        /* ── Active chip ── */
        .cf-chip--on {
          background: #1D9E75;
          border-color: #0F6E56;
          color: #fff;
          font-weight: 500;
        }
        .cf-chip--on:hover {
          background: #0F6E56;
          color: #fff;
          border-color: #085041;
        }

        /* ── Badge ── */
        .cf-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          border-radius: 999px;
          padding: 1px 6px;
          line-height: 1.4;
          background: rgba(29, 158, 117, 0.12);
          color: #0F6E56;
        }
        .cf-badge--on {
          background: rgba(255, 255, 255, 0.22);
          color: #fff;
        }

        /* ── Icon ── */
        .cf-icon {
          font-size: 13px;
          line-height: 1;
        }

        /* ── Separator ── */
        .cf-sep {
          display: inline-block;
          width: 0.5px;
          height: 18px;
          background: var(--color-border-tertiary, rgba(0,0,0,0.1));
          align-self: center;
          flex-shrink: 0;
        }

        /* ── Clear button ── */
        .cf-clear {
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          border: none;
          background: none;
          color: var(--color-text-tertiary, #999);
          cursor: pointer;
          transition: color 0.14s;
          white-space: nowrap;
        }
        .cf-clear:hover {
          color: var(--color-text-primary, #111);
        }
        .cf-clear:focus-visible {
          outline: 2px solid #1D9E75;
          outline-offset: 2px;
          border-radius: 999px;
        }

        /* ── Status line ── */
        .cf-status {
          margin: 10px 0 0;
          font-size: 12px;
          color: var(--color-text-tertiary, #999);
          line-height: 1.5;
        }
      `}</style>
        </div>
    );
}