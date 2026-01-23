# 🎨 Image Optimizer

A fast, privacy-first web application for compressing, resizing, and converting images. Built with Next.js and Sharp for optimal performance and quality.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Sharp](https://img.shields.io/badge/Sharp-0.34-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## ✨ Features

### 🚀 Core Features

- **Ultra-Fast Processing** - Client-server optimization with Sharp for lightning-fast image processing
- **Large File Support** - Handle images up to 50MB in size
- **Privacy First** - Images are never stored anywhere - all processing happens on-the-fly
- **No Registration Required** - Start optimizing immediately
- **Batch Processing** - Process multiple images in bulk
- **Dark/Light Mode** - Beautiful UI with theme support

### 🖼️ Image Operations

#### Format Conversion

- **WebP** - Modern format with excellent compression (Recommended)
- **JPEG** - Universal compatibility with progressive encoding
- **PNG** - Lossless compression for graphics and transparency
- **ICO** - Icon format for favicons and app icons

#### Resize Options

- **Max Width & Height** - Set maximum dimensions (100-4000px)
- **Independent Dimensions** - Resize with exact width/height (e.g., 80×330)
- **Aspect Ratio Lock** - Toggle to maintain or ignore original proportions
- **Smart Resizing** - Automatic downscaling without upscaling

#### Quality Control

- **Adjustable Quality** - 1-100% quality slider for lossy formats
- **Compression Level** - Maximum compression for PNG (Level 9)
- **Progressive JPEG** - Better loading experience for web
- **Metadata Removal** - Strip EXIF data to reduce file size

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **next-themes** - Dark mode support

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Sharp 0.34** - High-performance image processing
- **Node.js** - JavaScript runtime

### Developer Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixes

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Clone the Repository

```bash
git clone https://github.com/gourav-1711/image-resizer.git
cd image-resizer-web
```

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage Guide

### Basic Image Optimization

1. **Upload Image**
   - Drag and drop an image onto the upload zone
   - Or click to browse and select a file
   - Supports JPG, PNG, WebP, and other common formats

2. **Configure Settings** (Optional)
   - Click "Settings" to expand options
   - Choose output format (WebP, JPEG, PNG, ICO)
   - Adjust quality slider (1-100%)
   - Set max width and height
   - Toggle aspect ratio lock
   - Enable/disable metadata removal

3. **Optimize**
   - Click "Optimize Image" button
   - View before/after comparison
   - See file size reduction statistics

4. **Download**
   - Click "Download" to save optimized image
   - Or add to bulk processor for batch downloads

### Independent Width/Height Resizing

To resize an image to exact dimensions (ignoring aspect ratio):

1. Open Settings
2. **Turn OFF** "Maintain Aspect Ratio"
3. Set Width: `80` and Height: `330` (or any dimensions)
4. Optimize - output will be exactly 80×330 pixels

### Creating ICO Icons

1. Upload your image
2. Open Settings
3. Select Format: **ICO (Icon)**
4. Set dimensions (e.g., 256×256 for standard icons)
5. Optimize and download your .ico file

### Bulk Processing

1. Optimize individual images
2. Click "Add to Bulk Processing"
3. Repeat for multiple images
4. Download all at once from the bulk processor

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Image Processing Limits

Configure in `next.config.mjs`:

```javascript
experimental: {
  serverActions: {
    bodySizeLimit: "50mb", // Max file upload size
  },
},
```

Configure in `app/api/optimize/route.ts`:

```typescript
const SHARP_OPTIONS = {
  limitInputPixels: 268402689, // ~16k x 16k images
  unlimited: false,
};
```

## 🏗️ Project Structure

```
image-resizer-web/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   └── optimize/        # Image optimization endpoint
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # Radix UI components
│   ├── image-uploader.tsx   # Upload component
│   ├── image-preview.tsx    # Before/after preview
│   ├── optimization-settings.tsx  # Settings panel
│   └── bulk-processor.tsx   # Bulk processing UI
├── lib/                     # Utilities
├── styles/                  # Global styles
├── public/                  # Static assets
└── next.config.mjs          # Next.js configuration
```

## 🔧 API Reference

### POST `/api/optimize`

Optimize and convert images.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `file` (File) - Image file to optimize
  - `quality` (number) - Quality 1-100 (default: 75)
  - `format` (string) - Output format: "webp" | "jpeg" | "png" | "ico"
  - `maxWidth` (number) - Maximum width in pixels (default: 1920)
  - `maxHeight` (number) - Maximum height in pixels (default: 1080)
  - `maintainAspectRatio` (boolean) - Lock aspect ratio (default: true)
  - `removeMetadata` (boolean) - Strip EXIF data (default: true)

**Response:**

- Content-Type: `image/webp` | `image/jpeg` | `image/png` | `image/x-icon`
- Body: Optimized image buffer

**Example:**

```javascript
const formData = new FormData();
formData.append("file", imageFile);
formData.append("quality", "80");
formData.append("format", "webp");
formData.append("maxWidth", "1920");
formData.append("maxHeight", "1080");
formData.append("maintainAspectRatio", "true");

const response = await fetch("/api/optimize", {
  method: "POST",
  body: formData,
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gourav-1711/image-resizer)

### Docker

```bash
# Build image
docker build -t image-optimizer .

# Run container
docker run -p 3000:3000 image-optimizer
```

### Self-Hosted

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: 'your-color',
      // ...
    }
  }
}
```

### Default Settings

Modify default optimization settings in `app/page.tsx`:

```typescript
const [settings, setSettings] = useState({
  quality: 75, // Default quality
  format: "webp", // Default format
  maxWidth: 1920, // Default max width
  maxHeight: 1080, // Default max height
  removeMetadata: true, // Strip metadata by default
  maintainAspectRatio: true, // Lock aspect ratio by default
});
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Upload image < 5MB
- [ ] Upload image > 5MB
- [ ] Test WebP conversion
- [ ] Test JPEG conversion
- [ ] Test PNG conversion
- [ ] Test ICO conversion
- [ ] Test with aspect ratio locked
- [ ] Test with aspect ratio unlocked (e.g., 80×330)
- [ ] Test quality slider
- [ ] Test dark/light mode
- [ ] Test bulk processing

## 📊 Performance

- **Sharp Processing** - 4-5x faster than ImageMagick
- **Lazy Loading** - Components load on demand
- **API Caching** - No-cache headers for fresh results
- **Optimized Builds** - Next.js production optimization
- **CDN Ready** - Static assets can be cached

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Gourav**


## 🙏 Acknowledgments

- [Sharp](https://sharp.pixelplumbing.com/) - High performance image processing
- [Next.js](https://nextjs.org/) - The React Framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

