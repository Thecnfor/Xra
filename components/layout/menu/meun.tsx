"use client";

import * as React from "react";
import { selectMenuOpen, selectSetMenuOpen, useAppStore } from "@/stores";
import {
    useEscapeToClose,
    useLockBodyScroll,
    useRestoreFocus,
} from "./menu-hooks";
import MenuPanel from "./menu-panel";

export default function SiteMenu({ className }: { className?: string }) {
    const open = useAppStore(selectMenuOpen);
    const setOpen = useAppStore(selectSetMenuOpen);

    const close = React.useCallback(() => setOpen(false), [setOpen]);
    const initialFocusRef = React.useRef<HTMLDivElement | null>(null);

    useRestoreFocus(open, initialFocusRef);
    useEscapeToClose(open, close);
    useLockBodyScroll(open);

    return (
        <MenuPanel
            className={className}
            open={open}
            onClose={close}
            initialFocusRef={initialFocusRef}
        />
    );
}
