"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Image from "next/image"

interface ImagePreviewProps {
  original?: string
  optimized?: string
  originalSize?: number
  optimizedSize?: number
  isProcessing?: boolean
  onDownload?: () => void
}

function formatSize(bytes?: number): string {
  if (!bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export default function ImagePreview({
  original,
  optimized,
  originalSize,
  optimizedSize,
  isProcessing,
  onDownload,
}: ImagePreviewProps) {
  const savings = originalSize && optimizedSize ? Math.round(((originalSize - optimizedSize) / originalSize) * 100) : 0

  if (!original) {
    return (
      <Card className="p-12 text-center border-dashed">
        <p className="text-muted-foreground">Upload an image to see a preview</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <Card className="p-4">
          <p className="text-sm font-semibold mb-3 text-foreground">Original</p>
          <div className="bg-muted rounded-lg aspect-square flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={original || "/placeholder.svg"} alt="Original" fill className="object-contain" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Size: {formatSize(originalSize)}</p>
        </Card>

        {/* Optimized */}
        <Card className="p-4">
          <p className="text-sm font-semibold mb-3 text-foreground">Optimized</p>
          <div className="bg-muted rounded-lg aspect-square flex items-center justify-center overflow-hidden">
            {isProcessing ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Processing...</p>
              </div>
            ) : optimized ? (
              <div className="relative w-full h-full">
                <Image src={optimized || "/placeholder.svg"} alt="Optimized" fill className="object-contain" />
              </div>
            ) : (
              <p className="text-muted-foreground">Waiting to optimize...</p>
            )}
          </div>
          {optimized && (
            <p className="text-xs text-muted-foreground mt-3">
              Size: {formatSize(optimizedSize)} {savings > 0 && <span className="text-green-600">(-{savings}%)</span>}
            </p>
          )}
        </Card>
      </div>

      {optimized && (
        <Button onClick={onDownload} className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Download Optimized Image
        </Button>
      )}
    </div>
  )
}
