import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const config = {
  maxDuration: 60,
  api: {
    responseSizeLimit: "50mb",
  },
};

// Increase Sharp's memory limits for large images
const SHARP_OPTIONS = {
  limitInputPixels: 268402689, // ~16k x 16k images
  unlimited: false,
};

export async function POST(request: NextRequest) {
  try {
    console.log("🔵 Optimization request received");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const quality = Number(formData.get("quality")) || 75;
    const format = (formData.get("format") || "webp") as
      | "webp"
      | "jpeg"
      | "png"
      | "ico";
    const maxWidth = Number(formData.get("maxWidth")) || 1920;
    const maxHeight = Number(formData.get("maxHeight")) || 1080;
    const maintainAspectRatio = formData.get("maintainAspectRatio") === "true";

    console.log("📊 Parameters:", {
      fileName: file?.name,
      fileSize: file?.size,
      quality,
      format,
      maxWidth,
      maxHeight,
      maintainAspectRatio,
    });

    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("📦 File size:", file.size, "bytes");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("✅ Buffer created, size:", buffer.length);

    let image = sharp(buffer, SHARP_OPTIONS);

    let metadata;
    try {
      metadata = await image.metadata();
      console.log("🖼️ Image metadata:", {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      });
    } catch (metadataError) {
      console.error(
        "❌ Failed to read metadata:",
        metadataError instanceof Error
          ? metadataError.message
          : String(metadataError),
      );
      throw new Error(
        `Invalid image file: ${
          metadataError instanceof Error
            ? metadataError.message
            : "Unknown error"
        }`,
      );
    }

    // Create a fresh sharp instance for processing
    image = sharp(buffer, SHARP_OPTIONS);

    // Resize logic - support both aspect ratio locked and independent dimensions
    const needsResize =
      (metadata.width && metadata.width > maxWidth) ||
      (metadata.height && metadata.height > maxHeight);

    if (needsResize) {
      console.log(
        "🔄 Resizing from",
        metadata.width,
        "x",
        metadata.height,
        "to max",
        maxWidth,
        "x",
        maxHeight,
      );

      if (maintainAspectRatio) {
        // Maintain aspect ratio - fit inside the box
        image = image.resize(maxWidth, maxHeight, {
          fit: "inside",
          withoutEnlargement: true,
        });
      } else {
        // Independent dimensions - force exact dimensions
        image = image.resize(maxWidth, maxHeight, {
          fit: "fill",
          withoutEnlargement: false,
        });
      }
    }

    let output;
    try {
      switch (format) {
        case "jpeg":
          console.log("🎨 Converting to JPEG with quality", quality);
          output = image.jpeg({ quality, progressive: true });
          break;
        case "png":
          console.log("🎨 Converting to PNG");
          output = image.png({ compressionLevel: 9 });
          break;
        case "ico":
          console.log("🎨 Converting to ICO");
          // ICO format - respect aspect ratio setting just like other formats
          // Note: ICO files can contain non-square images
          if (maintainAspectRatio) {
            // Cap at 256 for standard icon size
            const iconSize = Math.min(maxWidth, maxHeight, 256);
            output = image
              .resize(iconSize, iconSize, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0, alpha: 0 },
              })
              .png({ compressionLevel: 9 });
          } else {
            // Independent dimensions - allow any width/height combination
            output = image
              .resize(maxWidth, maxHeight, {
                fit: "fill",
                background: { r: 0, g: 0, b: 0, alpha: 0 },
              })
              .png({ compressionLevel: 9 });
          }
          break;
        case "webp":
        default:
          console.log("🎨 Converting to WebP with quality", quality);
          output = image.webp({ quality });
          break;
      }

      console.log("⚙️ Processing image to buffer");
      const buffer_result = await output.toBuffer();
      console.log(
        "✅ Successfully optimized, result size:",
        buffer_result.length,
        "bytes",
      );

      return new NextResponse(new Uint8Array(buffer_result), {
        status: 200,
        headers: {
          "Content-Type": `image/${format === "jpeg" ? "jpeg" : format === "ico" ? "x-icon" : format}`,
          "Cache-Control": "no-cache",
        },
      });
    } catch (processingError) {
      console.error(
        "❌ Processing error:",
        processingError instanceof Error
          ? processingError.message
          : String(processingError),
      );
      throw new Error(
        `Failed to process image: ${
          processingError instanceof Error
            ? processingError.message
            : "Unknown error"
        }`,
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Optimization failed:", errorMessage);
    return NextResponse.json(
      { error: "Optimization failed", details: errorMessage },
      { status: 500 },
    );
  }
}
