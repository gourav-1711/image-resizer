"use client"

import type React from "react"

import { useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (file: File, preview: string) => void
  disabled?: boolean
}

export default function ImageUploader({ onUpload, disabled }: ImageUploaderProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) {
      processFile(file)
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file?.type.startsWith("image/")) {
      processFile(file)
    }
  }, [])

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      onUpload(file, preview)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Card
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "border-border hover:border-primary hover:bg-primary/5"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer block">
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="font-semibold text-foreground mb-1">Drag and drop your image</p>
        <p className="text-sm text-muted-foreground">or click to select from your device</p>
        <p className="text-xs text-muted-foreground mt-3">JPG, PNG, WebP up to 50MB</p>
      </label>
    </Card>
  )
}
