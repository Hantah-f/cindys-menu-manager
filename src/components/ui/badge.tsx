import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gold: "border-transparent bg-gradient-gold text-primary-foreground hover:shadow-glow font-bold",
        success: "border-transparent bg-hotel-success text-white hover:bg-hotel-success/80",
        warning: "border-transparent bg-hotel-warning text-white hover:bg-hotel-warning/80",
        "hotel-warning": "border-transparent bg-hotel-warning text-white hover:bg-hotel-warning/80",
        "hotel-info": "border-transparent bg-hotel-info text-white hover:bg-hotel-info/80",
        "hotel-success": "border-transparent bg-hotel-success text-white hover:bg-hotel-success/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
