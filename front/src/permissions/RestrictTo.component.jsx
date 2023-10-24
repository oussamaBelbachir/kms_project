import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../store/user/user.selectors";
import { useSelector } from "react-redux";

function RestrictTo({ roles }) {
  const user = useSelector(selectCurrentUser);
  return roles.includes(user.role) ? <Outlet /> : <Navigate to="/" />;
}

export default RestrictTo;
