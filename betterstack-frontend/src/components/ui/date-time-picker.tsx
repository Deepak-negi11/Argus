'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';

/**
 * A tasteful, theme-aware date + time picker.
 *
 * Drop-in replacement for `<input type="datetime-local">`:
 *   - `value` / `onChange` speak the same `YYYY-MM-DDTHH:mm` local string.
 *   - `min` / `max` are also `YYYY-MM-DDTHH:mm` strings (day-level clamping).
 *
 * The popover renders into a portal with fixed positioning so it is never
 * clipped by `overflow-hidden` ancestors.
 */

const pad = (n: number) => String(n).padStart(2, '0');

function fromInputString(value: string): Date | null {
    if (!value) return null;
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!m) return null;
    const [, y, mo, d, h, mi] = m;
    const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi));
    return Number.isNaN(date.getTime()) ? null : date;
}

function toInputString(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Approximate rendered popover height (px); used to decide flip-above vs below. */
const POPOVER_HEIGHT = 360;

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
    placeholder?: string;
    ariaLabel?: string;
    /**
     * Current app theme. Required because the popover portals into
     * `document.body`, which is outside the page's `.dark` wrapper — so it must
     * carry the `dark` class itself to inherit the dark CSS variables.
     */
    theme?: 'dark' | 'light';
}

