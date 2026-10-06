import React from "react"
import { Upload, Image as ImageIcon, Sparkles, WandSparkles, Search, MapPin, ListVideo, Users, Clock3, Globe2, MessageSquare, Bot, Tags, FolderOpen, Plus } from "lucide-react"
import { SubToolbox, ThumbnailMiniSubToolbox } from "../Toolbox"
import {
  SubToolboxButton,
  SubToolboxFileTarget,
  SubToolboxInput,
  SubToolboxLabeledInput,
  SubToolboxLabeledTextArea,
  SubToolboxSelect,
  SubToolboxStatusBadge,
  SubToolboxToggle,
} from "../subtoolbox/SubToolboxPrimitives"
import { SubToolboxActions, SubToolboxGrid, SubToolboxSection, SubToolboxStack } from "../subtoolbox/SubToolboxLayouts"
import { SubToolboxSplitButton } from "../subtoolbox/SubToolboxSplitPrimitives"
import { TagRankTag } from "./TagRankTag"
import { EducationTimestampNotes } from "./EducationTimestampNotes"
import type { TagSuggestion } from "../../services/gemini"

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
  categoryOptions?: { value: string; label: string }[]
  thumbnailActions?: React.ReactNode
  videoUploadLabel?: React.ReactNode
  titleLabel?: string
  descriptionLabel?: string
  className?: string
  showVideoUpload?: boolean
  showPlaylists?: boolean
  showCategory?: boolean
  tagAnalysis?: TagSuggestion[]
  suggestedTags?: TagSuggestion[]
  tagInput?: string
  onTagInputChange?: (value: string) => void
  onAddTag?: () => void
  onRemoveTag?: (tag: string) => void
  onAddSuggestedTag?: (tag: string, analysis?: TagSuggestion) => void
  maxTagChars?: number
  isAnalyzingTags?: boolean
  isGeneratingTags?: boolean
  onRankTags?: () => void
  educationNotes?: string
  onEducationNotesChange?: (value: string) => void
  educationNotesDisabled?: boolean
}

const ACTION_STYLES = {
  generate: { ["--pair-a" as string]: "#57F15C", ["--pair-b" as string]: "#CCFF00" },
  refine: { ["--pair-a" as string]: "#FFDA47", ["--pair-b" as string]: "#FFA85C" },
  analyze: { ["--pair-a" as string]: "#45C8E9", ["--pair-b" as string]: "#36E0F6" },
} as React.CSSProperties

const FieldActions: React.FC<{
  field: string
  onGenerate?: (field: string) => void
  onRefine?: (field: string) => void
  onAnalyze?: (field: string) => void
}> = ({ field, onGenerate, onRefine, onAnalyze }) => {
  if (!onGenerate && !onRefine && !onAnalyze) return null
  return (
    <SubToolboxActions columns={3} className="mt-2">
      {onGenerate ? <SubToolboxSplitButton level="l2" icon={<Sparkles size={16} />} style={ACTION_STYLES.generate} onClick={() => onGenerate(field)}>GENERATE</SubToolboxSplitButton> : <span />}
      {onRefine ? <SubToolboxSplitButton level="l2" icon={<WandSparkles size={16} />} style={ACTION_STYLES.refine} onClick={() => onRefine(field)}>REFINE</SubToolboxSplitButton> : <span />}
      {onAnalyze ? <SubToolboxSplitButton level="l2" icon={<Search size={16} />} style={ACTION_STYLES.analyze} onClick={() => onAnalyze(field)}>ANALYZE</SubToolboxSplitButton> : <span />}
    </SubToolboxActions>
  )
}

