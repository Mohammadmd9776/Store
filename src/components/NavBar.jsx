import React, { useContext } from "react";
import { Link } from "react-router-dom";

import UserContext from "../UserContext";

const NavBar = () => {
  const search = window.location;
  const userContext = useContext(UserContext);

  const onLogOut = (e) => {
    e.preventDefault();
    userContext.dispatch({type:'logout'})
    search.replace("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-style  navbar-dark bg-dark">
        <a className="navbar-brand" to="/">
          Mohammad Derakhshan
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {userContext.user.isLoggedIn && userContext.user.currentRole==="admin"? (
              <li className="nav-item">
                <Link
                  className="nav-link "
                  to="/products"
                  activeClassName="active"
                >
                  <i className="fa fa-suitcase"></i>
                  Products
                </Link>
              </li>
            ) : (
              ""
            )}
            {userContext.user.isLoggedIn ? (
              ""
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link "
                  aria-current="page"
                  to="/"
                  activeClassName="active"
                  exact={true}
                >
                  Login
                </Link>
              </li>
            )}

            {userContext.user.isLoggedIn ? (
              ""
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link "
                  to="/register"
                  activeClassName="active"
                >
                  Register
                </Link>
              </li>
            )}
            {userContext.user.isLoggedIn && userContext.user.currentRole==="user"? (
              <li className="nav-item">
                <Link
                  className="nav-link "
                  to="/dashboard"
                  activeClassName="active"
                >
                  <i className="fa fa-dashboard"></i>
                  Dashboard
                </Link>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item">
              <Link className="nav-link " to="/store" activeClassName="active">
                <i className="fa fa-shopping-bag"></i>
                Store
              </Link>
            </li>
          </ul>
          {userContext.user.isLoggedIn ? (
            <div style={{ marginRight: 100 }}>
              <ul className="navbar-nav ">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user circle" />
                    {userContext.user.currentUserName}
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link onClick={onLogOut} className="dropdown-item" to="">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>
    </div>
  );
};
export default NavBar;
