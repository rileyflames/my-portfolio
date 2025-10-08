// Sortable Image Gallery with drag-and-drop reordering
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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Eye } from 'lucide-react'

/**
 * Props for a single sortable image item
 */
interface SortableImageItemProps {
  id: string
  url: string
  index: number
  onRemove: (url: string) => void
  onView: (url: string) => void
}

/**
 * SortableImageItem Component
 * - Individual draggable image item
 * - Shows grip handle for dragging
 * - Remove and view buttons
 */
const SortableImageItem = ({ id, url, index, onRemove, onView }: SortableImageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors"
    >
      {/* Image */}
      <img
        src={url}
        alt={`Image ${index + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 bg-white bg-opacity-90 rounded cursor-move hover:bg-opacity-100 transition-opacity"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-600" />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* View Button */}
        <button
          onClick={() => onView(url)}
          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          title="View full size"
        >
          <Eye className="w-4 h-4" />
        </button>
        
        {/* Remove Button */}
        <button
          onClick={() => onRemove(url)}
          className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
          title="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Image Number Badge */}
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded font-medium">
        #{index + 1}
      </div>
    </div>
  )
}

/**
 * Props for SortableImageGallery
 */
interface SortableImageGalleryProps {
  /**
   * Array of image URLs
   */
  images: string[]
  
  /**
   * Callback when images are reordered
   */
  onReorder: (newOrder: string[]) => void
  
  /**
   * Callback when an image is removed
   */
  onRemove: (url: string) => void
  
  /**
   * Label for the gallery
   */
  label?: string
}

/**
 * SortableImageGallery Component
 * - Displays images in a sortable grid
 * - Drag and drop to reorder
 * - Remove individual images
 * - View images in full size
 * - Shows image position numbers
 * 
 * @example
 * ```tsx
 * <SortableImageGallery
 *   images={projectImages}
 *   onReorder={(newOrder) => setProjectImages(newOrder)}
 *   onRemove={(url) => setProjectImages(projectImages.filter(img => img !== url))}
 *   label="Project Gallery"
 * />
 * ```
 */
const SortableImageGallery = ({
  images,
  onReorder,
  onRemove,
  label
}: SortableImageGalleryProps) => {
  // State for image viewer modal
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  /**
   * Configure sensors for drag and drop
   * - PointerSensor: Mouse and touch
   * - KeyboardSensor: Keyboard navigation for accessibility
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance to start dragging (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /**
   * Handle drag end event
   * Reorders the images array
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string)
      const newIndex = images.indexOf(over.id as string)
      
      const newOrder = arrayMove(images, oldIndex, newIndex)
      onReorder(newOrder)
    }
  }

  /**
   * Handle image removal with confirmation
   */
  const handleRemove = (url: string) => {
    if (confirm('Remove this image?')) {
      onRemove(url)
    }
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label} ({images.length} {images.length === 1 ? 'image' : 'images'})
          </label>
          <p className="text-xs text-gray-500">
            Drag images to reorder
          </p>
        </div>
      )}

      {/* Sortable Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((url, index) => (
              <SortableImageItem
                key={url}
                id={url}
                url={url}
                index={index}
                onRemove={handleRemove}
                onView={setViewingImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            
            {/* Full Size Image */}
            <img
              src={viewingImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SortableImageGallery