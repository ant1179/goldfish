import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Collapsible({ title, children, defaultOpen = false, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn("border rounded-lg", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-lg">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  )
}

