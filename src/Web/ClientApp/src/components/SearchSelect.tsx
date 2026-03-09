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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (item: T) => {
    setSelected(item);
    setQuery("");
    setOpen(false);
    onSelect(getOptionValue(item));
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    setResults([]);
    onSelect(0);
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
            placeholder={placeholder}
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
              Cargando...
            </span>
          )}
          {open && results.length > 0 && (
            <ul className="absolute z-20 w-full mt-1 bg-white border border-stone-200 rounded-md shadow-md max-h-48 overflow-y-auto">
              {results.map((item) => (
                <li
                  key={getOptionValue(item)}
                  onMouseDown={() => handleSelect(item)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-amber-50 text-stone-700 transition-colors"
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
