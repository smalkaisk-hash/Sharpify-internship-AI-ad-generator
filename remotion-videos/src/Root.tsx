import { Composition } from "remotion";
import { DynamicAd } from "./DynamicAd";
import { NaqaaAdVideo } from "./NaqaaAd";
import { NaqaaV1PainPoint } from "./ads/NaqaaV1-PainPoint";
import { NaqaaV2ProductCarousel } from "./ads/NaqaaV2-ProductCarousel";
import { NaqaaV3BeforeAfter } from "./ads/NaqaaV3-BeforeAfter";
import { NaqaaRealLifeV1 } from "./ads/NaqaaRealLifeV1-ProblemSolution";
import { NaqaaRealLifeV2 } from "./ads/NaqaaRealLifeV2-MorningRitual";
import { NaqaaRealLifeV3 } from "./ads/NaqaaRealLifeV3-FourScents";
import { SharpifyConstructionLV } from "./ads/SharpifyConstructionLV-FreeWebsite";
import { SharpifyConstructionLVv2 } from "./ads/SharpifyConstructionLV-V2-AIHook";
import { SharpifyConstructionLVv3 } from "./ads/SharpifyConstructionLV-V3-GoogleFail";
import { SharpifyConstructionLVv4 } from "./ads/SharpifyConstructionLV-V4-Calculator";
import { SharpifyConstructionLVv5 } from "./ads/SharpifyConstructionLV-V5-VsCompetitor";
import { SharpifyConstructionLVv6 } from "./ads/SharpifyConstructionLV-V6-AICrane";
import { TravelAdvantageLV } from "./ads/TravelAdvantageLV-V1-BookingVS";
import { SharpifyV1PriceSlash } from "./ads/SharpifyV1-PriceSlash";
import { SharpifyV2BearPresenter } from "./ads/SharpifyV2-BearPresenter";
import { SharpifyV3CodingToSites } from "./ads/SharpifyV3-CodingToSites";
import { SharpifyV4RealFootage } from "./ads/SharpifyV4-RealFootage";
import { SharpifyClip1Building } from "./ads/SharpifyClip1-Building";
import { SharpifyClip2Money } from "./ads/SharpifyClip2-Money";
import { SharpifyClip3Showcase } from "./ads/SharpifyClip3-Showcase";
import { SharpifyV5LostClient } from "./ads/SharpifyV5-LostClient";
import { SharpifyV6SpeedRun } from "./ads/SharpifyV6-SpeedRun";
import { SharpifyV7TrustBlitz } from "./ads/SharpifyV7-TrustBlitz";
import { SharpifyV8Objections } from "./ads/SharpifyV8-Objections";
import { SharpifyV9Calculator } from "./ads/SharpifyV9-Calculator";
import { AIToolkitV1TimeSaved } from "./ads/AIToolkitV1-TimeSaved";
import { AIToolkitV2OldVsNew } from "./ads/AIToolkitV2-OldVsNew";
import { AIToolkitV3AILevels } from "./ads/AIToolkitV3-AILevels";
import { AIToolkitV4Unboxing } from "./ads/AIToolkitV4-Unboxing";
import { AIToolkitV5Instructor } from "./ads/AIToolkitV5-Instructor";
import { AIToolkitV6DayInLife } from "./ads/AIToolkitV6-DayInLife";
import { AIToolkitV7MadeByAI } from "./ads/AIToolkitV7-MadeByAI";
import { AIToolkitV8StopLearning } from "./ads/AIToolkitV8-StopLearning";
import { AIToolkitV947Ads } from "./ads/AIToolkitV9-47Ads";
import { RihardsV17Days } from "./ads/RihardsV1-7Days";
import { RihardsV2CostOfDelay } from "./ads/RihardsV2-CostOfDelay";
import { RihardsV3WeMoveCrews } from "./ads/RihardsV3-WeMoveCrews";
import { AIToolkitProShowcase } from "./ads/AIToolkitProShowcase";
import { AIToolkitPro2TimeLoop } from "./ads/AIToolkitPro2-TimeLoop";
import { AIToolkitPro3LevelUp } from "./ads/AIToolkitPro3-LevelUp";
import { AIToolkitPro4FiveLevels } from "./ads/AIToolkitPro4-FiveLevels";
import { AIToolkitPro5Unboxing } from "./ads/AIToolkitPro5-Unboxing";
import { AIToolkitPro6Authority } from "./ads/AIToolkitPro6-Authority";
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

      {/* --- Naqaa Beauty Real-Life Ads (9:16 Reels, Pexels footage) --- */}

      {/* RL V1: Problem → Solution — dirty water macro → clean shower reveal */}
      <Composition
        id="Naqaa-RealLife-V1-ProblemSolution"
        component={NaqaaRealLifeV1}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* RL V2: Morning Ritual — sunrise bathroom → hair shine → soft CTA */}
      <Composition
        id="Naqaa-RealLife-V2-MorningRitual"
        component={NaqaaRealLifeV2}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* RL V3: 4 Aromāti — hero aromatic shower → 4 scent cards → CTA */}
      <Composition
        id="Naqaa-RealLife-V3-FourScents"
        component={NaqaaRealLifeV3}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* --- Sharpify Construction (LV) — €500k+ revenue = free website --- */}
      <Composition
        id="Sharpify-Construction-LV"
        component={SharpifyConstructionLV}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Same but AI-generated bulldozer hook instead of Pexels demolition */}
      <Composition
        id="Sharpify-Construction-LV-V2-AIHook"
        component={SharpifyConstructionLVv2}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* V3: Google search — competitors everywhere, TEVIS TUR NAV red stamp */}
      <Composition
        id="Sharpify-Construction-LV-V3-GoogleFail"
        component={SharpifyConstructionLVv3}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* V4: Calculator math — 50 × 30% × €3k = €45,000 lost/month */}
      <Composition
        id="Sharpify-Construction-LV-V4-Calculator"
        component={SharpifyConstructionLVv4}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* V5: Split-screen — Konkurents (has site, bookings) vs Tu (empty) */}
      <Composition
        id="Sharpify-Construction-LV-V5-VsCompetitor"
        component={SharpifyConstructionLVv5}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* V6: AI crane lifting giant iPhone over construction site (Veo 3) */}
      <Composition
        id="Sharpify-Construction-LV-V6-AICrane"
        component={SharpifyConstructionLVv6}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* --- Travel Advantage (LV) — Ineta K referral ads --- */}
      <Composition
        id="TravelAdvantage-LV-V1-BookingVS"
        component={TravelAdvantageLV}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
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

      {/* V4: Real footage composite — filmed clips with overlays */}
      <Composition
        id="Sharpify-V4-RealFootage"
        component={SharpifyV4RealFootage}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V8: Objection Killer — common excuses get smashed */}
      <Composition
        id="Sharpify-V8-Objections"
        component={SharpifyV8Objections}
        durationInFrames={345}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V9: Lost Revenue Calculator — math that hits hard */}
      <Composition
        id="Sharpify-V9-Calculator"
        component={SharpifyV9Calculator}
        durationInFrames={365}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* --- AI Toolkit Ads --- */}

      {/* V1: Time Saved Calculator — math that hits hard */}
      <Composition
        id="AIToolkit-V1-TimeSaved"
        component={AIToolkitV1TimeSaved}
        durationInFrames={410}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V2: Old vs New Workflow — terminal demo */}
      <Composition
        id="AIToolkit-V2-OldVsNew"
        component={AIToolkitV2OldVsNew}
        durationInFrames={430}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V3: 5 AI Levels — where are you, toolkit gets you to level 5 */}
      <Composition
        id="AIToolkit-V3-AILevels"
        component={AIToolkitV3AILevels}
        durationInFrames={410}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V4: Unboxing — what's inside + value stack */}
      <Composition
        id="AIToolkit-V4-Unboxing"
        component={AIToolkitV4Unboxing}
        durationInFrames={425}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V5: Instructor — who's teaching you matters */}
      <Composition
        id="AIToolkit-V5-Instructor"
        component={AIToolkitV5Instructor}
        durationInFrames={405}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V6: Day in the Life — split timeline transformation */}
      <Composition
        id="AIToolkit-V6-DayInLife"
        component={AIToolkitV6DayInLife}
        durationInFrames={410}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V7: Self-aware meta — "This ad was made by AI" */}
      <Composition
        id="AIToolkit-V7-MadeByAI"
        component={AIToolkitV7MadeByAI}
        durationInFrames={445}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V8: Hot take — "Stop learning AI, start using it" */}
      <Composition
        id="AIToolkit-V8-StopLearning"
        component={AIToolkitV8StopLearning}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V9: Curiosity — "47 ads in 1 hour" counter hook */}
      <Composition
        id="AIToolkit-V9-47Ads"
        component={AIToolkitV947Ads}
        durationInFrames={435}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* PRO SHOWCASE: AI Toolkit with full pro techniques */}
      <Composition
        id="AIToolkit-ProShowcase"
        component={AIToolkitProShowcase}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* PRO 2: Time Loop — daily grind breaks */}
      <Composition
        id="AIToolkit-Pro2-TimeLoop"
        component={AIToolkitPro2TimeLoop}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* PRO 3: Level Up — gaming aesthetic transformation */}
      <Composition
        id="AIToolkit-Pro3-LevelUp"
        component={AIToolkitPro3LevelUp}
        durationInFrames={380}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* PRO 4: 5 Levels infographic — uses real Sharpify chart */}
      <Composition
        id="AIToolkit-Pro4-FiveLevels"
        component={AIToolkitPro4FiveLevels}
        durationInFrames={400}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* PRO 5: Unboxing — uses real product mockup */}
      <Composition
        id="AIToolkit-Pro5-Unboxing"
        component={AIToolkitPro5Unboxing}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* PRO 6: Authority — uses workshop audience photo */}
      <Composition
        id="AIToolkit-Pro6-Authority"
        component={AIToolkitPro6Authority}
        durationInFrames={400}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* --- Rihards Client (EU Workforce Staffing) --- */}

      {/* V1: 7 Days Timeline — Day 1 call to Day 7 crew on site */}
      <Composition
        id="Rihards-V1-7Days"
        component={RihardsV17Days}
        durationInFrames={380}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V2: Cost of Delay — calculator showing €35,700 weekly cost */}
      <Composition
        id="Rihards-V2-CostOfDelay"
        component={RihardsV2CostOfDelay}
        durationInFrames={430}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V3: We Move Crews — cinematic brand video */}
      <Composition
        id="Rihards-V3-WeMoveCrews"
        component={RihardsV3WeMoveCrews}
        durationInFrames={410}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* --- Sharpify Real Footage (individual clips) --- */}

      {/* Clip 1: Screen recording of building a website */}
      <Composition
        id="Sharpify-Clip1-Building"
        component={SharpifyClip1Building}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* Clip 2: Hand holding €50 bill + price reveal */}
      <Composition
        id="Sharpify-Clip2-Money"
        component={SharpifyClip2Money}
        durationInFrames={280}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* Clip 3: Finished website showcase + social proof */}
      <Composition
        id="Sharpify-Clip3-Showcase"
        component={SharpifyClip3Showcase}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* --- Sharpify Original Concepts --- */}

      {/* V5: Lost Client — Google search pain point story */}
      <Composition
        id="Sharpify-V5-LostClient"
        component={SharpifyV5LostClient}
        durationInFrames={375}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V6: Speed Run — clock timer, 3-step process, "10 min" reveal */}
      <Composition
        id="Sharpify-V6-SpeedRun"
        component={SharpifyV6SpeedRun}
        durationInFrames={345}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* V7: Trust Blitz — numbers cascade, client results, media logos */}
      <Composition
        id="Sharpify-V7-TrustBlitz"
        component={SharpifyV7TrustBlitz}
        durationInFrames={345}
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
