import {IconGitBranch, IconRadar, IconSearch, IconTimeline} from '@tabler/icons-react';
import {NavLink, Outlet} from 'react-router-dom';
import packageJson from '../../package.json';

const navigation = [
  {to: '/radar', label: 'Radar', icon: IconRadar},
  {to: '/technologies', label: 'Technologies', icon: IconGitBranch},
  {to: '/decisions', label: 'Decisions', icon: IconTimeline},
];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/radar" aria-label="Smrodek Tech Radar home">
          <span className="brand-mark logo-mark">
            <img src="/logo/logo.svg" alt="" />
          </span>
          <span>
            <strong>Smrodek</strong>
            <small>v{packageJson.version} · Tech Radar</small>
          </span>
        </NavLink>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navigation.map(({to, label, icon: Icon}) => (
            <NavLink key={to} to={to} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <Icon size={17} stroke={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink className="header-search" to="/technologies" aria-label="Search technologies">
          <IconSearch size={18} />
          <span>Search</span>
          <kbd>/</kbd>
        </NavLink>
      </header>
      <main className="page-container">
        <Outlet />
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({to, label, icon: Icon}) => (
          <NavLink key={to} to={to} className={({isActive}) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
