import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

export const pageContainerVariants = cva(
  "min-w-0 flex-1 p-4 md:p-6",
  {
    variants: {
      variant: {
        // Archetype 2: Full-width fluid operational canvas (default)
        workspace: "flex flex-col gap-4",
        // Archetype 1: Max-w-4xl centered, single-column configuration
        settings: "mx-auto flex w-full max-w-4xl flex-col gap-8",
        // Archetype 3: Viewport-locked, zero-scroll interactive canvas
        canvas:
          "flex h-[calc(100dvh-4rem)] flex-col gap-4 overflow-hidden md:h-[calc(100dvh-4.5rem)]",
      },
    },
    defaultVariants: {
      variant: "workspace",
    },
  }
)

export interface PageContainerProps
  extends
    React.ComponentProps<"main">,
    VariantProps<typeof pageContainerVariants> {}

export function PageContainer({
  className,
  variant,
  children,
  ...props
}: PageContainerProps) {
  return (
    <main
      data-slot="page-container"
      className={cn(pageContainerVariants({ variant }), className)}
      {...props}
    >
      {children}
    </main>
  )
}
