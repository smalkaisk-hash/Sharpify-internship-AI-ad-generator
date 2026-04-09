import { z } from "zod";

// --- Scene types ---

export const SceneConfigSchema = z.object({
  type: z.enum([
    "hook",
    "product",
    "benefits",
    "cta",
    "testimonial",
    "stats",
    "comparison",
  ]),
  headline: z.string(),
  subtext: z.string().optional(),
  imagePath: z.string().optional(),
  items: z.array(z.string()).optional(),
  price: z.string().optional(),
  productName: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  beforeLabel: z.string().optional(),
  afterLabel: z.string().optional(),
  durationFrames: z.number().default(90),
  transition: z
    .enum(["fade", "slide-left", "slide-up", "wipe", "none"])
    .default("fade"),
});

export type SceneConfig = z.infer<typeof SceneConfigSchema>;

// --- Brand config ---

export const BrandConfigSchema = z.object({
  name: z.string(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string(),
    ctaBg: z.string(),
    ctaText: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  logoPath: z.string().optional(),
  tagline: z.string().optional(),
  website: z.string().optional(),
});

export type BrandConfig = z.infer<typeof BrandConfigSchema>;

// --- Main video input props ---

export const VideoInputPropsSchema = z.object({
  brand: BrandConfigSchema,
  scenes: z.array(SceneConfigSchema),
  format: z.enum(["9:16", "1:1", "4:5"]).default("1:1"),
  language: z.string().default("lv"),
});

export type VideoInputProps = z.infer<typeof VideoInputPropsSchema>;

// --- Format dimensions ---

export const FORMAT_DIMENSIONS = {
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
} as const;
