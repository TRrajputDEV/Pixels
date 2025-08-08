// src/hooks/useErrorHandler.js
import { useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export const useErrorHandler = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const handleError = useCallback((error, context = 'Unknown') => {
        console.error(`Error in ${context}:`, error)

        // Log error for debugging
        const errorLog = {
            context,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href
        }
        
        console.error('Error Details:', errorLog)

        // Determine error type and show appropriate message
        let title = "Something went wrong"
        let description = "Please try again later"
        let action = null

        if (error.type === 'Network Error') {
            title = "Connection Problem"
            description = "Please check your internet connection"
            action = {
                label: "Retry",
                action: () => window.location.reload()
            }
        } else if (error.type === 'Unauthorized') {
            title = "Sign In Required"
            description = "Please sign in to continue"
            action = {
                label: "Sign In",
                action: () => navigate('/login')
            }
        } else if (error.type === 'Forbidden') {
            title = "Access Denied"
            description = "You don't have permission for this action"
        } else if (error.type === 'Not Found') {
            title = "Content Not Found"
            description = "The requested content is no longer available"
            action = {
                label: "Go Home",
                action: () => navigate('/')
            }
        } else if (error.type === 'Server Error') {
            title = "Server Temporarily Unavailable"
            description = "We're working to fix this issue"
        }

        toast({
            title,
            description,
            variant: "destructive",
            action: action ? (
                <button 
                    onClick={action.action}
                    className="px-3 py-1 text-sm bg-destructive-foreground text-destructive rounded hover:bg-opacity-90"
                >
                    {action.label}
                </button>
            ) : undefined
        })

        // Send error report to backend (optional)
        reportError(errorLog)
        
        return errorLog
    }, [toast, navigate])

    return { handleError }
}

// Auto error reporting
const reportError = async (errorLog) => {
    try {
        await fetch('/api/v1/errors/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(errorLog)
        })
    } catch (err) {
        // Silent fail - don't want error reporting to cause more errors
        console.warn('Failed to report error:', err)
    }
}
