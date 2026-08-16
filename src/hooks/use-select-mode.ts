import { useState, useCallback } from 'react';

export function useSelectMode<T extends { id: number }>(items: T[]) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleSelectMode = useCallback(() => {
    setSelectMode(prev => {
      if (prev) setSelected(new Set());
      return !prev;
    });
  }, []);

  const toggleItem = useCallback((id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(items.map(i => i.id)));
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  const isSelected = useCallback((id: number) => selected.has(id), [selected]);

  const selectedItems = items.filter(i => selected.has(i.id));

  return {
    selectMode,
    toggleSelectMode,
    selected,
    selectedItems,
    toggleItem,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount: selected.size,
  };
}
