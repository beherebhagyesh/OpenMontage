import React from "react";
import { AbsoluteFill, Series } from "remotion";
import {
  KineticCounter,
  WaffleMatrix,
  DivergenceRatio,
  ProportionGauge,
} from "./components";

export const DataMotionShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Series>
        {/* Scene 1: Niko Ludwig - $2.9T GDP Kinetic Counter (90 frames / 3 seconds) */}
        <Series.Sequence durationInFrames={90}>
          <KineticCounter
            value={2.9}
            startValue={0.0}
            prefix="$"
            suffix="Trillion"
            decimals={1}
            durationInFrames={36}
            startFrame={5}
            easingProfile="institutional"
            fontSize={120}
            color="#0E382B"
            accentColor="#C59B27"
            fontFamily="Cinzel, Playfair Display, Georgia, serif"
            badge="Preliminary 2025 GDP"
            badgeColor="rgba(197, 155, 39, 0.15)"
            subtitle="Texas economic output measured against every other sovereign nation on Earth"
            subtitleColor="rgba(27, 27, 27, 0.7)"
            backgroundColor="#F4F1EA"
          />
        </Series.Sequence>

        {/* Scene 2: Niko Ludwig - 314 Headquarters Relocated Waffle Matrix (100 frames) */}
        <Series.Sequence durationInFrames={100}>
          <WaffleMatrix
            totalDots={314}
            columns={20}
            activeCount={314}
            dotSize={16}
            gap={8}
            title="Corporate Headquarters Relocated"
            subtitle="Representing $2.8 Trillion in Combined Annual Revenue Since 2010"
            badge="Institutional Migration"
            activeColor="#0E382B"
            accentColor="#C59B27"
            backgroundColor="#F4F1EA"
            durationInFrames={48}
            startFrame={6}
          />
        </Series.Sequence>

        {/* Scene 3: Johnny Harris - 2.6x to 6.5x Housing Multiplier (100 frames) */}
        <Series.Sequence durationInFrames={100}>
          <DivergenceRatio
            title="Median Home Price to Income Multiple"
            subtitle="The Scissor Divergence: Housing Detaching From Worker Earnings"
            baselineYear="1955"
            baselineMultiplier={2.6}
            currentYear="2025"
            currentMultiplier={6.5}
            highlighterNotice="MATHEMATICALLY DETACHED FROM WAGES"
            backgroundColor="#EFECE6"
            durationInFrames={45}
            startFrame={6}
          />
        </Series.Sequence>

        {/* Scene 4: PolyMatter - 70% Real Estate Household Wealth Gauge (100 frames) */}
        <Series.Sequence durationInFrames={100}>
          <ProportionGauge
            percentage={70}
            label="Residential Real Estate"
            baselineLabel="Stocks, Pensions & Liquid Assets (30%)"
            title="Household Wealth Allocation in China"
            subtitle="Extreme asset overexposure compared to 30% international average"
            accentColor="#F59E0B"
            secondaryColor="#334155"
            backgroundColor="#131B2A"
            cardColor="#1E293B"
            durationInFrames={44}
            startFrame={6}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