const SecondaryControls: React.FC<{
  visibility: string
  audience: boolean
  timestamps: string
  location: string
  community: boolean
  aiUse: boolean
  onVisibilityChange: (value: string) => void
  onAudienceChange?: (value: boolean) => void
  onTimestampsChange?: (value: string) => void
  onLocationChange?: (value: string) => void
  onCommunityChange?: (value: boolean) => void
  onAiUseChange?: (value: boolean) => void
}> = ({
  visibility, audience, timestamps, location, community, aiUse,
  onVisibilityChange, onAudienceChange, onTimestampsChange, onLocationChange,
  onCommunityChange, onAiUseChange,
}) => (
  <SubToolboxGrid minItemWidth="compact" density="dense" className="grid-cols-2 lg:grid-cols-6">
    <SubToolboxSection label={<span className="flex items-center gap-1"><Globe2 size={11} /> VISIBILITY</span>}>
      <SubToolboxSelect controlSize="micro" value={visibility} onChange={e => onVisibilityChange(e.target.value)} aria-label="Visibility">
        <option value="public">PUBLIC</option><option value="unlisted">UNLISTED</option><option value="private">PRIVATE</option>
      </SubToolboxSelect>
    </SubToolboxSection>
    <SubToolboxSection label={<span className="flex items-center gap-1"><Users size={11} /> AUDIENCE</span>}>
      <SubToolboxToggle pressed={audience} label={audience ? "YES" : "NO"} onClick={() => onAudienceChange?.(!audience)} />
    </SubToolboxSection>
    <SubToolboxSection label={<span className="flex items-center gap-1"><Clock3 size={11} /> TIMESTAMPS</span>}>
      <SubToolboxInput controlSize="micro" value={timestamps} onChange={e => onTimestampsChange?.(e.target.value)} placeholder="OPTIONAL" aria-label="Timestamps" />
    </SubToolboxSection>
    <SubToolboxSection label={<span className="flex items-center gap-1"><MapPin size={11} /> LOCATION</span>}>
      <SubToolboxInput controlSize="micro" value={location} onChange={e => onLocationChange?.(e.target.value)} placeholder="OPTIONAL" aria-label="Location" />
    </SubToolboxSection>
    <SubToolboxSection label={<span className="flex items-center gap-1"><MessageSquare size={11} /> COMMUNITY</span>}>
      <SubToolboxToggle pressed={community} label={community ? "YES" : "NO"} onClick={() => onCommunityChange?.(!community)} />
    </SubToolboxSection>
    <SubToolboxSection label={<span className="flex items-center gap-1"><Bot size={11} /> AI USE</span>}>
      <SubToolboxToggle pressed={aiUse} label={aiUse ? "YES" : "NO"} onClick={() => onAiUseChange?.(!aiUse)} />
    </SubToolboxSection>
  </SubToolboxGrid>
)

