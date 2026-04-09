import { Composition } from "remotion";
import { DynamicAd } from "./DynamicAd";
import { NaqaaAdVideo } from "./NaqaaAd";
import { NaqaaV1PainPoint } from "./ads/NaqaaV1-PainPoint";
import { NaqaaV2ProductCarousel } from "./ads/NaqaaV2-ProductCarousel";
import { NaqaaV3BeforeAfter } from "./ads/NaqaaV3-BeforeAfter";
import { SharpifyV1PriceSlash } from "./ads/SharpifyV1-PriceSlash";
import { SharpifyV2BearPresenter } from "./ads/SharpifyV2-BearPresenter";
import { SharpifyV3CodingToSites } from "./ads/SharpifyV3-CodingToSites";
import type { VideoInputProps } from "./types/VideoConfig";
import { FORMAT_DIMENSIONS } from "./types/VideoConfig";

// Default props for the Naqaa Beauty dynamic ad (test/demo data)
const naqaaDefaultProps: VideoInputProps = {
  brand: {
    name: "Naqaa Beauty",
    colors: {
      primary: "#0097B2",
      secondary: "#B8960C",
      accent: "#B8960C",
      background: "#FFFFFF",
      text: "#1A1A2E",
      ctaBg: "#B8960C",
      ctaText: "#FFFFFF",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
    },
    tagline: "Dāvā savai ādai dabisku mirdzumu!",
    website: "https://www.naqaa-beauty.com",
  },
  scenes: [
    {
      type: "hook",
      headline: "Vai Tu zini, ko satur Tavs dušas ūdens?",
      subtext: "Hlors. Rūsa. Smagie metāli.",
      durationFrames: 90,
      transition: "fade",
    },
    {
      type: "product",
      headline: "4 aromāti. 1 misija.",
      productName: "Vitaminizētie dušas filtri",
      imagePath: "photos/all-filters.jpg",
      durationFrames: 90,
      transition: "slide-left",
    },
    {
      type: "benefits",
      headline: "Ko filtrs dod Tavai ādai?",
      items: [
        "Attīra no hlora un smagajiem metāliem",
        "Vitaminizē ūdeni ar C un E vitamīniem",
        "Aromterapijas efekts katrā dušā",
        "Maigāka āda un veselīgāki mati",
      ],
      durationFrames: 105,
      transition: "fade",
    },
    {
      type: "comparison",
      headline: "Sajūti atšķirību",
      beforeLabel: "Bez filtra",
      afterLabel: "Ar Naqaa",
      items: [
        "Sausa, jutīga āda",
        "Blāvi, nedzīvi mati",
        "Hlora smaka",
        "Mīksta, mirdzоša āda",
        "Spīdīgi, veselīgi mati",
        "Aromterapijas efekts",
      ],
      durationFrames: 105,
      transition: "slide-up",
    },
    {
      type: "cta",
      headline: "Dāvā savai ādai dabisku mirdzumu!",
      subtext: "No 24,99€",
      items: ["IEPIRKTIES TAGAD"],
      durationFrames: 75,
      transition: "fade",
    },
  ],
  format: "1:1",
  language: "lv",
};

// Calculate total duration from scenes
function getTotalFrames(props: VideoInputProps): number {
  return props.scenes.reduce((sum, s) => sum + s.durationFrames, 0);
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Dynamic Ad — Feed format (1:1) */}
      <Composition
        id="DynamicAd-Feed"
        component={DynamicAd}
        durationInFrames={getTotalFrames(naqaaDefaultProps)}
        fps={30}
        width={FORMAT_DIMENSIONS["1:1"].width}
        height={FORMAT_DIMENSIONS["1:1"].height}
        defaultProps={naqaaDefaultProps}
      />

      {/* Dynamic Ad — Reels format (9:16) */}
      <Composition
        id="DynamicAd-Reels"
        component={DynamicAd}
        durationInFrames={getTotalFrames(naqaaDefaultProps)}
        fps={30}
        width={FORMAT_DIMENSIONS["9:16"].width}
        height={FORMAT_DIMENSIONS["9:16"].height}
        defaultProps={{ ...naqaaDefaultProps, format: "9:16" }}
      />

      {/* --- Naqaa Beauty Custom Ads --- */}

      {/* V1: Dark cinematic pain-point ad */}
      <Composition
        id="Naqaa-V1-PainPoint"
        component={NaqaaV1PainPoint}
        durationInFrames={355}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V2: Light product carousel — each scent gets a moment */}
      <Composition
        id="Naqaa-V2-Carousel"
        component={NaqaaV2ProductCarousel}
        durationInFrames={485}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V3: Split-screen before/after transformation */}
      <Composition
        id="Naqaa-V3-BeforeAfter"
        component={NaqaaV3BeforeAfter}
        durationInFrames={295}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* --- Sharpify Ads --- */}

      {/* V1: Price slash — €300 → €59 dramatic reveal */}
      <Composition
        id="Sharpify-V1-PriceSlash"
        component={SharpifyV1PriceSlash}
        durationInFrames={345}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V2: Bear presenter — mascot guides through each scene */}
      <Composition
        id="Sharpify-V2-BearPresenter"
        component={SharpifyV2BearPresenter}
        durationInFrames={335}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V3: Bear codes → portfolio sites drop in → price slash */}
      <Composition
        id="Sharpify-V3-CodingToSites"
        component={SharpifyV3CodingToSites}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* Original NaqaaAd (legacy) */}
      <Composition
        id="NaqaaAd"
        component={NaqaaAdVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
