import React, { useState } from 'react';
import './SubMenu.styles.scss';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function SubMenu({ item, setOpenMenu }) {
  const [open, setOpen] = useState(false);
  const { title, submenu } = item;

  const { pathname } = useLocation();
  let path = pathname.split('/');
  path.shift();

  path = path.length > 1 && decodeURIComponent(path[1]) == title;

  if (submenu.length === 0) {
    return (
      <div className="submenu">
        <NavLink
          to={`/articles/${title}`}
          className="link"
          onClick={() => setOpenMenu(false)}
        >
          <div className={`submenu`}>
            <div className="submenu__title">
              <div className="left">
                <span>{title.split('_').join(' ')}</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    );
  }
  return (
    <div className={`submenu ${open || path ? 'open' : ''}`}>
      <div
        onClick={() => setOpen(!open)}
        className="submenu__title flex-between"
      >
        <div className="left">
          <span>{title.split('_').join(' ')}</span>
        </div>
        {submenu.length > 0 && (
          <div className="chevronRightIcon right">
            <ChevronRightIcon />
          </div>
        )}
      </div>

      <div className="submenu__items">
        {submenu.map((item) => (
          <div key={item.title} className="item flex-center">
            {' '}
            <NavLink
              to={`/articles/${title}/${item.title}`}
              onClick={() => setOpenMenu(false)}
            >
              {item.title.split('_').join(' ')}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubMenu;
