import React, { useEffect, useState } from 'react';
import packageJson from '../../../package.json';
import Header from '../Header/Header';
import { NavLink, useLocation } from "react-router-dom"
import CurrentUser from '../../main/config/user';
import { LoadJSFiles } from '../init';
import messageHTTPService from '../../main/services/messageHTTPService';
import { useTranslation } from 'react-i18next';
import './Navigation.css'

// Get username from localStorage user object and capitalize first character
let username = '';
try {
  const userObj = JSON.parse(localStorage.getItem('user'));
  if (userObj && userObj.username) {
    username = userObj.username.charAt(0).toUpperCase() + userObj.username.slice(1);
  }
} catch {
  username = '';
}

// Example user data for profile section
function getCurrentUser() {
  try {
    const userObj = JSON.parse(localStorage.getItem('user'));
    if (userObj) {
      return {
        name: userObj.fullName || userObj.username || "User",
        role: userObj.role || "Admin",
        avatar: userObj.profilePicture || "images/admin.png"
      };
    }
  } catch {}
  return {
    name: username || "User",
    role: "Admin",
    avatar: "images/admin.png"
  };
}

const Navigation = ({ connected, darkMode }) => {
  // Helper: get allowed menu keys by role
  const roleMenuMap = {
    ADMIN: 'ALL',
    DOCTOR: [
      'dashboard', 'Odontogram', 'rendezvous', 'quick-test', 'certificate', 'medicaments', 'medicament-category', 'medicament-manufacture', 'prescription', 'certificates', 'analytics', 'procedure', 'operation', 'diagnosis', 'dental-imaging', 'insurance', 'telemedicine', 'treatment-plan'
    ],
    STAFF: [
      'dashboard', 'rendezvous', 'quick-test', 'patient'
    ],
    TECHNICAL: [
      'dashboard', 'inventory-item', 'equipment-maintenance'
    ],
    ACCOUNTANT: [
      'dashboard', 'payment', 'expense', 'billing', 'insurance'
    ]
  };

  // Helper: flatten menu items to keys for filtering
  function getMenuKey(item) {
    if (item.to) return item.to.replace(/^\//, '');
    if (item.label) return item.label;
    return '';
  }

  function filterMenuByRole(menu, role) {
    if (roleMenuMap[role] === 'ALL') return menu;
    const allowed = roleMenuMap[role] || [];
    return menu
      .map(section => ({
        ...section,
        items: section.items
          .map(item => {
            if (item.dropdown) {
              const filteredChildren = item.children.filter(child => allowed.includes(getMenuKey(child)));
              return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
            }
            return allowed.includes(getMenuKey(item)) ? item : null;
          })
          .filter(Boolean)
      }))
      .filter(section => section.items.length > 0);
  }
  // Confirmation modal state for web_front
  const [confirmWebFrontOpen, setConfirmWebFrontOpen] = useState(false);
  const [pendingWebFrontNav, setPendingWebFrontNav] = useState(false);
  // User state and refresh effect
  const [user, setUser] = useState(getCurrentUser());
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    // Refresh user on mount
    setUser(getCurrentUser());
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const { t } = useTranslation();
  const [messages, setMessages] = useState(2);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
    getMessages()
  }, []);

  const getMessages = () => {
    messageHTTPService.getCount().then(data => {
      setMessages(data.data.message)
    })
  }

  // Example dynamic menu items based on role
  const menuItems = [
    {
      section: t("nav.main"),
      items: [
        { to: "/dashboard", icon: "fa-laptop", label: t("nav.dashboard") },
        { to: "/Odontogram", icon: "fa-tooth", label: t("nav.odontogram") }
      ]
    },
    {
      section: t("nav.consultations"),
      items: [
        {
          dropdown: true,
          icon: "fa-calendar",
          label: t("nav.consultations"),
          children: [
            { to: "/rendezvous", label: t("nav.appointments"), badge: 2, icon: "fa-calendar-check" },
            { to: "/quick-test", label: t("nav.quick_tests"), icon: "fa-vial" }
          ]
        }
      ]
    },
    {
      section: t("nav.management"),
      items: [
        { to: "/patient", icon: "fa-user", label: t("nav.patients") },
        { to: "/messages", icon: "fa-envelope-open", label: t("nav.messages"), badge: messages },
        { to: "/certificate", icon: "fa-certificate", label: t("nav.certificates") },
        {
          dropdown: true,
          icon: "fa-usd",
          label: t("nav.finances"),
          children: [
            { to: "/payment", label: t("nav.payments"), icon: "fa-credit-card" },
            { to: "/expense", label: t("nav.expenses"), icon: "fa-money-bill" }
          ]
        },
        {
          dropdown: true,
          icon: "fa-hotel",
          label: t("nav.pharmaceuticals"),
          children: [
            { to: "/medicaments", label: t("nav.medicaments"), icon: "fa-pills" },
            { to: "/medicament-manufacture", label: t("nav.manufactures"), icon: "fa-industry" },
            { to: "/medicament-category", label: t("nav.categories"), icon: "fa-tags" }
          ]
        },
        { to: "/prescription", icon: "fa-bars", label: t("nav.prescriptions") }
      ]
    },
    {
      section: "CMS",
      items: [
        {
          dropdown: true,
          icon: "fa-bookmark",
          label: t("nav.cms"),
          children: [
            { to: "/", label: t("nav.web_front"), icon: "fa-screen" },
            { to: "/aboutus", label: t("nav.about_us_page"), icon: "fa-home" },
            { to: "/servicepage", label: t("nav.service_page"), icon: "fa-concierge-bell" }
          ]
        }
      ]
    },
    {
      section: t("nav.analytics"),
      items: [
        {
          dropdown: true,
          icon: "fa-area-chart",
          label: t("nav.analytics"),
          children: [
            { to: "/patient-analytics", label: t("nav.patient_analytics"), icon: "fa-user-chart" },
            { to: "/medicament-analytics", label: t("nav.medicament_analytics"), icon: "fa-chart-bar" }
          ]
        }
      ]
    },
    {
      section: t("nav.clinic"),
      items: [
        {
          dropdown: true,
          icon: "fa-medkit",
          label: t("nav.clinic_management"),
          children: [
            { to: "/treatment-plan", label: t("nav.treatment_plan"), icon: "fa-notes-medical" },
            { to: "/telemedicine", label: t("nav.telemedicine"), icon: "fa-video" },
            { to: "/staff", label: t("nav.staff"), icon: "fa-users" },
            { to: "/doctor", label: t("nav.doctor"), icon: "fa-user-md" },
            { to: "/clinic", label: t("nav.clinic"), icon: "fa-hospital" },
            { to: "/billing", label: t("nav.billing"), icon: "fa-file-invoice-dollar" }
          ]
        }
      ]
    },
    {
      section: t("nav.diagnostics"),
      items: [
        {
          dropdown: true,
          icon: "fa-stethoscope",
          label: t("nav.diagnostics_treatment"),
          children: [
            { to: "/procedure", label: t("nav.procedure"), icon: "fa-stethoscope" },
            { to: "/operation", label: t("nav.operation"), icon: "fa-syringe" },
            { to: "/diagnosis", label: t("nav.diagnosis"), icon: "fa-diagnoses" },
            { to: "/dental-imaging", label: t("nav.dental_imaging"), icon: "fa-x-ray" }
          ]
        }
      ]
    },
    {
      section: t("nav.records"),
      items: [
        {
          dropdown: true,
          icon: "fa-heartbeat",
          label: t("nav.patient_records"),
          children: [
            { to: "/dental-membership", label: t("nav.dental_membership"), icon: "fa-id-card" },
            { to: "/insurance", label: t("nav.insurance"), icon: "fa-shield-alt" }
          ]
        }
      ]
    },
    {
      section: t("nav.inventory"),
      items: [
        {
          dropdown: true,
          icon: "fa-archive",
          label: t("nav.inventory_management"),
          children: [
            { to: "/inventory-item", label: t("nav.inventory_item"), icon: "fa-boxes" },
            { to: "/equipment-maintenance", label: t("nav.equipment_maintenance"), icon: "fa-tools" }
          ]
        }
      ]
    },
    {
      section: "Marketing",
      items: [
        { to: "/marketing", icon: "fa-bullhorn", label: "Marketing" }
      ]
    },
    {
      section: "Dicom Viewer",
      items: [
        { to: "/dicom-viewer", icon: "fa-x-ray", label: "Dicom Viewer" }
      ]
    },
    {
      section: t("nav.settings"),
      items: [
        { to: "/configuration", icon: "fa-cogs", label: t("nav.settings") },
        { to: "/help", icon: "fa-question-circle", label: t("nav.help") }
      ]
    }
  ];

  // Filter menu items by search
  const filterMenu = (items) => {
    if (!search) return items;
    return items
      .map(section => ({
        ...section,
        items: section.items
          .map(item => {
            if (item.dropdown) {
              const filteredChildren = item.children.filter(child =>
                child.label.toLowerCase().includes(search.toLowerCase())
              );
              return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
            }
            return item.label.toLowerCase().includes(search.toLowerCase()) ? item : null;
          })
          .filter(Boolean)
      }))
      .filter(section => section.items.length > 0);
  };

  // Keyboard navigation support (basic)
  // You can enhance this for full accessibility
  const handleKeyDown = (e) => {
    if (e.key === "Escape") setSidebarCollapsed(false);
  };

  // Change icon size based on sidebarCollapsed
  const iconSize = sidebarCollapsed ? 28 : 18;

  return (
    <aside
      id="left-panel"
      className={`left-panel${sidebarCollapsed ? ' collapsed' : ''}${darkMode ? ' dark-mode' : ''}`}
      style={{
        display: (connected ? 'block' : 'none'),
        width: sidebarCollapsed ? 80 : 250, // Increased collapsed width from 60 to 80
        minWidth: sidebarCollapsed ? 80 : 250,
        maxWidth: sidebarCollapsed ? 80 : 250,
        transition: 'width 0.2s, min-width 0.2s, max-width 0.2s'
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Collapsible Sidebar Toggle */}
      <div className="sidebar-toggle" style={{ padding: 8, textAlign: 'right' }}>
        <button
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: darkMode ? '#fff' : '#333',
            fontSize: 20
          }}
        >
          <i className={`fa ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="sidebar-profile" style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: sidebarCollapsed ? 'column' : 'row',
        padding: sidebarCollapsed ? '8px 0' : '8px 16px',
        borderBottom: '1px solid #eee'
      }}>
        <img src="images/admin.png" alt="avatar" style={{
          width: 38, height: 38, borderRadius: '50%', marginRight: sidebarCollapsed ? 0 : 10, marginBottom: sidebarCollapsed ? 6 : 0
        }} />
        {!sidebarCollapsed && (
          <div>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <span className="badge badge-primary" style={{
              fontSize: 13,
              color: '#fff',
              background: 'linear-gradient(90deg, #ff9800 60%, #ffc107 100%)',
              borderRadius: 12,
              padding: '4px 16px',
              fontWeight: 700,
              marginBottom: 8,
              marginTop: 6,
              display: 'inline-block',
              letterSpacing: 0.5,
              boxShadow: '0 2px 8px rgba(255,152,0,0.10)',
              border: '1px solid #ffe0b2',
              textTransform: 'lowercase'
            }}>{user.role}</span>
            {/* Version info just below the role */}
            <div style={{
              fontSize: 12,
              color: '#1976d2',
              fontWeight: 500,
              marginTop: 2
            }}>
              Version {packageJson.version}
            </div>
          </div>
        )}
      </div>

      {/* Search in Sidebar */}
      <div style={{ padding: sidebarCollapsed ? '8px 0' : '8px 16px', borderBottom: '1px solid #eee' }}>
        <input
          type="text"
          placeholder="Search menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 10px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 14
          }}
        />
      </div>

      {/* Main Menu */}
      <nav className="navbar navbar-expand-sm navbar-default" style={{ width: '100%' }}>
        <div id="main-menu" className="main-menu collapse navbar-collapse">
          <ul className="nav navbar-nav" style={{ width: '100%' }}>
            {filterMenuByRole(filterMenu(menuItems), user.role?.toUpperCase() || 'ADMIN').map(section => (
              <React.Fragment key={section.section}>
                {/* Section Title/Divider */}
                <li className="nav-section-title" style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#888',
                  padding: sidebarCollapsed ? '8px 0 4px 0' : '12px 16px 4px 16px',
                  borderTop: '1px solid #eee'
                }}>
                  {!sidebarCollapsed && section.section}
                </li>
                {section.items.map(item =>
                  item.dropdown ? (
                    <li className="menu-item-has-children dropdown" key={item.label}>
                      <a
                        href="#"
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        tabIndex={0}
                        title={item.label}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <i
                          className={`menu-icon fa ${item.icon}`}
                          style={{
                            width: 32,
                            textAlign: 'center',
                            fontSize: iconSize,
                            transition: 'font-size 0.2s'
                          }}
                        ></i>
                        {!sidebarCollapsed && <span>{item.label}</span>}
                        {!sidebarCollapsed && <i className="fa fa-caret-down" style={{ marginLeft: 'auto', fontSize: 12 }}></i>}
                      </a>
                      <ul className="sub-menu children dropdown-menu" style={{ left: sidebarCollapsed ? 60 : 250 }}>
                        {item.children.map(child => (
                          <li key={child.to}>
                            {child.label === t('nav.web_front') ? (
                              <NavLink
                                to="#"
                                className={({ isActive }) => isActive ? 'activeNavLink' : ''}
                                tabIndex={0}
                                title={child.label}
                                style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}
                                onClick={e => {
                                  e.preventDefault();
                                  setConfirmWebFrontOpen(true);
                                  setPendingWebFrontNav(child.to);
                                }}
                              >
                                {!sidebarCollapsed && (
                                  <span style={{ marginRight: 12 }}>{child.label}</span>
                                )}
                                {child.badge && <span className="badge badge-primary" style={{ marginLeft: 8 }}>{child.badge}</span>}
                              </NavLink>
                            ) : (
                              <NavLink
                                to={child.to}
                                className={({ isActive }) => isActive ? 'activeNavLink' : ''}
                                tabIndex={0}
                                title={child.label}
                                style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}
                              >
                                {!sidebarCollapsed && (
                                  <span style={{ marginRight: 12 }}>{child.label}</span>
                                )}
                                {child.badge && <span className="badge badge-primary" style={{ marginLeft: 8 }}>{child.badge}</span>}
                              </NavLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => isActive ? 'activeNavLink' : ''}
                        tabIndex={0}
                        title={item.label}
                        style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}
                      >
                        <i
                          className={`menu-icon fa ${item.icon || 'fa-circle'}`}
                          style={{
                            width: 32,
                            textAlign: 'center',
                            fontSize: iconSize,
                            transition: 'font-size 0.2s',
                            marginRight: !sidebarCollapsed ? 16 : 0 // <-- increased space between icon and label
                          }}
                        ></i>
                        {!sidebarCollapsed && (
                          <span style={{ marginRight: 12 }}>{item.label}</span> // <-- increased space between label and badge
                        )}
                        {item.badge && <span className="badge badge-primary" style={{ marginLeft: 8 }}>{item.badge}</span>}
                      </NavLink>
                    </li>
                  )
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </nav>
       <br/><br/><br/>
      {/* Responsive design: hide sidebar on small screens */}
      <style>
        {`
          @media (max-width: 768px) {
            .left-panel {
              position: absolute;
              z-index: 2000;
              height: 100vh;
              left: 0;
              top: 0;
              background: #fff;
              box-shadow: 2px 0 8px rgba(0,0,0,0.08);
            }
            .left-panel.collapsed {
              width: 0 !important;
              min-width: 0 !important;
              overflow: hidden;
            }
          }
          .left-panel.dark-mode {
            background: #23272b;
            color: #fff;
          }
          .left-panel .activeNavLink {
            background: #1976d2;
            color: #fff !important;
            border-radius: 4px;
          }
          .left-panel .menu-icon {
            color: #1976d2;
          }
          .left-panel.dark-mode .menu-icon {
            color: #90caf9;
          }
          .left-panel .badge-primary {
            background: #1976d2;
            color: #fff;
          }
        `}
      </style>

      {/* Confirmation modal for Web Front navigation */}
      {confirmWebFrontOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            minWidth: 320,
            boxShadow: '0 4px 24px rgba(25,118,210,0.12)'
          }}>
            <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Confirm Navigation</h2>
            <p style={{ fontSize: 16, marginBottom: 24 }}>Are you sure you want to open the Web Front page?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <button
                style={{
                  padding: '8px 24px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#eee',
                  color: '#1976d2',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setConfirmWebFrontOpen(false);
                  setPendingWebFrontNav(null);
                }}
              >Cancel</button>
              <button
                style={{
                  padding: '8px 24px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#1976d2',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setConfirmWebFrontOpen(false);
                  if (pendingWebFrontNav) window.location.href = pendingWebFrontNav;
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Navigation;
