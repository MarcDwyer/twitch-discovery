export interface RandomStreamers {
  _total: number;
  streams: SubStream[];
}

export interface SubStream {
  _id: number;
  game: string;
  viewers: number;
  video_height: number;
  average_fps: number;
  delay: number;
  created_at: Date;
  is_playlist: boolean;
  preview: Preview;
  channel: Channel;
}
export interface Channel {
  mature: boolean;
  status: string;
  broadcaster_language: string;
  display_name: string;
  game: string;
  language: string;
  _id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  partner: boolean;
  logo: string;
  video_banner: string;
  profile_banner: string;
  profile_banner_background_color: null;
  url: string;
  views: number;
  followers: number;
}

interface Preview {
  small: string;
  medium: string;
  large: string;
  template: string;
}

interface Links {
  channel: string;
  self: string;
}

interface ChannelData {
  _id: number;
  broadcaster_language: string;
  created_at: Date;
  display_name: string;
  followers: number;
  game: string;
  language: string;
  logo: string;
  mature: boolean;
  name: string;
  partner: boolean;
  profile_banner?: any;
  profile_banner_background_color?: any;
  status: string;
  updated_at: Date;
  url: string;
  video_banner?: any;
  views: number;
}

export interface IStreamers {
  streamData: SubStream | null;
  streamName: string;
  channelData: Channel;
  id: number;
}

export type TwitchPayload = {
  nextRefresh?: number;
  streams: IStreamers[];
  diagnostic: Diag;
  online: SubStream[];
};
type Diag = {
  skippedOver: number;
};
