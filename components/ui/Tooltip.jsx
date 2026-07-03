"use client";

export default function Tooltip({ text }) {
  return (
    <div
      className="
        absolute
        left-1/2
        top-full
        mt-3
        -translate-x-1/2
        opacity-0
        invisible
        transition-all
        duration-200
        group-hover:opacity-100
        group-hover:visible
        pointer-events-none
        z-50
      "
    >
      <div className="relative">
        {/* Arrow */}
        <div
          className="
            absolute
            left-1/2
            -top-1.5
            h-3
            w-3
            -translate-x-1/2
            rotate-45
            bg-[#0F172A]
          "
        />

        {/* Tooltip */}
        <div
          className="
            rounded-xl
            bg-[#0F172A]
            px-4
            py-2
            text-sm
            text-white
            shadow-lg
            whitespace-nowrap
          "
        >
          {text}
        </div>
      </div>
    </div>
  );
}