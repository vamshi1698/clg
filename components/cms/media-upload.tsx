'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  type: 'image' | 'url'
  placeholder?: string
  className?: string
}

export function MediaUploadInput({ value, onChange, type, placeholder, className }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await res.json()
      onChange(data.url)
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      })
    } catch (err: any) {
      toast({
        title: 'Upload Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            {type === 'image' ? <ImageIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          </div>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || (type === 'image' ? 'https://... or upload an image' : 'https://... or upload a file')}
            className={`w-full pl-9 ${className}`}
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={type === 'image' ? 'image/*' : '*/*'}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-shrink-0 inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {type === 'image' && value && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