export function DateTimePicker({
    value,
    onChange,
    min,
    max,
    placeholder = 'Pick a date & time',
    ariaLabel,
    theme = 'dark',
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const selected = useMemo(() => fromInputString(value), [value]);
    const minDate = useMemo(() => fromInputString(min || ''), [min]);
    const maxDate = useMemo(() => fromInputString(max || ''), [max]);

    // The month currently shown in the grid.
    const [viewDate, setViewDate] = useState<Date>(() => startOfDay(selected || new Date()));

    useEffect(() => {
        if (open) setViewDate(startOfDay(selected || maxDate || new Date()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Position the popover relative to the trigger (fixed → escapes overflow clipping).
    const reposition = () => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const below = window.innerHeight - r.bottom;
        const top = below < POPOVER_HEIGHT && r.top > POPOVER_HEIGHT ? r.top - POPOVER_HEIGHT - 8 : r.bottom + 8;
        setCoords({ top, left: r.left, width: r.width });
    };

    useLayoutEffect(() => {
        if (!open) return;
        reposition();
        const handler = () => reposition();
        window.addEventListener('resize', handler);
        window.addEventListener('scroll', handler, true);
        return () => {
            window.removeEventListener('resize', handler);
            window.removeEventListener('scroll', handler, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Close on outside click / Escape.
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (
                popoverRef.current?.contains(e.target as Node) ||
                triggerRef.current?.contains(e.target as Node)
            ) {
                return;
            }
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const isDayDisabled = (day: Date) => {
        if (minDate && startOfDay(day) < startOfDay(minDate)) return true;
        if (maxDate && startOfDay(day) > startOfDay(maxDate)) return true;
        return false;
    };

    // Clamp a candidate datetime into [min, max].
    const clamp = (d: Date) => {
        let next = d;
        if (minDate && next < minDate) next = new Date(minDate);
        if (maxDate && next > maxDate) next = new Date(maxDate);
        return next;
    };

    const commit = (d: Date) => onChange(toInputString(clamp(d)));

    const handlePickDay = (day: Date) => {
        const base = selected || new Date();
        const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), base.getHours(), base.getMinutes());
        commit(next);
    };

    // ----- time helpers -----
    const hours24 = selected ? selected.getHours() : 12;
    const minutes = selected ? selected.getMinutes() : 0;
    const isPM = hours24 >= 12;
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    const setTime = (h24: number, m: number) => {
        const base = selected || startOfDay(maxDate || new Date());
        commit(new Date(base.getFullYear(), base.getMonth(), base.getDate(), h24, m));
    };
    const stepHour = (delta: number) => setTime((hours24 + delta + 24) % 24, minutes);
    const stepMinute = (delta: number) => {
        let m = minutes + delta;
        let h = hours24;
        if (m > 59) { m -= 60; h = (h + 1) % 24; }
        if (m < 0) { m += 60; h = (h + 23) % 24; }
        setTime(h, m);
    };
    const setMeridiem = (pm: boolean) => {
        if (pm === isPM) return;
        setTime((hours24 + 12) % 24, minutes);
    };

    // ----- calendar grid -----
    const grid = useMemo(() => {
        const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const startOffset = firstOfMonth.getDay();
        const gridStart = new Date(firstOfMonth);
        gridStart.setDate(1 - startOffset);
        return Array.from({ length: 42 }, (_, i) => {
            const d = new Date(gridStart);
            d.setDate(gridStart.getDate() + i);
            return d;
        });
    }, [viewDate]);

    const today = new Date();

    const displayLabel = selected
        ? selected.toLocaleString([], {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
          })
        : placeholder;

    const popover = open && coords ? createPortal(
        <div
            ref={popoverRef}
            className={`${theme === 'dark' ? 'dark ' : ''}dtp-popover fixed z-[60] w-[300px] rounded-2xl border border-[var(--line)] bg-[var(--surface-elev)] p-3 shadow-2xl`}
            style={{
                top: coords.top,
                left: Math.max(8, Math.min(coords.left, window.innerWidth - 308)),
                boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px var(--line-soft)',
            }}
        >
            {/* Month header */}
            <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[13px] font-semibold text-[var(--text)]">
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <div className="flex items-center gap-1">
                    <NavBtn onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} aria="Previous month">
                        <ChevronLeft className="h-4 w-4" />
                    </NavBtn>
                    <NavBtn onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} aria="Next month">
                        <ChevronRight className="h-4 w-4" />
                    </NavBtn>
                </div>
            </div>

            {/* Weekday row */}
            <div className="grid grid-cols-7 gap-0.5 px-0.5">
                {WEEKDAYS.map((w, i) => (
                    <div key={i} className="grid h-7 place-items-center font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
                        {w}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-0.5 px-0.5">
                {grid.map((day, i) => {
                    const inMonth = day.getMonth() === viewDate.getMonth();
                    const disabled = isDayDisabled(day);
                    const isSel = selected && sameDay(day, selected);
                    const isToday = sameDay(day, today);
                    return (
                        <button
                            key={i}
                            type="button"
                            disabled={disabled}
                            onClick={() => handlePickDay(day)}
                            className={[
                                'relative grid h-8 w-full place-items-center rounded-lg text-[12.5px] tabular-nums transition',
                                disabled ? 'cursor-not-allowed opacity-25' : 'cursor-pointer',
                                isSel
                                    ? 'bg-[var(--brand)] font-semibold text-white shadow-[0_4px_12px_var(--brand-ring)]'
                                    : inMonth
                                        ? 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                                        : 'text-[var(--text-faint)] hover:bg-[var(--surface-2)]',
                            ].join(' ')}
                        >
                            {day.getDate()}
                            {isToday && !isSel && (
                                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--brand)]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Time picker */}
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">Time</span>
                <div className="flex items-center gap-1.5">
                    <Stepper value={pad(hours12)} onUp={() => stepHour(1)} onDown={() => stepHour(-1)} label="hour" />
                    <span className="text-[15px] font-semibold text-[var(--text-faint)]">:</span>
                    <Stepper value={pad(minutes)} onUp={() => stepMinute(1)} onDown={() => stepMinute(-1)} label="minute" />
                    <div className="ml-1 flex flex-col overflow-hidden rounded-lg border border-[var(--line)]">
                        <button
                            type="button"
                            onClick={() => setMeridiem(false)}
                            className={`px-2 py-0.5 text-[10px] font-bold transition ${!isPM ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--surface-3)]'}`}
                        >AM</button>
                        <button
                            type="button"
                            onClick={() => setMeridiem(true)}
                            className={`px-2 py-0.5 text-[10px] font-bold transition ${isPM ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--surface-3)]'}`}
                        >PM</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-2 flex items-center justify-between px-1">
                <button
                    type="button"
                    onClick={() => { onChange(''); setOpen(false); }}
                    className="text-[12px] font-medium text-[var(--text-faint)] transition hover:text-[var(--text)]"
                >
                    Clear
                </button>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => { commit(new Date()); }}
                        className="text-[12px] font-medium text-[var(--brand)] transition hover:opacity-80"
                    >
                        Now
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-lg bg-[var(--brand)] px-3 py-1 text-[12px] font-semibold text-white transition hover:opacity-90"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    ) : null;

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                aria-label={ariaLabel}
                onClick={() => setOpen((o) => !o)}
                className={`flex h-9 w-full items-center gap-2 rounded-lg border bg-[var(--surface)] px-2.5 text-left text-[12px] outline-none transition hover:border-[var(--line-strong)] ${open ? 'border-[var(--brand)] ring-2 ring-[var(--brand-ring)]' : 'border-[var(--line)]'}`}
            >
                <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-[var(--text-faint)]" />
                <span className={selected ? 'text-[var(--text)]' : 'text-[var(--text-faint)]'}>{displayLabel}</span>
            </button>
            {popover}
        </>
    );
}

function NavBtn({ children, onClick, aria }: { children: React.ReactNode; onClick: () => void; aria: string }) {
    return (
        <button
            type="button"
            aria-label={aria}
            onClick={onClick}
            className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
            {children}
        </button>
    );
}

function Stepper({ value, onUp, onDown, label }: { value: string; onUp: () => void; onDown: () => void; label: string }) {
    return (
        <div className="flex items-center gap-1">
            <span className="min-w-[26px] rounded-md bg-[var(--surface)] py-1 text-center font-mono text-[14px] font-semibold tabular-nums text-[var(--text)]">
                {value}
            </span>
            <div className="flex flex-col">
                <button type="button" aria-label={`Increase ${label}`} onClick={onUp} className="grid h-[14px] w-5 place-items-center rounded text-[var(--text-faint)] transition hover:text-[var(--brand)]">
                    <ChevronUp className="h-3 w-3" />
                </button>
                <button type="button" aria-label={`Decrease ${label}`} onClick={onDown} className="grid h-[14px] w-5 place-items-center rounded text-[var(--text-faint)] transition hover:text-[var(--brand)]">
                    <ChevronDown className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
}
