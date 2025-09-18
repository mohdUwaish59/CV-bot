"use client"

import { Heart, Github, Linkedin, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="font-semibold text-lg">CV Tracker</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Streamline your job search with intelligent application tracking and analytics.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for job seekers</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Application Tracking</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Analytics Dashboard</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Interview Scheduler</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Document Manager</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer flex items-center space-x-1">
                <span>Help Center</span>
                <ExternalLink className="w-3 h-3" />
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">API Documentation</li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Connect</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-emerald-500/10 hover:text-emerald-600">
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-500/10 hover:text-blue-600">
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-orange-500/10 hover:text-orange-600">
                <Mail className="w-4 h-4" />
                <span className="sr-only">Email</span>
              </Button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Get updates on new features</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">© {currentYear} CV Tracker. All rights reserved.</div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Status</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Changelog</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
