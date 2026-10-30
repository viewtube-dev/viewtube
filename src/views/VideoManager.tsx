import React, { useCallback, useState, useEffect, useRef } from "react"
import {
 addSimpleVideoToPlaylist,
 fetchSimplePlaylists,
 fetchSimpleVideoBundle,
 fetchSimpleVideoInventory,
 fetchSimpleVideoPlaylistMemberships,
 patchSimpleOwnedVideo,
 removeSimpleVideoFromPlaylist,
 setSimpleVideoThumbnail,
 type SimplePlaylist as Playlist,
 type SimplePlaylistMembership as PlaylistMembership,
 type SimpleVideoDetails as VideoDetails,
 type SimpleVideoSnippet as VideoSnippet,
} from "../services/simpleYouTubeApi"
import { useSimpleAuth } from "../auth/AuthProvider"
import { useNavigate } from "react-router-dom"
import { useBrain } from "../context/useBrain"
import { listContentBuilds, recordContentBuildMetadataChange } from "../services/asset-engine/ContentBuildRepository"
import { createEmptyMetadataMasterPackage } from "../services/metadataMaster"
import { listMetadataHistory, recordPublishedMetadataChange, recordPublishedMetadataSettingsChange } from "../services/metadataHistory"
import { ViewTubeHandoffReceiver } from "../components/ViewTubeHandoffReceiver"
import type { ViewTubeActionPacket } from "../services/viewTubeToolChains"
import type { LongformOptimizationHandoffPayload } from "../services/longformOptimization"
import { hasGeminiKey } from "../services/gemini"
import { generateGovernedTagSuggestions } from "../services/brain/creatorAssets"
import type { TagSuggestion } from "../services/brain/assetStrategies/tagSuggestions"
import { CanonicalMetadataSections, YOUTUBE_CATEGORY_OPTIONS } from "../components/metadata/CanonicalMetadataSections"
import MetadataMaster from "./MetadataMaster"
import { validateEducationTimestampLines } from "../components/metadata/EducationTimestampNotes"
import ProjectManifestation from "../components/projects/ProjectManifestation"
import { togglePlaylistSelection } from "../components/metadata/playlistSelection"
import {
 X,
 FileVideo,
 AlertCircle,
 CheckCircle,
 Edit,
 Search,
 RefreshCw,
} from "lucide-react"
import {
 SubToolboxGridActionButton,
 ToolboxScaffold,
} from "../components/Toolbox"
import { SubToolboxActions } from "../components/subtoolbox/SubToolboxLayouts"
import { ToolboxHeaderToggle } from "../components/subtoolbox/SubToolboxPrimitives"
import { StudioSplitLeftButton } from "../studio-ui"
import { SubToolboxShellAction } from "../components/subtoolbox/SubToolboxSplitPrimitives"
import {
 SubToolboxAlert,
 SubToolboxButton,
 SubToolboxDataTable,
 SubToolboxIconButton,
 SubToolboxLinkButton,
 SubToolboxOutputCard,
 SubToolboxStatePanel,
 SubToolboxTag,
 SubToolboxVideoSelector,
} from "../components/subtoolbox/SubToolboxPrimitives"

interface VideoManagerProps {
 embedded?: boolean
 collapsible?: boolean
 isOpenInitial?: boolean
 paletteIndex?: number
}

type VideoListLoadState = "idle" | "loading" | "success" | "empty" | "error"
const MAX_TAG_CHARS = 500

