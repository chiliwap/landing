export default function Hero(props: {
  img: string;
  children: React.ReactNode;
}) {
  return (
    <div className="-z-30 relative w-full min-h-[40vh] flex self-start items-center justify-center">
      <img
        src={props.img}
        alt="Article Hero Image"
        className="absolute w-full h-full object-cover taper-bottom"
      />
      <div className="absolute inset-0 bg-neutral-900/50"></div>
      <div className="absolute inset-0 from-75% bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
      <header className="z-30 flex flex-col items-center justify-center">
        {props.children}
      </header>
    </div>
  );
}
