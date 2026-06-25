"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type GalleryImage = { id: string; url: string; alt?: string | null };

export default function ProjectGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Re-animate the hero image whenever the active index changes.
  useGSAP(
    () => {
      if (!imgRef.current) return;
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    },
    { dependencies: [current] }
  );

  if (images.length === 0) return null;

  const prev = () => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1));
  const next = () => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <div className="mb-12">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          key={images[current].id}
          src={images[current].url}
          alt={images[current].alt || title}
          className="w-full h-72 md:h-96 object-contain rounded-2xl shadow-2xl"
        />
        <h1 className="absolute bottom-4 left-6 text-3xl md:text-5xl font-bold text-indigo-400 drop-shadow-lg">
          {title}
        </h1>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
          {images.map((img, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={img.url}
              alt={img.alt || `${title} image ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`w-24 h-20 object-contain rounded-lg cursor-pointer border-2 transition hover:scale-105 ${
                idx === current ? "border-primary" : "border-transparent"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
