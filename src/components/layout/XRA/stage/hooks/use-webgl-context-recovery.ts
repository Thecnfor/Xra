import * as React from "react";

export function useWebglContextRecovery(
  canvasEl: HTMLCanvasElement | null,
  onRecover: () => void,
) {
  const onRecoverRef = React.useRef(onRecover);

  React.useEffect(() => {
    onRecoverRef.current = onRecover;
  }, [onRecover]);

  React.useEffect(() => {
    if (!canvasEl) return;

    const onLost = (event: Event) => {
      event.preventDefault?.();
      onRecoverRef.current();
    };
    const onRestored = () => {
      onRecoverRef.current();
    };

    canvasEl.addEventListener("webglcontextlost", onLost as EventListener, { passive: false });
    canvasEl.addEventListener("webglcontextrestored", onRestored);
    return () => {
      canvasEl.removeEventListener("webglcontextlost", onLost as EventListener);
      canvasEl.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [canvasEl]);
}
