// src/components/common/NetworkStatus.jsx
import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wifi, WifiOff } from 'lucide-react'

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [showOfflineMessage, setShowOfflineMessage] = useState(false)

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            setShowOfflineMessage(false)
        }

        const handleOffline = () => {
            setIsOnline(false)
            setShowOfflineMessage(true)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if (!showOfflineMessage) return null

    return (
        <div className="fixed top-16 left-0 right-0 z-50 mx-4">
            <Alert variant={isOnline ? "default" : "destructive"}>
                {isOnline ? (
                    <Wifi className="h-4 w-4" />
                ) : (
                    <WifiOff className="h-4 w-4" />
                )}
                <AlertDescription>
                    {isOnline 
                        ? "Connection restored! 🎉" 
                        : "No internet connection. Some features may not work."
                    }
                </AlertDescription>
            </Alert>
        </div>
    )
}

export default NetworkStatus
