// src/components/common/ErrorBoundary.jsx
import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Bug, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null,
            errorId: null
        }
    }

    static getDerivedStateFromError(error) {
        // Generate unique error ID for tracking
        const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return { 
            hasError: true, 
            error,
            errorId
        }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ 
            error, 
            errorInfo,
        })

        // Log error to console for development
        console.error('Error Boundary Caught:', error, errorInfo)

        // Send error report to backend (optional)
        this.reportError(error, errorInfo)
    }

    reportError = async (error, errorInfo) => {
        try {
            const errorReport = {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                errorId: this.state.errorId
            }

            // Send to your error tracking service
            await fetch('/api/v1/errors/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(errorReport)
            })
        } catch (err) {
            console.error('Failed to report error:', err)
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <Card className="max-w-lg w-full">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Alert variant="destructive">
                                <Bug className="h-4 w-4" />
                                <AlertDescription>
                                    We're sorry for the inconvenience. An unexpected error occurred while loading this page.
                                </AlertDescription>
                            </Alert>

                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-medium text-sm mb-2">Error Details:</h4>
                                <p className="text-xs text-muted-foreground font-mono">
                                    Error ID: {this.state.errorId}
                                </p>
                                {process.env.NODE_ENV === 'development' && (
                                    <details className="mt-2">
                                        <summary className="text-xs cursor-pointer">Technical Details</summary>
                                        <pre className="text-xs mt-2 whitespace-pre-wrap">
                                            {this.state.error?.message}
                                        </pre>
                                    </details>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button 
                                    onClick={() => window.location.reload()} 
                                    className="flex-1"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => window.location.href = '/'}
                                    className="flex-1"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Go Home
                                </Button>
                            </div>

                            <BugReportDialog errorId={this.state.errorId} error={this.state.error} />
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
