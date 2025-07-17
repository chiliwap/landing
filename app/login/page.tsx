export default function Login() {
  return (
    <div className="grid grid-cols-2 place-content-center">
      <div className="z-20 relative flex flex-col items-center justify-center  w-full h-screen scale-150 pr-4 ">
        <div className="z-10 absolute w-full h-screen bg-black/60 backdrop-blur-2xl -rotate-12 right-1/8" />
        <h1 className="z-20 text-2xl font-bold mb-4">Login</h1>
        <form className="z-20 w-full max-w-sm">
          <div className="mb-4">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="cursor-pointer text-sm bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-all duration-350"
              type="button"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50" />
        <video loop autoPlay muted>
          <source src="/video_landing_page.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
