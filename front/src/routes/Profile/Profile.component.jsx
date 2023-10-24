import React from 'react';
import './Profile.styles.scss';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selectors';
import Port from '../../assets/port2.jpeg';
import DirectionList from '../../components/DirectionList/DirectionList.component';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import UpdatePassword from '../../components/UpdatePassword/UpdatePassword.component';

function Profile() {
  const user = useSelector(selectCurrentUser);
  const img =
    'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg';

  const { first_name, last_name, role, direction_departments } = user;
  let dir_deps = direction_departments;
  if (role === 'admin') {
    dir_deps = JSON.parse(import.meta.env.VITE_DIRECTION_DEPARTMENTS);
  }

  return (
    <div className="profile">
      <div
        className="backgroundImg"
        style={{ backgroundImage: `url(${Port})` }}
      />
      <div className="image" style={{ backgroundImage: `url(${img})` }}></div>

      <div className="fullname">
        {first_name} {last_name}
      </div>
      <div className="role">
        {role === 'admin' ? (
          'admin'
        ) : role === 'editor' ? (
          <div className="flex-center">
            <EditIcon /> éditeur
          </div>
        ) : (
          <div className="flex-center">
            <VisibilityIcon /> lecteur
          </div>
        )}
      </div>

      <div className="p-10">
        <div className="directions">
          {Object.keys(dir_deps).map((dir) => (
            <DirectionList
              key={dir}
              direction={dir}
              departments={direction_departments[dir]}
            />
          ))}
        </div>

        <UpdatePassword />
      </div>
    </div>
  );
}

export default Profile;
