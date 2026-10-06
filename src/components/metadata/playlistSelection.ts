export const togglePlaylistSelection = (selectedIds: string[], playlistId: string): string[] =>
 selectedIds.includes(playlistId)
  ? selectedIds.filter((id) => id !== playlistId)
  : [...selectedIds, playlistId]
