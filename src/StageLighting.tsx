type StageLightingProps = {
  enabled: boolean;
  active: boolean;
  landedCount: number;
};
export default function StageLighting({
  enabled,
  active,
  landedCount,
}: StageLightingProps) {
  return (
    <div
      className={`stage-show ${enabled ? "" : "stage-show-off"}`}
      data-active={enabled && active}
      data-cues={landedCount}
      aria-hidden="true"
    >
      <div className="stage-dimmer" />
      <div className="stage-spot spot-left">
        <i className="spot-housing" />
        <i className="spot-beam" />
      </div>
      <div className="stage-spot spot-right">
        <i className="spot-housing" />
        <i className="spot-beam" />
      </div>
      <div className="stage-floor-light" />
      <div className="stage-crown-glow" />
      <div className="stage-footlights">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ "--lamp": i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
