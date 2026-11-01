import type { Venue } from "./data";

export type VenueGroup = { key: string; name: string; venues: Venue[] };
export function groupVenues(venues: Venue[]): VenueGroup[] {
  const groups = new Map<string, VenueGroup>();
  for (const venue of venues) {
    const name = venue.brand || venue.name.split(" · ")[0];
    const key = name.toLocaleLowerCase("vi").normalize("NFC").trim();
    if (!groups.has(key)) groups.set(key, { key, name, venues: [] });
    groups.get(key)!.venues.push(venue);
  }
  return [...groups.values()];
}
export function venueReason(venue: Venue): string {
  return venue.reason || venue.note;
}
export const venuePhotoLabels = {
  exterior: "Mặt tiền quán",
  interior: "Không gian quán",
  dish: "Món tại quán",
  brand: "Ảnh thương hiệu",
};
