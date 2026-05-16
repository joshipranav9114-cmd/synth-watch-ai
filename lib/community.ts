/**
 * Community data layer.
 * Currently backed by localStorage so the features work without Supabase tables.
 * To migrate to Supabase: replace each function body with the equivalent
 * supabase.from("table").select/insert/update/delete call — the types stay identical.
 *
 * Required Supabase tables: see supabase/migrations/001_community.sql
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarEmoji =
  | "🦊" | "🐼" | "🐉" | "⚡" | "🌸" | "🔥" | "🌙" | "⭐" | "🎭" | "💎"
  | "🌊" | "🗡️" | "🧿" | "🦋" | "🎌";

export type AvatarColor =
  | "purple" | "cyan" | "pink" | "orange" | "blue" | "green" | "red";

export const AVATAR_COLORS: Record<AvatarColor, string> = {
  purple: "from-violet-600 to-purple-800",
  cyan:   "from-cyan-500 to-teal-700",
  pink:   "from-pink-500 to-rose-700",
  orange: "from-orange-500 to-amber-700",
  blue:   "from-blue-500 to-indigo-700",
  green:  "from-emerald-500 to-green-700",
  red:    "from-red-500 to-rose-800",
};

export const AVATAR_EMOJIS: AvatarEmoji[] = [
  "🦊","🐼","🐉","⚡","🌸","🔥","🌙","⭐","🎭","💎","🌊","🗡️","🧿","🦋","🎌",
];

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_emoji: AvatarEmoji;
  avatar_color: AvatarColor;
}

export interface Review {
  id: string;
  user_id: string;
  anime_id: string;
  anime_title: string;
  rating: number;          // 1-10
  body: string;
  created_at: string;
  profile: UserProfile;
  reactions: ReactionSummary[];
  user_reaction: string | null;
}

export interface Comment {
  id: string;
  user_id: string;
  anime_id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  profile: UserProfile;
  reactions: ReactionSummary[];
  user_reaction: string | null;
  replies?: Comment[];
}

export interface DiscussionMessage {
  id: string;
  user_id: string;
  anime_id: string;
  body: string;
  created_at: string;
  profile: UserProfile;
  reactions: ReactionSummary[];
  user_reaction: string | null;
}

export interface ReactionSummary {
  emoji: string;
  count: number;
}

export const REACTION_EMOJIS = ["🔥","❤️","😂","😭","🤯","👏","💀","✨"];

// ─── Local storage helpers ────────────────────────────────────────────────────

function ls<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Profile store ────────────────────────────────────────────────────────────
// Supabase migration: profiles table already has avatar_url; add avatar_emoji + avatar_color columns

export function getProfile(userId: string): UserProfile {
  const stored = ls<UserProfile | null>(`profile:${userId}`, null);
  if (stored) return stored;
  const defaults: UserProfile = {
    id: userId,
    display_name: "Anon",
    avatar_emoji: "⭐",
    avatar_color: "purple",
  };
  return defaults;
}

export function saveProfile(profile: UserProfile) {
  lsSet(`profile:${profile.id}`, profile);
}

// ─── Reviews store ────────────────────────────────────────────────────────────
// Supabase migration: supabase.from("anime_reviews").select("*, profiles(*), review_reactions(*)")

export function getReviews(animeId: string): Review[] {
  return ls<Review[]>(`reviews:${animeId}`, []);
}

export function addReview(
  animeId: string,
  animeTitle: string,
  userId: string,
  profile: UserProfile,
  rating: number,
  body: string,
): Review {
  const reviews = getReviews(animeId);
  const existing = reviews.findIndex((r) => r.user_id === userId);
  const review: Review = {
    id: uid(),
    user_id: userId,
    anime_id: animeId,
    anime_title: animeTitle,
    rating,
    body,
    created_at: new Date().toISOString(),
    profile,
    reactions: [],
    user_reaction: null,
  };
  if (existing >= 0) {
    reviews[existing] = { ...review, id: reviews[existing].id };
  } else {
    reviews.unshift(review);
  }
  lsSet(`reviews:${animeId}`, reviews);
  return review;
}

export function deleteReview(animeId: string, reviewId: string, userId: string) {
  const reviews = getReviews(animeId).filter(
    (r) => !(r.id === reviewId && r.user_id === userId),
  );
  lsSet(`reviews:${animeId}`, reviews);
}

// ─── Comments store ───────────────────────────────────────────────────────────
// Supabase migration: supabase.from("anime_comments").select("*, profiles(*), comment_reactions(*)")

export function getComments(animeId: string): Comment[] {
  const flat = ls<Comment[]>(`comments:${animeId}`, []);
  const roots = flat.filter((c) => !c.parent_id);
  const replies = flat.filter((c) => c.parent_id);
  return roots.map((r) => ({
    ...r,
    replies: replies.filter((rep) => rep.parent_id === r.id),
  }));
}

export function addComment(
  animeId: string,
  userId: string,
  profile: UserProfile,
  body: string,
  parentId: string | null = null,
): Comment {
  const flat = ls<Comment[]>(`comments:${animeId}`, []);
  const comment: Comment = {
    id: uid(),
    user_id: userId,
    anime_id: animeId,
    body,
    parent_id: parentId,
    created_at: new Date().toISOString(),
    profile,
    reactions: [],
    user_reaction: null,
  };
  flat.unshift(comment);
  lsSet(`comments:${animeId}`, flat);
  return comment;
}

export function deleteComment(animeId: string, commentId: string, userId: string) {
  const flat = ls<Comment[]>(`comments:${animeId}`, []).filter(
    (c) => !(c.id === commentId && c.user_id === userId),
  );
  lsSet(`comments:${animeId}`, flat);
}

// ─── Discussion messages ──────────────────────────────────────────────────────
// Supabase migration: supabase.from("discussion_messages").select("*, profiles(*)")
// With realtime: supabase.channel("room:animeId").on("postgres_changes", ..., cb).subscribe()

export function getMessages(animeId: string): DiscussionMessage[] {
  return ls<DiscussionMessage[]>(`discuss:${animeId}`, []);
}

export function addMessage(
  animeId: string,
  userId: string,
  profile: UserProfile,
  body: string,
): DiscussionMessage {
  const msgs = getMessages(animeId);
  const msg: DiscussionMessage = {
    id: uid(),
    user_id: userId,
    anime_id: animeId,
    body,
    created_at: new Date().toISOString(),
    profile,
    reactions: [],
    user_reaction: null,
  };
  msgs.push(msg);
  lsSet(`discuss:${animeId}`, msgs);
  return msg;
}

// ─── Reactions (generic) ──────────────────────────────────────────────────────
// Supabase migration: supabase.from("reactions").upsert({ user_id, target_id, target_type, emoji })

type ReactTarget = "review" | "comment" | "message";

function reactKey(type: ReactTarget, id: string) {
  return `reactions:${type}:${id}`;
}

export function getUserReaction(type: ReactTarget, id: string, userId: string): string | null {
  const map = ls<Record<string, string>>(reactKey(type, id), {});
  return map[userId] ?? null;
}

export function getReactionSummary(type: ReactTarget, id: string): ReactionSummary[] {
  const map = ls<Record<string, string>>(reactKey(type, id), {});
  const counts: Record<string, number> = {};
  Object.values(map).forEach((emoji) => { counts[emoji] = (counts[emoji] ?? 0) + 1; });
  return Object.entries(counts)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count);
}

export function toggleReaction(
  type: ReactTarget,
  id: string,
  userId: string,
  emoji: string,
): { reactions: ReactionSummary[]; user_reaction: string | null } {
  const map = ls<Record<string, string>>(reactKey(type, id), {});
  if (map[userId] === emoji) {
    delete map[userId];
  } else {
    map[userId] = emoji;
  }
  lsSet(reactKey(type, id), map);
  return {
    reactions: getReactionSummary(type, id),
    user_reaction: map[userId] ?? null,
  };
}

// ─── Aggregate stats ──────────────────────────────────────────────────────────

export function getAnimeRatingStats(animeId: string): {
  average: number;
  total: number;
  distribution: number[];
} {
  const reviews = getReviews(animeId);
  if (!reviews.length) return { average: 0, total: 0, distribution: Array(10).fill(0) };
  const distribution = Array(10).fill(0);
  reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 10) distribution[r.rating - 1]++; });
  const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return { average: Math.round(average * 10) / 10, total: reviews.length, distribution };
}

// ─── Active rooms (anime with at least 1 message) ────────────────────────────

export interface RoomSummary {
  anime_id: string;
  anime_title: string;
  anime_image: string;
  message_count: number;
  last_active: string;
}

const ROOM_INDEX_KEY = "community:room_index";

export function upsertRoom(anime_id: string, anime_title: string, anime_image: string) {
  const rooms = ls<RoomSummary[]>(ROOM_INDEX_KEY, []);
  const i = rooms.findIndex((r) => r.anime_id === anime_id);
  const messages = getMessages(anime_id);
  const entry: RoomSummary = {
    anime_id,
    anime_title,
    anime_image,
    message_count: messages.length,
    last_active: new Date().toISOString(),
  };
  if (i >= 0) rooms[i] = entry;
  else rooms.unshift(entry);
  rooms.sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime());
  lsSet(ROOM_INDEX_KEY, rooms);
}

export function getRooms(): RoomSummary[] {
  return ls<RoomSummary[]>(ROOM_INDEX_KEY, []);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
