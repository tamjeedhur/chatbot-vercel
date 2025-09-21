import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-72 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <Skeleton className="h-4 w-24 mb-6" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-2">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <Skeleton className="h-4 w-20 mb-3" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j}>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
