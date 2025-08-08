// src/components/common/ReportButton.jsx - New Component
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Flag } from 'lucide-react'
import BugReportDialog from './BugReportDialog'

const ReportButton = ({ 
    contentType = "content", // "video", "channel", "comment", etc.
    contentId = null,
    contentTitle = "",
    size = "sm",
    variant = "outline",
    className = ""
}) => {
    const [showReportDialog, setShowReportDialog] = useState(false)

    return (
        <>
            <Button
                variant={variant}
                size={size}
                className={className}
                onClick={() => setShowReportDialog(true)}
            >
                <Flag className="mr-2 h-4 w-4" />
                Report
            </Button>

            <BugReportDialog
                isOpen={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                contentType={contentType}
                contentId={contentId}
                contentTitle={contentTitle}
                isContentReport={true}
            />
        </>
    )
}

export default ReportButton
