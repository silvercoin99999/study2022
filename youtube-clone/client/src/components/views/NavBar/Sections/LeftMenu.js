import React from "react";
import { Menu } from "antd";

const items = [
  { label: "메뉴1", key: "menu1" }, // remember to pass the key prop
  { label: "메뉴2", key: "menu2" }, // which is required
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
