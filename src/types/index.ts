export type UserRole = 'user' | 'priest' | 'deacon' | 'religious' | 'seminarian' | 'catechist' | 'pastoral_coordinator' | 'parish_admin' | 'diocese_admin' | 'community_admin' | 'moderator' | 'platform_admin';

export type PrivacyLevel = 'public' | 'friends' | 'followers' | 'community' | 'private' | 'custom';

export type PresenceStatus = 'online' | 'away' | 'busy' | 'dnd' | 'invisible';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  cover: string;
  bio: string;
  city: string;
  parish: string;
  diocese: string;
  role: UserRole;
  verified: boolean;
  presence: PresenceStatus;
  presenceMessage: string;
  friends: number;
  followers: number;
  following: number;
  devotions: string[];
  pastorals: string[];
  joinedAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  media: MediaItem[];
  type: 'text' | 'image' | 'video' | 'prayer' | 'event' | 'formation' | 'poll';
  privacy: PrivacyLevel;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  saved: boolean;
  createdAt: string;
  hashtags: string[];
  mentions: string[];
  poll?: Poll;
  prayerRequest?: PrayerRequest;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface Poll {
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  endsAt: string;
}

export interface PrayerRequest {
  title: string;
  description: string;
  category: string;
  prayersCount: number;
  prayed: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  image: string;
  cover: string;
  type: 'public' | 'private' | 'institutional';
  members: number;
  posts: number;
  category: string;
  joined: boolean;
  admins: User[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unread: number;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'file';
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  reactions: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'mass' | 'adoration' | 'novena' | 'procession' | 'retreat' | 'catechesis' | 'formation' | 'meeting' | 'other';
  date: string;
  time: string;
  location: string;
  parish: string;
  image: string;
  participants: number;
  interested: number;
  going: boolean;
  organizer: User;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: User;
  category: string;
  modules: number;
  lessons: number;
  duration: string;
  enrolled: number;
  progress: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Story {
  id: string;
  user: User;
  media: MediaItem;
  createdAt: string;
  viewed: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'friend' | 'message' | 'event' | 'prayer' | 'community';
  user: User;
  content: string;
  createdAt: string;
  read: boolean;
}
