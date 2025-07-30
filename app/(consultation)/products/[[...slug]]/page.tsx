"use client";

import Nav from "@/components/nav";
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

  useEffect(() => {
    setSelectedProduct(products.findIndex((p) => p.id == slug));
  }, [slug]);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <main className="min-h-screen">
      <Nav />

      <section className="py-16 w-full h-full min-h-screen grid grid-cols-5 gap-8 px-20">
        <div className="relative flex items-center justify-center col-span-4">
          <img
            className="object-cover w-full h-full rounded-4xl aspect-video"
            src={
              selectedProduct !== null && selectedProduct !== -1
                ? products[selectedProduct].hero
                : slug
                ? products.find((p) => p.id == slug)?.hero
                : products[0].hero
            }
            alt="Product Image"
          />

          {/* Footer Notes */}
          <footer className="text-center text-sm text-neutral-500">
            <p className="absolute -bottom-10 left-14">
              Imagine a home that protects itself.
            </p>

            <p className="absolute -bottom-10 right-14">
              &copy; {new Date().getFullYear()} Chiliwap. All rights reserved.
            </p>
          </footer>
        </div>

        {/* Right sidebar */}
        <div className="max-h-full col-span-1 px-6">
          <header className="pt-5 space-y-2">
            <h3 className="text-3xl text-left logo-text">
              Virtual Consultation
            </h3>
            <p className="text-left text-neutral-400">
              Explore our range of high-quality products designed to meet your
              needs.
            </p>
          </header>

          <ul className="grid grid-row-4 h-3/4 pt-8">
            <h4 className="text-xl font-semibold row-span-1">Select Product</h4>
            <div className="row-span-3 grid grid-row-4 gap-y-6">
              {products.map((product, i) => (
                <li
                  key={product.id}
                  className="w-full min-h-72 flex flex-col justify-center"
                  onClick={() => setSelectedProduct(i)}
                >
                  <div
                    className={`cursor-pointer relative h-64 w-full overflow-hidden rounded-lg ring-3 ring-stone-800 ${
                      selectedProduct === i ? "ring-orange-500!" : ""
                    } transition-all duration-300`}
                  >
                    <img
                      className="object-cover h-full aspect-16/9 pb-18"
                      src={product.image}
                      alt={product.name}
                    />
                    <div className="absolute h-3/7 w-full bottom-0 bg-(--background) p-5">
                      <h5 className="font-semibold text-xl">{product.name}</h5>
                      <p className=" bg-text-sm text-neutral-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              <button
                disabled={selectedProduct == null || selectedProduct == -1}
                className={`flex items-center justify-center h-10 font-semibold tracking-wide w-full shadow ${
                  selectedProduct !== null && selectedProduct !== -1
                    ? "cursor-pointer bg-orange-600 text-white hover:bg-orange-500"
                    : "cursor-not-allowed bg-orange-600/30 text-white"
                } p-3 rounded-md transition-colors duration-300`}
              >
                Next &rarr;
              </button>
            </div>
          </ul>
        </div>
      </section>
    </main>
  );
}
