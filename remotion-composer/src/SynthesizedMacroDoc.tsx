import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Audio,
  staticFile,
} from "remotion";
import {
  KineticCounter,
  WaffleMatrix,
  DivergenceRatio,
  ProportionGauge,
  CalloutBox,
  StatCard,
  HeroTitle,
} from "./components";

// Subtitle sentences from narration.vtt
const SUBTITLES = [
  {
    start: 0,
    end: 233,
    text: "Between 2020 and 2026, global enterprise capital did something it has never done in economic history.",
    highlightWords: ["2020", "2026", "global", "enterprise", "capital", "history"],
  },
  {
    start: 233,
    end: 513,
    text: "Instead of expanding human payroll, 420 of the Fortune 500 quietly re-engineered their operational core into autonomous execution engines.",
    highlightWords: ["payroll,", "420", "Fortune", "500", "autonomous", "execution", "engines."],
  },
  {
    start: 513,
    end: 863,
    text: "This created what economists call The Scissor: while legacy service companies stayed trapped at a 1.3x revenue multiple, automated operations blew out to 5.8x earnings.",
    highlightWords: ["The", "Scissor:", "1.3x", "multiple,", "5.8x", "earnings."],
  },
  {
    start: 863,
    end: 987,
    text: "In the old economy, scaling meant hiring more people.",
    highlightWords: ["old", "economy,", "hiring", "more", "people."],
  },
  {
    start: 987,
    end: 1239,
    text: "In the new economy, scaling means running an engine that does not sleep, does not forget, and compounds with every single iteration.",
    highlightWords: ["new", "economy,", "engine", "compounds", "iteration."],
  },
  {
    start: 1239,
    end: 1349,
    text: "The question is not whether your industry gets automated.",
    highlightWords: ["automated."],
  },
  {
    start: 1349,
    end: 1500,
    text: "The question is whether you own the engine, or work for the firm that does.",
    highlightWords: ["own", "the", "engine,", "firm", "that", "does."],
  },
];

// Document Dossier Corner Marks & Coordinates Header
const DossierOverlay: React.FC<{
  title: string;
  reportCode: string;
  theme?: "light" | "dark";
}> = ({ title, reportCode, theme = "light" }) => {
  const isDark = theme === "dark";
  const fgColor = isDark ? "rgba(226, 232, 240, 0.75)" : "rgba(27, 27, 27, 0.75)";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)";
  const accentColor = isDark ? "#38BDF8" : "#C59B27";

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 48,
        right: 48,
        bottom: 24,
        pointerEvents: "none",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${borderColor}`,
          paddingBottom: 12,
          fontFamily: "Courier, monospace",
          fontSize: 13,
          letterSpacing: "0.15em",
          color: fgColor,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              backgroundColor: accentColor,
              borderRadius: "50%",
            }}
          />
          <span style={{ fontWeight: 700, color: accentColor }}>
            FAR-EVER-REACH MACRO REPORT
          </span>
          <span>// {reportCode}</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <span>LAT 30°16'N LON 97°44'W</span>
          <span style={{ color: accentColor, fontWeight: 700 }}>
            CLASSIFIED: UNRESTRICTED
          </span>
        </div>
      </div>

      {/* Corner crosshairs */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          color: accentColor,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        +
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          color: accentColor,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        +
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          color: accentColor,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        +
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          color: accentColor,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        +
      </div>

      {/* Bottom Footer Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${borderColor}`,
          paddingTop: 10,
          fontFamily: "Courier, monospace",
          fontSize: 12,
          letterSpacing: "0.12em",
          color: fgColor,
        }}
      >
        <span>SUBJECT: {title}</span>
        <span>VERIFIED QUANTITATIVE SYNTHESIS // Q4 2026</span>
      </div>
    </div>
  );
};

