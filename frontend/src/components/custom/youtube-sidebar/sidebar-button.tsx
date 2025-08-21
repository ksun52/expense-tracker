import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";


interface SidebarButtonProps extends React.ComponentProps<"button"> {
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export function SidebarButton({
  icon: Icon,
  className,
  children,
  ...props }: SidebarButtonProps) {
  return (
    <Button variant="ghost" className={cn('gap-2 justify-start', className)} {...props}>
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </Button>
  )
}