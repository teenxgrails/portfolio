/* lines.js — designs page: animated white DASHED outline arrows pointing to
 * the VK-style zones (banner / avatar / other pictures). The dash offset
 * moves and the strokes drift subtly so viewers read these as annotations.
 * Pure SVG; geometry recomputed on resize so arrows track the zone boxes.
 * Reduced motion: static dashes (no offset animation).
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = document.querySelector("[data-lines]");
  if (!stage) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "lines-svg");
  svg.setAttribute("aria-hidden", "true");
  stage.appendChild(svg);

  // zones are elements with [data-zone]; labels are [data-zone-label] anchors
  function build() {
    const sb = stage.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${sb.width} ${sb.height}`);
    svg.setAttribute("width", sb.width);
    svg.setAttribute("height", sb.height);
    svg.innerHTML = "";

    // arrowhead marker
    const defs = document.createElementNS(svgNS, "defs");
    defs.innerHTML =
      `<marker id="lh" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
         <path d="M1 1 L7 4.5 L1 8" fill="none" stroke="#fff" stroke-width="1.2"/>
       </marker>`;
    svg.appendChild(defs);

    stage.querySelectorAll("[data-zone]").forEach((zone) => {
      const zb = zone.getBoundingClientRect();
      const label = stage.querySelector(
        `[data-zone-label="${zone.getAttribute("data-zone")}"]`
      );
      if (!label) return;
      const lb = label.getBoundingClientRect();

      // outline rect around the zone (dashed)
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", zb.left - sb.left);
      rect.setAttribute("y", zb.top - sb.top);
      rect.setAttribute("width", zb.width);
      rect.setAttribute("height", zb.height);
      rect.setAttribute("rx", "6");
      rect.setAttribute("class", "lines-rect");
      svg.appendChild(rect);

      // arrow from label to zone edge
      const x1 = lb.left - sb.left + lb.width / 2;
      const y1 = lb.top - sb.top + lb.height / 2;
      const x2 = zb.left - sb.left + zb.width / 2;
      const y2 = zb.top - sb.top + zb.height / 2;
      const mx = (x1 + x2) / 2 + (y2 - y1) * 0.12; // slight curve
      const my = (y1 + y2) / 2 - (x2 - x1) * 0.12;
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
      path.setAttribute("class", "lines-arrow");
      path.setAttribute("marker-end", "url(#lh)");
      svg.appendChild(path);
    });
  }

  build();
  let ro;
  if ("ResizeObserver" in window) {
    ro = new ResizeObserver(build);
    ro.observe(stage);
  }
  window.addEventListener("resize", build);
  // rebuild after fonts/layout settle and on i18n label change
  document.addEventListener("i18n:change", () => requestAnimationFrame(build));
  window.addEventListener("load", build);

  if (reduce) stage.classList.add("lines-static");
})();