export const CanonicalMetadataSections: React.FC<CanonicalMetadataSectionsProps> = (props) => {
  const {
    title, description, tags, category, playlists, videoFile, thumbnailFile, thumbnailPreview,
    visibility, audience = false, timestamps = "", location = "", community = false, aiUse = true,
    onTitleChange, onDescriptionChange, onTagsChange, onCategoryChange, onPlaylistsChange,
    onVideoFileChange, onThumbnailFileChange, onVisibilityChange, onAudienceChange,
    onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange,
    onGenerate, onRefine, onAnalyze, categoryOptions = [], thumbnailActions,
    videoUploadLabel, titleLabel = "TITLE", descriptionLabel = "DESCRIPTION", className = "",
    showVideoUpload = true, showPlaylists = true, showCategory = true,
    tagAnalysis = [], suggestedTags = [], tagInput = "", onTagInputChange, onAddTag,
    onRemoveTag, onAddSuggestedTag, maxTagChars = 500, isAnalyzingTags = false,
    isGeneratingTags = false, onRankTags,
    educationNotes = "", onEducationNotesChange, educationNotesDisabled = false,
  } = props

  const hasTagEditor = Boolean(onTagInputChange && onAddTag)
  const currentTags = tags.split(",").map(tag => tag.trim()).filter(Boolean)

  return (
    <SubToolbox title="METADATA" icon={<FolderOpen size={20} strokeWidth={3} />} collapsible isOpenInitial className={className}>
      <SubToolboxStack density="compact">
        {showVideoUpload ? (
          <SubToolboxSection label="VIDEO UPLOAD">
            {onVideoFileChange ? (
              <SubToolboxFileTarget
                label={videoFile ? <>{videoFile.name}<br />VIDEO SELECTED</> : videoUploadLabel || <>DROP FILE OR CLICK<br />UPLOAD VIDEO</>}
                icon={<Upload size={28} strokeWidth={3} />}
                accept="video/*"
                onFiles={files => onVideoFileChange(files?.[0] || null)}
              />
            ) : <SubToolboxStatusBadge level="l1">{videoUploadLabel || "VIDEO SELECTED"}</SubToolboxStatusBadge>}
          </SubToolboxSection>
        ) : null}

        <SubToolboxSection label="TITLE">
          <SubToolboxLabeledInput overlayLabel={titleLabel} value={title} onChange={e => onTitleChange(e.target.value)} placeholder="WRITE TITLE MANUALLY…" aria-label="Title" />
          <FieldActions field="title" {...{ onGenerate, onRefine, onAnalyze }} />
        </SubToolboxSection>

        <SubToolboxSection label="THUMBNAIL">
          {thumbnailPreview ? (
            <ThumbnailMiniSubToolbox title="THUMBNAIL" icon={<ImageIcon size={18} />} src={thumbnailPreview} alt="Video thumbnail" actions={thumbnailActions} />
          ) : onThumbnailFileChange ? (
            <SubToolboxFileTarget label={thumbnailFile ? thumbnailFile.name : "SELECT THUMBNAIL"} icon={<ImageIcon size={28} />} accept="image/jpeg,image/png,image/webp" onFiles={files => onThumbnailFileChange(files?.[0] || null)} />
          ) : <SubToolboxStatusBadge level="l1">THUMBNAIL NOT SELECTED</SubToolboxStatusBadge>}
          <FieldActions field="thumbnail" {...{ onGenerate, onRefine, onAnalyze }} />
        </SubToolboxSection>

        <SecondaryControls {...{ visibility, audience, timestamps, location, community, aiUse, onVisibilityChange, onAudienceChange, onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange }} />

        {category === "27" && onEducationNotesChange ? (
          <SubToolboxSection label={<span className="flex items-center gap-1"><Tags size={12} /> EDUCATION QUESTIONS & PHRASES</span>}>
            <EducationTimestampNotes
              embedded
              value={educationNotes}
              onChange={onEducationNotesChange}
              disabled={educationNotesDisabled}
            />
          </SubToolboxSection>
        ) : null}

        <SubToolboxSection label="DESCRIPTION">
          <SubToolboxLabeledTextArea overlayLabel={descriptionLabel} value={description} onChange={e => onDescriptionChange(e.target.value)} placeholder="WRITE DESCRIPTION MANUALLY…" aria-label="Description" height="standard" />
          <FieldActions field="description" {...{ onGenerate, onRefine, onAnalyze }} />
        </SubToolboxSection>

        {showPlaylists ? (
          <SubToolboxSection label={<span className="flex items-center gap-1"><ListVideo size={12} /> PLAYLISTS</span>}>
            <SubToolboxInput value={playlists} onChange={e => onPlaylistsChange(e.target.value)} placeholder="PLAYLIST IDS / NAMES" aria-label="Playlists" />
            <FieldActions field="playlists" {...{ onGenerate, onRefine, onAnalyze }} />
          </SubToolboxSection>
        ) : null}

        <SubToolboxSection label={<span className="flex items-center gap-1"><Tags size={12} /> TAGS</span>}>
          {hasTagEditor ? (
            <>
              <SubToolboxActions columns={2}>
                <SubToolboxInput aria-label="Add video tag" value={tagInput} onChange={e => onTagInputChange?.(e.target.value)} placeholder="ADD TAG…" maxLength={maxTagChars} />
                <SubToolboxButton level="l2" size="compact" icon={<Plus size={15} />} onClick={onAddTag} disabled={!tagInput.trim()}>ADD TAG</SubToolboxButton>
              </SubToolboxActions>
              <div className="flex min-h-[76px] flex-wrap content-start gap-2 border-[2px] border-black/15 bg-black/[.025] p-2">
                {currentTags.length ? currentTags.map(tag => (
                  <TagRankTag key={tag} tag={tag} analysis={tagAnalysis.find(item => item.tag.toLowerCase() === tag.toLowerCase())} onRemove={onRemoveTag ? () => onRemoveTag(tag) : undefined} />
                )) : <span className="w-full py-4 text-center text-[10px] font-black uppercase opacity-35">NO TAGS POPULATED</span>}
                <span className="ml-auto self-end text-[10px] font-black uppercase opacity-50">{tags.length}/{maxTagChars}</span>
              </div>
              {suggestedTags.length > 0 ? (
                <SubToolboxSection label="RANKED SUGGESTIONS">
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(suggestion => (
                      <TagRankTag key={suggestion.tag} tag={suggestion.tag} analysis={suggestion} isSuggested isAdded={currentTags.some(tag => tag.toLowerCase() === suggestion.tag.toLowerCase())} onAdd={() => onAddSuggestedTag?.(suggestion.tag, suggestion)} />
                    ))}
                  </div>
                </SubToolboxSection>
              ) : null}
              <FieldActions field="tags" {...{ onGenerate, onRefine, onAnalyze }} />
              {onRankTags ? (
                <SubToolboxButton level="l2" size="compact" tone="neutral" onClick={onRankTags} disabled={isAnalyzingTags || !tags.trim()}>
                  {isAnalyzingTags ? "RANKING…" : tagAnalysis.length ? "VIEW TAG RANKINGS" : "RANK TAGS"}
                </SubToolboxButton>
              ) : null}
              {isGeneratingTags ? <SubToolboxStatusBadge level="l1">GENERATING TAGS…</SubToolboxStatusBadge> : null}
            </>
          ) : (
            <>
              <SubToolboxInput value={tags} onChange={e => onTagsChange(e.target.value)} placeholder="TAGS, COMMA SEPARATED" aria-label="Tags" />
              <FieldActions field="tags" {...{ onGenerate, onRefine, onAnalyze }} />
            </>
          )}
        </SubToolboxSection>

        {showCategory ? (
          <SubToolboxSection label="CATEGORY">
            {categoryOptions.length ? (
              <SubToolboxSelect value={category} onChange={e => onCategoryChange(e.target.value)} aria-label="Category">
                {categoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </SubToolboxSelect>
            ) : <SubToolboxInput value={category} onChange={e => onCategoryChange(e.target.value)} placeholder="CATEGORY" aria-label="Category" />}
            <FieldActions field="category" {...{ onGenerate, onRefine, onAnalyze }} />
          </SubToolboxSection>
        ) : null}
      </SubToolboxStack>
    </SubToolbox>
  )
}
