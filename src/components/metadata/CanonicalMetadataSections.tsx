import React from "react"
import { Upload, Image as ImageIcon, Sparkles, History, WandSparkles, Search, MapPin, ListVideo, Users, Clock3, Globe2, MessageSquare, Bot, Tags, FolderOpen } from "lucide-react"
import { SubToolbox, ThumbnailMiniSubToolbox } from "../Toolbox"
import { SubToolboxActions, SubToolboxGrid, SubToolboxSection, SubToolboxStack } from "../subtoolbox/SubToolboxLayouts"
import {
  SubToolboxButton,
  SubToolboxFileTarget,
  SubToolboxInput,
  SubToolboxSelect,
  SubToolboxTextArea,
} from "../subtoolbox/SubToolboxPrimitives"

export const CANONICAL_METADATA_SECTIONS = [
  "video-upload", "title", "thumbnail", "visibility", "audience", "timestamps",
  "description", "location", "playlists", "community", "ai-use", "tags", "category",
] as const

export const PRIMARY_METADATA_SECTIONS = [
  "video-upload", "title", "thumbnail", "description", "playlists", "tags", "category",
] as const

export const SECONDARY_METADATA_SECTIONS = [
  "visibility", "audience", "timestamps", "location", "community", "ai-use",
] as const

export interface CanonicalMetadataSectionsProps {
  title: string
  description: string
  tags: string
  category: string
  playlists: string
  videoFile?: File | null
  thumbnailFile?: File | null
  thumbnailPreview?: string | null
  visibility: string
  audience?: boolean
  timestamps?: string
  location?: string
  community?: boolean
  aiUse?: boolean
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onTagsChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onPlaylistsChange: (value: string) => void
  onVideoFileChange?: (file: File | null) => void
  onThumbnailFileChange?: (file: File | null) => void
  onVisibilityChange: (value: string) => void
  onAudienceChange?: (value: boolean) => void
  onTimestampsChange?: (value: string) => void
  onLocationChange?: (value: string) => void
  onCommunityChange?: (value: boolean) => void
  onAiUseChange?: (value: boolean) => void
  onGenerate?: (field: string) => void
  onRefine?: (field: string) => void
  onAnalyze?: (field: string) => void
  onHistory?: (field: string) => void
  categoryOptions?: { value: string; label: string }[]
  thumbnailActions?: React.ReactNode
  videoUploadLabel?: React.ReactNode
  titleLabel?: string
  descriptionLabel?: string
  tagsLabel?: string
  className?: string
}

const FieldActions: React.FC<{
  field: string
  onGenerate?: (field: string) => void
  onRefine?: (field: string) => void
  onAnalyze?: (field: string) => void
  onHistory?: (field: string) => void
}> = ({ field, onGenerate, onRefine, onAnalyze, onHistory }) => {
  if (!onGenerate && !onRefine && !onAnalyze && !onHistory) return null
  return (
    <SubToolboxActions columns={4} className="mt-2">
      {onGenerate && <SubToolboxButton size="micro" onClick={() => onGenerate(field)} icon={<Sparkles size={13} />}>GENERATE</SubToolboxButton>}
      {onRefine && <SubToolboxButton size="micro" tone="neutral" onClick={() => onRefine(field)} icon={<WandSparkles size={13} />}>REFINE</SubToolboxButton>}
      {onAnalyze && <SubToolboxButton size="micro" tone="neutral" onClick={() => onAnalyze(field)} icon={<Search size={13} />}>ANALYZE</SubToolboxButton>}
      {onHistory && <SubToolboxButton size="micro" tone="neutral" onClick={() => onHistory(field)} icon={<History size={13} />}>HISTORY</SubToolboxButton>}
    </SubToolboxActions>
  )
}

const SecondaryControl: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
  <div className="flex min-h-9 items-center gap-2 border-2 border-black/10 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[.04em]">
    <span className="flex shrink-0 items-center gap-1 opacity-55">{icon}{label}</span>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
)

