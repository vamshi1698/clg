/**
 * Security Utilities
 * Centralized helpers for input sanitization, rate limiting, and validation.
 */

import { z } from 'zod'

// ---------------------------------------------------------------------------
// HTML Sanitization — strip all HTML tags from user input
// ---------------------------------------------------------------------------

/**
 * Remove all HTML tags from a string to prevent XSS in email templates
 * and any context where user input is embedded into HTML.
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Strip HTML tags entirely (for plain-text contexts).
 */
export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

// ---------------------------------------------------------------------------
// In-Memory Rate Limiter (sliding window)
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  timestamps: number[]
}

/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for single-process deployments. For multi-instance setups,
 * replace with Redis-backed storage.
 */
export class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private maxAttempts: number
  private windowMs: number

  constructor(options: { maxAttempts: number; windowMs: number }) {
    this.maxAttempts = options.maxAttempts
    this.windowMs = options.windowMs

    // Periodic cleanup every 60s to prevent memory leaks
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 60_000)
    }
  }

  /**
   * Check if a key is rate-limited. Returns true if the request should be BLOCKED.
   */
  isLimited(key: string): boolean {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry) {
      this.store.set(key, { timestamps: [now] })
      return false
    }

    // Remove timestamps outside the sliding window
    entry.timestamps = entry.timestamps.filter(t => now - t < this.windowMs)

    if (entry.timestamps.length >= this.maxAttempts) {
      return true // Rate limited
    }

    entry.timestamps.push(now)
    return false
  }

  /**
   * Get remaining attempts for a key.
   */
  remaining(key: string): number {
    const now = Date.now()
    const entry = this.store.get(key)
    if (!entry) return this.maxAttempts

    const validTimestamps = entry.timestamps.filter(t => now - t < this.windowMs)
    return Math.max(0, this.maxAttempts - validTimestamps.length)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      entry.timestamps = entry.timestamps.filter(t => now - t < this.windowMs)
      if (entry.timestamps.length === 0) {
        this.store.delete(key)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Pre-configured rate limiters for different endpoints
// ---------------------------------------------------------------------------

/** Login: 5 attempts per 15 minutes per IP/email */
const LOGIN_MAX_ATTEMPTS = process.env.LOGIN_MAX_ATTEMPTS ? parseInt(process.env.LOGIN_MAX_ATTEMPTS, 10) : 5
const LOGIN_WINDOW_MS = process.env.LOGIN_WINDOW_MS ? parseInt(process.env.LOGIN_WINDOW_MS, 10) : 15 * 60 * 1000 // 15 minutes

export const loginLimiter = new RateLimiter({ maxAttempts: LOGIN_MAX_ATTEMPTS, windowMs: LOGIN_WINDOW_MS })

// ---------------------------------------------------------------------------
// Zod Validation Helper
// ---------------------------------------------------------------------------

/**
 * Validate data against a Zod schema. Returns parsed data or throws
 * a user-friendly error message.
 */
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const firstError = result.error.errors[0]
    throw new Error(firstError?.message || 'Invalid input')
  }
  return result.data
}

// ---------------------------------------------------------------------------
// Common Zod Schemas
// ---------------------------------------------------------------------------

export const resultLookupSchema = z.object({
  registerNumber: z.string()
    .trim()
    .min(1, 'Register number is required')
    .max(50, 'Register number is too long')
    .regex(/^[A-Za-z0-9\-_/]+$/, 'Register number contains invalid characters'),
  dateOfBirth: z.string()
    .trim()
    .min(1, 'Date of birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
})

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(320, 'Email is too long'),
  phone: z.string().trim().max(20, 'Phone number is too long').optional(),
  subject: z.string().trim().max(500, 'Subject is too long').optional(),
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message is too long'),
})

export const admissionEnquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(320, 'Email is too long'),
  phone: z.string().trim().min(1, 'Phone is required').max(20, 'Phone number is too long'),
  level: z.string().trim().min(1, 'Program level is required'),
  courseId: z.string().trim().min(1, 'Course selection is required'),
  percentage: z.string().trim().min(1, 'Percentage is required'),
  queries: z.string().trim().max(5000, 'Queries text is too long').optional(),
})

export const testimonialSubmissionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name is too long'),
  designation: z.string().trim().max(200, 'Designation is too long').optional(),
  company: z.string().trim().max(200, 'Company is too long').optional(),
  batchYear: z.string().trim().regex(/^\d{4}$/, 'Batch year must be a 4-digit number').optional().or(z.literal('')),
  rating: z.number().min(1).max(5).default(5),
  content: z.string().trim().min(1, 'Review content is required').max(2000, 'Review is too long'),
})
