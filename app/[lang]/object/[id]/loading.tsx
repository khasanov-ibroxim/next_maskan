import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Skeleton */}
            <Skeleton className="h-[400px] md:h-[500px] w-full rounded-2xl" />

            {/* Details Skeleton */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                   <div key={i}>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-32" />
                   </div>
                ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-40" />
                <div className="space-y-3">
                   <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-10 w-full" />
                   <Skeleton className="h-10 w-full" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}