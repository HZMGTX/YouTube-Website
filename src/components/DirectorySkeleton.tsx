/** Shown while the client-side filter state hydrates from the URL. */
export default function DirectorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div>
      <div className="skeleton h-12 w-full" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="panel flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton size-12 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
            </div>
            <div className="skeleton h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
