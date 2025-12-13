import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <div className="relative h-[600px] bg-slate-900 flex items-center justify-center">
        <div className="container mx-auto px-4 w-full max-w-5xl">
          <div className="space-y-4 text-center mb-10">
            <Skeleton className="h-16 w-3/4 mx-auto bg-slate-800" />
            <Skeleton className="h-6 w-1/2 mx-auto bg-slate-800" />
          </div>
          <div className="bg-white rounded-2xl p-6 h-32">
             <div className="grid grid-cols-4 gap-4 h-full items-center">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          </div>
        </div>
      </div>

      {/* Properties Skeleton */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {[1, 2].map((section) => (
          <div key={section}>
            <div className="flex justify-between mb-8">
               <Skeleton className="h-8 w-48" />
               <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm h-[400px]">
                  <Skeleton className="h-[250px] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between pt-4">
                       <Skeleton className="h-10 w-full" />
                    </div>
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