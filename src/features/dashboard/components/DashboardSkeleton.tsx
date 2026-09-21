
export function DashboardSkeleton() {
  return (
    <div className="w-full h-full space-y-4">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-xs animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded-md" />
            <div className="h-3 w-64 bg-gray-100 rounded-md" />
          </div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-100 rounded-md" />
              <div className="h-8 w-12 bg-gray-200 rounded-lg" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-200 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 sm:gap-6 w-full h-full min-h-0 animate-pulse">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 h-full">
            <div className="h-5 w-32 bg-gray-200 rounded-md mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-2xl shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
