/* Interactive timeline — vis-timeline spike for /report-viz
   ─────────────────────────────────────────────────────────────────────────
   Renders the same BLOCKS.timeline data through vis-timeline 8.x
   (visjs community, Apache-2.0/MIT) to evaluate it as the workspace
   renderer: native zoom/pan, item stacking, clustering, background bands,
   a draggable custom "today" bar, and group lanes per category.

   Loaded lazily (React.lazy) so vis-timeline stays out of the marketing
   bundle. The static SVG variant remains the export renderer — the spec
   requires a no-JS variant regardless, so workspace and export are
   different renderers over one block. showCurrentTime is off on purpose:
   "today" is the report generation date, not the viewer's wall clock. */
import React from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import { BLOCKS, REPORT_META } from "./report-blocks.js";

const CAT_ORDER = ["security", "political", "commercial", "humanitarian"];
const CAT_LABEL = { security: "Security", political: "Political", commercial: "Commercial", humanitarian: "Humanitarian" };

function buildData() {
  const t = BLOCKS.timeline;
  // Two lanes, split on the today bar: what happened vs what is expected.
  // Four category lanes made every connector line cross the other lanes —
  // category lives on the chip (accent + dot + legend) instead.
  const groups = new DataSet([
    { id: "recorded", order: 0, content: '<span class="rvv-glab plain">Recorded</span>' },
    { id: "forward", order: 1, content: '<span class="rvv-glab plain">Forward look</span>' },
  ]);
  const items = [];
  t.events.forEach((e, i) => {
    items.push({
      id: `e${i}`,
      group: "recorded",
      content: e.label,
      start: e.date,
      type: "box",
      className: `rvv-item rvv-${e.category}`,
      title: `${e.label}\n${e.date} · ${CAT_LABEL[e.category]} · recorded`,
    });
  });
  t.forward_triggers.forEach((f, i) => {
    if (f.date) {
      items.push({
        id: `f${i}`,
        group: "forward",
        content: f.label,
        start: f.precision === "month" ? `${f.date}-15` : f.date,
        type: "box",
        className: `rvv-item rvv-${f.category} rvv-expected`,
        title: `${f.label}\nExpected · ${f.date}${f.precision === "month" ? " (month precision)" : ""} · ${CAT_LABEL[f.category]}`,
      });
    } else {
      items.push({
        id: `u${i}`,
        group: "forward",
        content: f.label,
        start: REPORT_META.generated,
        end: t.window.end,
        type: "range",
        className: `rvv-undated rvv-${f.category}`,
        title: `${f.label}\nUndated forward trigger — ${f.window}`,
      });
    }
  });
  t.bands.forEach((b, i) => {
    items.push({
      id: `b${i}`,
      content: "", // label lives in the legend; inline it collides with stacked chips
      start: b.from,
      end: b.to,
      type: "background",
      className: `rvv-band rvv-${b.category}`,
    });
  });
  return { groups, items: new DataSet(items) };
}

export default function VisTimelinePanel() {
  const ref = React.useRef(null);
  const tlRef = React.useRef(null);

  React.useEffect(() => {
    const { groups, items } = buildData();
    const tl = new Timeline(ref.current, items, groups, {
      start: "2025-11-01",
      end: "2027-03-01",
      min: "2025-10-01",
      max: "2027-07-01",
      zoomMin: 1000 * 60 * 60 * 24 * 4,
      stack: true,
      maxHeight: 480,
      showCurrentTime: false,
      orientation: "bottom",
      margin: { item: { horizontal: 6, vertical: 6 }, axis: 8 },
      tooltip: { followMouse: true, delay: 120 },
      groupOrder: "order",
    });
    tl.addCustomTime(REPORT_META.generated, "today");
    tl.setCustomTimeMarker("Today · 14 Jul", "today", false);
    tlRef.current = tl;
    return () => tl.destroy();
  }, []);

  return (
    <>
      <div ref={ref} className="rvv-host"/>
      <div className="rv-legend" style={{ marginTop: 12 }}>
        {CAT_ORDER.map((c) => (
          <span key={c} className="rv-legend-item"><span className={`rvv-key rvv-${c}`}/>{CAT_LABEL[c]}</span>
        ))}
        <span className="rv-legend-sep"/>
        <span className="rv-legend-item">dashed = expected / undated · shaded = dry-season window</span>
        <span className="rv-legend-sep"/>
        <span className="rv-legend-item">drag to pan · scroll to zoom</span>
        <button
          className="rvv-reset"
          onClick={() => tlRef.current && tlRef.current.setWindow("2025-11-01", "2027-03-01", { animation: true })}
        >Reset view</button>
      </div>
    </>
  );
}
