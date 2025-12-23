import React from "react";

type Props = {
  className?: string;
  full?: boolean; 
};

const Loader: React.FC<Props> = ({ className = "", full = true }) => {
  return (
    <div className={`${full ? "min-h-[40vh] grid place-items-center" : ""} ${className}`}>
      <div className="inline-flex items-center gap-3">
        <span className="relative flex h-6 w-6">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent/25 animate-ping" />
          <span className="relative inline-flex h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </span>
        <span className="text-sm text-gray-600">Loading…</span>
      </div>
    </div>
  );
};

export default Loader;