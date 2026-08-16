import { useState } from 'react';
import { Download, X, CheckSquare, Square, FolderDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { downloadZip, type DownloadFormat, type Downloadable } from '@/lib/download';
import { cn } from '@/lib/utils';

interface BulkDownloadToolbarProps {
  selectMode: boolean;
  onToggleSelectMode: () => void;
  selectedCount: number;
  selectedItems: Downloadable[];
  allItems: Downloadable[];
  categoryLabel?: string;
  onSelectAll: () => void;
  onClearSelection: () => void;
  zipBaseName?: string;
}

export default function BulkDownloadToolbar({
  selectMode,
  onToggleSelectMode,
  selectedCount,
  selectedItems,
  allItems,
  categoryLabel,
  onSelectAll,
  onClearSelection,
  zipBaseName = 'open-connect-resources',
}: BulkDownloadToolbarProps) {
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const doDownload = async (
    items: Downloadable[],
    name: string,
    fmt: DownloadFormat,
    setLoading: (v: boolean) => void,
    label: string
  ) => {
    if (items.length === 0) { toast.error('No items to download'); return; }
    setLoading(true);
    try {
      await downloadZip(items, name, fmt);
      toast.success(`Downloaded ${items.length} ${label} as ${name}.zip`);
    } catch {
      toast.error('ZIP creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6 p-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm">
      {/* Left: Select mode toggle + counts */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSelectMode}
          className={cn(
            'h-8 text-xs border gap-1.5',
            selectMode
              ? 'border-primary/50 bg-primary/5 text-primary hover:bg-primary/10'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
        >
          {selectMode ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
          {selectMode ? 'Cancel Select' : 'Select'}
        </Button>

        {selectMode && (
          <>
            <Button variant="ghost" size="sm" onClick={onSelectAll}
              className="h-8 text-xs border border-border text-muted-foreground hover:text-foreground">
              Select All ({allItems.length})
            </Button>
            {selectedCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearSelection}
                className="h-8 text-xs border border-border text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3 mr-1" /> Clear ({selectedCount})
              </Button>
            )}
            {selectedCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {selectedCount} selected
              </span>
            )}
          </>
        )}
      </div>

      {/* Right: Download buttons */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {/* Download selected (only in select mode with selection) */}
        {selectMode && selectedCount > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 text-xs gap-1.5" disabled={loadingSelected}>
                {loadingSelected
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Download className="h-3.5 w-3.5" />}
                Download Selected ({selectedCount})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(['md', 'txt', 'json'] as DownloadFormat[]).map(fmt => (
                <DropdownMenuItem key={fmt} onClick={() =>
                  doDownload(selectedItems, `${zipBaseName}-selected`, fmt, setLoadingSelected, 'items')
                }>
                  {fmt === 'md' ? 'Markdown (.md)' : fmt === 'txt' ? 'Plain Text (.txt)' : 'JSON (.json)'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Bulk download by category */}
        {categoryLabel && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs border border-border gap-1.5 hover:border-primary/40"
                disabled={loadingCategory}>
                {loadingCategory
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <FolderDown className="h-3.5 w-3.5" />}
                <span className="hidden md:inline">Download Category</span>
                <span className="md:hidden">By Category</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(['md', 'txt', 'json'] as DownloadFormat[]).map(fmt => (
                <DropdownMenuItem key={fmt} onClick={() =>
                  doDownload(allItems, `${zipBaseName}-${categoryLabel.toLowerCase().replace(/\s+/g, '-')}`, fmt, setLoadingCategory, `${categoryLabel} items`)
                }>
                  {fmt === 'md' ? 'Markdown (.md)' : fmt === 'txt' ? 'Plain Text (.txt)' : 'JSON (.json)'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Bulk download all visible */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs border border-border gap-1.5 hover:border-primary/40"
              disabled={loadingAll}>
              {loadingAll
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />}
              Download All ({allItems.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(['md', 'txt', 'json'] as DownloadFormat[]).map(fmt => (
              <DropdownMenuItem key={fmt} onClick={() =>
                doDownload(allItems, zipBaseName, fmt, setLoadingAll, 'items')
              }>
                {fmt === 'md' ? 'Markdown (.md)' : fmt === 'txt' ? 'Plain Text (.txt)' : 'JSON (.json)'}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
