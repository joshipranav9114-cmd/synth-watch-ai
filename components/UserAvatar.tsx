import { useState } from "react";
import {
  AVATAR_COLORS,
  AVATAR_EMOJIS,
  type AvatarColor,
  type AvatarEmoji,
  type UserProfile,
  saveProfile,
} from "@/lib/community";

interface UserAvatarProps {
  profile: UserProfile;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onUpdate?: (profile: UserProfile) => void;
}

const SIZE_CLASSES = {
  sm:  "h-8 w-8 text-sm",
  md:  "h-10 w-10 text-base",
  lg:  "h-14 w-14 text-2xl",
  xl:  "h-24 w-24 text-4xl",
};

export function UserAvatar({ profile, size = "md", editable = false, onUpdate }: UserAvatarProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  const gradient = AVATAR_COLORS[profile.avatar_color] ?? AVATAR_COLORS.purple;
  const sizeClass = SIZE_CLASSES[size];

  const handleSave = () => {
    saveProfile(draft);
    onUpdate?.(draft);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => editable && setOpen(true)}
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} ${sizeClass} ${editable ? "ring-2 ring-offset-2 ring-offset-background ring-primary/40 hover:ring-primary transition-all" : ""} flex-shrink-0`}
        aria-label={editable ? "Edit avatar" : profile.display_name}
      >
        <span>{profile.avatar_emoji}</span>
        {editable && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
            ✎
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-md rounded-t-3xl bg-card p-6 pb-10 animate-fade-up">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Edit Avatar</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full glass px-3 py-1 text-xs text-muted-foreground"
              >
                Cancel
              </button>
            </div>

            {/* Preview */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[draft.avatar_color]} text-4xl`}
              >
                {draft.avatar_emoji}
              </div>
              <input
                value={draft.display_name}
                onChange={(e) => setDraft({ ...draft, display_name: e.target.value })}
                maxLength={24}
                className="mt-1 rounded-xl glass px-3 py-2 text-center text-sm font-bold text-foreground outline-none"
                placeholder="Display name"
              />
            </div>

            {/* Emoji grid */}
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Pick your spirit
            </p>
            <div className="mb-4 grid grid-cols-8 gap-2">
              {AVATAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setDraft({ ...draft, avatar_emoji: emoji as AvatarEmoji })}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                    draft.avatar_emoji === emoji
                      ? "bg-primary/30 ring-2 ring-primary scale-110"
                      : "glass hover:scale-105"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Color grid */}
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Aura color
            </p>
            <div className="mb-6 flex gap-3">
              {(Object.keys(AVATAR_COLORS) as AvatarColor[]).map((color) => (
                <button
                  key={color}
                  onClick={() => setDraft({ ...draft, avatar_color: color })}
                  className={`h-8 w-8 rounded-full bg-gradient-to-br ${AVATAR_COLORS[color]} transition-all ${
                    draft.avatar_color === color ? "scale-125 ring-2 ring-white/60" : "opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleSave}
              className="w-full rounded-2xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-extrabold uppercase tracking-widest text-primary-foreground"
            >
              Save Avatar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
