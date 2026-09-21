export function TableSkeleton({ rows = 5, cols: _cols }: { rows?: number; cols?: number } = {}) {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div 
          key={rIdx} 
          className="grid grid-cols-12 items-center gap-4 py-3.5 px-4 rounded-2xl bg-gray-100/70 border border-gray-200/50"
        >
          <div className="col-span-1 h-8 bg-gray-200 rounded-xl" />
          <div className="col-span-4 space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded-md w-3/4" />
            <div className="h-2.5 bg-gray-200/80 rounded-md w-1/2" />
          </div>
          <div className="col-span-2 h-3 bg-gray-200 rounded-md" />
          <div className="col-span-2 h-3 bg-gray-200 rounded-md" />
          <div className="col-span-2 flex justify-center">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
          </div>
          <div className="col-span-1 flex justify-end gap-2">
            <div className="w-7 h-7 bg-gray-200 rounded-xl" />
            <div className="w-7 h-7 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-2.5 bg-gray-200 rounded-md w-24" />
            <div className="h-6 bg-gray-200 rounded-md w-16" />
          </div>
          <div className="w-11 h-11 bg-gray-200 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}
