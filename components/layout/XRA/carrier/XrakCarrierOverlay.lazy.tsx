"use client";

import dynamic from "next/dynamic";

const XrakCarrierOverlayLazy = dynamic(() => import("./XrakCarrierOverlay.client"), { ssr: false });

export default XrakCarrierOverlayLazy;
