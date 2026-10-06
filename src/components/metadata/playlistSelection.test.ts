import { describe, expect, it } from "vitest"
import { togglePlaylistSelection } from "./playlistSelection"

describe("togglePlaylistSelection", () => {
 it("adds a playlist that is not selected", () => {
  expect(togglePlaylistSelection(["playlist-a"], "playlist-b")).toEqual(["playlist-a", "playlist-b"])
 })

 it("removes a playlist that is already selected", () => {
  expect(togglePlaylistSelection(["playlist-a", "playlist-b"], "playlist-a")).toEqual(["playlist-b"])
 })

 it("does not mutate the existing selection", () => {
  const current = ["playlist-a"]
  const next = togglePlaylistSelection(current, "playlist-b")
  expect(current).toEqual(["playlist-a"])
  expect(next).not.toBe(current)
 })
})
