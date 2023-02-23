import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

function Login(props) {
  const { history } = props;
  const userContext = useContext(UserContext);

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("12");
  const [dirty, setDirty] = useState({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeEmailHandler = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const onChangePasswordHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const valid = () => {
    let errorsData = {};
    //email
    errorsData.email = [];
    //password
    errorsData.password = [];
    //blank email
    if (!email) {
      errorsData.email.push("email is blank");
    }
    //wrong email format
    const emailRex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email) {
      if (!emailRex.test(email)) {
        errorsData.email.push("email not valid");
      }
    }
    //password blank
    if (!password) {
      errorsData.password.push("password is blank");
    }
    setErrors(errorsData);
  };

  useEffect(valid, [email, password]);
  const onLoginClick = async () => {
    let dirtyDate = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyDate[control] = true;
    });
    setDirty([dirtyDate]);
    valid();
    if (isValid()) {
      let response = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`,
        { method: "GET" }
      );

      if (response.ok) {
        let responseBody = await response.json();

        if (responseBody.length > 0) {
          userContext.dispatch({
            type:'login',
            payload:{
              currentUserId: responseBody[0].id,
              currentUserName: responseBody[0].fullName,
              currentRole: responseBody[0].role,}
          });


          if(responseBody[0].role==='user'){history.replace("/dashboard");}else{history.replace("/products");}
          
        } else {
          setErrorMessage(
            <p className="text-danger">Please check email or password</p>
          );
        }
      }
    } else {
      setErrorMessage(<p className="text-danger">Wrong db connection</p>);
    }
  };

  const isValid = () => {
    let valid = true;
    for (let control in errors) {
      if (errors[control].length > 0) {
        valid = false;
      }
    }
    return valid;
  };

  return (
    <div className="row">
      <div className="col-lo-5 col-md-7 mx-auto">
        <div className="card border-success shadow-lg my-2">
          <div className="card-header border-bottom border-success">
            <h2
              style={{ fontSize: "40px" }}
              className="text-success text-center"
            >
              Login
            </h2>
          </div>
          <div className="card-body border-bottom border-success">
            <div className="form-group">
              <label className="mb-2" htmlFor="email">
                Email
              </label>
              <input
                value={email}
                onChange={onChangeEmailHandler}
                autoComplete="off"
                type="text"
                className="form-control"
                id="email"
                placeholder="please enter ur email"
                name="email"
                onBlur={(e) => {
                  setDirty({ ...dirty, [e.target.name]: true });
                  valid();
                }}
              ></input>
              <div className="text-danger">
                {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
              </div>
            </div>
            <div className="form-group mt-3">
              <label className="mb-2" htmlFor="password">
                Password
              </label>
              <input
                value={password}
                onChange={onChangePasswordHandler}
                autoComplete="off"
                type="text"
                className="form-control"
                id="password"
                placeholder="please enter ur password"
                name="password"
                onBlur={(e) => {
                  setDirty({ ...dirty, [e.target.name]: true });
                  valid();
                }}
              ></input>
              <div className="text-danger">
                {dirty["password"] && errors["password"][0]
                  ? errors["password"]
                  : ""}
              </div>
            </div>
          </div>
          <div className="card-footer text-center">
            <div className="m-1">{errorMessage}</div>
            <button className="btn btn-success m-2" onClick={onLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
