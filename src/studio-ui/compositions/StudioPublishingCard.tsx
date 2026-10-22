import React from "react"
import type { StudioControlSize } from "../tokens"
import { StudioCloseableBadge, StudioLegendMultiDropdown, StudioUploadFrame, StudioTextInput, StudioTextArea, type StudioLegendMultiDropdownOption } from "../primitives/StudioControls"
import "../../styles/studio-publishing-card.css"

export type StudioPublishingCardOption = { value: string; label: string; disabled?: boolean }

export type StudioPublishingCardMetadata = {
  playlist: string[]
  category: string[]
  location: string[]
  publishDate: string[]
}

export type StudioPublishingCardSize = Extract<StudioControlSize, "standard" | "compact" | "micro">

export type StudioPublishingCardProps = {
  sizeVariant?: StudioPublishingCardSize
  title?: string
  onTitleChange?: (value: string) => void
  description?: string
  onDescriptionChange?: (value: string) => void
  imageUrl?: string
  onThumbnailChange?: (file: File) => void
  tags?: string[]
  onTagsChange?: (tags: string[]) => void
  metadata?: Partial<StudioPublishingCardMetadata>
  onMetadataChange?: (metadata: StudioPublishingCardMetadata) => void
  playlistOptions?: StudioPublishingCardOption[]
  categoryOptions?: StudioLegendMultiDropdownOption[]
  locationOptions?: StudioLegendMultiDropdownOption[]
  publishDateOptions?: StudioLegendMultiDropdownOption[]
  className?: string
}

/** 5:7 publishing-card composition; controls remain canonical Studio primitives. */
export function StudioPublishingCard({
  sizeVariant = "standard",
  title = "",
  onTitleChange,
  description = "",
  onDescriptionChange,
  onThumbnailChange,
  tags: controlledTags,
  onTagsChange,
  metadata,
  onMetadataChange,
  playlistOptions = [{ value: "featured", label: "FEATURED" }, { value: "gameplay", label: "GAMEPLAY" }, { value: "tutorial", label: "TUTORIAL" }],
  categoryOptions = [{ value: "gaming", label: "GAMING" }, { value: "education", label: "EDUCATION" }, { value: "entertainment", label: "ENTERTAINMENT" }],
  locationOptions = [{ value: "youtube", label: "YOUTUBE" }, { value: "shorts", label: "SHORTS" }, { value: "community", label: "COMMUNITY" }],
  publishDateOptions = [{ value: "2026-10-21", label: "10/21/2026" }, { value: "2026-10-22", label: "10/22/2026" }, { value: "2026-10-23", label: "10/23/2026" }],
  className,
}: StudioPublishingCardProps) {
  const [localTags, setLocalTags] = React.useState(["VIEWTUBE", "FEATURED", "GAMEPLAY", "TUTORIAL"])
  const [tagDraft, setTagDraft] = React.useState("")
  const [localMetadata, setLocalMetadata] = React.useState<StudioPublishingCardMetadata>({
    playlist: [], category: [], location: [], publishDate: ["2026-10-21"],
  })
  const tags = controlledTags ?? localTags
  const selectedMetadata = { ...localMetadata, ...metadata }
  const updateTags = (next: string[]) => {
    if (controlledTags === undefined) setLocalTags(next)
    onTagsChange?.(next)
  }
  const updateMetadata = (key: keyof StudioPublishingCardMetadata, next: string[]) => {
    const updated = { ...selectedMetadata, [key]: next }
    setLocalMetadata(updated)
    onMetadataChange?.(updated)
  }
  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !tagDraft.trim()) return
    event.preventDefault()
    const next = [...tags, tagDraft.trim().toUpperCase()]
    updateTags(next)
    setTagDraft("")
  }
  return (
    <article className={["vt-studio-publishing-card", className].filter(Boolean).join(" ")} data-vt-studio-control="true" data-vt-studio-publishing-card="true" data-size={sizeVariant} aria-label="Publishing card">
      <header className="vt-studio-publishing-card__title">
        <StudioTextInput sizeVariant={sizeVariant} variant="fixed-label" label="TITLE" value={title} placeholder="ADD A TITLE" onChange={event => onTitleChange?.(event.target.value)} aria-label="Title" />
      </header>
      <section className="vt-studio-publishing-card__thumbnail" aria-label="Thumbnail upload">
        <StudioUploadFrame accept="image/*" prompt="UPLOAD THUMBNAIL" aria-label="Upload thumbnail image" onFileChange={onThumbnailChange} className="vt-studio-publishing-card__upload" />
      </section>
      <section className="vt-studio-publishing-card__description">
        <StudioTextArea sizeVariant={sizeVariant === "micro" ? "compact" : sizeVariant} variant="fixed-label" label="DESCRIPTION" value={description} placeholder="WRITE A DESCRIPTION" rows={3} onChange={event => onDescriptionChange?.(event.target.value)} aria-label="Description" />
      </section>
      <div className="vt-studio-publishing-card__lower">
        <section className="vt-studio-publishing-card__tags" aria-label="Tags">
          <div className="vt-studio-publishing-card__section-label">TAGS</div>
          <div className="vt-studio-publishing-card__tag-list">
            {tags.map((tag, index) => <StudioCloseableBadge key={tag + index} label={tag} entering={false} onClose={() => updateTags(tags.filter((_, tagIndex) => tagIndex !== index))} />)}
          </div>
          <input data-vt-studio-control="true" data-size={sizeVariant} className="vt-studio-publishing-card__tag-input" aria-label="Add tag" value={tagDraft} placeholder="+ ADD TAG" onChange={event => setTagDraft(event.target.value)} onKeyDown={addTag} />
        </section>
        <section className="vt-studio-publishing-card__metadata" aria-label="Publishing metadata">
          <StudioLegendMultiDropdown sizeVariant={sizeVariant} label="PLAYLIST" accessibleLabel="Playlist" options={playlistOptions} value={selectedMetadata.playlist} onChange={value => updateMetadata("playlist", value)} placeholder="SELECT" />
          <StudioLegendMultiDropdown sizeVariant={sizeVariant} label="CATEGORY" accessibleLabel="Category" options={categoryOptions} value={selectedMetadata.category} onChange={value => updateMetadata("category", value)} placeholder="SELECT" />
          <StudioLegendMultiDropdown sizeVariant={sizeVariant} label="LOCATION" accessibleLabel="Location" options={locationOptions} value={selectedMetadata.location} onChange={value => updateMetadata("location", value)} placeholder="SELECT" />
          <StudioLegendMultiDropdown sizeVariant={sizeVariant} label="PUBLISH DATE" accessibleLabel="Publish date" options={publishDateOptions} value={selectedMetadata.publishDate} onChange={value => updateMetadata("publishDate", value)} placeholder="SELECT" selectionMode="single" />
        </section>
      </div>
    </article>
  )
}

export default StudioPublishingCard