// Global Synced Subtitles Overlay
const GlobalSubtitles: React.FC = () => {
  const frame = useCurrentFrame();

  const activeSub = SUBTITLES.find(
    (s) => frame >= s.start && frame < s.end
  );

  if (!activeSub) return null;

  const words = activeSub.text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 56,
        zIndex: 90,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 100px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(18, 16, 14, 0.90)",
          backdropFilter: "blur(12px)",
          padding: "14px 32px",
          borderRadius: 8,
          border: "1px solid rgba(197, 155, 39, 0.35)",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
          textAlign: "center",
          maxWidth: 1360,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#F4F1EA",
            letterSpacing: "-0.01em",
          }}
        >
          {words.map((w, idx) => {
            const clean = w.replace(/[^a-zA-Z0-9]/g, "");
            const isHighlight = activeSub.highlightWords.some(
              (hw) => hw.replace(/[^a-zA-Z0-9]/g, "") === clean
            );
            return (
              <span
                key={idx}
                style={{
                  color: isHighlight ? "#F59E0B" : "#F4F1EA",
                  marginRight: 7,
                  display: "inline-block",
                  textShadow: isHighlight
                    ? "0 0 12px rgba(245, 158, 11, 0.45)"
                    : "none",
                }}
              >
                {w}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};

// Scene 4: Dual Compounding Curves (PolyMatter + Economics Explained)
const DualCompoundingCurves: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [10, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate curve points
  const pointsLinear: string[] = [];
  const pointsExponential: string[] = [];

  const width = 800;
  const height = 400;

  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * width;
    // Linear human curve plateaus
    const yLin = height - (Math.min(i, 45) / 45) * 140;
    pointsLinear.push(`${x},${yLin}`);

    // Exponential automated curve explodes
    const tNorm = i / 100;
    const yExp = height - Math.pow(tNorm, 2.4) * 360;
    pointsExponential.push(`${x},${yExp}`);
  }

  const dLinear = `M ${pointsLinear.join(" L ")}`;
  const dExponential = `M ${pointsExponential.join(" L ")}`;

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 170,
        width: 840,
        height: 520,
        backgroundColor: "rgba(30, 41, 59, 0.7)",
        borderRadius: 16,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: 32,
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <span
            style={{
              fontSize: 13,
              fontFamily: "Courier, monospace",
              color: "#38BDF8",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            MACRO DYNAMICS MODEL
          </span>
          <h3
            style={{
              margin: "6px 0 0 0",
              fontSize: 24,
              color: "#FFFFFF",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
            }}
          >
            Operating Leverage Divergence
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
            <span style={{ width: 12, height: 3, backgroundColor: "#EF4444" }} />
            <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
              Human Payroll (Linear Limit)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <span style={{ width: 12, height: 3, backgroundColor: "#F59E0B" }} />
            <span style={{ fontSize: 13, color: "#F59E0B", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              Software Engine (Compounding)
            </span>
          </div>
        </div>
      </div>

      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {/* Grid lines */}
        {[0, 100, 200, 300, 400].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Linear Line */}
        <path
          d={dLinear}
          fill="none"
          stroke="#EF4444"
          strokeWidth={3}
          strokeDasharray="6 6"
          opacity={0.85}
        />

        {/* Exponential Curve with Dashoffset reveal */}
        <path
          d={dExponential}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={5}
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - progress)}
          style={{
            filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))",
          }}
        />
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
          fontSize: 12,
          fontFamily: "Courier, monospace",
          color: "#64748B",
        }}
      >
        <span>T0: LINEAR ONBOARDING</span>
        <span>T+18 MO: INFLECTION POINT</span>
        <span>T+36 MO: ASYMPTOTIC SPLIT</span>
      </div>
    </div>
  );
};

