"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface ProcessedImage {
  id: string
  name: string
  url: string
  size: number
  originalSize: number
  format: string
}

interface BulkProcessorProps {
  onProcess?: () => void
}

export default function BulkProcessor({ onProcess }: BulkProcessorProps) {
  const [images, setImages] = useState<ProcessedImage[]>([])

  const handleRemove = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  const handleDownloadAll = async () => {
    // Create a zip file or download all sequentially
    for (const image of images) {
      const a = document.createElement("a")
      a.href = image.url
      a.download = image.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // Add small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  if (images.length === 0) return null

  return (
    <Card className="p-6 mt-8 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Bulk Downloads ({images.length})</h3>
        <Button onClick={handleDownloadAll} size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {images.map((img) => (
          <div key={img.id} className="flex items-center justify-between p-3 bg-background rounded-lg text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{img.name}</p>
              <p className="text-xs text-muted-foreground">
                {(img.originalSize / 1024).toFixed(2)} KB → {(img.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(img.id)} className="ml-2" title="Remove">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
