import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';

/**
 * Extracts ncode and episode number from an IsNoticeListItem.
 * @param item - The notice list item to extract from
 * @returns Object containing ncode (e.g., "n1234aa") and episode number (next episode to read)
 * @example
 * // For item with base_url "https://ncode.syosetu.com/n1234aa/" and bookmark 5
 * extractNcodeAndEpisode(item) // => { ncode: "n1234aa", episode: 6 }
 */
export function extractNcodeAndEpisode(item: IsNoticeListItem): {
  ncode: string;
  episode: number;
} {
  // Extract ncode from base_url (e.g., "https://ncode.syosetu.com/n1234aa/" -> "n1234aa")
  const regex = /\/([^/]+)\/$/;
  const match = regex.exec(item.base_url);
  const ncode = match ? match[1] : '';
  const episode = item.bookmark + 1; // Next episode to read
  return { ncode, episode };
}