// Scene 5: FarEverReach Studio Thesis Lock Climax
const StudioThesisLock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, 100], [0.96, 1.0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F4EFE4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          border: "2px solid #C59B27",
          backgroundColor: "#FAF7F0",
          borderRadius: 20,
          padding: "64px 80px",
          maxWidth: 1300,
          width: "100%",
          boxShadow: "0 32px 80px rgba(27, 27, 27, 0.12)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Institutional Stamp */}
        <div
          style={{
            display: "inline-block",
            padding: "8px 24px",
            backgroundColor: "rgba(14, 56, 43, 0.08)",
            border: "1px solid #0E382B",
            borderRadius: 4,
            fontFamily: "Courier, monospace",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#0E382B",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          STRATEGIC CONCLUSION // MANDATE 2026
        </div>

        <h1
          style={{
            fontFamily: "Cinzel, Georgia, serif",
            fontSize: 68,
            fontWeight: 800,
            color: "#0E382B",
            margin: "0 0 24px 0",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          You don’t compete by working more hours.
        </h1>

        <p
          style={{
            fontFamily: "Cinzel, Georgia, serif",
            fontSize: 48,
            fontWeight: 700,
            color: "#C59B27",
            margin: "0 0 40px 0",
            lineHeight: 1.25,
          }}
        >
          You compete by owning the execution engine.
        </p>

        {/* Decorative Divider */}
        <div
          style={{
            width: 240,
            height: 2,
            backgroundColor: "#0E382B",
            margin: "0 auto 40px auto",
            opacity: 0.3,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 32,
            fontFamily: "Courier, monospace",
            fontSize: 16,
            letterSpacing: "0.15em",
            color: "rgba(27, 27, 27, 0.7)",
          }}
        >
          <span>FAREVERREACH STUDIO</span>
          <span>•</span>
          <span>AUTONOMOUS MEDIA INTELLIGENCE</span>
          <span>•</span>
          <span>PRODUCTION BLUEPRINT 2026</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export interface DynamicBeat {
  beat_id: string;
  start_sec: number;
  end_sec: number;
  duration_sec: number;
  visual_type: string;
  camera_directive?: string;
  component_name?: string;
  props?: Record<string, any>;
  spoken_dialogue?: string;
  sfx_type?: string;
}

export interface SynthesizedMacroDocProps {
  beats?: DynamicBeat[];
  tasteProfile?: Record<string, any>;
  title?: string;
  reportCode?: string;
}

// MASTER COMPOSITION: SynthesizedMacroDoc
export const SynthesizedMacroDoc: React.FC<SynthesizedMacroDocProps> = (props) => {
  // If dynamic beats are passed via --props, render them dynamically
  if (props.beats && props.beats.length > 0) {
    const paperColor = props.tasteProfile?.visual_grammar?.paper_color || "#F4F1EA";
    const primaryColor = props.tasteProfile?.visual_grammar?.primary_color || "#131B2A";
    const accentColor = props.tasteProfile?.visual_grammar?.accent_color || "#C59B27";
    const inkColor = props.tasteProfile?.visual_grammar?.ink_color || "#1D1B16";

    return (
      <AbsoluteFill style={{ backgroundColor: paperColor }}>
        {props.beats.map((beat, idx) => {
          const fromFrame = Math.round(beat.start_sec * 30);
          const durFrames = Math.max(1, Math.round(beat.duration_sec * 30));
          const triggerFrame = beat.props?.trigger_frames?.primary_metric || 10;
          const isDark = beat.visual_type === "proportion_gauge" || primaryColor === "#0A0A0A";

          return (
            <Sequence key={beat.beat_id || idx} from={fromFrame} durationInFrames={durFrames}>
              <DossierOverlay
                title={props.title || "Macro Intelligence Analysis"}
                reportCode={`BEAT-${String(idx + 1).padStart(2, "0")}`}
                theme={isDark ? "dark" : "light"}
              />

              {/* 1. Kinetic Typography & Kinetic Counter */}
              {(beat.visual_type === "kinetic_counter" || beat.visual_type === "kinetic_typography") && (
                <KineticCounter
                  value={beat.props?.to || 4.2}
                  startValue={beat.props?.from || 0.0}
                  prefix={beat.props?.prefix || "$"}
                  suffix={beat.props?.suffix || " Trillion"}
                  decimals={beat.props?.decimals ?? 1}
                  durationInFrames={Math.min(durFrames - 10, 54)}
                  startFrame={triggerFrame}
                  fontSize={120}
                  color={beat.props?.inkColor || inkColor}
                  accentColor={beat.props?.accentColor || accentColor}
                  badge={beat.props?.label || "VERIFIED FORENSIC DATA"}
                  subtitle={beat.spoken_dialogue}
                  backgroundColor={beat.props?.paperColor || paperColor}
                />
              )}

              {/* 2. Enterprise Adoption Waffle Matrix */}
              {beat.visual_type === "waffle_matrix" && (
                <div style={{ transform: "translateY(-28px)" }}>
                  <WaffleMatrix
                    totalDots={beat.props?.totalDots || 500}
                    columns={25}
                    activeCount={beat.props?.highlightedDots || 420}
                    dotSize={15}
                    gap={7}
                    title={beat.props?.label || "Enterprise Adoption Distribution"}
                    subtitle={beat.spoken_dialogue || "Empirical Corporate Modernization Saturation"}
                    badge="SYSTEMIC MIGRATION CENSUS"
                    activeColor={beat.props?.inkColor || inkColor}
                    accentColor={beat.props?.accentColor || accentColor}
                    backgroundColor={beat.props?.paperColor || paperColor}
                    durationInFrames={Math.min(durFrames - 10, 65)}
                    startFrame={triggerFrame}
                  />
                </div>
              )}

              {/* 3. Divergence Ratio & Chart Animation */}
              {(beat.visual_type === "divergence_ratio" || beat.visual_type === "chart_animation") && (
                <div style={{ transform: "translateY(-28px)" }}>
                  <DivergenceRatio
                    title="The Operational Scissor Divergence"
                    subtitle={beat.spoken_dialogue || "Legacy Headcount Multiple vs Autonomous Software Leverage"}
                    baselineYear={beat.props?.lowerLabel || "LEGACY AGENCY"}
                    baselineMultiplier={beat.props?.lowerValue || 1.3}
                    currentYear={beat.props?.upperLabel || "EXECUTION ENGINE"}
                    currentMultiplier={beat.props?.upperValue || 5.8}
                    highlighterNotice="4.5X OPERATIONAL SCISSOR GAP"
                    backgroundColor={beat.props?.paperColor || "#EFECE6"}
                    durationInFrames={Math.min(durFrames - 10, 55)}
                    startFrame={triggerFrame}
                  />
                </div>
              )}

              {/* 4. Proportion Gauge */}
              {beat.visual_type === "proportion_gauge" && (
                <AbsoluteFill style={{ backgroundColor: "#131B2A", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: 880, height: 560 }}>
                    <ProportionGauge
                      percentage={beat.props?.percentage || 78}
                      label={beat.props?.label || "Operating Margin Advantage"}
                      baselineLabel="Legacy Baseline: 22%"
                      title="Autonomous Leverage Model"
                      subtitle={beat.spoken_dialogue || "Gross margin surplus unlocked through autonomous software"}
                      accentColor={beat.props?.accentColor || "#F59E0B"}
                      secondaryColor="#334155"
                      backgroundColor="rgba(30, 41, 59, 0.7)"
                      cardColor="#1E293B"
                      durationInFrames={Math.min(durFrames - 10, 60)}
                      startFrame={triggerFrame}
                    />
                  </div>
                </AbsoluteFill>
              )}

              {/* 5. Bento Stat Grid */}
              {beat.visual_type === "bento_stat_grid" && (
                <StatCard
                  stat={beat.props?.stat || "$4.2T"}
                  subtitle={beat.spoken_dialogue || beat.props?.label || "Institutional Capital Reallocation"}
                  color={beat.props?.inkColor || inkColor}
                  accentColor={beat.props?.accentColor || accentColor}
                  backgroundColor={beat.props?.paperColor || paperColor}
                />
              )}

              {/* 6. Evidence Callout */}
              {beat.visual_type === "evidence_callout" && (
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
                  <CalloutBox
                    type="quote"
                    title={beat.props?.citation_title || "Verified Claim"}
                    text={beat.spoken_dialogue || beat.props?.mandate || ""}
                    borderColor={beat.props?.accentColor || accentColor}
                    backgroundColor={beat.props?.paperColor || "#F9FAFB"}
                    textColor={beat.props?.inkColor || inkColor}
                  />
                </AbsoluteFill>
              )}

              {/* 7. Fallback / Closing Slate */}
              {(beat.visual_type === "broll_slate" || (!["kinetic_counter", "kinetic_typography", "waffle_matrix", "divergence_ratio", "chart_animation", "proportion_gauge", "bento_stat_grid", "evidence_callout"].includes(beat.visual_type))) && (
                <StudioThesisLock />
              )}

              {/* Dynamic Spoken Dialogue Captions */}
              {beat.spoken_dialogue && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 48,
                    zIndex: 90,
                    display: "flex",
                    justifyContent: "center",
                    pointerEvents: "none",
                    padding: "0 80px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgba(18, 16, 14, 0.88)",
                      backdropFilter: "blur(12px)",
                      padding: "12px 28px",
                      borderRadius: 8,
                      border: "1px solid rgba(197, 155, 39, 0.35)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      maxWidth: 1300,
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "Space Grotesk, Inter, sans-serif",
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#F4F1EA",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {beat.spoken_dialogue}
                    </p>
                  </div>
                </div>
              )}
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  }

  // Fallback to default canonical showcase if no custom beats provided
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Master Mixed Soundtrack (Voice + Ducked Music) */}
      <Audio src={staticFile("audio/master_mix.mp3")} volume={1.0} />

      {/* Global Synced Subtitles */}
      <GlobalSubtitles />

      {/* ========================================================
          SCENE 1: Capital Reallocation Hook ($4.2T Kinetic Counter)
          Frames 0 to 235 (0.0s – 7.83s)
          Niko Ludwig Institutional Underwriting Style
         ======================================================== */}
      <Sequence from={0} durationInFrames={235}>
        <DossierOverlay
          title="Macro Capital Migration Analysis"
          reportCode="DOC-2026-CAPEX-01"
          theme="light"
        />
        <KineticCounter
          value={4.2}
          startValue={0.0}
          prefix="$"
          suffix="Trillion"
          decimals={1}
          durationInFrames={54}
          startFrame={10}
          easingProfile="institutional"
          fontSize={130}
          color="#0E382B"
          accentColor="#C59B27"
          fontFamily="Cinzel, Georgia, serif"
          badge="CAPITAL REALLOCATION DISCLOSURE"
          badgeColor="rgba(197, 155, 39, 0.2)"
          subtitle="Global enterprise capex diverted from headcount expansion into autonomous infrastructure"
          subtitleColor="rgba(27, 27, 27, 0.75)"
          backgroundColor="#F4F1EA"
        />
      </Sequence>

      {/* ========================================================
          SCENE 2: The Enterprise Waffle Migration Matrix
          Frames 235 to 515 (7.83s – 17.17s)
          420 of Fortune 500 Automation Adoption
         ======================================================== */}
      <Sequence from={235} durationInFrames={280}>
        <DossierOverlay
          title="Fortune 500 Autonomous Architecture"
          reportCode="DOC-2026-WFL-420"
          theme="light"
        />
        <div style={{ transform: "translateY(-28px)" }}>
          <WaffleMatrix
            totalDots={500}
            columns={25}
            activeCount={420}
            dotSize={15}
            gap={7}
            title="Fortune 500 Core Re-Engineering"
            subtitle="420 Enterprises Operating Autonomous Execution Engines (84.0% Saturation)"
            badge="SYSTEMIC INDUSTRIAL MIGRATION"
            activeColor="#0E382B"
            accentColor="#C59B27"
            backgroundColor="#F4F1EA"
            durationInFrames={65}
            startFrame={10}
          />
        </div>
      </Sequence>

      {/* ========================================================
          SCENE 3: The Scissor Divergence (Johnny Harris Calipers)
          Frames 515 to 865 (17.17s – 28.83s)
          1.3x vs 5.8x Revenue Multiplier Detachment
         ======================================================== */}
      <Sequence from={515} durationInFrames={350}>
        <DossierOverlay
          title="Operational Multiplier Scissor"
          reportCode="DOC-2026-SCISSOR-03"
          theme="light"
        />
        <div style={{ transform: "translateY(-28px)" }}>
          <DivergenceRatio
            title="The Operational Scissor Divergence"
            subtitle="Enterprise Multiple: Legacy Headcount vs Autonomous Software Leverage"
            baselineYear="LEGACY SERVICES"
            baselineMultiplier={1.3}
            currentYear="AUTONOMOUS ENGINE"
            currentMultiplier={5.8}
            highlighterNotice="4.5X OPERATIONAL SCISSOR GAP"
            backgroundColor="#EFECE6"
            durationInFrames={55}
            startFrame={12}
          />
        </div>
      </Sequence>

      {/* ========================================================
          SCENE 4: The Compounding Engine (PolyMatter + EE)
          Frames 865 to 1240 (28.83s – 41.33s)
          Midnight Slate, Cartesian Grid, Compounding Curves, Gauge
         ======================================================== */}
      <Sequence from={865} durationInFrames={375}>
        <DossierOverlay
          title="Asymptotic Software Compound Model"
          reportCode="DOC-2026-VECT-04"
          theme="dark"
        />
        <AbsoluteFill style={{ backgroundColor: "#131B2A" }}>
          {/* Dual Compounding Curves on Left */}
          <DualCompoundingCurves />

          {/* Radial Proportion Gauge on Right */}
          <div
            style={{
              position: "absolute",
              right: 120,
              top: 170,
              width: 760,
              height: 520,
            }}
          >
            <ProportionGauge
              percentage={78}
              label="Operating Margin Advantage"
              baselineLabel="Legacy Agency Baseline: 22%"
              title="Autonomous Software Surplus"
              subtitle="78% gross margin retained through autonomous pipeline execution"
              accentColor="#F59E0B"
              secondaryColor="#334155"
              backgroundColor="rgba(30, 41, 59, 0.7)"
              cardColor="#1E293B"
              durationInFrames={60}
              startFrame={10}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ========================================================
          SCENE 5: The Studio Thesis Lock & Climax
          Frames 1240 to 1500 (41.33s – 50.0s)
          FarEverReach Studio Strategic Conclusion
         ======================================================== */}
      <Sequence from={1240} durationInFrames={260}>
        <DossierOverlay
          title="Executive Studio Mandate"
          reportCode="DOC-2026-EXEC-05"
          theme="light"
        />
        <StudioThesisLock />
      </Sequence>
    </AbsoluteFill>
  );
};
