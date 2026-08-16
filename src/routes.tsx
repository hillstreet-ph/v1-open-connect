import { lazy, type ReactNode } from 'react';

const HomePage           = lazy(() => import('@/pages/HomePage'));
const SkillsPage         = lazy(() => import('@/pages/SkillsPage'));
const SkillDetailPage    = lazy(() => import('@/pages/SkillDetailPage'));
const GuidesPage         = lazy(() => import('@/pages/GuidesPage'));
const SetupGuidesPage    = lazy(() => import('@/pages/SetupGuidesPage'));
const FreeToolsPage      = lazy(() => import('@/pages/FreeToolsPage'));
const AboutPage          = lazy(() => import('@/pages/AboutPage'));
const SearchPage         = lazy(() => import('@/pages/SearchPage'));
const AgentsPage         = lazy(() => import('@/pages/AgentsPage'));
const PluginsPage        = lazy(() => import('@/pages/PluginsPage'));
const MCPPage            = lazy(() => import('@/pages/MCPPage'));
const PromptsPage        = lazy(() => import('@/pages/PromptsPage'));
const ToolsPage          = lazy(() => import('@/pages/ToolsPage'));
const ResourceDetailPage = lazy(() => import('@/pages/ResourceDetailPage'));
const LoginPage          = lazy(() => import('@/pages/LoginPage'));
const AdminPage          = lazy(() => import('@/pages/AdminPage'));
const ProfilePage        = lazy(() => import('@/pages/ProfilePage'));
const GatewayPage        = lazy(() => import('@/pages/GatewayPage'));
const ApiKeysPage        = lazy(() => import('@/pages/ApiKeysPage'));
const OAuthAppsPage      = lazy(() => import('@/pages/OAuthAppsPage'));

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Home',           path: '/',                    element: <HomePage />,            public: true },
  { name: 'Agents',         path: '/agents',              element: <AgentsPage />,          public: true },
  { name: 'Agent Detail',   path: '/agents/:slug',        element: <ResourceDetailPage />,  public: true },
  { name: 'Skills',         path: '/skills',              element: <SkillsPage />,          public: true },
  { name: 'Skill Detail',   path: '/skills/:slug',        element: <SkillDetailPage />,     public: true },
  { name: 'Plugins',        path: '/plugins',             element: <PluginsPage />,         public: true },
  { name: 'Plugin Detail',  path: '/plugins/:slug',       element: <ResourceDetailPage />,  public: true },
  { name: 'MCP',            path: '/mcp',                 element: <MCPPage />,             public: true },
  { name: 'MCP Detail',     path: '/mcp/:slug',           element: <ResourceDetailPage />,  public: true },
  { name: 'Prompts',        path: '/prompts',             element: <PromptsPage />,         public: true },
  { name: 'Prompt Detail',  path: '/prompts/:slug',       element: <ResourceDetailPage />,  public: true },
  { name: 'Tools',          path: '/tools',               element: <ToolsPage />,           public: true },
  { name: 'Tool Detail',    path: '/tools/:slug',         element: <ResourceDetailPage />,  public: true },
  { name: 'Guides',         path: '/guides',              element: <GuidesPage />,          public: true },
  { name: 'Setup Guides',   path: '/setup-guides',        element: <SetupGuidesPage />,     public: true },
  { name: 'Free Tools',     path: '/free-tools',          element: <FreeToolsPage />,       public: true },
  { name: 'About',          path: '/about',               element: <AboutPage />,           public: true },
  { name: 'Search',         path: '/search',              element: <SearchPage />,          public: true },
  { name: 'Login',          path: '/login',               element: <LoginPage />,           public: true },
  { name: 'Admin',          path: '/admin',               element: <AdminPage />,           public: false },
  { name: 'Profile',        path: '/profile',             element: <ProfilePage />,         public: false },
  { name: 'Gateway',        path: '/gateway',             element: <GatewayPage />,         public: true },
  { name: 'API Keys',       path: '/api-keys',            element: <ApiKeysPage />,         public: false },
  { name: 'OAuth Apps',    path: '/oauth-apps',          element: <OAuthAppsPage />,       public: false },
];
