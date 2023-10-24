import React from 'react';
import SubMenu from '../SubMenu/SubMenu.component';
import './Sidebar.styles.scss';
import Logo from '../Logo/Logo.component';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selectors';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Api/auth';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../store/user/user.actions';
import adminRoutes from './adminRoutes';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink } from 'react-router-dom';

function Sidebar({ openMenu, setOpenMenu }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);

  const direction_departments =
    user.role !== 'admin'
      ? user.direction_departments
      : JSON.parse(import.meta.env.VITE_DIRECTION_DEPARTMENTS);

  const menuItems = Object.keys(direction_departments).map((el) => {
    const submenu = direction_departments[el].map((dep) => ({
      title: dep,
      url: '/' + dep,
    }));

    return {
      title: el,
      url: '/' + el,
      submenu,
    };
  });

  const handleLogout = async () => {
    await logout();
    dispatch(setCurrentUser(null));
    navigate('/connexion');
  };

  return (
    <div className={`sidebar ${openMenu && 'open'}`}>
      <div>
        <div className="sidebar__logo">
          <Link to={'/articles'}>
            <Logo />
          </Link>
          <div className="close__menu" onClick={() => setOpenMenu(false)}>
            <CloseIcon className="custom-icon" />
          </div>
        </div>

        <div className="sidebar__menu">
          {menuItems.map((item) => (
            <SubMenu key={item.title} item={item} setOpenMenu={setOpenMenu} />
          ))}
        </div>

        {/* =================================   Admin   =================================*/}
        {user.role === 'admin' && (
          <div className="admin__sidebar">
            {adminRoutes.map((el) => (
              <div key={el.name} className="sidebar__item">
                <NavLink
                  to={el.link}
                  className="flex-center"
                  onClick={() => setOpenMenu(false)}
                >
                  <span>
                    <el.icon className="custom-icon" />
                  </span>
                  <span>{el.name}</span>
                </NavLink>
              </div>
            ))}
          </div>
        )}
        {/* =================================   Admin   =================================*/}

        <div className="sidebar__item">
          <NavLink to={'/profile'} className="flex-center">
            <span>
              <AccountCircleIcon className="custom-icon" />
            </span>
            <span>Profil</span>
          </NavLink>
        </div>
      </div>

      <div className="logout" onClick={handleLogout}>
        <LogoutIcon />
        deconnexion
      </div>
    </div>
  );
}

export default Sidebar;
