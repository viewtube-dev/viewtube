import React from "react"
import { ListVideo, LockKeyhole, Tags } from "lucide-react"
import { SubToolbox } from "../Toolbox"
import { SubToolboxGrid } from "../subtoolbox/SubToolboxLayouts"
import { SubToolboxTopTitleDropdown } from "../subtoolbox/SubToolboxPrimitives"

export interface PublishingControlOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface PublishingControlsProps {
  privacy: string
  category: string
  playlistIds: string[]
  privacyOptions: PublishingControlOption[]
  categoryOptions: PublishingControlOption[]
  playlistOptions: PublishingControlOption[]
  onPrivacyChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onPlaylistToggle: (value: string) => void
}

export const PublishingControls: React.FC<PublishingControlsProps> = ({
  privacy, category, playlistIds, privacyOptions, categoryOptions, playlistOptions,
  onPrivacyChange, onCategoryChange, onPlaylistToggle,
}) => {
  const privacyLabel = privacyOptions.find(option => option.value === privacy)?.label || "Select Privacy"
  const categoryLabel = categoryOptions.find(option => option.value === category)?.label || "Select Category"
  const playlistLabel = playlistIds.length === 0 ? "No playlists" : `${playlistIds.length} selected`

  return (
    <SubToolbox title="PUBLISHING CONTROLS" icon={<Tags size={20} strokeWidth={3} />} collapsible isOpenInitial>
      <SubToolboxGrid minItemWidth="compact" density="compact" className="grid-cols-1 md:grid-cols-3">
        <SubToolboxTopTitleDropdown
          level="l1"
          label={<><LockKeyhole size={13} aria-hidden="true" /> PRIVACY</>}
          value={privacyLabel}
          options={privacyOptions}
          onValueChange={onPrivacyChange}
          ariaLabel="Privacy"
        />
        <SubToolboxTopTitleDropdown
          level="l1"
          label={<><Tags size={13} aria-hidden="true" /> CATEGORY</>}
          value={categoryLabel}
          options={categoryOptions}
          onValueChange={onCategoryChange}
          ariaLabel="Category"
        />
        <SubToolboxTopTitleDropdown
          level="l1"
          label={<><ListVideo size={13} aria-hidden="true" /> PLAYLISTS</>}
          value={playlistLabel}
          options={playlistOptions}
          multiSelect
          selectedValues={playlistIds}
          onValueChange={onPlaylistToggle}
          ariaLabel="Channel playlists"
        />
      </SubToolboxGrid>
    </SubToolbox>
  )
}
