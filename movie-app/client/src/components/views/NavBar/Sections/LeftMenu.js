import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const items = [
  { label: <Link to="favorite">Favorite</Link>, key: "favorite" },
  { label: "메뉴2", key: "menu2" },
  {
    label: "메뉴3",
    key: "menu3",
    children: [{ label: "서브메뉴1", key: "sub-menu1" }],
  },
];

function LeftMenu(props) {
  return <Menu items={items} mode={props.mode} />;
}

export default LeftMenu;
