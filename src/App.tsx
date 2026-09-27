import React, { useState, useEffect } from 'react';
import { AdminShell, AdminTab } from './components/admin/AdminShell';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMemberManager } from './components/admin/AdminMemberManager';
import { AdminAnnouncementManager } from './components/admin/AdminAnnouncementManager';
import { AdminScheduleManager } from './components/admin/AdminScheduleManager';
import { AdminLiturgyManager } from './components/admin/AdminLiturgyManager';
import { AdminRegistrationManager } from './components/admin/AdminRegistrationManager';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminLoginPage } from './components/admin/AdminLoginPage';

import { PortalShell, PortalPage } from './components/portal/PortalShell';
import { PortalHome } from './components/portal/PortalHome';
import { PortalAnnouncements } from './components/portal/PortalAnnouncements';
import { PortalRehearsals } from './components/portal/PortalRehearsals';
import { PortalLiturgy } from './components/portal/PortalLiturgy';
import { PortalRegistration } from './components/portal/PortalRegistration';

import { dataService } from './services/dataService';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

export function App() {
  const { isAuthenticated, isLoading: authLoading, signOut } = useAuth();

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const adminPath = `${basePath}/admin`;

const getIsAdminRoute = () => {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';

  return (
    window.location.search.includes('admin=true') ||
    pathname === adminPath ||
    pathname.startsWith(`${adminPath}/`)
  );
};

const isAdminRoute = getIsAdminRoute();

  const [viewMode, setViewMode] = useState<'admin' | 'portal'>(isAdminRoute ? 'admin' : 'portal');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [portalPage, setPortalPage] = useState<PortalPage>('home');
  const [portalParams, setPortalParams] = useState<any>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    dataService.fetchAll();
    const unsubscribe = dataService.subscribe(() => setTick(t => t + 1));

const handlePopState = () => {
  const isAdmin = getIsAdminRoute();
  setViewMode(isAdmin ? 'admin' : 'portal');
};

    window.addEventListener('popstate', handlePopState);

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handlePortalNavigate = (page: PortalPage, params?: any) => {
    setPortalPage(page);
    setPortalParams(params || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Auth loading spinner ─────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B192C] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Đang xác thực phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  // ─── Admin mode: require auth ─────────────────────────────────────────────
  if (viewMode === 'admin') {
    // Not authenticated → show login page
    if (!isAuthenticated) {
      return (
        <AdminLoginPage
          onBack={() => {
            window.history.pushState({}, '', basePath || '/');
            setViewMode('portal');
          }}
        />
      );
    }

    // Authenticated → show admin center
    return (
      <AdminShell
        currentTab={adminTab}
        onTabChange={setAdminTab}
        onOpenPortal={() => {
          window.history.pushState({}, '', '/');
          setViewMode('portal');
        }}
        onSignOut={async () => {
          await signOut();
          window.history.pushState({}, '', '/');
          setViewMode('portal');
        }}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigate={setAdminTab} />}
        {adminTab === 'members' && <AdminMemberManager />}
        {adminTab === 'announcements' && <AdminAnnouncementManager />}
        {adminTab === 'rehearsals' && <AdminScheduleManager />}
        {adminTab === 'liturgy' && <AdminLiturgyManager />}
        {adminTab === 'registrations' && <AdminRegistrationManager />}
        {adminTab === 'analytics' && <AdminAnalytics />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminShell>
    );
  }

  // ─── Public Portal ────────────────────────────────────────────────────────
  return (
    <PortalShell
      currentPage={portalPage}
      onPageChange={handlePortalNavigate}
    >
      {portalPage === 'home' && <PortalHome onPageChange={handlePortalNavigate} />}
      {portalPage === 'announcements' && <PortalAnnouncements />}
      {portalPage === 'rehearsals' && <PortalRehearsals />}
      {portalPage === 'liturgy' && <PortalLiturgy />}
      {portalPage === 'registration' && <PortalRegistration />}
    </PortalShell>
  );
}

export default App;
