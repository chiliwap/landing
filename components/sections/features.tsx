export default function Features() {
  return (
    <section className="place-self-center w-11/12 md:w-8/10">
      <header className="w-full text-center mb-12">
        <h2 className="text-3xl md:text-5xl logo-text">Get In-The-Know</h2>
        <p className="text-base md:text-lg text-stone-400 max-w-2xl place-self-center px-2">
          Using Chiliwap&apos;s dashboard get all the analytics you&apos;d ever
          care about, with real-time monitoring of fire locations and controller
          status.
        </p>
      </header>

      {/* bento-style insights section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col md:flex-row w-full">
            <div className="h-auto p-4 rounded w-full text-center taper-bottom">
              <h3 className="font-bold text-lg">Real-time Monitoring</h3>
              <p className="text-stone-400">
                Get real-time insights into fire locations and controller
                status.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center -mt-2 md:-mt-6 gap-4">
                <svg
                  className="size-40 md:size-64"
                  viewBox="0 0 300 300"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* <!-- Radial Gradient for zones --> */}
                  <defs>
                    <radialGradient id="zoneGradient" cx="50%" cy="50%" r="50%">
                      <stop
                        offset="0%"
                        stopColor="rgba(255, 255, 255, 0.396)"
                      />
                      <stop offset="55%" stopColor="rgba(10,10,10,0.05)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* <!-- Background Gradient Circle --> */}
                  <circle cx="150" cy="150" r="150" fill="url(#zoneGradient)" />

                  {/* <!-- Central point (you can replace this with Heroicons pin) --> */}
                  {/* <circle cx="150" cy="150" r="6" fill="white" /> */}
                  <g transform="translate(138, 138) scale(1.1)">
                    <path
                      fill="white"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    />
                  </g>

                  {/* <!-- Scattered dots --> */}
                  <circle cx="60" cy="70" r="2" fill="white" />
                  <circle cx="90" cy="110" r="2" fill="white" />
                  <circle cx="200" cy="80" r="2" fill="white" />
                  <circle cx="240" cy="100" r="2" fill="white" />
                  <circle cx="180" cy="200" r="2" fill="white" />
                  <circle cx="120" cy="220" r="2" fill="white" />
                  <circle cx="80" cy="190" r="2" fill="white" />
                  <circle cx="220" cy="160" r="2" fill="white" />
                  <circle cx="170" cy="120" r="2" fill="white" />
                  <circle cx="130" cy="90" r="2" fill="white" />
                </svg>
                <div className="flex flex-col space-y-3 w-full md:w-42">
                  <div className="cursor-pointer px-3 py-1 rounded-md bg-stone-900/50 flex flex-row text-stone-400 justify-between">
                    <p>Zone 1</p>
                    <p className="text-green-600/90">Normal</p>
                  </div>
                  <div className="cursor-pointer px-3 py-1 rounded-md bg-stone-900/50 flex flex-row text-stone-400 justify-between">
                    <p>Zone 2</p>
                    <p className="text-yellow-500/90">At Risk</p>
                  </div>
                  <div className="cursor-pointer px-3 py-1 rounded-md bg-stone-900/50 flex flex-row text-stone-400 justify-between">
                    <p>Zone 3</p>
                    <p className="text-red-500/90">Enabled</p>
                  </div>
                </div>
              </div>
            </div>
            <span className="hidden md:block bg-stone-700 w-[1px] -mb-4 ml-2 -mr-2 taper-top" />
          </div>

          <div className="col-span-1 md:col-span-2 h-auto p-4 rounded text-center taper-bottom">
            <h3 className="font-bold text-lg">Advanced Analytics</h3>
            <p className="text-stone-400">
              Leverage advanced analytics to identify trends and optimize
              performance.
            </p>
            <svg
              className="place-self-center w-full md:w-8/10 max-h-full"
              viewBox="0 0 800 300"
              //   preserveAspectRatio="none"
            >
              {/* <!-- Grid lines: Rendered first (so they go under everything) --> */}
              <line x1="0" y1="300" x2="0" y2="300" className="grid-line" />
              <line x1="100" y1="300" x2="100" y2="200" className="grid-line" />
              <line x1="200" y1="300" x2="200" y2="180" className="grid-line" />
              <line x1="300" y1="300" x2="300" y2="160" className="grid-line" />
              <line x1="400" y1="300" x2="400" y2="140" className="grid-line" />
              <line x1="500" y1="300" x2="500" y2="120" className="grid-line" />
              <line x1="600" y1="300" x2="600" y2="100" className="grid-line" />
              <line x1="700" y1="300" x2="700" y2="90" className="grid-line" />
              <line x1="800" y1="300" x2="800" y2="80" className="grid-line" />

              {/* <!-- Gradient Fill --> */}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0, 123, 255, 0.3)" />
                  <stop offset="90%" stopColor="rgba(10, 10, 10, 0)" />
                </linearGradient>
              </defs>

              {/* <!-- Area under the trend line --> */}
              <path
                d="M0,250 
               L100,200 
               L200,180 
               L300,160 
               L400,140 
               L500,120 
               L600,100 
               L700,90 
               L800,80 
               L800,300 
               L0,300 
               Z"
                fill="url(#blueGradient)"
              />

              {/* <!-- Trend Line --> */}
              <polyline
                fill="none"
                stroke="#007bff"
                strokeWidth="3"
                points="0,250 100,200 200,180 300,160 400,140 500,120 600,100 700,90 800,80"
              />

              {/* <!-- Pulsing Dot at End --> */}
              <g>
                <circle className="pulse-ring" cx="800" cy="80" r="4" />
                <circle className="pulse-dot" cx="800" cy="80" r="5" />
              </g>
            </svg>
          </div>
        </div>
        <hr className="col-span-3 taper-edges-sm border-stone-700" />
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row w-full">
            <div className="h-62 p-4 rounded w-full text-center taper-bottom">
              <h3 className="font-bold text-lg">Complete System Control</h3>
              <p className="text-stone-400">
                Monitor and control your entire fire protection system from one
                dashboard.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center w-full gap-5 mt-10">
                <div className="flex flex-col items-center ring-2 ring-orange-600 rounded-md p-4 w-full md:w-auto">
                  <header>
                    <h6 className="flex flex-row items-center justify-around">
                      NE Controller
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4 inline-flex"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </h6>
                    <sup className="text-stone-600">dev:648297145306824</sup>
                    <p className="text-stone-400">Status: Normal</p>
                  </header>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-stone-600"
                  >
                    <path d="M16.5 7.5h-9v9h9v-9Z" />
                    <path
                      fillRule="evenodd"
                      d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col items-center ring-1 ring-stone-700 rounded-md p-4 w-full md:w-auto">
                  <header>
                    <h6 className="flex flex-row items-center justify-around">
                      SW Controller
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4 inline-flex"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </h6>
                    <sup className="text-stone-600">dev:971433598254179</sup>
                    <p className="text-stone-400">Status: Enabled</p>
                  </header>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-stone-600"
                  >
                    <path d="M16.5 7.5h-9v9h9v-9Z" />
                    <path
                      fillRule="evenodd"
                      d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="hidden md:block bg-stone-700 w-[1px] h-32 taper-bottom taper-top" />
                {/* Controls */}
                <div className="flex flex-col items-center md:ml-4 gap-2 w-full md:w-auto">
                  <button className="bg-stone-800 w-full md:w-50 text-white px-4 py-2 rounded-md">
                    Run Test
                  </button>
                  <button className="bg-stone-900/90 w-full md:w-50 text-white px-4 py-2 rounded-md">
                    Request Maintenance
                  </button>
                  <button className="bg-stone-900/90 w-full md:w-50 text-white px-4 py-2 rounded-md">
                    Managed Zones
                  </button>
                </div>
              </div>
            </div>
            <span className="hidden md:block bg-stone-700 w-[1px] -mt-4 ml-2 -mr-2 taper-bottom" />
          </div>

          <div className="col-span-1 h-62 p-4 rounded text-center">
            <h3 className="font-bold text-lg">Customizable Dashboard</h3>
            <p className="text-stone-400">
              Tailor your dashboard to display the metrics that matter most to
              you.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center w-full gap-5 mt-12">
              <div className="flex flex-col space-y-3 taper-bottom w-full md:w-auto">
                <button className="bg-(--background) w-full md:w-60 border-dashed border-2 border-stone-600 text-white px-4 py-2 rounded-md">
                  +
                </button>
                <button className="w-full md:w-60 bg-stone-900/90 text-white px-4 py-2 rounded-md">
                  View Controller Health
                </button>
                <button className="w-full md:w-60 bg-stone-900/90 text-white px-4 py-2 rounded-md">
                  View Controller Logs
                </button>
              </div>

              <div className="w-full md:w-auto">
                {/* rotated button */}
                <button className="bg-stone-900/90 w-full md:w-60 text-stone-200 px-4 py-2 rounded-md md:transform md:rotate-6">
                  View Coverage
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 inset-0 absolute right-0 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68ZM3 10.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10.5Zm14.25 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75Zm-8.962 3.712a.75.75 0 0 1 0 1.061l-1.591 1.591a.75.75 0 1 1-1.061-1.06l1.591-1.592a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
