import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  // *option*
  // null => 아무나 출입이 가능한 페이지
  // ture => 로그인한 유저만 출입이 가능한 페이지
  // false => 로그인한 유저는 출입 불가능한 페이지

  // *adminRoute*
  // 관리자만 출입하게 하려면 true

  function AuthenticationCheck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // 로그인 하지 않은 사람이
        if (!response.payload.isAuth) {
          // 로그인한 유저만 출입이 가능한 페이지에 접근하면
          if (option) {
            navigate("/login");
          }
          // 로그인 한 사람이
        } else {
          // 어드민만 접근가능한 페이지에 접근하면
          if (adminRoute && !response.payload.isAdmin) {
            navigate("/");
            // 로그인 안한 유저만 출입이 가능한 페이지에 접근하면
          } else {
            if (option === false) {
              navigate("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
