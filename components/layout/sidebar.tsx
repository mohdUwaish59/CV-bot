"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Plus, FileText, BarChart3, Settings, ChevronRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, description: "Overview & stats" },
  { name: "Add Application", href: "/applications/new", icon: Plus, description: "New job application" },
  { name: "All Applications", href: "/applications", icon: FileText, description: "Manage applications" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, description: "Track your progress" },
  { name: "Settings", href: "/settings", icon: Settings, description: "Account settings" },
]

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile && onToggle) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex h-full flex-col bg-sidebar/50 backdrop-blur-sm border-r animate-slide-in transition-all duration-300 z-50",
        // Desktop: always visible, fixed width
        "lg:w-72 lg:relative",
        // Mobile: overlay when open, hidden when closed
        isMobile ? (
          isOpen
            ? "fixed left-0 top-0 w-80 shadow-xl"
            : "fixed -left-80 w-80"
        ) : "w-72"
      )}>
        {/* Header with close button on mobile */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Navigation</h2>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={handleLinkClick}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto p-4 text-left group transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                  )}
                >
                  <div className="flex items-center w-full">
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div
                        className={cn(
                          "text-xs opacity-70 truncate",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity",
                        isActive && "opacity-100",
                      )}
                    />
                  </div>
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground text-center">CV-bot v1.0</div>
        </div>
      </div>
    </>
  )
}
