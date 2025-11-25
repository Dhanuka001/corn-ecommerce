import Image from "next/image";
import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  readTime: string;
};

export function BlogCard({ post }: { post: Blog }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          width={640}
          height={360}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#ED1C24] shadow-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight text-[#0A1931] line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-3">{post.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between text-sm text-neutral-500">
          <span>{post.readTime}</span>
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-[#ED1C24] transition"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
