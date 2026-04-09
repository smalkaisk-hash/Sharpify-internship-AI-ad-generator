import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface CaptionWord {
  text: string;
  startMs: number;
  endMs: number;
}

/**
 * Animated captions component — renders word-level captions synced to voiceover audio.
 * Only renders when captionWords are provided (voiceover pipeline produces these).
 *
 * To activate: generate voiceover with ElevenLabs → get word-level timing JSON → pass here.
 */
export const AnimatedCaptions: React.FC<{
  captionWords: CaptionWord[];
  style?: "bounce" | "fade" | "highlight";
  accentColor?: string;
  fontSize?: number;
}> = ({
  captionWords,
  style = "highlight",
  accentColor = "#B8960C",
  fontSize = 48,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!captionWords || captionWords.length === 0) return null;

  const currentTimeMs = (frame / fps) * 1000;

  // Group words into pages (~1 second windows)
  const pages: CaptionWord[][] = [];
  let currentPage: CaptionWord[] = [];
  let pageStartMs = captionWords[0]?.startMs || 0;

  for (const word of captionWords) {
    if (word.startMs - pageStartMs > 1200 && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [word];
      pageStartMs = word.startMs;
    } else {
      currentPage.push(word);
    }
  }
  if (currentPage.length > 0) pages.push(currentPage);

  // Find the active page
  const activePage = pages.find(
    (page) =>
      currentTimeMs >= page[0].startMs &&
      currentTimeMs <= page[page.length - 1].endMs + 300
  );

  if (!activePage) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.2em",
          maxWidth: 800,
          padding: "12px 24px",
          borderRadius: 12,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        {activePage.map((word, i) => {
          const isActive =
            currentTimeMs >= word.startMs && currentTimeMs <= word.endMs;
          const isPast = currentTimeMs > word.endMs;

          const wordProgress = spring({
            frame:
              frame - Math.round((word.startMs / 1000) * fps),
            fps,
            config: { damping: 200, stiffness: 100 },
          });

          return (
            <span
              key={`${word.startMs}-${i}`}
              style={{
                fontSize,
                fontWeight: isActive ? 800 : 600,
                color: isActive
                  ? accentColor
                  : isPast
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
                transform:
                  style === "bounce" && isActive
                    ? `scale(${1.15 * wordProgress})`
                    : undefined,
                textShadow: isActive
                  ? `0 0 20px ${accentColor}60`
                  : "0 2px 8px rgba(0,0,0,0.5)",
                transition: "color 0.1s, font-weight 0.1s",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
