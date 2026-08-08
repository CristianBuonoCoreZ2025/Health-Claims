"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingStateProps extends React.ComponentProps<"div"> {
  context?: "table" | "card" | "default"
}

function LoadingState({
  context = "default",
  className,
  ...props
}: LoadingStateProps) {
  if (context === "table") {
    return (
      <div
        data-slot="loading-state"
        className={cn("flex h-44 items-center justify-center", className)}
        {...props}
      >
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (context === "card") {
    return (
      <div
        data-slot="loading-state"
        className={cn("flex flex-col gap-3 p-4", className)}
        {...props}
      >
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div
      data-slot="loading-state"
      className={cn(
        "flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <Loader2Icon className="size-4 animate-spin" />
    </div>
  )
}

export { LoadingState }
