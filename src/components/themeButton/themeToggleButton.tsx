'use client'
import React, { useTransition } from 'react'
import { Moon, SunMedium } from 'lucide-react'
import { Button } from "../ui/button"
import { useTheme } from '@/providers/ThemeProvider'
import { toggleTheme as serverToggleTheme } from '@/app/actions/theme'

const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme()
    const [isPending, startTransition] = useTransition()

    const toggleTheme = () => {
        // Optimistic update for instant feedback
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        
        // Sync with create-chatbot ThemeProvider if needed
        localStorage.setItem("vite-ui-theme", newTheme)
        
        // Dispatch custom event to notify other theme providers
        window.dispatchEvent(new CustomEvent('theme-change', { 
            detail: { theme: newTheme } 
        }))
        
        // Update server-side cookie (this is the primary cookie setting)
        startTransition(async () => {
            try {
                await serverToggleTheme()
            } catch (error) {
                console.error('Failed to update theme on server:', error)
                // Revert optimistic update on error
                setTheme(theme)
            }
        })
    }

    return (
        <Button 
            onClick={toggleTheme} 
            variant="ghost" 
            size="icon"
            className="hover:bg-transparent focus:ring-0"
            disabled={isPending}
        >
            {theme === "light" ? (
                <Moon className="w-5 h-5" />
            ) : (
                <SunMedium className="w-5 h-5" />
            )}
        </Button>
    )
}

export default ThemeToggleButton