const VideoManager: React.FC<VideoManagerProps> = ({
 embedded = false,
 collapsible = false,
 isOpenInitial = true,
 paletteIndex,
}) => {
 const auth = useSimpleAuth()
 const { brain, updateProject, setActiveProject } = useBrain()
 const connected = auth.session.status === "ready" && auth.session.capabilities.youtubeRead
 const canManageVideos = auth.session.status === "ready" && auth.session.capabilities.youtubeWrite
 const navigate = useNavigate()
 const basePalette = paletteIndex ?? 0
 const [allVideos, setAllVideos] = useState<VideoSnippet[]>([])
 const [videos, setVideos] = useState<VideoSnippet[]>([])
 const [videoSearchQuery, setVideoSearchQuery] = useState("")
 const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
 const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
 const [loading, setLoading] = useState(false)
 const [saving, setSaving] = useState(false)
 const [saveSuccess, setSaveSuccess] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const lastSearchRef = useRef("")
 const activeChannelIdRef = useRef(auth.session.channel?.id || "")

 const [editTitle, setEditTitle] = useState("")
 const [editDescription, setEditDescription] = useState("")
 const [editTags, setEditTags] = useState("")
 const [editPrivacy, setEditPrivacy] = useState("public")
 const [editCategoryId, setEditCategoryId] = useState("27")
 const [editAudience, setEditAudience] = useState(false)
 const [editTimestamps, setEditTimestamps] = useState("")
 const [editLocation, setEditLocation] = useState("")
 const [editCommunity, setEditCommunity] = useState(false)
 const [editAiUse, setEditAiUse] = useState(true)
 const [educationNotes, setEducationNotes] = useState("")

 const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([])
 const [currentPlaylists, setCurrentPlaylists] = useState<PlaylistMembership[]>([])
 const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([])

 const [isAnalyzingTags, setIsAnalyzingTags] = useState(false)
 const [isGeneratingTags, setIsGeneratingTags] = useState(false)
 const [existingTagAnalysis, setExistingTagAnalysis] = useState<TagSuggestion[]>([])
 const [suggestedTags, setSuggestedTags] = useState<TagSuggestion[]>([])
 const [tagInput, setTagInput] = useState("")
 const [showRankDetails, setShowRankDetails] = useState(false)
 const fileInputRef = useRef<HTMLInputElement>(null)
 const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
 const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
 const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false)
 const [isOpen, setIsOpen] = useState(isOpenInitial)
 const [viewMode, setViewMode] = useState<"workspace" | "intelligence">("workspace")
 const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false)
 const [videoListLoadState, setVideoListLoadState] = useState<VideoListLoadState>("idle")
 const hasTriggeredInitialLoadRef = useRef(false)

 const showHeaderLoadAssetsButton = connected && videos.length === 0

 const handleProjectManifestLoad = useCallback((project: typeof brain.projects[number]) => {
  setActiveProject(project.id)
  setEditTitle(project.videoTitle || "")
  setEditDescription(project.description || "")
  setEditTags(project.tags || "")
  setThumbnailPreview(project.thumbnailUrl || null)
  setThumbnailFile(null)
  setSaveSuccess(false)
  setError(null)
 }, [setActiveProject])

 const saveProjectManifestState = useCallback((project: typeof brain.projects[number]) => {
  updateProject(project.id, {
   videoTitle: editTitle,
   description: editDescription,
   tags: editTags,
   thumbnailUrl: thumbnailPreview || project.thumbnailUrl,
  })
 }, [editTitle, editDescription, editTags, thumbnailPreview, updateProject])

 const handleLongformOptimizerHandoff = useCallback((packet: ViewTubeActionPacket) => {
  if (packet.sourceToolId !== "longform-optimizer") return
  const payload = packet.payload as LongformOptimizationHandoffPayload
  const metadata = payload.currentMetadata
  setSelectedVideoId(payload.videoId || null)
  setEditTitle(metadata?.title || "")
  setEditDescription(metadata?.description || "")
  setEditTags((metadata?.tags || []).join(", "))
  if (metadata?.categoryId) setEditCategoryId(metadata.categoryId)
  setSelectedPlaylistIds(metadata?.playlistIds || [])
  setThumbnailPreview(payload.thumbnail?.url || null)
  setVideoSearchQuery(metadata?.title || "")
  setSaveSuccess(false)
  setError(null)
  setIsOpen(true)
 }, [])

 const handleMetadataMasterHandoff = useCallback((packet: ViewTubeActionPacket) => {
  if (packet.sourceToolId !== "metadata-master") return
  const payload = packet.payload as { title?: string; description?: string; tags?: string[]; category?: string; thumbnail?: { url?: string } }
  if (packet.videoId) setSelectedVideoId(packet.videoId)
  setEditTitle(payload.title || "")
  setEditDescription(payload.description || "")
  setEditTags((payload.tags || []).join(", "))
  if (payload.category) setEditCategoryId(payload.category)
  if (payload.thumbnail?.url) setThumbnailPreview(payload.thumbnail.url)
  setSaveSuccess(false)
  setError(null)
  setIsOpen(true)
 }, [])

 const formatVideoLoadError = (err: any) => {
  const raw = err?.message || "Failed to load channel assets."
  if (/session|auth|401|expired|invalid/i.test(raw)) {
   return "YouTube session expired. Reconnect your channel in Settings, then reload assets."
  }
  return raw
 }

 const selectedVideo: (VideoSnippet & Partial<VideoDetails>) | null = selectedVideoId
  ? ({
     ...(allVideos.find((v) => v.videoId === selectedVideoId) ?? {}),
     ...(videoDetails ?? {}),
    } as VideoSnippet & Partial<VideoDetails>)
  : null
 // The catalog can still be arriving while the tool is fully usable. Keep the
 // default layout mounted and say so on the selector instead of replacing the
 // whole tool body with an empty box.
 const catalogLoading = connected && videoListLoadState === "loading" && videos.length === 0 && !selectedVideo

 useEffect(() => {
  const channelId = auth.session.channel?.id || ""
  if (activeChannelIdRef.current === channelId) return
  activeChannelIdRef.current = channelId
  setSelectedVideoId(null)
  setVideoDetails(null)
  setUserPlaylists([])
  setCurrentPlaylists([])
  setSelectedPlaylistIds([])
  setAllVideos([])
  setVideos([])
  setHasLoadedInitialData(false)
  hasTriggeredInitialLoadRef.current = false
 }, [auth.session.channel?.id])

 const loadInitialData = useCallback(async (_force = false) => {
  if (!connected) return
  setVideoListLoadState("loading")
  setLoading(true)
  setError(null)
  try {
   const [inventory, playlists] = await Promise.all([
    fetchSimpleVideoInventory(),
    fetchSimplePlaylists(),
   ])
   setAllVideos(inventory.videos)
   setVideos(inventory.videos)
   setUserPlaylists(playlists)
   setHasLoadedInitialData(true)
   setVideoListLoadState(inventory.videos.length > 0 ? "success" : "empty")
  } catch (err: any) {
   console.error(err)
   setError(formatVideoLoadError(err))
   setHasLoadedInitialData(true)
   setVideoListLoadState("error")
  } finally {
   setLoading(false)
  }
 }, [connected])

 useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
   const nextQuery = videoSearchQuery.trim().toLowerCase()
   if (nextQuery === lastSearchRef.current) return
   lastSearchRef.current = nextQuery
   const nextVideos = !nextQuery
    ? allVideos
    : allVideos.filter((video) =>
       video.title.toLowerCase().includes(nextQuery) || video.videoId.toLowerCase().includes(nextQuery),
      )
   setVideos(nextVideos.slice(0, 50))
  }, 180)
  return () => clearTimeout(delayDebounceFn)
 }, [allVideos, videoSearchQuery])

 useEffect(() => {
  if (!connected) {
   hasTriggeredInitialLoadRef.current = false
   return
  }
  if (hasLoadedInitialData || hasTriggeredInitialLoadRef.current) return
  if (collapsible && !isOpen) return
  hasTriggeredInitialLoadRef.current = true
  void loadInitialData()
 }, [collapsible, connected, hasLoadedInitialData, isOpen, loadInitialData])

 useEffect(() => {
  if (!connected || videos.length === 0 || selectedVideoId) return
  const firstVideoId = videos[0]?.videoId
  if (!firstVideoId) return
  void handleSelectVideo(firstVideoId, userPlaylists)
 }, [connected, videos, selectedVideoId, userPlaylists])

 const handleSelectVideo = async (videoId: string, playlistsToUse = userPlaylists) => {
  if (!connected) return
  setSelectedVideoId(videoId)
  setLoading(true)
  setError(null)
  setSaveSuccess(false)
  setThumbnailPreview(null)
  setThumbnailFile(null)
  try {
   const videoBundle = await fetchSimpleVideoBundle(videoId)
   const details = videoBundle.details
   setVideoDetails(details)
   setEditTitle(details.title)
   setEditDescription(details.description)
   setEditTags(details.tags.join(", "))
   setEditPrivacy(details.privacyStatus)
   setEditCategoryId(details.categoryId)
   setExistingTagAnalysis([])
   setSuggestedTags([])
   setTagInput("")

   try {
    const memberships = await fetchSimpleVideoPlaylistMemberships(videoId, playlistsToUse.map((p) => p.id))
    setCurrentPlaylists(memberships)
    setSelectedPlaylistIds(memberships.map((m) => m.playlistId))
   } catch (playlistError) {
    console.warn("Video details loaded, but playlist membership sync failed.", playlistError)
    setCurrentPlaylists([])
    setSelectedPlaylistIds([])
   }
  } catch (err: any) {
   console.error(err)
   setError("Failed to load video details.")
  } finally {
   setLoading(false)
  }
 }

 const buildLocalTagAnalysis = (title: string, description: string, tags: string[]): TagSuggestion[] => {
  const titleWords = new Set(title.toLowerCase().split(/\W+/).filter(Boolean))
  const combinedText = `${title} ${description}`.toLowerCase()
  return tags
   .map((tag) => {
    const words = tag.toLowerCase().split(/\W+/).filter(Boolean)
    const titleHits = words.filter((word) => titleWords.has(word)).length
    const bodyHits = words.filter((word) => combinedText.includes(word)).length
    const tripleKeyword = titleHits > 0 && bodyHits === words.length
    const searchVolume = Math.max(200, Math.round(5800 - words.length * 280 + titleHits * 900 + bodyHits * 350))
    const competition = Math.max(80, Math.round(4100 + words.length * 500 - titleHits * 450))
    const score = Math.min(99, Math.max(35, Math.round((searchVolume / Math.max(searchVolume + competition, 1)) * 100 + titleHits * 8 + bodyHits * 3 + (tripleKeyword ? 7 : 0))))
    return { tag, score, searchVolume, competition, rank: 0, tripleKeyword }
   })
   .sort((a, b) => b.score - a.score)
   .map((item, index) => ({ ...item, rank: index + 1 }))
 }

 const handleRankTags = async () => {
  if (existingTagAnalysis.length > 0) {
   setShowRankDetails(true)
   return
  }
  if (!editTags) return
  setIsAnalyzingTags(true)
  try {
   const tags = editTags.split(",").map((t) => t.trim()).filter(Boolean)
   if (tags.length === 0) return
   const channelId = auth.session.channel?.id || ""
   const analysis = hasGeminiKey()
    ? (await generateGovernedTagSuggestions({
       context: { channelId },
       title: editTitle,
       description: editDescription,
       tags,
       mode: "analyze",
       operationId: `video-manager-tag-analysis:${selectedVideoId || Date.now()}`,
       workflowId: `workflow:video-manager-tags:${selectedVideoId || "draft"}`,
      })).suggestions
    : buildLocalTagAnalysis(editTitle, editDescription, tags)
   setExistingTagAnalysis(analysis)
   setShowRankDetails(true)
  } catch (err) {
   console.error("Failed to rank tags:", err)
  } finally {
   setIsAnalyzingTags(false)
  }
 }

 const handleGenerateTags = async () => {
  if (!hasGeminiKey()) return
  setIsGeneratingTags(true)
  try {
   const channelId = auth.session.channel?.id || ""
   if (!channelId) throw new Error("Connect a YouTube channel before generating governed tag suggestions.")
   const { suggestions } = await generateGovernedTagSuggestions({
    context: { channelId },
    title: editTitle,
    description: editDescription,
    operationId: `video-manager-tag-suggestions:${selectedVideoId || Date.now()}`,
    workflowId: `workflow:video-manager-tags:${selectedVideoId || "draft"}`,
   })
   setSuggestedTags([...suggestions].sort((a, b) => b.score - a.score).slice(0, 10))
  } catch (err) {
   console.error(err)
  } finally {
   setIsGeneratingTags(false)
  }
 }

 const handleAddTag = (tag: string, analysis?: TagSuggestion) => {
  const trimmed = tag.trim()
  if (!trimmed) return
  const current = editTags.split(",").map(t => t.trim()).filter(Boolean)
  if (current.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
   setTagInput("")
   return
  }
  const nextValue = [...current, trimmed].join(", ")
  if (nextValue.length > MAX_TAG_CHARS) {
   alert("Character limit exceeded. Tags must be 500 characters or less including spaces.")
   return
  }
  setEditTags(nextValue)
  if (analysis) setExistingTagAnalysis(prev => [...prev.filter(item => item.tag.toLowerCase() !== trimmed.toLowerCase()), analysis])
  setTagInput("")
 }

 const handleRemoveTag = (tag: string) => {
  setEditTags(editTags.split(",").map(t => t.trim()).filter(t => t.toLowerCase() !== tag.toLowerCase()).join(", "))
  setExistingTagAnalysis(prev => prev.filter(item => item.tag.toLowerCase() !== tag.toLowerCase()))
 }

 const handleRefineTags = async () => {
  await handleGenerateTags()
 }

 const handleThumbnailChange = (file: File | null) => {
  if (!file) {
   setThumbnailFile(null)
   setThumbnailPreview(null)
   return
  }
  if (file.size > 2 * 1024 * 1024) {
   alert("Image size must be under 2MB")
   return
  }
  setThumbnailFile(file)
  const reader = new FileReader()
  reader.onloadend = () => setThumbnailPreview(reader.result as string)
  reader.readAsDataURL(file)
 }

 const educationValidation = validateEducationTimestampLines(educationNotes)
 const educationReady = editCategoryId !== "27" || educationValidation.valid
 const togglePlaylist = useCallback((playlistId: string) => {
  setSelectedPlaylistIds((current) => togglePlaylistSelection(current, playlistId))
 }, [])

 const handleSave = async () => {
  if (!connected || !canManageVideos) {
   auth.login("/video-manager")
   return
  }
  if (!selectedVideoId) return
  if (!educationReady) {
   setError(`Education timestamps contain invalid lines: ${educationValidation.invalidLines.join(", ")}`)
   return
  }
  setSaving(true)
  setError(null)
  setSaveSuccess(false)
  const previousPlaylistIds = currentPlaylists.map((membership) => membership.playlistId)
  const nextDescription = educationNotes.trim() && editCategoryId === "27"
   ? `${editDescription.trim()}\n\n${educationNotes.trim()}`.trim()
   : editDescription
  try {
   await patchSimpleOwnedVideo(selectedVideoId, {
    snippet: {
     title: editTitle,
     description: nextDescription,
     tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
     categoryId: editCategoryId,
    },
    status: { privacyStatus: editPrivacy, selfDeclaredMadeForKids: editAudience },
    ...(editLocation.trim() ? { recordingDetails: { locationDescription: editLocation.trim() } } : {}),
   })

   // Record only after YouTube confirms the metadata write. The ContentBuild event
   // stream remains the history authority; no second manager-history store is used.
   const historyBuild = listContentBuilds().find(build => build.youtube?.videoId === selectedVideoId)
   if (historyBuild) {
    const history = listMetadataHistory(historyBuild.id)
    const livePackageId = `live-metadata:${selectedVideoId}`
    const priorVersion = Math.max(0, ...history
     .filter(event => event.metadata?.metadataPackageId === livePackageId)
     .map(event => Number(event.metadata?.packageVersion) || 0))
    const previousPackage = createEmptyMetadataMasterPackage({
     id: livePackageId,
     version: priorVersion,
     projectId: historyBuild.legacyProjectId,
     contentBuildId: historyBuild.id,
     videoId: selectedVideoId,
     title: videoDetails?.title || selectedVideo?.title || "",
     description: videoDetails?.description || "",
     tags: videoDetails?.tags || [],
     category: videoDetails?.categoryId || "",
     playlistIds: previousPlaylistIds,
     source: "imported",
     provenance: ["Video Manager", "Pre-update published metadata"],
    })
    const nextPackage = createEmptyMetadataMasterPackage({
     id: livePackageId,
     version: priorVersion + 1,
     projectId: historyBuild.legacyProjectId,
     contentBuildId: historyBuild.id,
     videoId: selectedVideoId,
     title: editTitle,
     description: nextDescription,
     tags: editTags.split(",").map(tag => tag.trim()).filter(Boolean),
     category: editCategoryId,
     playlistIds: previousPlaylistIds,
     source: "manual",
     provenance: ["Video Manager", "Successful published metadata update"],
    })
    const metadataOperationId = `video-manager-save-${selectedVideoId}-${Date.now()}`
    const metadataOccurredAt = new Date().toISOString()
    recordPublishedMetadataChange({
     contentBuildId: historyBuild.id,
     projectId: historyBuild.legacyProjectId,
     videoId: selectedVideoId,
     operation: "manual",
     actorType: "creator",
     operationId: metadataOperationId,
     timestamp: metadataOccurredAt,
     reason: "Creator saved published-video metadata in Video Manager.",
     previousPackage,
     package: nextPackage,
     previousSettings: { visibility: videoDetails?.privacyStatus ?? null },
     nextSettings: { visibility: editPrivacy },
    })
    const metadataFields = (["title", "description", "tags", "category"] as const)
     .filter(field => JSON.stringify(previousPackage[field]) !== JSON.stringify(nextPackage[field]))
     .map(field => ({ field, before: previousPackage[field], after: nextPackage[field] }))
    if (metadataFields.length) {
     recordContentBuildMetadataChange({
      contentBuildId: historyBuild.id,
      metadataVersionId: `live-metadata-version:${selectedVideoId}:${priorVersion + 1}`,
      operationId: metadataOperationId,
      operation: "edit",
      actorType: "creator",
      sourceToolId: "video-manager",
      publishedVideoId: selectedVideoId,
      fields: metadataFields,
      sourceAssetIds: [
       historyBuild.selections.title,
       historyBuild.selections.thumbnail,
       historyBuild.selections.description,
       historyBuild.selections.tags,
      ].filter((value): value is string => Boolean(value)),
      evidenceIds: [],
      occurredAt: metadataOccurredAt,
     })
    }
    if (thumbnailFile) {
     await setSimpleVideoThumbnail(selectedVideoId, thumbnailFile)
     setThumbnailFile(null)
    }
   }
   const toAdd = selectedPlaylistIds.filter((id) => !currentPlaylists.some((m) => m.playlistId === id))
   const toRemove = currentPlaylists.filter((m) => !selectedPlaylistIds.includes(m.playlistId))
   await Promise.all([
    ...toAdd.map((id) => addSimpleVideoToPlaylist(id, selectedVideoId)),
    ...toRemove.map((m) => removeSimpleVideoFromPlaylist(m.playlistItemId)),
   ])
   if (historyBuild && JSON.stringify(previousPlaylistIds) !== JSON.stringify(selectedPlaylistIds)) {
    recordPublishedMetadataSettingsChange({
     contentBuildId: historyBuild.id,
     videoId: selectedVideoId,
     previousSettings: { playlistIds: previousPlaylistIds },
     nextSettings: { playlistIds: selectedPlaylistIds },
     operationId: `video-manager-playlists-${selectedVideoId}-${Date.now()}`,
     actorType: "creator",
     toolId: "video-manager",
    })
   }
   if (brain.activeProjectId) {
    const activeProject = brain.projects.find(project => project.id === brain.activeProjectId)
    updateProject(brain.activeProjectId, {
     videoTitle: editTitle,
     description: editDescription,
     tags: editTags,
     thumbnailUrl: thumbnailPreview || undefined,
     plan: {
      ...(activeProject?.plan || {}),
      concept: activeProject?.plan?.concept || activeProject?.concept || activeProject?.videoTitle || activeProject?.name || "",
      niche: activeProject?.plan?.niche || activeProject?.niche || brain.targetNiche || "",
      publishingMetadata: {
       ...(activeProject?.plan?.publishingMetadata || {}),
       category: editCategoryId,
       visibility: editPrivacy,
       audience: editAudience,
       timestamps: editTimestamps,
       location: editLocation,
       community: editCommunity,
       aiUse: editAiUse,
       playlistIds: selectedPlaylistIds.join(","),
      },
     },
    })
   }
   setSaveSuccess(true)
    setVideos((current) => current.map((video) => video.videoId === selectedVideoId ? { ...video, title: editTitle } : video))
   void loadInitialData()
  } catch (err: any) {
   setError("Save failed: " + err.message)
  } finally {
   setSaving(false)
  }
 }

 const formatPublishedDate = (value?: string) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" }).toUpperCase()
 }

 const formatDuration = (value?: string) => {
  if (!value) return ""
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return value
  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)
  return hours > 0
   ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
   : `${minutes}:${String(seconds).padStart(2, "0")}`
 }

 const categoryOptions = [
  { value: "2", label: "Autos & Vehicles" }, { value: "23", label: "Comedy" }, { value: "27", label: "Education" }, { value: "24", label: "Entertainment" }, { value: "1", label: "Film & Animation" }, { value: "20", label: "Gaming" }, { value: "26", label: "Howto & Style" }, { value: "10", label: "Music" }, { value: "25", label: "News & Politics" }, { value: "29", label: "Nonprofits & Activism" }, { value: "22", label: "People & Blogs" }, { value: "15", label: "Pets & Animals" }, { value: "28", label: "Science & Technology" }, { value: "17", label: "Sports" }, { value: "19", label: "Travel & Events" },
 ]
 const subtitleBase = "Manage your published YouTube videos: refine titles, thumbnails, descriptions, tags, and publishing metadata."
 const subtitleHelpRail = (
  <div className="flex flex-wrap items-center gap-2">
   <span className="uppercase tracking-[0.12em]">Choose a published video to review or update its metadata.</span>
  </div>
 )

 const selectorOptions = videos.map((video) => ({
  value: video.videoId,
  title: video.title,
  thumbnail: video.thumbnail,
  dateLabel: formatPublishedDate(video.publishedAt),
  durationLabel: video.duration ? formatDuration(video.duration) : "",
 }))
 const connectionLabel = auth.loading
  ? "CONNECTING YOUR YOUTUBE CHANNEL…"
  : auth.session.status === "reconnect_required"
    ? "RECONNECT YOUR YOUTUBE CHANNEL TO LOAD VIDEOS"
    : "CONNECT YOUR YOUTUBE CHANNEL TO LOAD VIDEOS"

 return (
  <ToolboxScaffold
   title="VIDEO MANAGER"
   subtitle={subtitleBase}
   icon={<FileVideo size={40} strokeWidth={3} className="text-black" />}
   headerColor="bg-[#00CCFF]"
   iconBoxColor="bg-[#CC99FF]"
   paletteIndex={paletteIndex}
   collapsible={collapsible}
   isOpen={isOpen}
   onToggle={() => setIsOpen(!isOpen)}
   embedded={embedded}
   helpText={subtitleHelpRail}
   headerActionsPlacement="header"
   headerActions={
    <div className="flex flex-wrap items-center justify-end gap-2 max-w-full">
     <ToolboxHeaderToggle
      value={viewMode === "intelligence" ? "generate" : "manage"}
      aria-label="Manager mode"
      options={[
       { value: "manage", label: "Manage" },
       { value: "generate", label: "Generate" },
      ]}
      onValueChange={(value) => setViewMode(value === "generate" ? "intelligence" : "workspace")}
     />
     {showHeaderLoadAssetsButton ? (
      <StudioSplitLeftButton
       sizeVariant="standard"
       tone="neutral"
       icon={<RefreshCw aria-hidden="true" size={18} />}
       className="!w-auto"
       onClick={(event) => { event.stopPropagation(); lastSearchRef.current = ""; setVideoSearchQuery(""); void loadInitialData(true) }}
       disabled={loading}
      >
       {loading ? "REFRESHING..." : "LOAD SPACE ASSETS"}
      </StudioSplitLeftButton>
     ) : null}
    </div>
   }
   shellClassName="animate-fade-in"
   contentClassName={embedded ? "p-0" : "p-8"}>
   <div className="flex flex-col h-full">
    <ViewTubeHandoffReceiver targetToolId="video-manager" onPacket={handleLongformOptimizerHandoff} />
    <ViewTubeHandoffReceiver targetToolId="video-manager" onPacket={handleMetadataMasterHandoff} />
    {error && <SubToolboxAlert level="l1" tone="danger" className="mb-6" icon={<AlertCircle size={20} />} title="Video Manager Issue" detail={error} />}
    {saveSuccess && <SubToolboxAlert level="l1" tone="success" className="mb-6" icon={<CheckCircle size={20} />} title="Asset Deployed Successfully" />}
    {viewMode === "intelligence" ? (
     <MetadataMaster embedded collapsible={false} paletteIndex={basePalette + 1} />
    ) : (
     <>
    {showRankDetails && existingTagAnalysis.length > 0 && (
     <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-center justify-center p-6" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowRankDetails(false) }}>
      <SubToolboxOutputCard
       level="l0"
       role="dialog"
       aria-modal="true"
       aria-label="Tag Rank Calculations"
       className="w-full max-w-4xl !overflow-hidden"
       title={<span className="flex min-w-0 flex-col"><strong>Tag Rank Calculations</strong><small>Score balances search volume, competition, title match, and triple keyword signal.</small></span>}
       action={<SubToolboxIconButton level="l1" icon={<X size={18} />} ariaLabel="Close tag rankings" onClick={() => setShowRankDetails(false)} />}
      >
       <SubToolboxDataTable
        level="l1"
        className="max-h-[70vh]"
        columns={[
         { key: "tag", label: "Tag" },
         { key: "score", label: "Score", align: "right" },
         { key: "searchVolume", label: "Search Vol", align: "right" },
         { key: "competition", label: "Competition", align: "right" },
         { key: "rank", label: "Rank", align: "center" },
         { key: "tripleKeyword", label: "Triple Keyword", align: "center" },
        ]}
        rows={existingTagAnalysis.map((analysis) => ({
         tag: <strong className="uppercase">{analysis.tag}</strong>,
         score: analysis.score,
         searchVolume: analysis.searchVolume.toLocaleString(),
         competition: analysis.competition.toLocaleString(),
         rank: <SubToolboxTag level="l2">#{analysis.rank}</SubToolboxTag>,
         tripleKeyword: analysis.tripleKeyword ? "YES" : "NO",
        }))}
        getRowKey={(_row, index) => existingTagAnalysis[index]?.tag ?? index}
       />
      </SubToolboxOutputCard>
     </div>
    )}

    {connected && videoListLoadState === "idle" && !hasLoadedInitialData ? (
     <div className="min-h-[200px] sm:min-h-[320px] lg:min-h-[500px] flex items-center justify-center">
      <SubToolboxStatePanel
       level="l0"
       state="ready"
       className="w-full max-w-2xl"
       message="Ready to load your YouTube channel catalog."
       action={<SubToolboxGridActionButton label={loading ? "Loading..." : "Load Channel Catalog"} iconName="video" tone="green" onClick={() => void loadInitialData(true)} disabled={loading} />}
      />
     </div>
    ) : connected && videoListLoadState === "error" && videos.length === 0 ? (
     <div className="min-h-[200px] sm:min-h-[320px] lg:min-h-[500px] flex items-center justify-center">
      <SubToolboxStatePanel
       level="l0"
       state="error"
       className="w-full max-w-2xl"
       message={error || "We couldn't load your YouTube assets. Try reload, or reconnect your channel in Settings."}
       action={<SubToolboxGridActionButton label={loading ? "Retrying..." : "Retry Catalog Load"} iconName="video" tone="orange" onClick={() => void loadInitialData(true)} disabled={loading} />}
      />
     </div>
    ) : connected && videoListLoadState === "empty" ? (
     <div className="min-h-[200px] sm:min-h-[320px] lg:min-h-[500px] flex items-center justify-center">
      <SubToolboxStatePanel
       level="l0"
       state="empty"
       className="w-full max-w-2xl"
       message="Your YouTube channel is connected, but no videos were detected yet."
       action={<SubToolboxActions columns={2}><SubToolboxLinkButton level="l0" tone="success" href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer">Open YouTube Studio</SubToolboxLinkButton><SubToolboxGridActionButton label={loading ? "Reloading..." : "Reload Assets"} iconName="video" tone="blue" onClick={() => void loadInitialData(true)} disabled={loading} /></SubToolboxActions>}
      />
     </div>
    ) : (selectedVideo || !connected || catalogLoading) ? (
     <div className="vm-manager-stack animate-in fade-in slide-in-from-bottom-4 duration-500">
      {catalogLoading ? (
       <SubToolboxGridActionButton
        label="Loading Your YouTube Video Catalog…"
        iconName="video"
        tone="blue"
        onClick={() => undefined}
        disabled
       />
      ) : connected ? (
       <SubToolboxVideoSelector
        level="l0"
        value={selectedVideoId || ""}
        options={selectorOptions}
        onValueChange={(videoId) => void handleSelectVideo(videoId)}
        searchValue={videoSearchQuery}
        onSearchValueChange={setVideoSearchQuery}
        searchIcon={<Search size={20} strokeWidth={3} />}
        searchPlaceholder="SEARCH VIDEOS..."
        ariaLabel="Choose video"
       />
      ) : (
       <SubToolboxShellAction
        level="l0"
        icon={<FileVideo aria-hidden="true" />}
        onClick={() => auth.login("/video-manager")}
        disabled={auth.loading}
       >
        {connectionLabel}
       </SubToolboxShellAction>
      )}

      <ProjectManifestation
       projects={brain.projects || []}
       activeProjectId={brain.activeProjectId}
       onLoadProject={handleProjectManifestLoad}
       onSaveProject={saveProjectManifestState}
       paletteIndex={basePalette + 1}
      />
      <CanonicalMetadataSections
       showFieldActions={true}
       title={editTitle}
       description={editDescription}
       tags={editTags}
       category={editCategoryId}
       categoryOptions={YOUTUBE_CATEGORY_OPTIONS.map(option => ({ value: option.value, label: option.label }))}
       playlists={selectedPlaylistIds.join(",")}
       playlistOptions={userPlaylists.map(playlist => ({ value: playlist.id, label: playlist.title }))}
       selectedPlaylistIds={selectedPlaylistIds}
       onPlaylistToggle={togglePlaylist}
       thumbnailFile={thumbnailFile}
       thumbnailPreview={thumbnailPreview || selectedVideo?.thumbnail || null}
       visibility={editPrivacy}
       audience={editAudience}
       timestamps={editTimestamps}
       location={editLocation}
       community={editCommunity}
       aiUse={editAiUse}
       onTitleChange={setEditTitle}
       onDescriptionChange={setEditDescription}
       onTagsChange={setEditTags}
       onCategoryChange={setEditCategoryId}
       onPlaylistsChange={() => undefined}
       onThumbnailFileChange={handleThumbnailChange}
       onVisibilityChange={setEditPrivacy}
       onAudienceChange={(value) => { if (value !== null) setEditAudience(value) }}
       onTimestampsChange={setEditTimestamps}
       onLocationChange={setEditLocation}
       onCommunityChange={setEditCommunity}
       onAiUseChange={setEditAiUse}
       onGenerate={(field) => { if (field === "tags") void handleGenerateTags() }}
       onRefine={(field) => { if (field === "tags") void handleRefineTags() }}
       onAnalyze={(field) => { if (field === "tags") void handleRankTags() }}
       actionFields={["tags"]}
       onRankTags={handleRankTags}
       tagAnalysis={existingTagAnalysis}
       suggestedTags={suggestedTags}
       tagInput={tagInput}
       onTagInputChange={setTagInput}
       onAddTag={() => handleAddTag(tagInput)}
       onRemoveTag={handleRemoveTag}
       onAddSuggestedTag={handleAddTag}
       maxTagChars={MAX_TAG_CHARS}
       isAnalyzingTags={isAnalyzingTags}
       isGeneratingTags={isGeneratingTags}
       educationNotes={educationNotes}
       onEducationNotesChange={setEducationNotes}
       educationNotesDisabled={!connected}
       thumbnailActions={
        <>
         <SubToolboxButton level="l2" onClick={() => fileInputRef.current?.click()} disabled={!connected || !selectedVideo}>UPLOAD</SubToolboxButton>
         <SubToolboxButton level="l2" onClick={() => navigate("/thumbnail-studio", { state: { source: "video-manager", videoId: selectedVideoId, title: editTitle, thumbnail: thumbnailPreview || selectedVideo?.thumbnail || null } })} disabled={!selectedVideoId}>GENERATE</SubToolboxButton>
        </>
       }
       showVideoUpload={false}
       showPlaylists={true}
       showCategory={true}
      />
      <SubToolboxGridActionButton
       onClick={connected ? handleSave : () => auth.login("/video-manager")}
       disabled={connected ? saving || !selectedVideoId || !educationReady : auth.loading}
       tone="blue"
       iconName="settings"
       showIconSection
       className="vm-update-video-action"
       label={!connected ? connectionLabel : catalogLoading ? "Loading Video Catalog..." : saving ? "Transmitting to Server..." : "Update Video Details"}
      />
     </div>
    ) : (
     <div className="min-h-[180px] sm:min-h-[320px] lg:h-[500px] flex flex-col items-center justify-center gap-3 sm:gap-5 font-black uppercase text-xl sm:text-2xl lg:text-3xl tracking-tighter text-black/20"><Edit size={100} strokeWidth={1} className="mb-2 opacity-50" />Awaiting Asset Selection</div>
    )}

     </>
    )}

    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleThumbnailChange(e.target.files[0])} className="hidden" accept="image/*" />
   </div>
  </ToolboxScaffold>
 )
}

export default VideoManager
