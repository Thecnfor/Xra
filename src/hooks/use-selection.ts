import { useState, useCallback } from "react";

export function useSelection<T>(initialSelected: T[] = []) {
    const [selectedItems, setSelectedItems] = useState<Set<T>>(new Set(initialSelected));
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const toggleSelection = useCallback((item: T) => {
        setSelectedItems((prev) => {
            const next = new Set(prev);
            if (next.has(item)) {
                next.delete(item);
            } else {
                next.add(item);
            }

            if (next.size === 0) {
                setIsSelectionMode(false);
            } else {
                setIsSelectionMode(true);
            }
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedItems(new Set());
        setIsSelectionMode(false);
    }, []);

    const selectAll = useCallback((items: T[]) => {
        setSelectedItems(new Set(items));
        setIsSelectionMode(true);
    }, []);

    return {
        selectedItems,
        isSelectionMode,
        setIsSelectionMode,
        toggleSelection,
        clearSelection,
        selectAll,
        selectedCount: selectedItems.size,
    };
}
