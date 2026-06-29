export default function Topbar() {
  return (
    <div className="h-24 border-b border-zinc-800 flex items-center justify-between px-10">

      {/* Left */}
      <div>
        <p className="text-sm text-zinc-500">
          welcome back,
        </p>

        <h1 className="text-2xl font-semisemibold text-white">
          rugveda
        </h1>
      </div>

      {/* Right */}
      <p className="text-sm italic hover:text-[#f4d953] transition cursor-pointer">
        Write. Collaborate. Create.
      </p>

    </div>
  );
}