export const CanonicalMetadataSections: React.FC<CanonicalMetadataSectionsProps> = (props) => {
  const {
    title, description, tags, category, playlists, videoFile, thumbnailFile, thumbnailPreview,
    visibility, audience = false, timestamps = "", location = "", community = false, aiUse = true,
    onTitleChange, onDescriptionChange, onTagsChange, onCategoryChange, onPlaylistsChange,
    onVideoFileChange, onThumbnailFileChange, onVisibilityChange, onAudienceChange,
    onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange,
    onGenerate, onRefine, onAnalyze, onHistory, categoryOptions = [], thumbnailActions,
    videoUploadLabel, titleLabel = "TITLE", descriptionLabel = "DESCRIPTION",
    tagsLabel = "TAGS", className = "",
  } = props

  return (
    <div data-canonical-metadata="true" className={`flex min-w-0 flex-col gap-3 ${className}`}>
      <SubToolbox title="01 · VIDEO UPLOAD" icon={<Upload size={20} strokeWidth={3} />} collapsible isOpenInitial>
        {onVideoFileChange ? (
          <SubToolboxFileTarget
            label={videoFile ? <>{videoFile.name}<br />VIDEO SELECTED</> : videoUploadLabel || <>DROP FILE OR CLICK<br />UPLOAD VIDEO</>}
            icon={<Upload size={28} strokeWidth={3} />}
            accept="video/*"
            onFiles={files => onVideoFileChange(files?.[0] || null)}
          />
        ) : (
          <div className="border-2 border-black/15 bg-black/[.03] p-3 text-xs font-black uppercase">{videoUploadLabel || "PUBLISHED VIDEO SELECTOR"}</div>
        )}
      </SubToolbox>

      <SubToolbox title={`02 · ${titleLabel}`} icon={<FolderOpen size={20} strokeWidth={3} />} collapsible isOpenInitial>
        <SubToolboxInput value={title} onChange={e => onTitleChange(e.target.value)} placeholder="Write title manually…" aria-label="Title" />
        <FieldActions field="title" {...{ onGenerate, onRefine, onAnalyze, onHistory }} />
      </SubToolbox>

      <SubToolbox title="03 · THUMBNAIL" icon={<ImageIcon size={20} strokeWidth={3} />} collapsible isOpenInitial>
        {thumbnailPreview ? (
          <ThumbnailMiniSubToolbox title="THUMBNAIL" icon={<ImageIcon size={18} />} src={thumbnailPreview} alt="Video thumbnail" actions={thumbnailActions} />
        ) : onThumbnailFileChange ? (
          <SubToolboxFileTarget label={thumbnailFile ? thumbnailFile.name : "SELECT THUMBNAIL"} icon={<ImageIcon size={28} />} accept="image/jpeg,image/png,image/webp" onFiles={files => onThumbnailFileChange(files?.[0] || null)} />
        ) : (
          <div className="border-2 border-black/15 bg-black/[.03] p-3 text-xs font-black uppercase">THUMBNAIL NOT SELECTED</div>
        )}
        <FieldActions field="thumbnail" {...{ onGenerate, onRefine, onAnalyze, onHistory }} />
      </SubToolbox>

      <SecondaryControl label="VISIBILITY" icon={<Globe2 size={13} />}>
        <SubToolboxSelect value={visibility} onChange={e => onVisibilityChange(e.target.value)} aria-label="Visibility">
          <option value="public">PUBLIC</option><option value="unlisted">UNLISTED</option><option value="private">PRIVATE</option>
        </SubToolboxSelect>
      </SecondaryControl>

      <SecondaryControl label="AUDIENCE" icon={<Users size={13} />}>
        <SubToolboxButton size="micro" selected={audience} onClick={() => onAudienceChange?.(!audience)}>{audience ? "YES" : "NO"}</SubToolboxButton>
      </SecondaryControl>

      <SecondaryControl label="TIMESTAMPS" icon={<Clock3 size={13} />}>
        <SubToolboxInput value={timestamps} onChange={e => onTimestampsChange?.(e.target.value)} placeholder="Optional" aria-label="Timestamps" />
      </SecondaryControl>

      <SubToolbox title="07 · DESCRIPTION" icon={<FolderOpen size={20} strokeWidth={3} />} collapsible isOpenInitial>
        <SubToolboxTextArea value={description} onChange={e => onDescriptionChange(e.target.value)} placeholder="Write description manually…" aria-label="Description" height="standard" />
        <FieldActions field="description" {...{ onGenerate, onRefine, onAnalyze, onHistory }} />
      </SubToolbox>

      <SecondaryControl label="LOCATION" icon={<MapPin size={13} />}>
        <SubToolboxInput value={location} onChange={e => onLocationChange?.(e.target.value)} placeholder="Optional" aria-label="Location" />
      </SecondaryControl>

      <SubToolbox title="09 · PLAYLISTS" icon={<ListVideo size={20} strokeWidth={3} />} collapsible isOpenInitial>
        <SubToolboxInput value={playlists} onChange={e => onPlaylistsChange(e.target.value)} placeholder="Playlist IDs / names, comma separated" aria-label="Playlists" />
        <FieldActions field="playlists" {...{ onGenerate, onRefine, onAnalyze, onHistory }} />
      </SubToolbox>

      <SecondaryControl label="COMMUNITY" icon={<MessageSquare size={13} />}>
        <SubToolboxButton size="micro" selected={community} onClick={() => onCommunityChange?.(!community)}>{community ? "YES" : "NO"}</SubToolboxButton>
      </SecondaryControl>

      <SecondaryControl label="AI USE" icon={<Bot size={13} />}>
        <SubToolboxButton size="micro" selected={aiUse} onClick={() => onAiUseChange?.(!aiUse)}>{aiUse ? "YES" : "NO"}</SubToolboxButton>
      </SecondaryControl>

      <SubToolbox title="12 · TAGS" icon={<Tags size={20} strokeWidth={3} />} collapsible isOpenInitial>
        <SubToolboxInput value={tags} onChange={e => onTagsChange(e.target.value)} placeholder="Tags, comma separated" aria-label="Tags" />
        <FieldActions field="tags" {...{ onGenerate, onRefine, onAnalyze, onHistory }} />
      </SubToolbox>

      <SubToolbox title="13 · CATEGORY" icon={<FolderOpen size={20} strokeWidth={3} />} collapsible isOpenInitial>
        {categoryOptions.length ? (
          <SubToolboxSelect value={category} onChange={e => onCategoryChange(e.target.value)} aria-label="Category">
            {categoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </SubToolboxSelect>
        ) : (
          <SubToolboxInput value={category} onChange={e => onCategoryChange(e.target.value)} placeholder="Category" aria-label="Category" />
        )}
        <FieldActions field="category" {...{ onGenerate, onRefine, onAnalyze, onHistory }} />
      </SubToolbox>
    </div>
  )
}
