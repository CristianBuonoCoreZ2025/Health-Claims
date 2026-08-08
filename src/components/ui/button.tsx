import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "btn-primary",
        secondary: "btn-secondary",
        outline:
          "btn-base border-border bg-background text-foreground hover:bg-muted",
        ghost: "btn-ghost",
        destructive: "btn-danger",
        link: "text-sm font-medium text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "",
        sm: "h-7 gap-1 px-2 text-xs",
        lg: "h-9 gap-1.5 px-3.5",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
