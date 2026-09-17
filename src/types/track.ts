
interface Track {
  track_id: number;
  name: string;
  track_description: string
}

interface TrackDay {
  track_id: number
  ordinal_numbers: number;
  day_description: string
  stopover: string;
  length: number;
  spring: boolean
}

interface RoutePoint {
  id: number;
  track_id: numder;
  lat: number;
  lng: number;
  order: number
}

interface TrackWithDetails extends Track {
  days: TrackDay[];
  points: RoutePoint[];
}