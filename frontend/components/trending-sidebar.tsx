import Image from "next/image";
import Link from "next/link";

type TrendingItem = {
  id: string;
  title: string;
  image: string;
};

type Featured = {
  title: string;
  body: string;
  cta: string;
};

export function TrendingSidebar({
  trending,
  featured,
}: {
  trending: TrendingItem[];
  featured: Featured;
}) {
  return (
    <aside className="space-y-6 rounded-2xl bg-white">
      <div className="space-y-4 rounded-2xl border border-neutral-200 p-5 shadow-md">
        <h3 className="text-lg font-semibold text-[#0A1931]">Trending now</h3>
        <div className="space-y-3">
          {trending.map((item) => (
            <Link
              key={item.id}
              href="#"
              className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-neutral-50"
            >
              <div className="h-14 w-14 overflow-hidden rounded-xl border border-neutral-200">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={120}
                  height={120}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-sm font-semibold text-[#0A1931] line-clamp-2 group-hover:text-[#ED1C24]">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ED1C24]">
          Featured · Corn Labs
        </p>
        <h4 className="mt-2 text-lg font-semibold text-[#0A1931]">{featured.title}</h4>
        <p className="mt-2 text-sm text-neutral-600">{featured.body}</p>
        <Link
          href="#"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#ED1C24] transition hover:text-[#c8161d]"
        >
          {featured.cta} →
        </Link>
      </div>
    </aside>
  );
}
