import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface KineticCounterProps {
  value: number;
  startValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  useGrouping?: boolean;
  durationInFrames?: number;
  startFrame?: number;
  easingProfile?: "institutional" | "tactile" | "swiss" | "bloomberg" | "linear";
  fontSize?: number;
  color?: string;
  accentColor?: string;
  fontFamily?: string;
  subtitle?: string;
  subtitleColor?: string;
  badge?: string;
  badgeColor?: string;
  position?: "center" | "left" | "right";
  backgroundColor?: string;
}

export const KineticCounter: React.FC<KineticCounterProps> = ({
  value,
  startValue = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  useGrouping = true,
  durationInFrames = 36,
  startFrame = 0,
  easingProfile = "institutional",
  fontSize = 110,
  color = "#FFFFFF",
  accentColor = "#F59E0B",
  fontFamily = "Inter, system-ui, sans-serif",
  subtitle,
  subtitleColor = "#94A3B8",
  badge,
  badgeColor = "rgba(245, 158, 11, 0.15)",
  position = "center",
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Elapsed progress normalized between 0 and 1
  const elapsed = Math.max(0, Math.min(1, (frame - startFrame) / durationInFrames));

  // Custom deceleration profiles derived from forensic study
  let easeProgress = elapsed;
  if (easingProfile === "institutional") {
    // Niko Ludwig / Collateral Partners: cubic-bezier(0.12, 0.82, 0.18, 1.0)
    easeProgress = 1 - Math.pow(1 - elapsed, 3.8);
  } else if (easingProfile === "swiss") {
    // PolyMatter OutExpo: cubic-bezier(0.16, 1.0, 0.3, 1.0)
    easeProgress = 1 - Math.pow(1 - elapsed, 4.5);
  } else if (easingProfile === "tactile") {
    // Johnny Harris: Explosive launch (70% in first 20%), long settle
    if (elapsed < 0.22) {
      easeProgress = (elapsed / 0.22) * 0.72;
    } else {
      const subT = (elapsed - 0.22) / 0.78;
      easeProgress = 0.72 + (1 - Math.pow(1 - subT, 2.8)) * 0.28;
    }
  } else if (easingProfile === "bloomberg") {
    // Economics Explained: Smooth cinematic ease
    easeProgress = 0.5 * (1 - Math.cos(Math.PI * elapsed));
  }

  // Current interpolated numeric value
  const currentValue = startValue + (value - startValue) * easeProgress;

  // Format string with exact decimals and thousand separators
  let formattedNumber = currentValue.toFixed(decimals);
  if (useGrouping) {
    const parts = formattedNumber.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formattedNumber = parts.join(".");
  }

  // Entrance spring for card container
  const cardEntrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.9 },
  });

  // Delayed subtitle fade
  const subtitleOpacity = interpolate(
    frame - (startFrame + durationInFrames * 0.4),
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const alignmentStyle: React.CSSProperties =
    position === "center"
      ? { justifyContent: "center", alignItems: "center", textAlign: "center" }
      : position === "left"
      ? { justifyContent: "center", alignItems: "flex-start", paddingLeft: 120, textAlign: "left" }
      : { justifyContent: "center", alignItems: "flex-end", paddingRight: 120, textAlign: "right" };

  return (
    <AbsoluteFill
      style={{
        ...alignmentStyle,
        backgroundColor: backgroundColor || "transparent",
      }}
    >
      <div
        style={{
          transform: `scale(${interpolate(cardEntrance, [0, 1], [0.92, 1])})`,
          opacity: cardEntrance,
        }}
      >
        {/* Optional Badge pill */}
        {badge && (
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              backgroundColor: badgeColor,
              color: accentColor,
              fontSize: 16,
              fontWeight: 600,
              fontFamily,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
              border: `1px solid ${accentColor}40`,
            }}
          >
            {badge}
          </div>
        )}

        {/* Primary Metric Line with Static Spatial Anchors */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: position === "center" ? "center" : position === "left" ? "flex-start" : "flex-end",
            fontFamily,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {/* Static Prefix (Never jitters) */}
          {prefix && (
            <span
              style={{
                fontSize: fontSize * 0.75,
                color: accentColor,
                marginRight: 6,
                fontWeight: 700,
              }}
            >
              {prefix}
            </span>
          )}

          {/* Rolling Numeric Glyphs */}
          <span
            style={{
              fontSize,
              color,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formattedNumber}
          </span>

          {/* Static Suffix */}
          {suffix && (
            <span
              style={{
                fontSize: fontSize * 0.65,
                color: accentColor,
                marginLeft: 10,
                fontWeight: 700,
              }}
            >
              {suffix}
            </span>
          )}
        </div>

        {/* Subtitle / Narrative Underwriting Context */}
        {subtitle && (
          <div
            style={{
              marginTop: 20,
              opacity: subtitleOpacity,
              fontSize: Math.max(20, fontSize * 0.28),
              color: subtitleColor,
              fontFamily,
              fontWeight: 400,
              maxWidth: 720,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
