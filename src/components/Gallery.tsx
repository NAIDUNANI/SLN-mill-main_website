import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import millFields from "@/assets/mill-fields.jpeg";
import millInterior from "@/assets/mill-interior.jpeg";
import millProcessing from "@/assets/mill-processing.jpeg";
import millMachinery from "@/assets/mill-machinery.jpeg";
import millBuilding from "@/assets/mill-building.jpeg";
import millTowers from "@/assets/mill-towers.jpeg";
import millWarehouse from "@/assets/mill-warehouse.jpeg";
import millExterior from "@/assets/mill-exterior.jpeg";

const images = [
  { src: millFields, alt: "Lush paddy fields surrounding SLN Rice Mill", caption: "Our Paddy Fields" },
  { src: millExterior, alt: "SLN Rice Mill exterior view", caption: "Mill Exterior" },
  { src: millBuilding, alt: "SLN Rice Mill main building", caption: "Main Facility" },
  { src: millInterior, alt: "Inside SLN Rice Mill", caption: "Mill Interior" },
  { src: millMachinery, alt: "Advanced rice milling machinery", caption: "Modern Machinery" },
  { src: millProcessing, alt: "Rice processing in action", caption: "Processing Unit" },
  { src: millTowers, alt: "SLN Rice Mill storage towers", caption: "Storage Towers" },
  { src: millWarehouse, alt: "SLN Rice Mill warehouse", caption: "Warehouse" },
];

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % images.length);
  };
  const goPrev = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Facility
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the heart of SLN Rice Mill
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 flex items-end">
                <span className="text-primary-foreground font-semibold text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                  {img.caption}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 text-white/70 hover:text-white z-10 p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-5xl max-h-[85vh] px-12" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-center text-white/80 mt-4 text-lg font-medium">
              {images[lightboxIndex].caption}
              <span className="text-white/50 text-sm ml-3">
                {lightboxIndex + 1} / {images.length}
              </span>
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 text-white/70 hover:text-white z-10 p-2"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
