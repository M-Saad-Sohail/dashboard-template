
export function getTrackUrl(item: any, isSubscribed: boolean) {
  // If user is subscribed, return full track
  if (isSubscribed) return item.track || undefined;

  // If item is premium and user is not subscribed, return preview
  if (item.premium) return item.preview || undefined;

  // If item is free, return full track
  return item.track || undefined;
}
