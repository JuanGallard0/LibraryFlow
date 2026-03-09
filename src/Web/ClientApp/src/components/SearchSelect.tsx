import { useState, useEffect, useRef } from "react";

interface SearchSelectProps<T> {
  label: string;
  placeholder?: string;
  onSearch: (query: string) => Promise<T[]>;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => number;
  onSelect: (id: number) => void;
}

export function SearchSelect<T>({
  label,
  placeholder = "Search...",
  onSearch,
  getOptionLabel,
  getOptionValue,
  onSelect,
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [selected, setSelected] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (selected) return;
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await onSearch(query);
        setResults(data);
        setActiveIndex(-1);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query, selected]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelect = (item: T) => {
    setSelected(item);
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    onSelect(getOptionValue(item));
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    onSelect(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {selected ? (
        <div className="flex items-center gap-2 border border-stone-300 rounded-md px-3 py-2 bg-stone-50">
          <span className="flex-1 text-sm text-stone-700">{getOptionLabel(selected)}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-stone-400 hover:text-amber-700 text-xs transition-colors"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-autocomplete="list"
            aria-expanded={open}
            aria-activedescendant={activeIndex >= 0 ? `option-${activeIndex}` : undefined}
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
              Cargando...
            </span>
          )}
          {open && results.length > 0 && (
            <ul
              ref={listRef}
              role="listbox"
              className="absolute z-20 w-full mt-1 bg-white border border-stone-200 rounded-md shadow-md max-h-48 overflow-y-auto"
            >
              {results.map((item, i) => (
                <li
                  key={getOptionValue(item)}
                  id={`option-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`px-3 py-2 text-sm cursor-pointer text-stone-700 transition-colors ${
                    i === activeIndex ? "bg-amber-100" : "hover:bg-amber-50"
                  }`}
                >
                  {getOptionLabel(item)}
                </li>
              ))}
            </ul>
          )}
          {open && !loading && results.length === 0 && query.trim() && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-stone-200 rounded-md shadow-md px-3 py-2 text-sm text-stone-500">
              Sin resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
