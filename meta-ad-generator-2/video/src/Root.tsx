import { Composition } from 'remotion';
import { SolarAd } from './SolarAd';
import { TilerAd } from './TilerAd';
import { VeoPreview } from './VeoPreview';
import { FallHookAd } from './FallHookAd';
import { ClickPreview } from './ClickPreview';

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 14 * FPS; // 420

export const Root: React.FC = () => (
  <>
    <Composition
      id="SolarAd"
      component={SolarAd}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="TilerAd"
      component={TilerAd}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="FallHookAd"
      component={FallHookAd}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="ClickPreview"
      component={ClickPreview}
      durationInFrames={420}
      fps={FPS}
      width={1440}
      height={900}
    />
    <Composition
      id="VeoPreview"
      component={VeoPreview}
      durationInFrames={240}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
