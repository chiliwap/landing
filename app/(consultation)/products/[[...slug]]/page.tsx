"use client";

import Nav from "@/components/layout/nav";
import { use, useState, useEffect } from "react";

const products = [
  {
    id: "full-coverage",
    name: "Full Coverage System",
    description: "Comprehensive fire protection system.",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fbrickandbatten%2Fimages%2Ff_auto%2Cq_auto%2Fv1657654626%2Fwordpress_assets%2F106771-BEFORE_agreeable-gray_westhighland-white%2F106771-BEFORE_agreeable-gray_westhighland-white.jpg%3F_i%3DAA&f=1&nofb=1&ipt=355ce572b18c69d7f6a8bebfe9892911013b25747fe2c0fb7e551f928a56cbcc",
    hero: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F37%2F0c%2F55%2F370c55f67d922cb79459cc19d7865666.jpg&f=1&nofb=1&ipt=d671cfceb3ab3c76c453e01d4da67bebc049852dfe8049b2fbede88aceb872eb",
  },
  {
    id: "brass-sprinklers",
    name: "Stand-Alone Sprinklers",
    description: "High-quality sprinkler for your home.",
    image: "/products/sprinkler.jpg",
    hero: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fww1.prweb.com%2Fprfiles%2F2015%2F03%2F02%2F12556168%2FGeneva_Q1_Facade.jpg&f=1&nofb=1&ipt=1f63b02053caa786837cf83acad388a9df0eda9141b43d80a1b7f849d180ea1c",
  },
  {
    id: "monitoring",
    name: "Control & Monitoring System",
    description: "Advanced monitoring solutions for fire protection.",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thespruce.com%2Fthmb%2FQG4SUpXK8rwsAcqdx39OB_QhF_w%3D%2F2000x1333%2Ffilters%3Ano_upscale()%2Felectrical-service-size-of-my-home-1152752-hero-0a04c3eec7c94154a5e8f116e7fe329f.jpg&f=1&nofb=1&ipt=20e73ea2598437f120b6d97a54f73aebf7c4cee16a294d27bf8cd120a5531ac4",
    hero: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.staticmb.com%2Fmbcontent%2Fimages%2Fuploads%2F2022%2F12%2FMost-Beautiful-House-in-the-World.jpg&f=1&nofb=1&ipt=abe02fa60dc9445c7f733fc2ef0dcb990de79a23f5e8432b883ebd7ea86e3ec5",
  },
];

export default function Products(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  useEffect(() => {
    setSelectedProduct(products.findIndex((p) => p.id == slug));
  }, [slug]);

  const currentProduct =
    selectedProduct !== null && selectedProduct !== -1
      ? products[selectedProduct]
      : slug
        ? products.find((p) => p.id == slug) || products[0]
        : products[0];

  return (
    <main className="min-h-screen text-white">
      <Nav />

      {/* Full-width layout with 5:1 ratio (left:right) */}
      <section className="pt-16 md:pt-20">
        <div className="px-4 md:px-6 pb-24 md:pb-0">
          <div className="my-6 md:my-8 w-full flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left: big image area */}
            <div className="w-full md:flex-[5_1_0%]">
              <div className="relative rounded-2xl overflow-hidden bg-black">
                <img
                  className="w-full h-[65vh] md:h-[80vh] object-cover object-center"
                  src={currentProduct.hero}
                  alt="Product preview"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs md:text-sm text-white/70">
                <span className="whitespace-normal break-words">
                  {currentProduct.description}
                </span>
                <span>&copy; {new Date().getFullYear()} Chiliwap</span>
              </div>
            </div>

            {/* Right: options with min width */}
            <aside className="w-full md:flex-[1_1_0%] md:min-w-[260px]">
              <header className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  Virtual Consultation
                </h2>
                <p className="text-sm text-white/60">
                  Explore our range of high-quality products.
                </p>
              </header>

              <h3 className="mt-5 text-base font-semibold tracking-tight">
                Select a product
              </h3>
              <ul className="mt-3 space-y-3">
                {products.map((product, i) => {
                  const selected = selectedProduct === i;
                  return (
                    <li key={product.id}>
                      <button
                        type="button"
                        aria-selected={selected}
                        onClick={() => setSelectedProduct(i)}
                        className={`group w-full text-left rounded-xl overflow-hidden border transition-colors duration-300 ${
                          selected
                            ? "border-orange-500/60"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="relative h-24 md:h-28">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="px-3 py-2 bg-white/[0.02]">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm md:text-base font-medium tracking-tight">
                              {product.name}
                            </h4>
                            {selected && (
                              <span className="text-[10px] md:text-xs text-orange-300">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[12px] md:text-sm text-white/60 overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal md:text-ellipsis md:overflow-visible">
                            {product.description}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                disabled={selectedProduct == null || selectedProduct == -1}
                className={`inline-flex mt-4 items-center justify-center h-10 font-semibold tracking-wide w-full shadow ${
                  selectedProduct !== null && selectedProduct !== -1
                    ? "cursor-pointer bg-orange-600 text-white hover:bg-orange-500"
                    : "cursor-not-allowed bg-orange-600/30 text-white"
                } rounded-md transition-colors duration-300`}
              >
                Next &rarr;
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
