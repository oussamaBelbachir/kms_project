import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListOfUsers from './ListOfUsers/ListOfUsers.component';
import CreateUser from './CreateUser/CreateUser.component';
import UpdateUser from './UpdateUser/UpdateUser.component';

function Users() {
  return (
    <Routes>
      <Route index element={<ListOfUsers />} />
      <Route path="ajouter" element={<CreateUser />} />
      <Route path="/:id/modifier" element={<UpdateUser />} />
    </Routes>
  );
}

export default Users;
