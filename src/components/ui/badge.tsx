import * as React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className = "", variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
