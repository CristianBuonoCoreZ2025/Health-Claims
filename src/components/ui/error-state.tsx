"use client"

import * as React from "react"
import { TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorStateProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
}

function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Reintentar",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-center",
        className
      )}
      {...props}
    >
      <TriangleAlertIcon className="size-8 text-destructive" />
      <div className="grid gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export { ErrorState }
