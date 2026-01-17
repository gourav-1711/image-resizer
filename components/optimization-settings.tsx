"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface OptimizationSettingsProps {
  settings: {
    quality: number
    format: "webp" | "jpeg" | "png"
    maxWidth: number
    maxHeight: number
    removeMetadata: boolean
  }
  onChange: (settings: OptimizationSettingsProps["settings"]) => void
}

export default function OptimizationSettings({ settings, onChange }: OptimizationSettingsProps) {
  return (
    <div className="space-y-4">
      {/* Format */}
      <div>
        <Label htmlFor="format" className="text-sm font-medium">
          Format
        </Label>
        <Select value={settings.format} onValueChange={(format) => onChange({ ...settings, format: format as any })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp">WebP (Recommended)</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quality */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="quality" className="text-sm font-medium">
            Quality
          </Label>
          <span className="text-sm font-medium text-primary">{settings.quality}%</span>
        </div>
        <Slider
          value={[settings.quality]}
          onValueChange={([value]) => onChange({ ...settings, quality: value })}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Max Width */}
      <div>
        <Label htmlFor="maxWidth" className="text-sm font-medium">
          Max Width (px)
        </Label>
        <input
          type="number"
          value={settings.maxWidth}
          onChange={(e) => onChange({ ...settings, maxWidth: Number(e.target.value) })}
          className="w-full mt-1 px-3 py-1 border border-border rounded-md bg-background"
          min={100}
          max={4000}
        />
      </div>

      {/* Remove Metadata */}
      <div className="flex items-center justify-between">
        <Label htmlFor="removeMetadata" className="text-sm font-medium">
          Remove Metadata
        </Label>
        <Switch
          checked={settings.removeMetadata}
          onCheckedChange={(checked) => onChange({ ...settings, removeMetadata: checked })}
        />
      </div>
    </div>
  )
}
