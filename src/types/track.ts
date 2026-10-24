
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

export interface RouteMarker {
  id: number;
  track_id: numder;
  lat: number;
  lng: number;
  order: number;
  description: string;
  photo: object;
  recall: string;
  archived: boolean
}

interface TrackWithDetails extends Track {
  days: TrackDay[];
  points: RoutePoint[];
}