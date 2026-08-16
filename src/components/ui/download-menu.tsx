/**
 * DownloadMenu — unified download dropdown supporting md / txt / json / zip (bundle).
 * Wraps the existing downloadSingle + downloadZip utilities.
 */
import { useState } from 'react';
import { Archive, ChevronDown, Download, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadSingle, downloadZip, type Downloadable } from '@/lib/download';

interface DownloadMenuProps {
  item: Downloadable;
  /** If provided, show a "Bundle ZIP" option downloading all items */
  bundleItems?: Downloadable[];
  bundleLabel?: string;
  size?: 'sm' | 'default';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const fmtIcons = {
  md:   <FileText className="h-3.5 w-3.5" />,
  txt:  <FileText className="h-3.5 w-3.5" />,
  json: <FileJson className="h-3.5 w-3.5" />,
};

export default function DownloadMenu({
  item,
  bundleItems,
  bundleLabel = 'Bundle ZIP',
  size = 'default',
  variant = 'default',
  className,
}: DownloadMenuProps) {
  const [loading, setLoading] = useState(false);

  const handleSingle = async (fmt: 'md' | 'txt' | 'json') => {
    setLoading(true);
    try {
      downloadSingle(item, fmt);
      toast.success(`Downloaded as .${fmt}`);
    } catch {
      toast.error('Download failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBundle = async () => {
    if (!bundleItems?.length) return;
    setLoading(true);
    try {
      await downloadZip(bundleItems, 'md', `${item.slug}-bundle`);
      toast.success(`Bundle ZIP downloaded (${bundleItems.length} files)`);
    } catch {
      toast.error('Bundle download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          disabled={loading}
          className={className}
        >
          <Download className="h-4 w-4" />
          <span className="ml-2">Download</span>
          <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Single File
        </DropdownMenuLabel>
        {(['md', 'txt', 'json'] as const).map(fmt => (
          <DropdownMenuItem key={fmt} onClick={() => handleSingle(fmt)} className="gap-2 text-xs">
            {fmtIcons[fmt]}
            {fmt === 'md' ? 'Markdown (.md)' : fmt === 'txt' ? 'Plain Text (.txt)' : 'JSON (.json)'}
          </DropdownMenuItem>
        ))}
        {bundleItems && bundleItems.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Bundle
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={handleBundle} className="gap-2 text-xs">
              <Archive className="h-3.5 w-3.5" />
              {bundleLabel} ({bundleItems.length})
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
