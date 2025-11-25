"use client";

type CategoryFilterProps = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
};

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="sticky top-0 z-30 mb-6 bg-white/95 px-1 pb-3 backdrop-blur sm:px-3 sm:pb-4">
      <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto rounded-full border border-neutral-200 bg-white px-2 py-2 shadow-sm sm:justify-center sm:px-3">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition shadow-[0_2px_6px_rgba(15,23,42,0.06)] ${
                isActive
                  ? "bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/25"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
