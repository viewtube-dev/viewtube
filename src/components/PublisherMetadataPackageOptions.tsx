import React, { useMemo } from "react"
import { Check, GitCompare, RotateCcw } from "lucide-react"
import { listPublisherMetadataPackageOptions, selectPublisherMetadataPackageOption } from "../services/publisherMetadataPackageOptions"
import { SubToolbox } from "./Toolbox"
import { SubToolboxActions, SubToolboxStack } from "./subtoolbox/SubToolboxLayouts"
import { SubToolboxButton, SubToolboxOutputCard, SubToolboxStatePanel } from "./subtoolbox/SubToolboxPrimitives"

export interface PublisherMetadataPackageOptionsProps {
  contentBuildId: string | null
  onSelected?: (assetId: string) => void
  sourceToolId?: string
}

const PublisherMetadataPackageOptions: React.FC<PublisherMetadataPackageOptionsProps> = ({
  contentBuildId,
  onSelected,
  sourceToolId = "video-publisher",
}) => {
  const options = useMemo(
    () => contentBuildId ? listPublisherMetadataPackageOptions(contentBuildId) : [],
    [contentBuildId],
  )

  if (!contentBuildId) return null

  return (
    <SubToolbox title="Saved Metadata Sets" icon={<GitCompare size={20} strokeWidth={3} />} collapsible isOpenInitial>
      {!options.length ? (
        <SubToolboxStatePanel state="empty" message="Save this metadata to the Project to create a reusable set." />
      ) : (
        <SubToolboxStack density="dense">
          {options.map((option, index) => {
            const title = option.payload.title?.trim() || option.label
            const description = option.payload.description?.trim() || "No description saved."
            const tags = option.payload.tags?.trim() || "No tags saved."
            return (
              <SubToolboxOutputCard
                key={option.assetId}
                title={option.selected ? "CURRENT SET" : option.label || ("OPTION " + (index + 1))}
                badge={option.selected ? "SELECTED" : "OPTION " + (index + 1)}
              >
                <SubToolboxStack density="dense">
                  <div className="font-black text-base">{title}</div>
                  <div className="text-sm font-semibold opacity-70 line-clamp-2">{description}</div>
                  <div className="text-xs font-bold opacity-60 line-clamp-2">{tags}</div>
                  <SubToolboxActions columns={2} forceRow>
                    <SubToolboxButton
                      tone={option.selected ? "success" : "neutral"}
                      disabled={option.selected}
                      icon={option.selected ? <Check size={16} /> : <RotateCcw size={16} />}
                      onClick={() => {
                        if (!contentBuildId || option.selected) return
                        selectPublisherMetadataPackageOption(contentBuildId, option.assetId, { sourceToolId })
                        onSelected?.(option.assetId)
                      }}
                    >
                      {option.selected ? "CURRENT" : "USE THIS"}
                    </SubToolboxButton>
                    <SubToolboxButton
                      tone="ink"
                      onClick={() => {
                        if (!contentBuildId) return
                        const url = new URL(window.location.href)
                        url.searchParams.set("metadataOption", option.assetId)
                        window.history.replaceState({}, "", url.toString())
                      }}
                    >
                      COMPARE
                    </SubToolboxButton>
                  </SubToolboxActions>
                </SubToolboxStack>
              </SubToolboxOutputCard>
            )
          })}
        </SubToolboxStack>
      )}
    </SubToolbox>
  )
}

export default PublisherMetadataPackageOptions