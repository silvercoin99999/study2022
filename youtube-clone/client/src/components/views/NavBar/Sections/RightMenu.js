/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const items1 = [
  { label: <Link to="/login">Signin</Link>, key: "Signin" },
  { label: <Link to="/register">Signup</Link>, key: "Signup" },
];
const items2 = [
  { label: <Link to="/video/upload">upload</Link>, key: "upload" },
];

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        navigate("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return <Menu items={items1} mode={props.mode} />;
  } else {
    return (
      <>
        <Menu items={items2} mode={props.mode} />
        <button onClick={logoutHandler}>로그아웃</button>
      </>
    );
  }
}

export default RightMenu;
