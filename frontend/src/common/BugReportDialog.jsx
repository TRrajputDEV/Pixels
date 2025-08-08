// src/components/common/BugReportDialog.jsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Bug, Send, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const BugReportDialog = ({ errorId, error }) => {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        stepsToReproduce: '',
        expectedBehavior: '',
        userEmail: ''
    })
    const { user } = useAuth()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const bugReport = {
                ...formData,
                errorId,
                errorMessage: error?.message,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                userId: user?._id,
                userEmail: formData.userEmail || user?.email
            }

            const response = await fetch('/api/v1/bugs/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(bugReport)
            })

            if (response.ok) {
                toast({
                    title: "Bug Report Submitted! 🐛",
                    description: "Thank you for helping us improve Pixels. We'll investigate this issue.",
                })
                setOpen(false)
                setFormData({
                    title: '',
                    description: '',
                    stepsToReproduce: '',
                    expectedBehavior: '',
                    userEmail: ''
                })
            } else {
                throw new Error('Failed to submit bug report')
            }
        } catch (err) {
            toast({
                title: "Submission Failed",
                description: "Unable to submit bug report. Please try again later.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Bug className="mr-2 h-4 w-4" />
                    Report This Bug
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Report a Bug</DialogTitle>
                    <DialogDescription>
                        Help us fix this issue by providing detailed information about what happened.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="title">Bug Title *</Label>
                            <Input
                                id="title"
                                placeholder="Brief description of the issue"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="userEmail">Your Email</Label>
                            <Input
                                id="userEmail"
                                type="email"
                                placeholder="For follow-up (optional)"
                                value={formData.userEmail || user?.email || ''}
                                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">What happened? *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the issue you encountered..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                        <Textarea
                            id="stepsToReproduce"
                            placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                            value={formData.stepsToReproduce}
                            onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="expectedBehavior">Expected Behavior</Label>
                        <Textarea
                            id="expectedBehavior"
                            placeholder="What should have happened instead?"
                            value={formData.expectedBehavior}
                            onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                            rows={2}
                        />
                    </div>

                    {errorId && (
                        <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">
                                <strong>Error ID:</strong> {errorId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                This will help our developers identify and fix the issue.
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
