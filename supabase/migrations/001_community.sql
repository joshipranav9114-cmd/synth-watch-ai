-- ============================================================
-- AniVerse Community Feature — Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Extend profiles table with avatar fields
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_emoji  text DEFAULT '⭐',
  ADD COLUMN IF NOT EXISTS avatar_color  text DEFAULT 'purple';

-- 2. Anime reviews
CREATE TABLE IF NOT EXISTS anime_reviews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id     text NOT NULL,
  anime_title  text NOT NULL,
  rating       smallint NOT NULL CHECK (rating BETWEEN 1 AND 10),
  body         text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, anime_id)   -- one review per user per anime
);

-- 3. Anime comments (supports one level of threading via parent_id)
CREATE TABLE IF NOT EXISTS anime_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id    text NOT NULL,
  body        text NOT NULL,
  parent_id   uuid REFERENCES anime_comments(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4. Discussion room messages (live chat per anime)
CREATE TABLE IF NOT EXISTS discussion_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id    text NOT NULL,
  body        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 5. Reactions (polymorphic — covers reviews, comments, messages)
CREATE TABLE IF NOT EXISTS reactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id    uuid NOT NULL,
  target_type  text NOT NULL CHECK (target_type IN ('review', 'comment', 'message')),
  emoji        text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_id, target_type)  -- one reaction per user per target
);

-- ── Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_reviews_anime_id     ON anime_reviews(anime_id);
CREATE INDEX IF NOT EXISTS idx_comments_anime_id    ON anime_comments(anime_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id   ON anime_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_messages_anime_id    ON discussion_messages(anime_id);
CREATE INDEX IF NOT EXISTS idx_reactions_target     ON reactions(target_id, target_type);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE anime_reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE anime_comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions            ENABLE ROW LEVEL SECURITY;

-- Reviews: anyone can read; only owner can insert/update/delete
CREATE POLICY "reviews_select"  ON anime_reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert"  ON anime_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update"  ON anime_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete"  ON anime_reviews FOR DELETE USING (auth.uid() = user_id);

-- Comments: same pattern
CREATE POLICY "comments_select" ON anime_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON anime_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON anime_comments FOR DELETE USING (auth.uid() = user_id);

-- Messages: anyone can read; authenticated users can insert; only owner deletes
CREATE POLICY "messages_select" ON discussion_messages FOR SELECT USING (true);
CREATE POLICY "messages_insert" ON discussion_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "messages_delete" ON discussion_messages FOR DELETE USING (auth.uid() = user_id);

-- Reactions: anyone reads; authenticated upsert own; delete own
CREATE POLICY "reactions_select" ON reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_update" ON reactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reactions_delete" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- ── Realtime (discussion rooms) ───────────────────────────────
-- Enable realtime on discussion_messages so the chat updates live.
-- Run in Supabase Dashboard → Database → Replication → Tables → enable discussion_messages

-- ── Helper: updated_at trigger for reviews ───────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reviews_updated_at ON anime_reviews;
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON anime_reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
