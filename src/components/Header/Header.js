import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import { Link, useHistory, useLocation } from 'react-router-dom';
import CurrentUser from '../../main/config/user';
import messageHTTPService from '../../main/services/messageHTTPService'
import showMessage from '../../libraries/messages/messages';
import { LinearProgress, Switch, MenuItem, Menu, IconButton, Avatar, Tooltip, Badge, Chip, Select } from '@mui/material';
import appointementHTTPService from '../../main/services/appointementHTTPService';
import { FaPlus, FaBell, FaQuestionCircle, FaBars, FaCircle, FaUserCircle, FaCog, FaPowerOff, FaUser, FaGlobe, FaTooth } from 'react-icons/fa';
import axios from 'axios'; // Add this if not already imported
import BASE_URL from '../../main/urls/urls';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import es from './locales/es.json'; // Add this import
import vi from './locales/vi.json';
import th from './locales/th.json';
import pt from './locales/pt.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import tr from './locales/tr.json';
import fil from './locales/fil.json';
import id from './locales/id.json';
import { useTranslation } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
      es: { translation: es },
      vi: { translation: vi },
      th: { translation: th },
      pt: { translation: pt },
      hi: { translation: hi },
      bn: { translation: bn },
      tr: { translation: tr },
      fil: { translation: fil },
      id: { translation: id }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    initImmediate: false  // synchronous init so translations are ready before first render
  });



const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'pt', label: 'Português' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'fil', label: 'Filipino' },
  { code: 'id', label: 'Bahasa Indonesia' }
];

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

