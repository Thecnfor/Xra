import * as React from "react";

function getVisualViewportSize() {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  const vv = window.visualViewport;
  if (vv) return { width: Math.round(vv.width), height: Math.round(vv.height) };
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useVisualViewport() {
  const [viewport, setViewport] = React.useState(getVisualViewportSize);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setViewport(getVisualViewportSize());
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  return viewport;
}
