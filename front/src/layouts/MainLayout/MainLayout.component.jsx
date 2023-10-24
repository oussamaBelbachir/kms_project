import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header.component';
import Sidebar from '../../components/Sidebar/Sidebar.component';
import './MainLayout.styles.scss';

function MainLayout() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="mainlayout">
      <Sidebar openMenu={openMenu} setOpenMenu={(v) => setOpenMenu(v)} />

      <div className="mainlayout__right">
        <Header setOpenMenu={(v) => setOpenMenu(v)} />
        <div className="main__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
