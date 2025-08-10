import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { NavLink, useLocation } from "react-router-dom"
import CurrentUser from '../../main/config/user';
import { LoadJSFiles } from '../init';
import messageHTTPService from '../../main/services/messageHTTPService';
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
const user = {
  name: username || "User",
  role: "Admin",
  avatar: "images/admin.png"
};

const Navigation = ({ connected, darkMode }) => {
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
      section: "Main",
      items: [
        { to: "/dashboard", icon: "fa-laptop", label: "Dashboard" },
        { to: "/Odontogram", icon: "fa-tooth", label: "Odontogram" }
      ]
    },
    {
      section: "Consultations",
      items: [
        {
          dropdown: true,
          icon: "fa-calendar",
          label: "Consultations",
          children: [
            { to: "/rendezvous", label: "Appointments", badge: 2, icon: "fa-calendar-check" },
            { to: "/quick-test", label: "Quick tests", icon: "fa-vial" }
          ]
        }
      ]
    },
    {
      section: "Management",
      items: [
        { to: "/patient", icon: "fa-user", label: "Patients" },
        { to: "/messages", icon: "fa-envelope-open", label: "Messages", badge: messages }, // <-- use messages state here
        { to: "/certificate", icon: "fa-certificate", label: "Certificates" },
        {
          dropdown: true,
          icon: "fa-usd",
          label: "Finances",
          children: [
            { to: "/payment", label: "Payments", icon: "fa-credit-card" },
            { to: "/expense", label: "Expenses", icon: "fa-money-bill" }
          ]
        },
        {
          dropdown: true,
          icon: "fa-hotel",
          label: "Pharmaceuticals",
          children: [
            { to: "/medicaments", label: "Medicaments", icon: "fa-pills" },
            { to: "/medicament-manufacture", label: "Manufactures", icon: "fa-industry" },
            { to: "/medicament-category", label: "Categories", icon: "fa-tags" }
          ]
        },
        { to: "/prescription", icon: "fa-bars", label: "Prescriptions" }
      ]
    },
    {
      section: "CMS",
      items: [
        {
          dropdown: true,
          icon: "fa-bookmark",
          label: "CMS",
          children: [
            { to: "/", label: "Web Front", icon: "fa-screen" },
            { to: "/aboutus", label: "About Us Page", icon: "fa-home" },
            { to: "/servicepage", label: "Service Page", icon: "fa-concierge-bell" }
          ]
        }
      ]
    },
    {
      section: "Analytics",
      items: [
        {
          dropdown: true,
          icon: "fa-area-chart",
          label: "Analytics",
          children: [
            { to: "/patient-analytics", label: "Patient", icon: "fa-user-chart" },
            { to: "/medicament-analytics", label: "Medicament", icon: "fa-chart-bar" }
          ]
        }
      ]
    },
    {
      section: "Clinic",
      items: [
        {
          dropdown: true,
          icon: "fa-medkit",
          label: "Clinic Management",
          children: [
            { to: "/treatment-plan", label: "Treatment Plan", icon: "fa-notes-medical" },
            { to: "/telemedicine", label: "Telemedicine", icon: "fa-video" },
            { to: "/staff", label: "Staff", icon: "fa-users" },
            { to: "/doctor", label: "Doctor", icon: "fa-user-md" },
            { to: "/clinic", label: "Clinic", icon: "fa-hospital" },
            { to: "/billing", label: "Billing", icon: "fa-file-invoice-dollar" }
          ]
        }
      ]
    },
    {
      section: "Diagnostics",
      items: [
        {
          dropdown: true,
          icon: "fa-stethoscope",
          label: "Diagnostics & Treatment",
          children: [
            { to: "/procedure", label: "Procedure", icon: "fa-stethoscope" },
            { to: "/operation", label: "Operation", icon: "fa-syringe" },
            { to: "/diagnosis", label: "Diagnosis", icon: "fa-diagnoses" },
            { to: "/dental-imaging", label: "Dental Imaging", icon: "fa-x-ray" }
          ]
        }
      ]
    },
    {
      section: "Records",
      items: [
        {
          dropdown: true,
          icon: "fa-heartbeat",
          label: "Patient Records",
          children: [
            { to: "/dental-membership", label: "Dental Membership", icon: "fa-id-card" },
            { to: "/insurance", label: "Insurance", icon: "fa-shield-alt" }
          ]
        }
      ]
    },
    {
      section: "Inventory",
      items: [
        {
          dropdown: true,
          icon: "fa-archive",
          label: "Inventory Management",
          children: [
            { to: "/inventory-item", label: "Inventory Item", icon: "fa-boxes" },
            { to: "/equipment-maintenance", label: "Equipment Maintenance", icon: "fa-tools" }
          ]
        }
      ]
    },
    {
      section: "Settings",
      items: [
        { to: "/configuration", icon: "fa-cogs", label: "Settings" },
        { to: "/help", icon: "fa-question-circle", label: "Help" }
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
        <img src={user.avatar} alt="avatar" style={{
          width: 38, height: 38, borderRadius: '50%', marginRight: sidebarCollapsed ? 0 : 10, marginBottom: sidebarCollapsed ? 6 : 0
        }} />
        {!sidebarCollapsed && (
          <div>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{user.role}</div>
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
            {filterMenu(menuItems).map(section => (
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
    </aside>
  );
};

export default Navigation;
