"use client";

import dynamic from "next/dynamic";

const XraBackground = dynamic(() => import("./XraBackground.client"), { ssr: false });

export const XraCenterStage = dynamic(
    () => import("./XraCenterStage.client").then((m) => m.XraCenterStage),
    { ssr: false },
);

export default XraBackground;
