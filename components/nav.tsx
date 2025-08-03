"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export default function Nav(props: { className?: string }) {
  const [stickyNav, setStickyNav] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigationItems = [
    {
      name: "Solutions",
      href: "/solutions",
      dropdown: {
        sections: [
          {
            title: "Protection Systems",
            items: [
              {
                name: "Fire Protection Systems",
                description: "Advanced sprinkler and suppression systems",
                href: "/solutions-fire-protection",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                    />
                  </svg>
                ),
              },
              {
                name: "System Design",
                description: "Custom fire protection system planning",
                href: "/solutions-system-design",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>
                ),
              },
            ],
          },
          {
            title: "Services",
            items: [
              {
                name: "Sprinkler Installation",
                description: "Professional installation services",
                href: "/solutions-sprinkler-installation",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>
                ),
              },
              {
                name: "Maintenance Services",
                description: "Regular maintenance and inspections",
                href: "/solutions-maintenance",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>
                ),
              },
            ],
          },
        ],
      },
    },
    {
      name: "Products",
      href: "/products",
      dropdown: {
        sections: [
          {
            title: "Sprinkler Systems",
            items: [
              {
                name: "Full Coverage System",
                description: "Comprehensive fire protection system.",
                href: "/products/full-coverage",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>
                ),
              },
              {
                name: "Brass Impact Sprinklers",
                description: "High-performance brass sprinkler heads",
                href: "/products/brass-sprinklers",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
                    />
                  </svg>
                ),
              },
            ],
          },
          {
            title: "Control & Monitoring",
            items: [
              {
                name: "Control & Monitoring Systems",
                description: "Advanced monitoring and detection systems",
                href: "/products/monitoring",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                    />
                  </svg>
                ),
              },
              // {
              //   name: "Monitoring Equipment",
              //   description: "Advanced monitoring and detection systems",
              //   href: "/products/monitoring",
              //   icon: (
              //     <svg
              //       xmlns="http://www.w3.org/2000/svg"
              //       fill="none"
              //       viewBox="0 0 24 24"
              //       strokeWidth={1.5}
              //       stroke="currentColor"
              //       className="size-6"
              //     >
              //       <path
              //         strokeLinecap="round"
              //         strokeLinejoin="round"
              //         d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
              //       />
              //     </svg>
              //   ),
              // },
            ],
          },
        ],
      },
    },
    {
      name: "Resources",
      href: "/resources",
    },
    {
      name: "Pricing",
      href: "/pricing",
    },
    {
      name: "About",
      href: "/about",
    },
  ];

  return (
    <>
      <motion.nav
        onViewportLeave={() => setStickyNav(true)}
        onViewportEnter={() => setStickyNav(false)}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
          delay: 0.6,
          ease: [0.48, 0.15, 0.25, 0.96],
        }}
        className={`fade-in absolute top-0 left-0 w-full z-50 ${
          props.className ?? ""
        }`}
      >
        <div className="w-full px-24 mx-auto flex justify-between items-center p-1.5">
          <Link
            href="/"
            className="text-2xl text-white inline-flex items-center logo-text"
          >
            <img
              src="/logo.png"
              alt="Chiliwap Logo"
              className="inline-block h-8 mr-2 "
            />{" "}
            CHILIWAP
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.dropdown && setActiveDropdown(item.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`text-white hover:text-gray-300 group transition-colors duration-300 flex items-center space-x-1 py-2 ${
                    activeDropdown === item.name ? "text-gray-300" : ""
                  }`}
                >
                  <span>{item.name}</span>
                  {item.dropdown && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4 group-hover:rotate-180 transition-transform duration-350"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {/* Active indicator */}
                  {/* {activeDropdown === item.name && ( */}
                  <motion.div
                    // layoutId="activeTab"
                    className="absolute group-hover:bg-black/15 bg-transparent inset-0 rounded-4xl -z-10 -mx-3 transition-colors duration-350"
                  />
                  {/* )} */}
                </Link>
              </div>
            ))}
          </div>

          <div className="space-x-4 text-xs font-bold">
            <Link
              className="hover:text-gray-300 transition-colors duration-350"
              href="/news"
              title="News"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 inline-flex"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                />
              </svg>
            </Link>
            <Link
              className="hover:text-gray-300 transition-colors duration-350"
              href="/support"
              title="Support"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 inline-flex"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288"
                />
              </svg>
            </Link>
            <Link
              className="cursor-pointer hover:text-gray-300 transition-colors duration-350"
              href="/login"
              title="Login"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6 inline-flex"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.48, 0.15, 0.25, 0.96] }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 z-50"
              onMouseEnter={() => setActiveDropdown(activeDropdown)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="bg-black/90 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl overflow-hidden w-[700px]">
                {/* Fixed height container to prevent layout shift */}
                <div className="relative h-[250px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    {navigationItems
                      .filter((item) => item.name === activeDropdown)
                      .map((item) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, scale: 0.99 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.99 }}
                          transition={{
                            duration: 0.1,
                            ease: [0.48, 0.15, 0.25, 0.96],
                          }}
                          className="absolute inset-0 p-6"
                        >
                          {/* Column Layout */}
                          <div className="grid grid-cols-2 gap-8">
                            {item.dropdown?.sections.map(
                              (section, sectionIndex) => (
                                <div key={section.title} className="space-y-4">
                                  <h3 className="text-sm ml-2 text-gray-400">
                                    {section.title}
                                  </h3>
                                  <div className="space-y-2">
                                    {section.items.map(
                                      (dropdownItem, index) => (
                                        <Link
                                          key={dropdownItem.name}
                                          href={dropdownItem.href}
                                        >
                                          <motion.div
                                            className="group flex items-start space-x-3 p-3 rounded-lg transition-all duration-200"
                                            // initial={{ opacity: 0, y: 10 }}
                                            // animate={{ opacity: 1, y: 0 }}
                                            // transition={{
                                            //   delay:
                                            //     (sectionIndex * 2 + index) * 0.03,
                                            //   duration: 0.2,
                                            // }}
                                          >
                                            <div className="text-base mt-0.5 flex-shrink-0 border border-gray-800 group-hover:border-white rounded p-1 group-hover:text-black text-gray-300 group-hover:bg-white transition-colors duration-200">
                                              {dropdownItem.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h4 className="text-white text-sm font-medium transition-colors truncate">
                                                {dropdownItem.name}
                                              </h4>
                                              <p className="text-gray-400 group-hover:text-gray-300 text-xs mt-0.5 line-clamp-2 h-8 transition-colors">
                                                {dropdownItem.description}
                                              </p>
                                            </div>
                                          </motion.div>
                                        </Link>
                                      )
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Sticky Navigation Bar */}
      <AnimatePresence>
        {stickyNav && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              delay: 0,
              ease: [0.48, 0.15, 0.25, 0.96],
            }}
            className="fixed bg-stone-900/20 backdrop-blur-lg top-0 left-0 w-full z-50"
          >
            <div className="w-full px-24 mx-auto flex justify-between items-center p-1.5">
              <Link
                href="/"
                className="text-2xl text-white inline-flex items-center logo-text"
              >
                <img
                  src="/logo.png"
                  alt="Chiliwap Logo"
                  className="inline-block h-8 mr-2"
                />{" "}
                CHILIWAP
              </Link>
              <div className="space-x-4 text-xs font-bold ">
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors duration-350"
                >
                  Schedule a Consultation
                </Link>
                <Link
                  href="/support"
                  className="text-gray-300 hover:text-white transition-colors duration-350"
                >
                  Support
                </Link>
                <Link
                  href="/login"
                  className="bg-zinc-900 hover:bg-neutral-800 hover:text-white transition-all duration-350 p-1.5 px-4 cursor-pointer rounded-md text-gray-300 "
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
