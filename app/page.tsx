"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Download, Zap, Settings2, Plus } from "lucide-react"
import ImageUploader from "@/components/image-uploader"
import ImagePreview from "@/components/image-preview"
import OptimizationSettings from "@/components/optimization-settings"
import ThemeToggle from "@/components/theme-toggle"
import BulkProcessor from "@/components/bulk-processor"

interface ProcessedImage {
  id: string
  name: string
  url: string
  size: number
  originalSize: number
  format: string
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null)
  const [optimizedImage, setOptimizedImage] = useState<{ url: string; size: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    quality: 75,
    format: "webp" as "webp" | "jpeg" | "png",
    maxWidth: 1920,
    maxHeight: 1080,
    removeMetadata: true,
  })

  const handleImageUpload = useCallback((file: File, preview: string) => {
    setUploadedImage({ file, preview })
    setOptimizedImage(null)
    setError(null)
  }, [])

  const handleOptimize = useCallback(async () => {
    if (!uploadedImage) return

    setIsProcessing(true)
    setError(null)
    try {
      console.log(" Starting optimization...")

      const formData = new FormData()
      formData.append("file", uploadedImage.file)
      formData.append("quality", String(settings.quality))
      formData.append("format", settings.format)
      formData.append("maxWidth", String(settings.maxWidth))
      formData.append("maxHeight", String(settings.maxHeight))
      formData.append("removeMetadata", String(settings.removeMetadata))

      console.log(" Sending request to /api/optimize")
      const response = await fetch("/api/optimize", {
        method: "POST",
        body: formData,
      })

      console.log(" Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || "Optimization failed"
        console.error(" Optimization error:", errorMessage)
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      console.log(" Optimization successful, blob size:", blob.size)
      const url = URL.createObjectURL(blob)
      setOptimizedImage({ url, size: blob.size })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error(" Error optimizing image:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [uploadedImage, settings])

  const handleDownload = () => {
    if (!optimizedImage || !uploadedImage) return
    const a = document.createElement("a")
    a.href = optimizedImage.url
    a.download = `optimized.${settings.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleAddToBulk = () => {
    if (!optimizedImage || !uploadedImage) return
    const id = Date.now().toString()
    setProcessedImages([
      ...processedImages,
      {
        id,
        name: `optimized-${id}.${settings.format}`,
        url: optimizedImage.url,
        size: optimizedImage.size,
        originalSize: uploadedImage.file.size,
        format: settings.format,
      },
    ])
    setUploadedImage(null)
    setOptimizedImage(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Image Optimizer</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Compress, resize, and convert your images instantly. No registration required.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {error && (
          <Card className="mb-6 p-4 bg-destructive/10 border-destructive">
            <p className="text-destructive font-medium">{error}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ImageUploader onUpload={handleImageUpload} disabled={isProcessing} />

              {uploadedImage && (
                <div className="mt-6 space-y-4">
                  <Button onClick={() => setShowSettings(!showSettings)} variant="outline" className="w-full">
                    <Settings2 className="w-4 h-4 mr-2" />
                    {showSettings ? "Hide Settings" : "Settings"}
                  </Button>

                  {showSettings && (
                    <Card className="p-4">
                      <OptimizationSettings settings={settings} onChange={setSettings} />
                    </Card>
                  )}

                  <Button onClick={handleOptimize} disabled={isProcessing} className="w-full" size="lg">
                    {isProcessing ? "Optimizing..." : "Optimize Image"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            <ImagePreview
              original={uploadedImage?.preview}
              optimized={optimizedImage?.url}
              originalSize={uploadedImage?.file.size}
              optimizedSize={optimizedImage?.size}
              isProcessing={isProcessing}
              onDownload={handleDownload}
            />

            {optimizedImage && (
              <Button onClick={handleAddToBulk} variant="secondary" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add to Bulk Processing
              </Button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border">
          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Ultra Fast</h3>
            <p className="text-sm text-muted-foreground">Process images instantly in the browser</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Download Anywhere</h3>
            <p className="text-sm text-muted-foreground">Get optimized images instantly, no uploads</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">Your images are never stored on our servers</p>
          </div>
        </div>

        {/* Bulk Processor */}
        <BulkProcessor />
      </div>
    </main>
  )
}
