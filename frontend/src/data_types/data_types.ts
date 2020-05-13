export declare namespace FTypes {
  export interface Channel {
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
    profile_banner: string;
    profile_banner_background_color?: any;
    status: string;
    updated_at: Date;
    url: string;
    video_banner: string;
    views: number;
  }

  export interface Preview {
    large: string;
    medium: string;
    small: string;
    template: string;
  }

  export interface Stream {
    _id: number;
    average_fps: number;
    channel: Channel;
    created_at: Date;
    delay: number;
    game: string;
    is_playlist: boolean;
    preview: Preview;
    video_height: number;
    viewers: number;
  }

  export interface Streams {
    streams: Stream[];
  }
}
