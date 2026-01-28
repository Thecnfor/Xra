import * as React from "react";

type Insets = {
  right: number;
  bottom: number;
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getVisualViewportSize() {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  const vv = window.visualViewport;
  if (vv) return { width: Math.round(vv.width), height: Math.round(vv.height) };
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useDockInsets(ref: React.RefObject<HTMLElement | null>) {
  const [dockInsets, setDockInsets] = React.useState<Insets>(() => {
    return { right: 20, bottom: 20 };
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const size = getVisualViewportSize();
      const vw = size.width;
      const vh = size.height;
      setDockInsets({
        right: clampNumber(vw - rect.left, 0, vw),
        bottom: clampNumber(vh - rect.top, 0, vh),
      });
    };

    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [ref]);

  return dockInsets;
}
