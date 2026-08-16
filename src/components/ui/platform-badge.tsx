import { cn } from '@/lib/utils';

const platformConfig: Record<string, { label: string; className: string }> = {
  claude: { label: 'Claude', className: 'platform-badge-claude' },
  chatgpt: { label: 'ChatGPT', className: 'platform-badge-chatgpt' },
  'gemini-spark': { label: 'Gemini Spark', className: 'platform-badge-gemini-spark' },
  'open-webui': { label: 'Open WebUI', className: 'platform-badge-open-webui' },
  lobehub: { label: 'LobeHub', className: 'platform-badge-lobehub' },
};

interface PlatformBadgeProps {
  platform: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function PlatformBadge({ platform, size = 'sm', className }: PlatformBadgeProps) {
  const config = platformConfig[platform.toLowerCase()] ?? {
    label: platform,
    className: 'bg-muted text-muted-foreground border border-border',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function PlatformBadgeList({
  platforms,
  max = 3,
  size = 'sm',
  className,
}: {
  platforms: string[];
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const visible = platforms.slice(0, max);
  const overflow = platforms.length - max;
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {visible.map(p => (
        <PlatformBadge key={p} platform={p} size={size} />
      ))}
      {overflow > 0 && (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground border border-border">
          +{overflow}
        </span>
      )}
    </div>
  );
}
