'use client'

import { useState } from 'react'
import { submitTestimonial } from '@/lib/actions/public-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Loader2, PenLine, Star } from 'lucide-react'

export function ReviewForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    const formData = new FormData(e.currentTarget)
    formData.set('rating', rating.toString())

    try {
      const result = await submitTestimonial(formData)
      if (result.error) {
        setStatus({ type: 'error', message: result.error })
      } else {
        setStatus({ type: 'success', message: result.message || 'Review submitted successfully.' })
        setTimeout(() => {
          setIsOpen(false)
          setStatus(null)
          setRating(5)
        }, 3000)
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) setStatus(null)
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-academic-900 transition-colors rounded-full font-medium shadow-sm">
          <PenLine className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold text-academic-900">Share Your Experience</DialogTitle>
          <DialogDescription className="text-gray-500">
            Tell us about your time here. Your review will be published after a quick verification.
          </DialogDescription>
        </DialogHeader>

        {status?.type === 'success' ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800">Review Submitted!</h3>
            <p className="text-emerald-600 text-sm px-4">{status.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {status?.type === 'error' && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                {status.message}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation (Optional)</Label>
                <Input id="designation" name="designation" placeholder="e.g. Alumni, Parent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Org (Optional)</Label>
                <Input id="company" name="company" placeholder="e.g. Google" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchYear">Batch Year (Optional)</Label>
              <Input id="batchYear" name="batchYear" placeholder="e.g. 2021" pattern="\d{4}" title="Must be a 4-digit year" />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${rating >= star ? 'text-gold-500' : 'text-gray-200'}`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Your Review <span className="text-red-500">*</span></Label>
              <Textarea 
                id="content" 
                name="content" 
                required 
                placeholder="What was your experience like?" 
                rows={4} 
                className="resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-academic-900 text-white hover:bg-academic-800">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
