import Footer from "@/components/footer";
import Gradient from "@/components/mouse-gradient";
import Nav from "@/components/nav";
import Link from "next/link";

const articles = [
  {
    title: "Firefighting with foresight",
    href: "/article/firefighting-with-foresight",
    date: new Date("June 6 2025"),
    image: "/content/firefighting-with-foresight.webp",
  },
  {
    title: "Man saves home with garden hose",
    href: "/article/man-saves-home-with-garden-hose",
    date: new Date("April 14 2025"),
    image: "/content/man-saves-home-with-garden-hose.jpg",
  },
  {
    title: "Wildfire Season 2023",
    href: "/article/wildfire-season-2023",
    date: new Date("Jan 30 2024"),
    image: "/content/wildfire-season-2023.jpg",
  },
  {
    title: "Calgary severe water restrictions",
    href: "/article/calgary-severe-water-restrictions",
    date: new Date("Jan 30 2025"),
    image: "/content/calgary-severe-water-restrictions.jpg",
  },
  {
    title: "Atmospheric river vancouver",
    href: "/article/atmospheric-river-vancouver",
    date: new Date("Jan 30 2025"),
    image: "/content/atmospheric-river-vancouver.jpg",
  },
  {
    title: "BC Insurance",
    href: "/article/bc-insurance",
    date: new Date("Jan 30 2025"),
    image: "/content/bc-insurance.webp",
  },
  {
    title: "A Builder's Perspective",
    href: "/article/a-builders-perspective",
    date: new Date("Jan 23 2025"),
    image: "/content/a-builders-perspective.jpg",
  },
];

export default function News() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-32 pt-20">
      <Nav />

      <header className="z-20 text-center mb-8">
        <h1 className="text-4xl logo-text">Latest News</h1>
        <p className="text-lg">Stay tuned for updates!</p>
      </header>

      {/* Featured/Newest Article */}
      <Link
        href={articles[0].href}
        className="group z-20 flex justify-between items-center mb-8 w-3/4 rounded-2xl border-2 border-stone-800 bg-stone-900/30 overflow-hidden"
      >
        <header className="px-12 py-8">
          <h2 className="text-2xl flex items-center logo-text">
            <span className="text-orange-600 text-base mr-4 font-normal">
              NEW{" "}
            </span>{" "}
            {articles[0].title}
          </h2>

          <p className="text-neutral-200 font-semibold inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4 mr-2"
            >
              <path d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" />
              <path
                fillRule="evenodd"
                d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                clipRule="evenodd"
              />
            </svg>

            {articles[0].date.toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <img
          src={articles[0].image}
          alt={articles[0].title}
          className="h-72 w-4/6 object-cover taper-left opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        />
      </Link>

      <section className="z-20 px-12 grid grid-cols-4 gap-8 w-full">
        {articles.map((article, i) => {
          if (i !== 0) {
            return (
              <Link
                href={article.href}
                key={i}
                className="group relative h-64 mb-4 border-2 border-stone-900/65 hover:border-stone-900/40 bg-(--background)/60 hover:bg-(--background)/40 px-5 py-3 overflow-hidden rounded-xl transition-colors duration-400"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="opacity-75 absolute top-0 left-0 -z-10 w-full h-full aspect-[4/3] object-cover"
                />

                <header className="relative z-30 w-full h-full">
                  <h2 className="text-2xl logo-text">{article.title}</h2>
                  <p className="text-neutral-200 font-semibold inline-flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4 mr-2"
                    >
                      <path d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" />
                      <path
                        fillRule="evenodd"
                        d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    {article.date.toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5 bottom-5 right-5 absolute group-hover:right-4 transition-all duration-300"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </header>
              </Link>
            );
          }
          return null;
        })}
      </section>

      <Gradient />

      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </main>
  );
}
