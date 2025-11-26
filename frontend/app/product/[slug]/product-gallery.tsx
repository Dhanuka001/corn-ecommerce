"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductImage } from "@/types/catalog";

type ProductGalleryProps = {
  name: string;
  images: ProductImage[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const safeImages = images.length ? images : [{ id: "placeholder", url: "/placeholder.png", alt: name, position: 0 }];
  const [activeId, setActiveId] = useState<string>(safeImages[0].id);
  const active = safeImages.find((img) => img.id === activeId) ?? safeImages[0];

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex flex-row gap-3 overflow-x-auto lg:flex-col lg:w-24">
        {safeImages.map((image) => {
          const selected = image.id === activeId;
          return (
            <button
              key={image.id}
              onClick={() => setActiveId(image.id)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition ${
                selected ? "border-primary" : "border-slate-200 hover:border-primary/40"
              }`}
              aria-label={`View ${name}`}
            >
              <Image
                src={image.url}
                alt={image.alt || name}
                fill
                className="object-contain"
                sizes="96px"
              />
            </button>
          );
        })}
      </div>
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100">
        <Image
          src={active.url}
          alt={active.alt || name}
          width={1100}
          height={1100}
          className="h-[460px] w-full object-contain lg:h-[560px]"
          priority
        />
      </div>
    </div>
  );
}
