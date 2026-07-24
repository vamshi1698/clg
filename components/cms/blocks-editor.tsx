'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { MediaUploadInput } from './media-upload'

export type BlockData = {
  id: string
  type: 'hero' | 'text' | 'image_gallery' | 'cta'
  [key: string]: any
}

interface BlocksEditorProps {
  value: BlockData[]
  onChange: (blocks: BlockData[]) => void
}

const BLOCK_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'text', label: 'Text Content' },
  { value: 'image_gallery', label: 'Image Gallery' },
  { value: 'cta', label: 'Call to Action' },
]

export function BlocksEditor({ value, onChange }: BlocksEditorProps) {
  const blocks = Array.isArray(value) ? value : []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      onChange(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  const addBlock = (type: BlockData['type']) => {
    const newBlock: BlockData = {
      id: crypto.randomUUID(),
      type,
    }
    
    if (type === 'hero') {
      newBlock.title = ''
      newBlock.subtitle = ''
      newBlock.image = ''
    } else if (type === 'text') {
      newBlock.content = ''
    } else if (type === 'image_gallery') {
      newBlock.images = []
    } else if (type === 'cta') {
      newBlock.title = ''
      newBlock.content = ''
      newBlock.buttonText = ''
      newBlock.buttonUrl = ''
    }
    
    onChange([...blocks, newBlock])
  }

  const updateBlock = (id: string, updates: Partial<BlockData>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onRemove={() => removeBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        <div className="text-sm font-semibold text-gray-500 w-full mb-1">Add Block:</div>
        {BLOCK_TYPES.map((bt) => (
          <button
            key={bt.value}
            type="button"
            onClick={() => addBlock(bt.value as any)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {bt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface SortableBlockProps {
  block: BlockData
  onUpdate: (updates: Partial<BlockData>) => void
  onRemove: () => void
}

function SortableBlock({ block, onUpdate, onRemove }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id })
  const [isExpanded, setIsExpanded] = useState(true)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative z-0 group/block">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
        <button
          type="button"
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-gray-700 capitalize flex-1">
          {block.type.replace('_', ' ')} Block
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-red-400 hover:text-red-600 transition-colors ml-1"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {block.type === 'hero' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Subtitle</label>
                <textarea
                  value={block.subtitle || ''}
                  onChange={(e) => onUpdate({ subtitle: e.target.value })}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Background Image</label>
                <MediaUploadInput
                  value={block.image || ''}
                  onChange={(v) => onUpdate({ image: v })}
                  type="image"
                />
              </div>
            </>
          )}

          {block.type === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Content (HTML allowed)</label>
              <textarea
                value={block.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className={inputClass}
                rows={5}
              />
            </div>
          )}

          {block.type === 'image_gallery' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Images</label>
              <div className="space-y-3">
                {(block.images || []).map((img: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <MediaUploadInput
                      value={img}
                      onChange={(v) => {
                        const newImages = [...(block.images || [])]
                        newImages[i] = v
                        onUpdate({ images: newImages })
                      }}
                      type="image"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...(block.images || [])]
                        newImages.splice(i, 1)
                        onUpdate({ images: newImages })
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onUpdate({ images: [...(block.images || []), ''] })}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  + Add Image
                </button>
              </div>
            </div>
          )}

          {block.type === 'cta' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Content</label>
                <textarea
                  value={block.content || ''}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={block.buttonText || ''}
                    onChange={(e) => onUpdate({ buttonText: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={block.buttonUrl || ''}
                    onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
