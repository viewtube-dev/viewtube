import React, { useMemo, useState } from "react"
import { Check, GitCompare, RotateCcw } from "lucide-react"
import { listPublisherMetadataPackageOptions, selectPublisherMetadataPackageOption, type PublisherMetadataPackageOption } from "../services/publisherMetadataPackageOptions"
import { SubToolbox } from "./Toolbox"
import { SubToolboxActions, SubToolboxStack } from "./subtoolbox/SubToolboxLayouts"
import { SubToolboxButton, SubToolboxOutputCard, SubToolboxStatePanel } from "./subtoolbox/SubToolboxPrimitives"

export interface PublisherMetadataPackageOptionsProps {
  contentBuildId: string | null
  onSelected?: (option: PublisherMetadataPackageOption) => void
  sourceToolId?: string
}

const PublisherMetadataPackageOptions: React.FC<PublisherMetadataPackageOptionsProps> = ({
  contentBuildId,
  onSelected,
  sourceToolId = "video-publisher",
}) => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [compareAssetId, setCompareAssetId] = useState<string | null>(null)
  const options = useMemo(
    () => contentBuildId ? listPublisherMetadataPackageOptions(contentBuildId) : [],
    [contentBuildId, refreshKey],
  )
  const compareOption = options.find(option => option.assetId === compareAssetId) || null
  const selectedOption = options.find(option => option.selected) || null

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
                  {option.payload.thumbnailPreviewUrl ? <img src={option.payload.thumbnailPreviewUrl} alt={`Thumbnail for ${title}`} className="max-h-36 w-full rounded border-2 border-black object-contain" /> : null}
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
                        setRefreshKey(value => value + 1)
                        onSelected?.(option)
                      }}
                    >
                      {option.selected ? "CURRENT" : "USE THIS"}
                    </SubToolboxButton>
                    <SubToolboxButton
                      tone={compareAssetId === option.assetId ? "success" : "ink"}
                      onClick={() => setCompareAssetId(current => current === option.assetId ? null : option.assetId)}
                    >
                      {compareAssetId === option.assetId ? "CLOSE COMPARE" : "COMPARE"}
                    </SubToolboxButton>
                  </SubToolboxActions>
                </SubToolboxStack>
              </SubToolboxOutputCard>
            )
          })}
        </SubToolboxStack>
      )}
      {compareOption ? (
        <SubToolboxOutputCard title="METADATA COMPARISON" badge="SIDE BY SIDE">
          <SubToolboxStack density="dense">
            {(["title", "description", "tags", "category", "visibility", "playlistIds"] as const).map(field => (
              <div key={field} className="grid grid-cols-2 gap-2 border-b-2 border-black/10 pb-2 last:border-0">
                <div className="min-w-0"><div className="text-[10px] font-black opacity-60">CURRENT · {field.toUpperCase()}</div><div className="whitespace-pre-wrap break-words text-sm font-bold">{String(selectedOption?.payload[field] ?? "—")}</div></div>
                <div className="min-w-0"><div className="text-[10px] font-black opacity-60">COMPARE · {field.toUpperCase()}</div><div className="whitespace-pre-wrap break-words text-sm font-bold">{String(compareOption.payload[field] ?? "—")}</div></div>
              </div>
            ))}
          </SubToolboxStack>
        </SubToolboxOutputCard>
      ) : null}
    </SubToolbox>
  )
}

export default PublisherMetadataPackageOptions