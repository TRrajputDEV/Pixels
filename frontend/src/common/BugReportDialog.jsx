// src/components/common/BugReportDialog.jsx - Enhanced version
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { Bug, Send, Loader2, Flag, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const BugReportDialog = ({ 
    isOpen, 
    onClose, 
    errorId, 
    error,
    contentType = null, // "video", "channel", "comment", etc.
    contentId = null,
    contentTitle = "",
    isContentReport = false 
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [reportType, setReportType] = useState(isContentReport ? 'inappropriate' : 'bug')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        severity: 'medium',
        userEmail: ''
    })
    const { user } = useAuth()
    const { toast } = useToast()

    // Report categories based on type
    const contentReportCategories = [
        { value: 'inappropriate', label: 'Inappropriate Content', description: 'Content violates community guidelines' },
        { value: 'spam', label: 'Spam or Misleading', description: 'Spam, scam, or misleading content' },
        { value: 'copyright', label: 'Copyright Violation', description: 'Unauthorized use of copyrighted material' },
        { value: 'harassment', label: 'Harassment or Bullying', description: 'Content that harasses or bullies others' },
        { value: 'violence', label: 'Violence or Dangerous Acts', description: 'Content showing violence or dangerous activities' },
        { value: 'other', label: 'Other', description: 'Other policy violations' }
    ]

    const bugCategories = [
        { value: 'ui', label: 'User Interface Issue', description: 'Button not working, layout problems' },
        { value: 'video', label: 'Video Playback', description: 'Video won\'t play, loading issues' },
        { value: 'account', label: 'Account Issues', description: 'Login, profile, settings problems' },
        { value: 'performance', label: 'Performance', description: 'Slow loading, crashes, freezing' },
        { value: 'feature', label: 'Feature Request', description: 'Suggestion for new feature' },
        { value: 'other', label: 'Other', description: 'Other technical issues' }
    ]

    const categories = isContentReport ? contentReportCategories : bugCategories

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const reportData = {
                type: isContentReport ? 'content_report' : 'bug_report',
                reportType,
                ...formData,
                contentType,
                contentId,
                contentTitle,
                errorId,
                errorMessage: error?.message,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                userId: user?._id,
                userEmail: formData.userEmail || user?.email
            }

            const endpoint = isContentReport ? '/api/v1/reports/content' : '/api/v1/bugs/report'
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(reportData)
            })

            if (response.ok) {
                toast({
                    title: isContentReport ? "Report Submitted! 🚨" : "Bug Report Submitted! 🐛",
                    description: isContentReport 
                        ? "Thank you for keeping Pixels safe. We'll review this content."
                        : "Thank you for helping us improve Pixels. We'll investigate this issue.",
                })
                onClose()
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    severity: 'medium',
                    userEmail: ''
                })
                setReportType(isContentReport ? 'inappropriate' : 'bug')
            } else {
                throw new Error('Failed to submit report')
            }
        } catch (err) {
            toast({
                title: "Submission Failed",
                description: "Unable to submit report. Please try again later.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const getDialogTitle = () => {
        if (isContentReport) {
            return `Report ${contentType === 'video' ? 'Video' : contentType === 'channel' ? 'Channel' : 'Content'}`
        }
        return "Report a Bug"
    }

    const getDialogDescription = () => {
        if (isContentReport) {
            return `Help us keep Pixels safe by reporting content that violates our community guidelines.`
        }
        return "Help us fix this issue by providing detailed information about what happened."
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isContentReport ? (
                            <Flag className="h-5 w-5 text-red-500" />
                        ) : (
                            <Bug className="h-5 w-5" />
                        )}
                        {getDialogTitle()}
                    </DialogTitle>
                    <DialogDescription>
                        {getDialogDescription()}
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Content Info (for content reports) */}
                    {isContentReport && contentTitle && (
                        <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm font-medium">Reporting: {contentTitle}</p>
                            <p className="text-xs text-muted-foreground">
                                {contentType === 'video' ? 'Video' : 'Channel'} • ID: {contentId}
                            </p>
                        </div>
                    )}

                    {/* Report Category */}
                    <div>
                        <Label className="text-base font-medium">
                            {isContentReport ? "Why are you reporting this?" : "What type of issue is this?"} *
                        </Label>
                        <RadioGroup
                            value={formData.category}
                            onValueChange={(value) => setFormData({...formData, category: value})}
                            className="mt-3"
                        >
                            {categories.map((category) => (
                                <div key={category.value} className="flex items-start space-x-2 space-y-0">
                                    <RadioGroupItem 
                                        value={category.value} 
                                        id={category.value}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label 
                                            htmlFor={category.value}
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {category.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">
                            {isContentReport ? "Additional details (optional)" : "What happened? *"}
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={
                                isContentReport 
                                    ? "Provide any additional context about why this content should be reviewed..."
                                    : "Describe the issue you encountered..."
                            }
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={4}
                            required={!isContentReport}
                        />
                    </div>

                    {/* Severity (for bug reports only) */}
                    {!isContentReport && (
                        <div>
                            <Label>Severity</Label>
                            <RadioGroup
                                value={formData.severity}
                                onValueChange={(value) => setFormData({...formData, severity: value})}
                                className="mt-2 flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="low" id="low" />
                                    <Label htmlFor="low" className="text-sm">Low</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium" className="text-sm">Medium</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="high" id="high" />
                                    <Label htmlFor="high" className="text-sm">High</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {/* Contact Email */}
                    <div>
                        <Label htmlFor="userEmail">Your Email (optional)</Label>
                        <Input
                            id="userEmail"
                            type="email"
                            placeholder="For follow-up if needed"
                            value={formData.userEmail || user?.email || ''}
                            onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                        />
                    </div>

                    {/* Warning for content reports */}
                    {isContentReport && (
                        <div className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                    Please report responsibly
                                </p>
                                <p className="text-yellow-700 dark:text-yellow-300">
                                    False reports may result in restrictions on your account. Only report content that genuinely violates our guidelines.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Report
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BugReportDialog
