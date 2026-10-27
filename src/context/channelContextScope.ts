import type { ChannelContextProfile } from "./ChannelContextProfile"

/**
 * A saved channel profile is reusable only for the active channel it names.
 * Missing names are not proof of scope, so fail closed rather than leak
 * personalization from another channel into the current prompt.
 */
export const resolveChannelContextForActiveChannel = (
  profile: ChannelContextProfile | null | undefined,
  activeChannelLabel: string | null | undefined,
): ChannelContextProfile | null => {
  const profileName = profile?.identity?.name?.trim().replace(/\s+/g, " ").toLocaleLowerCase()
  const activeName = activeChannelLabel?.trim().replace(/\s+/g, " ").toLocaleLowerCase()
  if (!profile || !profileName || !activeName || profileName !== activeName) return null
  return profile
}
