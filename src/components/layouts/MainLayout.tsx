import { type ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  BookOpen, Bot, Cpu, Globe2, Home, Info, Menu, MessageSquare, Moon,
  Puzzle, Search, Server, Sun, Wrench, X, Zap, LogIn, LogOut,
  User, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { to: '/',            label: 'Home',     icon: Home },
  { to: '/agents',      label: 'Agents',   icon: Bot },
  { to: '/skills',      label: 'Skills',   icon: Zap },
  { to: '/plugins',     label: 'Plugins',  icon: Puzzle },
  { to: '/mcp',         label: 'MCP',      icon: Server },
  { to: '/tools',       label: 'Tools',    icon: Wrench },
  { to: '/prompts',     label: 'Prompts',  icon: MessageSquare },
  { to: '/guides',      label: 'Guides',   icon: BookOpen },
  { to: '/setup-guides',label: 'Setup',    icon: Cpu },
  { to: '/gateway',     label: 'Gateway',  icon: Globe2 },
  { to: '/about',       label: 'About',    icon: Info },
];

function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/login')}
        className="text-muted-foreground hover:text-foreground gap-1.5"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden md:inline text-xs">Sign In</span>
      </Button>
    );
  }

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : (user.email ?? 'U').slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{profile?.username ?? user.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile?.role ?? 'user'}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="h-4 w-4 mr-2" /> My Profile
        </DropdownMenuItem>
        {profile?.role === 'admin' && (
          <DropdownMenuItem onClick={() => navigate('/admin')}>
            <ShieldCheck className="h-4 w-4 mr-2" /> Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut().then(() => navigate('/'))}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavLinks({ onClick, pathname }: { onClick?: () => void; pathname: string }) {
  return (
    <>
      {navLinks.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || (to !== '/' && pathname.startsWith(to));
        return (
          <Link
            key={to}
            to={to}
            onClick={onClick}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              active
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="text-muted-foreground hover:text-foreground"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2 mr-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">OC</span>
            </div>
            <span className="hidden font-semibold text-foreground md:block">
              Open<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
            <NavLinks pathname={location.pathname} />
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            <Link to="/search">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeToggle />
            <UserMenu />
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
                <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                      <span className="text-xs font-bold text-primary-foreground">OC</span>
                    </div>
                    <span className="font-semibold text-sidebar-foreground">
                      Open<span className="text-primary">Connect</span>
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="text-muted-foreground h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-1 p-3">
                  <NavLinks pathname={location.pathname} onClick={() => setMobileOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <span className="text-xs font-bold text-primary-foreground">OC</span>
                </div>
                <span className="font-semibold">Open<span className="text-primary">Connect</span></span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                Your unified hub for AI agent resources — skills, agents, plugins, MCP servers, prompts, and guides.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Resources</p>
              <div className="flex flex-col gap-2">
                {[
                  { to: '/agents',       l: 'Agents' },
                  { to: '/skills',       l: 'Skills Library' },
                  { to: '/plugins',      l: 'Plugins' },
                  { to: '/mcp',          l: 'MCP Servers' },
                  { to: '/prompts',      l: 'Prompts' },
                  { to: '/guides',       l: 'Guides' },
                  { to: '/setup-guides', l: 'Setup Guides' },
                  { to: '/free-tools',   l: 'Free Tools' },
                ].map(({ to, l }) => (
                  <Link key={to} to={to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Platforms</p>
              <div className="flex flex-col gap-2">
                {['Claude', 'ChatGPT', 'Gemini Spark', 'Open WebUI', 'LobeHub'].map(p => (
                  <Link key={p} to={`/skills?platform=${p.toLowerCase().replace(' ', '-')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{p}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Company</p>
              <div className="flex flex-col gap-2">
                <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link to="/search" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Search className="h-3 w-3" /> Search
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2026 Open Connect. Your unified AI resource hub.</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Supports <span className="text-primary font-medium">Claude · ChatGPT · Gemini Spark · Open WebUI · LobeHub</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
