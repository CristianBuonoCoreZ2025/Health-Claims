import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  lead?: string
  children?: React.ReactNode
  className?: string
}

function PageHeader({ title, lead, children, className }: PageHeaderProps) {
  return (
    <div className={cn("app-page-header", className)}>
      <h1 className="app-page-title">{title}</h1>
      {lead && <p className="app-page-lead">{lead}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}

export { PageHeader }
