import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export const config = {
  maxDuration: 60,
}

export async function POST(request: NextRequest) {
  try {
    console.log(" Optimization request received")

    const formData = await request.formData()
    const file = formData.get("file") as File
    const quality = Number(formData.get("quality")) || 75
    const format = (formData.get("format") || "webp") as "webp" | "jpeg" | "png"
    const maxWidth = Number(formData.get("maxWidth")) || 1920
    const maxHeight = Number(formData.get("maxHeight")) || 1080

    console.log(" Parameters:", { fileName: file?.name, quality, format, maxWidth, maxHeight })

    if (!file) {
      console.error(" No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(" File size:", file.size, "bytes")

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(" Buffer created, size:", buffer.length)

    let image = sharp(buffer)

    let metadata
    try {
      metadata = await image.metadata()
      console.log(" Image metadata:", { width: metadata.width, height: metadata.height, format: metadata.format })
    } catch (metadataError) {
      console.error(
        " Failed to read metadata:",
        metadataError instanceof Error ? metadataError.message : String(metadataError),
      )
      throw new Error(`Invalid image file: ${metadataError instanceof Error ? metadataError.message : "Unknown error"}`)
    }

    // Create a fresh sharp instance for processing
    image = sharp(buffer)

    // Resize if necessary
    if (metadata.width && metadata.width > maxWidth) {
      console.log(" Resizing from", metadata.width, "to", maxWidth)
      image = image.resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
    }

    let output
    try {
      switch (format) {
        case "jpeg":
          console.log(" Converting to JPEG with quality", quality)
          output = image.jpeg({ quality, progressive: true })
          break
        case "png":
          console.log(" Converting to PNG")
          output = image.png({ compressionLevel: 9 })
          break
        case "webp":
        default:
          console.log(" Converting to WebP with quality", quality)
          output = image.webp({ quality })
          break
      }

      console.log(" Processing image to buffer")
      const buffer_result = await output.toBuffer()
      console.log(" Successfully optimized, result size:", buffer_result.length, "bytes")

      return new NextResponse(buffer_result, {
        status: 200,
        headers: {
          "Content-Type": `image/${format === "jpeg" ? "jpeg" : format}`,
          "Cache-Control": "no-cache",
        },
      })
    } catch (processingError) {
      console.error(
        " Processing error:",
        processingError instanceof Error ? processingError.message : String(processingError),
      )
      throw new Error(
        `Failed to process image: ${processingError instanceof Error ? processingError.message : "Unknown error"}`,
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(" Optimization failed:", errorMessage)
    return NextResponse.json({ error: "Optimization failed", details: errorMessage }, { status: 500 })
  }
}
