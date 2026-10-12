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
  SubToolboxTagEditor,
  SubToolboxTopTitleDropdown,
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

/** Canonical YouTube video categories shared by Publisher and Manager. */
export const YOUTUBE_CATEGORY_OPTIONS = [
  { value: "2", label: "Autos & Vehicles" },
  { value: "23", label: "Comedy" },
  { value: "27", label: "Education" },
  { value: "24", label: "Entertainment" },
  { value: "1", label: "Film & Animation" },
  { value: "20", label: "Gaming" },
  { value: "26", label: "Howto & Style" },
  { value: "10", label: "Music" },
  { value: "25", label: "News & Politics" },
  { value: "29", label: "Nonprofits & Activism" },
  { value: "22", label: "People & Blogs" },
  { value: "15", label: "Pets & Animals" },
  { value: "28", label: "Science & Technology" },
  { value: "17", label: "Sports" },
  { value: "19", label: "Travel & Events" },
] as const

export interface CanonicalMetadataSectionsProps {
  title: string
  description: string
  tags: string
  category: string
  playlists: string
  playlistOptions?: { value: string; label: string; disabled?: boolean }[]
  playlistLoading?: boolean
  selectedPlaylistIds?: string[]
  onPlaylistToggle?: (playlistId: string) => void
  videoFile?: File | null
  thumbnailFile?: File | null
  thumbnailPreview?: string | null
  visibility: string
  showScheduledVisibility?: boolean
  publishAt?: string
  onPublishAtChange?: (value: string) => void
  audience?: boolean | null
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
  onAudienceChange?: (value: boolean | null) => void
  onTimestampsChange?: (value: string) => void
  onLocationChange?: (value: string) => void
  onCommunityChange?: (value: boolean) => void
  onAiUseChange?: (value: boolean) => void
  onGenerate?: (field: string) => void
  onRefine?: (field: string) => void
  onAnalyze?: (field: string) => void
  actionFields?: string[]
  showFieldActions?: boolean
  categoryOptions?: { value: string; label: string }[]
  thumbnailActions?: React.ReactNode
  videoUploadLabel?: React.ReactNode
  thumbnailLabel?: string
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

type MetadataActionStyle = React.CSSProperties & { "--pair-a": string; "--pair-b": string }
const ACTION_STYLES: Record<"generate" | "refine" | "analyze", MetadataActionStyle> = {
  generate: { "--pair-a": "#57F15C", "--pair-b": "#CCFF00" },
  refine: { "--pair-a": "#FFDA47", "--pair-b": "#FFA85C" },
  analyze: { "--pair-a": "#45C8E9", "--pair-b": "#36E0F6" },
}

const FieldActions: React.FC<{
  field: string
  onGenerate?: (field: string) => void
  onRefine?: (field: string) => void
  onAnalyze?: (field: string) => void
}> = ({ field, onGenerate, onRefine, onAnalyze }) => {
  if (!onGenerate && !onRefine && !onAnalyze) return null
  return (
    <SubToolboxActions columns={3} forceRow className="vt-metadata-field-actions mt-2">
      {onGenerate ? <SubToolboxSplitButton level="l2" icon={<Sparkles size={16} />} style={ACTION_STYLES.generate} onClick={() => onGenerate(field)}>GENERATE</SubToolboxSplitButton> : <span />}
      {onRefine ? <SubToolboxSplitButton level="l2" icon={<WandSparkles size={16} />} style={ACTION_STYLES.refine} onClick={() => onRefine(field)}>REFINE</SubToolboxSplitButton> : <span />}
      {onAnalyze ? <SubToolboxSplitButton level="l2" icon={<Search size={16} />} style={ACTION_STYLES.analyze} onClick={() => onAnalyze(field)}>ANALYZE</SubToolboxSplitButton> : <span />}
    </SubToolboxActions>
  )
}

const SecondaryControls: React.FC<{
  placement: "pre-description" | "post-description" | "post-playlists"
  visibility: string; audience: boolean | null; timestamps: string; location: string; community: boolean; aiUse: boolean
  showScheduledVisibility?: boolean; publishAt: string; onPublishAtChange?: (value: string) => void
  onVisibilityChange: (value: string) => void; onAudienceChange?: (value: boolean | null) => void
  onTimestampsChange?: (value: string) => void; onLocationChange?: (value: string) => void
  onCommunityChange?: (value: boolean) => void; onAiUseChange?: (value: boolean) => void
}> = ({ placement, visibility, audience, timestamps, location, community, aiUse, showScheduledVisibility = false, publishAt, onPublishAtChange, onVisibilityChange, onAudienceChange, onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange }) => (
  <SubToolboxGrid minItemWidth="compact" density="dense" className={placement === "pre-description" ? "grid-cols-2 lg:grid-cols-3" : placement === "post-playlists" ? "grid-cols-2" : "grid-cols-1"}>
    {placement === "pre-description" ? <>
      <SubToolboxSection label={<span className="flex items-center gap-1"><Globe2 size={11} /> VISIBILITY</span>}>
        <SubToolboxSelect controlSize="micro" value={visibility} onChange={e => onVisibilityChange(e.target.value)} aria-label="Visibility"><option value="public">PUBLIC</option><option value="unlisted">UNLISTED</option><option value="private">PRIVATE</option>{showScheduledVisibility ? <option value="scheduled">SCHEDULED</option> : null}</SubToolboxSelect>
        {showScheduledVisibility && visibility === "scheduled" && onPublishAtChange ? <SubToolboxInput controlSize="micro" type="datetime-local" value={publishAt} onChange={e => onPublishAtChange(e.target.value)} aria-label="Publish date and time" /> : null}
      </SubToolboxSection>
      <SubToolboxSection label={<span className="flex items-center gap-1"><Users size={11} /> AUDIENCE</span>}>
        <SubToolboxToggle pressed={audience === true} label={audience === null ? "UNSET" : audience ? "YES" : "NO"} onClick={() => onAudienceChange?.(audience === null ? true : audience ? false : null)} />
      </SubToolboxSection>
      <SubToolboxSection label={<span className="flex items-center gap-1"><Clock3 size={11} /> TIMESTAMPS</span>}>
        <SubToolboxInput controlSize="micro" value={timestamps} onChange={e => onTimestampsChange?.(e.target.value)} placeholder="OPTIONAL" aria-label="Timestamps" />
      </SubToolboxSection>
    </> : null}
    {placement === "post-description" ? <SubToolboxSection label={<span className="flex items-center gap-1"><MapPin size={11} /> LOCATION</span>}>
      <SubToolboxInput controlSize="micro" value={location} onChange={e => onLocationChange?.(e.target.value)} placeholder="OPTIONAL" aria-label="Location" />
    </SubToolboxSection> : null}
    {placement === "post-playlists" ? <>
      <SubToolboxSection label={<span className="flex items-center gap-1"><MessageSquare size={11} /> COMMUNITY</span>}>
        <SubToolboxToggle pressed={community} label={community ? "YES" : "NO"} onClick={() => onCommunityChange?.(!community)} />
      </SubToolboxSection>
      <SubToolboxSection label={<span className="flex items-center gap-1"><Bot size={11} /> AI USE</span>}>
        <SubToolboxToggle pressed={aiUse} label={aiUse ? "YES" : "NO"} onClick={() => onAiUseChange?.(!aiUse)} />
      </SubToolboxSection>
    </> : null}
  </SubToolboxGrid>
)

export const CanonicalMetadataSections: React.FC<CanonicalMetadataSectionsProps> = (props) => {
  const {
    title, description, tags, category, playlists, playlistOptions, playlistLoading = false, selectedPlaylistIds = [], onPlaylistToggle, videoFile, thumbnailFile, thumbnailPreview,
    visibility, showScheduledVisibility = false, publishAt = "", onPublishAtChange, audience = null, timestamps = "", location = "", community = false, aiUse = true,
    onTitleChange, onDescriptionChange, onTagsChange, onCategoryChange, onPlaylistsChange,
    onVideoFileChange, onThumbnailFileChange, onVisibilityChange, onAudienceChange,
    onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange,
    onGenerate, onRefine, onAnalyze, actionFields, showFieldActions = true, categoryOptions = [], thumbnailActions,
    videoUploadLabel, thumbnailLabel = "THUMBNAIL", titleLabel = "TITLE", descriptionLabel = "DESCRIPTION", className = "",
    showVideoUpload = true, showPlaylists = true, showCategory = true,
    tagAnalysis = [], suggestedTags = [], tagInput = "", onTagInputChange, onAddTag,
    onRemoveTag, onAddSuggestedTag, maxTagChars = 500, isAnalyzingTags = false,
    isGeneratingTags = false, onRankTags,
    educationNotes = "", onEducationNotesChange, educationNotesDisabled = false,
  } = props

  const hasTagEditor = Boolean(onTagsChange)
  const currentTags = tags.split(",").map(tag => tag.trim()).filter(Boolean)
  const shouldShowActions = (field: string) => showFieldActions && (!actionFields || actionFields.includes(field))

  return (
    <SubToolbox title="METADATA" icon={<FolderOpen size={20} strokeWidth={3} />} collapsible isOpenInitial>
      <SubToolboxStack density="dense" className={className}>
        {showVideoUpload ? (
          <SubToolboxSection label="VIDEO UPLOAD">
            {onVideoFileChange ? (
              <SubToolboxFileTarget
                label={videoFile ? <>{videoFile.name}<br />VIDEO SELECTED</> : videoUploadLabel || <>DROP FILE OR CLICK<br />UPLOAD VIDEO</>}
                icon={<Upload size={28} strokeWidth={3} />}
                accept="video/*"
                file={videoFile}
                tooltip="Click or drop a video to upload or change it."
                previewAlt="Selected video preview"
                onFiles={files => onVideoFileChange(files?.[0] || null)}
              />
            ) : <SubToolboxStatusBadge level="l1">{videoUploadLabel || "VIDEO SELECTED"}</SubToolboxStatusBadge>}
          </SubToolboxSection>
        ) : null}

        <SubToolboxSection>
          <SubToolboxLabeledInput overlayLabel={titleLabel} value={title} onChange={e => onTitleChange(e.target.value)} placeholder="WRITE TITLE MANUALLY…" aria-label="Title" />
          {shouldShowActions("title") ? <FieldActions field="title" {...{ onGenerate, onRefine, onAnalyze }} /> : null}
        </SubToolboxSection>

        <SubToolboxSection>
          {onThumbnailFileChange ? (
            <SubToolboxFileTarget
              label={thumbnailFile ? thumbnailFile.name : thumbnailLabel || "Click or drop an image"}
              icon={<ImageIcon size={28} />}
              accept="image/jpeg,image/png,image/webp"
              file={thumbnailFile}
              preview={thumbnailPreview}
              tooltip="Click or drop an image to upload or change the thumbnail."
              previewAlt="Selected thumbnail"
              onFiles={files => onThumbnailFileChange(files?.[0] || null)}
              className="vt-thumbnail-upload-target"
            />
          ) : thumbnailPreview ? (
            <ThumbnailMiniSubToolbox title="THUMBNAIL" icon={<ImageIcon size={18} />} overlayLabel={thumbnailLabel} src={thumbnailPreview} alt="Video thumbnail" actions={thumbnailActions} />
          ) : <SubToolboxStatusBadge level="l1">THUMBNAIL NOT SELECTED</SubToolboxStatusBadge>}
          {shouldShowActions("thumbnail") ? <FieldActions field="thumbnail" {...{ onGenerate, onRefine, onAnalyze }} /> : null}
        </SubToolboxSection>

        <SecondaryControls placement="pre-description" {...{ visibility, showScheduledVisibility, publishAt, onPublishAtChange, audience, timestamps, location, community, aiUse, onVisibilityChange, onAudienceChange, onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange }} />

        <SubToolboxSection>
          <SubToolboxLabeledTextArea overlayLabel={descriptionLabel} value={description} onChange={e => onDescriptionChange(e.target.value)} placeholder="WRITE DESCRIPTION MANUALLY…" aria-label="Description" height="standard" />
          {shouldShowActions("description") ? <FieldActions field="description" {...{ onGenerate, onRefine, onAnalyze }} /> : null}
        </SubToolboxSection>



        <SecondaryControls placement="post-description" {...{ visibility, showScheduledVisibility, publishAt, onPublishAtChange, audience, timestamps, location, community, aiUse, onVisibilityChange, onAudienceChange, onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange }} />

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

        {showPlaylists ? (
          <SubToolboxSection label={<span className="flex items-center gap-1"><ListVideo size={12} /> PLAYLISTS</span>}>
            {playlistOptions && onPlaylistToggle ? (
              <SubToolboxTopTitleDropdown
                level="l1"
                label={<><ListVideo size={13} aria-hidden="true" /> CHANNEL PLAYLISTS</>}
                value={playlistLoading ? "Loading playlists…" : selectedPlaylistIds.length ? `${selectedPlaylistIds.length} selected` : "Select playlists"}
                options={playlistLoading ? [] : playlistOptions}
                multiSelect
                selectedValues={selectedPlaylistIds}
                onValueChange={onPlaylistToggle}
                ariaLabel="Channel playlists"
              />
            ) : (
              <SubToolboxInput value={playlists} onChange={e => onPlaylistsChange(e.target.value)} placeholder="PLAYLIST IDS / NAMES" aria-label="Playlists" />
            )}
            {shouldShowActions("playlists") ? <FieldActions field="playlists" {...{ onGenerate, onRefine, onAnalyze }} /> : null}
          </SubToolboxSection>
        ) : null}

        <SecondaryControls placement="post-playlists" {...{ visibility, showScheduledVisibility, publishAt, onPublishAtChange, audience, timestamps, location, community, aiUse, onVisibilityChange, onAudienceChange, onTimestampsChange, onLocationChange, onCommunityChange, onAiUseChange }} />

        <SubToolboxSection label={<span className="flex items-center gap-1"><Tags size={12} /> TAGS</span>}>
          {hasTagEditor ? (
            <>
              <SubToolboxTagEditor
                level="l1"
                className="vt-metadata-tag-editor"
                style={{
                  "--vt-component-height": "44px",
                  "--vt-component-stroke": "3px",
                  "--vt-component-radius": "8px",
                  "--vt-component-font-size": "14px",
                } as React.CSSProperties}
                tags={currentTags}
                onTagsChange={nextTags => onTagsChange(nextTags.join(", "))}
                addIcon={<Plus size={15} />}
                saveIcon="✓"
                removeIcon="×"
                renderTag={(tag, remove) => (
                  <TagRankTag key={tag} tag={tag} componentLevel="l1" analysis={tagAnalysis.find(item => item.tag.toLowerCase() === tag.toLowerCase())} onRemove={remove} />
                )}
              />
              <div className="flex justify-end text-[10px] font-black uppercase opacity-50">{tags.length}/{maxTagChars}</div>
              {suggestedTags.length > 0 ? (
                <SubToolboxSection label="RANKED SUGGESTIONS">
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(suggestion => (
                      <TagRankTag key={suggestion.tag} tag={suggestion.tag} analysis={suggestion} isSuggested isAdded={currentTags.some(tag => tag.toLowerCase() === suggestion.tag.toLowerCase())} onAdd={() => onAddSuggestedTag?.(suggestion.tag, suggestion)} />
                    ))}
                  </div>
                </SubToolboxSection>
              ) : null}
              {shouldShowActions("tags") ? <FieldActions field="tags" {...{ onGenerate, onRefine, onAnalyze }} /> : null}
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
              {shouldShowActions("tags") ? <FieldActions field="tags" {...{ onGenerate, onRefine, onAnalyze }} /> : null}
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
            {shouldShowActions("category") ? <FieldActions field="category" {...{ onGenerate, onRefine, onAnalyze }} /> : null}
          </SubToolboxSection>
        ) : null}
      </SubToolboxStack>
    </SubToolbox>
  )
}
