import React, { Fragment, useState } from 'react';
import './Header.styles.scss';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button.component';
import AddIcon from '@mui/icons-material/Add';

import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selectors';

import LoadingLogo from '../../assets/loading__logo.png';

function Header({ setOpenMenu }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { first_name, last_name, role } = useSelector(selectCurrentUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) navigate(`/articles?search=${search}`);
  };

  return (
    <Fragment>
      <div className="header__height"></div>
      <div className="header flex-between">
        <div className="header__left flex-center">
          <Link to={'/'} className="logo">
            <img src={LoadingLogo} />
          </Link>

          {role !== 'reader' && (
            <Link to={'/articles/ajouter'} className="add__button">
              <Button nomargin fitContent>
                <AddIcon />
                <span>Ajouter un article</span>
              </Button>
            </Link>
          )}
        </div>

        {/* <Link to={"/articles"}><Logo /></Link> */}

        <div className="flex-center">
          <div className="user flex-between">
            <div className="search">
              <form onSubmit={handleSubmit}>
                <div className="search__group">
                  <SearchIcon />
                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value.toLocaleLowerCase())
                    }
                    placeholder="Tapez pour rechercher ..."
                  />
                </div>
              </form>
            </div>

            <Link to={'/users'}>
              <div className="avatar">
                <Avatar
                  alt="Oussama belbachir"
                  src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                />
                <div>
                  <span className="full__name">
                    {first_name} {last_name}
                  </span>
                  <span className="role">
                    {role === 'admin'
                      ? 'admin'
                      : role === 'editor'
                      ? 'éditeur'
                      : 'lecteur'}
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <div className="menu" onClick={() => setOpenMenu(true)}>
            <MenuIcon className="menu__icon custom-icon" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Header;
