/**
 * Returns whether a chat transcript should follow newly appended content.
 * A small bottom threshold avoids disabling follow mode for minor scroll jitter.
 */
export const shouldFollowBrainConversation = (
 scrollHeight: number,
 scrollTop: number,
 clientHeight: number,
 threshold = 72,
) => scrollHeight - scrollTop - clientHeight <= threshold