// Example usage in header (e.g., greeting or profile menu)
function getCurrentUser() {
    try {
        const userObj = JSON.parse(localStorage.getItem('user'));
        if (userObj) {
            return {
                name: userObj.fullName || userObj.username || "User",
                role: userObj.role || "Administrator",
                avatar: "images/admin.png"
            };
        }
    } catch {}
    return {
        name: username || "User",
        role: "Administrator",
        avatar: "images/admin.png"
    };
}
const Header = ({ connected, handleClick }) => {
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
    let history = useHistory();
    let location = useLocation();
    const [loading, setLoading] = useState(false);
    const [messsage, setmessage] = useState([]);
    const [appointements, setAppointements] = useState([]);
    const initialState = { input: '' };
    const [activity, setActivity] = useState(initialState);

    // Theme switcher
    const [darkMode, setDarkMode] = useState(false);
    const handleThemeChange = () => setDarkMode((prev) => !prev);

    const { i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language);

    const handleLangChange = (e) => {
      setLang(e.target.value);
      i18n.changeLanguage(e.target.value);
    };

    // Hamburger menu for mobile
    const [navOpen, setNavOpen] = useState(true);
    const toggleNav = () => setNavOpen(open => !open);

    // User dropdown
    const [userAnchorEl, setUserAnchorEl] = useState(null);
    const handleUserMenu = (event) => setUserAnchorEl(event.currentTarget);
    const handleUserClose = () => setUserAnchorEl(null);

    // Quick Add
    const [quickAddAnchorEl, setQuickAddAnchorEl] = useState(null);
    const handleQuickAdd = (event) => setQuickAddAnchorEl(event.currentTarget);
    const handleQuickAddClose = () => setQuickAddAnchorEl(null);

    // System status
    const [systemStatus, setSystemStatus] = useState('online'); // online, warning, offline

    // Customizable shortcuts (example)
    const shortcuts = [];

    // Breadcrumbs
    const breadcrumbs = location.pathname.split('/').filter(Boolean);

    // Add state for appointments menu anchor
    const [appointmentsAnchorEl, setAppointmentsAnchorEl] = useState(null);
    const [clinicSettings, setClinicSettings] = useState({ system: { appName: 'App' } });

    const logout = () => {
    handleClick(false)
    localStorage.clear();
    // For extra safety, also remove 'user' key directly
    localStorage.removeItem('user');
    history.push("/login")
    }

    useEffect(() => {
        if (CurrentUser.DEMO_MODE) {
            fetch('/demo/clinicssettings.json')
                .then(res => res.json())
                .then(data => setClinicSettings(data))
                .catch(() => setClinicSettings({ system: { appName: 'App' } }));
        } else {
            axios.get(`${BASE_URL}/clinicsettings`)
                .then(res => setClinicSettings(res.data))
                .catch(() => setClinicSettings({ system: { appName: 'App' } }));
        }
        // LoadJS()
        //  getAllExpenses()
    }, []);

    const print = () => {
        history.replace("/result/" + activity.input)
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    };

    const search = (event) => {
        if (event.keyCode === 13) {
            history.replace("/result/" + activity.input)
        }
    }

    const getAllExpenses = () => {
        setLoading(true);
        messageHTTPService.getAllMessage()
            .then(response => {
                setmessage(response.data);
                setLoading(false);
            })
            .catch(e => {
                showMessage('Error', CurrentUser.ERR_MSG, 'warning')
            });
    };

    const getAllAppointements = () => {
        setLoading(true);

        if (CurrentUser.DEMO_MODE) {
            fetch('/demo/appointments.json')
                .then(res => res.json())
                .then(data => {
                    setAppointements(data);
                    setLoading(false);
                })
                .catch(e => {
                    showMessage('Error', CurrentUser.ERR_MSG, 'warning');
                    setLoading(false);
                });
        } else {
            appointementHTTPService.getAllAppointement()
                .then(response => {
                    setAppointements(response.data);
                    setLoading(false);
                })
                .catch(e => {
                    showMessage('Error', CurrentUser.ERR_MSG, 'warning');
                    setLoading(false);
                });
        }
    };

    const handleAppointmentsClick = (event) => {
        setAppointmentsAnchorEl(event.currentTarget);
        getAllAppointements(); // Fetch appointments when opening
    };
    const handleAppointmentsClose = () => setAppointmentsAnchorEl(null);

    const { t } = useTranslation();

    return (
        <header id="header" className={`header${darkMode ? ' dark-mode' : ''}`} style={{ display: (connected ? 'block' : 'none') }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        flexWrap: 'nowrap',
                        padding: '0 16px',
                        minHeight: 64,
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Left: App Name instead of Logo */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="navbar-brand" style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 700,
                            fontSize: 28,
                            color: '#1976d2',
                            letterSpacing: 1,
                            fontFamily: 'inherit'
                        }}>
                            <FaTooth style={{ fontSize: 32, marginRight: 10, color: '#1976d2' }} />
                            {clinicSettings?.system?.appName || 'App'}
                        </span>
                        {/* Remove logo images */}
                        {/* <a className="navbar-brand"><img src="images/logo.png" alt="Logo" /></a>
                        <a className="navbar-brand hidden"><img src="images/logo2.png" alt="Logo" /></a> */}
                        <IconButton onClick={toggleNav} sx={{ ml: 1, display: { md: 'none' } }}>
                            <FaBars />
                        </IconButton>
                    </div>
                    {/* Breadcrumb Navigation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        marginLeft: 16,
                        marginRight: 16,
                        minWidth: 0,
                        overflow: 'hidden'
                    }}>
                        <FaGlobe style={{ marginRight: 8, color: '#1976d2', flexShrink: 0 }} />
                        <nav aria-label="breadcrumb" style={{ width: '100%', overflow: 'hidden' }}>
                            <ol className="breadcrumb" style={{
                                margin: 0,
                                background: 'none',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflowX: 'auto'
                            }}>
                                <li className="breadcrumb-item"><Link to="/">{t('home.menu_home')}</Link></li>
                                {breadcrumbs.map((crumb, idx) => (
                                    <li key={idx} className="breadcrumb-item">
                                        <Link to={`/${breadcrumbs.slice(0, idx + 1).join('/')}`}>{crumb.charAt(0).toUpperCase() + crumb.slice(1)}</Link>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                    {/* Right: All header actions */}
                    <div className="header-menu" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexShrink: 0
                    }}>
                        {/* Remove the dark mode Switch */}
                        {/* <Tooltip title="Toggle light/dark mode">
                            <Switch checked={darkMode} onChange={handleThemeChange} color="default" />
                        </Tooltip> */}
                        <Select
                            value={lang}
                            onChange={handleLangChange}
                            size="small"
                            sx={{ minWidth: 90, fontSize: 14, background: '#fff' }}
                        >
                            <MenuItem key="en" value="en">English</MenuItem>
                            <MenuItem key="fr" value="fr">Français</MenuItem>
                            <MenuItem key="ar" value="ar">العربية</MenuItem>
                            <MenuItem key="es" value="es">Español</MenuItem> {/* Add Spanish option */}
                            <MenuItem key="vi" value="vi">Tiếng Việt</MenuItem>
                            <MenuItem key="th" value="th">ไทย</MenuItem>
                            <MenuItem key="pt" value="pt">Português</MenuItem>
                            <MenuItem key="hi" value="hi">हिन्दी</MenuItem>
                            <MenuItem key="bn" value="bn">বাংলা</MenuItem>
                            <MenuItem key="tr" value="tr">Türkçe</MenuItem>
                            <MenuItem key="fil" value="fil">Filipino</MenuItem>
                            <MenuItem key="id" value="id">Bahasa Indonesia</MenuItem>
                        </Select>
                        <div className="form-inline" style={{ marginRight: 0 }}>
                            <form className="search-form" onSubmit={e => { e.preventDefault(); print(); }}>
                                <input
                                    onChange={handleInputChange}
                                    name="input"
                                    value={activity.input}
                                    onKeyDown={search}
                                    className="form-control mr-sm-2"
                                    type="text"
                                    placeholder="Global Search..."
                                    aria-label="Search"
                                    style={{ minWidth: 140, maxWidth: 180 }}
                                />
                                <button className="search-close" type="submit"><i className="fa fa-search"></i></button>
                            </form>
                        </div>
                        <Tooltip title="Quick Add">
                            <IconButton color="primary" onClick={handleQuickAdd}>
                                <FaPlus />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={quickAddAnchorEl}
                            open={Boolean(quickAddAnchorEl)}
                            onClose={handleQuickAddClose}
                        >
                            <MenuItem onClick={() => { handleQuickAddClose(); history.push('/appointments/add'); }}>
                                {t('add_appointment')}
                            </MenuItem>
                            <MenuItem onClick={() => { handleQuickAddClose(); history.push('/patients/add'); }}>
                                {t('add_patient')}
                            </MenuItem>
                            <MenuItem onClick={() => { handleQuickAddClose(); history.push('/inventory/add'); }}>
                                {t('add_inventory_item')}
                            </MenuItem>
                        </Menu>
                        <Tooltip title="Appointments">
                            <IconButton color="secondary" onClick={handleAppointmentsClick}>
                                <Badge badgeContent={appointements?.length} color="error">
                                    <FaBell />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={appointmentsAnchorEl}
                            open={Boolean(appointmentsAnchorEl)}
                            onClose={handleAppointmentsClose}
                            PaperProps={{
                                style: { minWidth: 340, maxHeight: 350, overflowY: 'auto', paddingBottom: 0 }
                            }}
                        >
                            <MenuItem disabled>
                                <strong>{t('appointments_count', { count: appointements.length })}</strong>
                            </MenuItem>
                            {loading ? (
                                <MenuItem>{t('loading')}</MenuItem>
                            ) : appointements.length === 0 ? (
                                <MenuItem>{t('no_appointments')}</MenuItem>
                            ) : (
                                appointements.map(itemm => (
                                    <MenuItem
                                        key={itemm.id || itemm.patient}
                                        style={{
                                            whiteSpace: 'normal',
                                            alignItems: 'flex-start',
                                            padding: '12px 8px',
                                            borderBottom: '1px solid #f0f0f0',
                                            background: '#f9f9f9',
                                            borderRadius: 8,
                                            margin: '6px 0'
                                        }}
                                    >
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                                <span style={{
                                                    fontWeight: 600,
                                                    fontSize: 15,
                                                    color: '#1976d2',
                                                    marginRight: 8
                                                }}>
                                                    {itemm.patient}
                                                </span>
                                                {itemm.status && (
                                                    <span
                                                        style={{
                                                            background:
                                                                itemm.status === 'Confirmed' ? '#e8f5e9'
                                                                : itemm.status === 'Pending' ? '#fff8e1'
                                                                : itemm.status === 'Cancelled' ? '#ffebee'
                                                                : '#e3f2fd',
                                                            color:
                                                                itemm.status === 'Confirmed' ? '#388e3c'
                                                                : itemm.status === 'Pending' ? '#ffa000'
                                                                : itemm.status === 'Cancelled' ? '#e53935'
                                                                : '#1976d2',
                                                            borderRadius: 8,
                                                            padding: '2px 10px',
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                            marginLeft: 4
                                                        }}
                                                    >
                                                        {itemm.status}
                                                    </span>
                                                )}
                                            </div>
                                            {itemm.date && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Date:</strong>{' '}
                                                    <span style={{
                                                        background: '#e3f2fd',
                                                        color: '#1976d2',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13,
                                                        fontWeight: 500
                                                    }}>
                                                        {new Date(itemm.date).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.startTime && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Start:</strong>{' '}
                                                    <span style={{
                                                        background: '#fffde7',
                                                        color: '#fbc02d',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.startTime}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.endTime && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>End:</strong>{' '}
                                                    <span style={{
                                                        background: '#e1f5fe',
                                                        color: '#0288d1',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.endTime}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.doctor && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Doctor:</strong>{' '}
                                                    <span style={{
                                                        background: '#ede7f6',
                                                        color: '#5e35b1',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.doctor}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.type && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Type:</strong>{' '}
                                                    <span style={{
                                                        background: '#f3e5f5',
                                                        color: '#8e24aa',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.type}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.location && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Location:</strong>{' '}
                                                    <span style={{
                                                        background: '#e0f2f1',
                                                        color: '#00897b',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.location}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.phone && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Phone:</strong>{' '}
                                                    <span style={{
                                                        background: '#fce4ec',
                                                        color: '#ad1457',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.phone}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.reason && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Reason:</strong>{' '}
                                                    <span style={{
                                                        background: '#fff3e0',
                                                        color: '#ef6c00',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.reason}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.notes && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Notes:</strong>{' '}
                                                    <span style={{
                                                        background: '#f3e5f5',
                                                        color: '#8e24aa',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {itemm.notes}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.createdAt && (
                                                <div style={{ marginBottom: 2 }}>
                                                    <strong>Created:</strong>{' '}
                                                    <span style={{
                                                        background: '#ede7f6',
                                                        color: '#5e35b1',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {new Date(itemm.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            {itemm.updatedAt && (
                                                <div>
                                                    <strong>Updated:</strong>{' '}
                                                    <span style={{
                                                        background: '#fbe9e7',
                                                        color: '#d84315',
                                                        borderRadius: 6,
                                                        padding: '2px 8px',
                                                        fontSize: 13
                                                    }}>
                                                        {new Date(itemm.updatedAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </MenuItem>
                                ))
                            )}
                        </Menu>
                        <Tooltip title={t('help_support')}>
                            <IconButton color="info" component={Link} to="/help">
                                <FaQuestionCircle />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleUserMenu} sx={{ ml: 1 }}>
                            <Avatar src={user.avatar} alt={user.name} />
                        </IconButton>
                        <Menu
                            anchorEl={userAnchorEl}
                            open={Boolean(userAnchorEl)}
                            onClose={handleUserClose}
                        >
                            <MenuItem disabled>
                                <Avatar src={user.avatar} sx={{ mr: 1 }} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                                    <div style={{ fontSize: 13, color: '#888' }}>{user.role}</div>
                                </div>
                            </MenuItem>
                            <MenuItem onClick={() => { handleUserClose(); history.push('/profile'); }}>
                                <FaUserCircle style={{ marginRight: 8 }} /> {t('my_profile')}
                            </MenuItem>
                            <MenuItem onClick={() => { handleUserClose(); history.push('/configuration'); }}>
                                <FaCog style={{ marginRight: 8 }} /> {t('settings')}
                            </MenuItem>
                            <MenuItem onClick={() => { handleUserClose(); logout(); }}>
                                <FaPowerOff style={{ marginRight: 8 }} /> {t('log_out')}
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </header>
    )
};

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
