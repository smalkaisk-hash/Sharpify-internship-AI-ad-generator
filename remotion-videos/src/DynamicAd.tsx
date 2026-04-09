import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type {
  VideoInputProps,
  SceneConfig,
  BrandConfig,
} from "./types/VideoConfig";
import { SceneHook } from "./components/scenes/SceneHook";
import { SceneProduct } from "./components/scenes/SceneProduct";
import { SceneBenefits } from "./components/scenes/SceneBenefits";
import { SceneCTA } from "./components/scenes/SceneCTA";
import { SceneTestimonial } from "./components/scenes/SceneTestimonial";
import { SceneStats } from "./components/scenes/SceneStats";
import { SceneComparison } from "./components/scenes/SceneComparison";

const TRANSITION_FRAMES = 12;

const SCENE_COMPONENTS: Record<
  SceneConfig["type"],
  React.FC<{
    scene: SceneConfig;
    brand: BrandConfig;
    format: "9:16" | "1:1" | "4:5";
  }>
> = {
  hook: SceneHook,
  product: SceneProduct,
  benefits: SceneBenefits,
  cta: SceneCTA,
  testimonial: SceneTestimonial,
  stats: SceneStats,
  comparison: SceneComparison,
};

function getPresentation(type: SceneConfig["transition"]) {
  switch (type) {
    case "slide-left":
      return slide({ direction: "from-right" });
    case "slide-up":
      return slide({ direction: "from-bottom" });
    case "wipe":
      return wipe({ direction: "from-left" });
    case "fade":
    default:
      return fade();
  }
}

export const DynamicAd: React.FC<VideoInputProps> = ({
  brand,
  scenes,
  format = "1:1",
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {scenes.map((scene, i) => {
          const SceneComponent = SCENE_COMPONENTS[scene.type];
          const transition = scene.transition || "fade";
          const elements: React.ReactNode[] = [];

          // Add transition before every scene except the first
          if (i > 0 && transition !== "none") {
            elements.push(
              <TransitionSeries.Transition
                key={`t-${i}`}
                presentation={getPresentation(transition)}
                timing={linearTiming({
                  durationInFrames: TRANSITION_FRAMES,
                })}
              />
            );
          }

          elements.push(
            <TransitionSeries.Sequence
              key={`s-${i}`}
              durationInFrames={scene.durationFrames}
            >
              <SceneComponent scene={scene} brand={brand} format={format} />
            </TransitionSeries.Sequence>
          );

          return elements;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
