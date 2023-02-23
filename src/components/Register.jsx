import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

const Register = (props) => {
  const search = window.location;
  const userContext=useContext(UserContext)
  const [state, setState] = useState({
    email: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    receiveNewsLetters: "",
  });
  const [countries, setCountries] = useState([
    { id: 1, countyName: "Iran" },
    { id: 2, countyName: "India" },
    { id: 3, countyName: "USA" },
    { id: 4, countyName: "Japan" },
    { id: 5, countyName: "France" },
  ]);
  const [errors, setErrors] = useState({
    email: [],
    password: [],
    fullName: [],
    dateOfBirth: [],
    gender: [],
    country: [],
    receiveNewsLetters: [],
  });
  const [dirty, setDirty] = useState({
    email: false,
    password: false,
    fullName: false,
    dateOfBirth: false,
    gender: false,
    country: false,
    receiveNewsLetters: false,
  });
  const [message, setMessage] = useState("");

  const valid = () => {
    let errorsData = {};
    //email
    errorsData.email = [];
    //password
    errorsData.password = [];
    //fullName
    errorsData.fullName = [];
    //dateOfBirth
    errorsData.dateOfBirth = [];
    //gender
    errorsData.gender = [];
    //country
    errorsData.country = [];

    //blank email
    if (!state.email) {
      errorsData.email.push("email is blank");
    }
    //wrong email format
    const emailRex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (state.email) {
      if (!emailRex.test(state.email)) {
        errorsData.email.push("email not valid");
      }
    }
    //password blank
    if (!state.password) {
      errorsData.password.push("password is blank");
    }
    //wrong password format
    
    //fullName
    if (!state.fullName) {
      errorsData.fullName.push("fullName is blank");
    }
    if (!state.dateOfBirth) {
      errorsData.dateOfBirth.push("dateOfBirth is blank");
    }
    if (!state.gender) {
      errorsData.gender.push("please select gender");
    }
    if (!state.country) {
      errorsData.country.push("please select country");
    }
    setErrors(errorsData);
  };

  const onRegisterClick = async () => {
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    valid();
    if (isValid()) {
      let response = await fetch("http://localhost:5000/users", {
        method: "POST",
        body: JSON.stringify({
          email: state.email,
          password: state.password,
          fullName: state.fullName,
          dateOfBirth: state.dateOfBirth,
          gender: state.gender,
          country: state.country,
          receiveNewsLetters: state.receiveNewsLetters,
          role:"user"
        }),
        headers: { "Content-type": "application/json" },
      });
      if (response.ok) {
        
        setMessage(<span className="text-succsee">Register is Successed</span>);
        let responseBody = await response.json();
        userContext.dispatch({
          type:'login',
          payload:{currentUserId:responseBody.id,
            currentUserName:responseBody.fullName,
            currentRole:responseBody.role,}
          
        })
        search.replace('/dashboard')
      } else {
        setMessage(<span className="text-danger">Error in db connection</span>);
      }
    } else {
      setMessage(<span className="text-danger">Errors</span>);
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
      <div className="col-lg-6 col-md-7 mx-auto">
        <div className="card border-primary shadow my-2">
          <div className="card-header border-bottom border-primary">
            <h4
              style={{ fontSize: "40px" }}
              className="text-primary text-center"
            >
              Register
            </h4>
            <ul className="text-danger">
              {Object.keys(errors).map((control) => {
                if (dirty[control]) {
                  return errors[control].map((err) => {
                    return <li key={err}>{err}</li>;
                  });
                } else {
                  return "";
                }
              })}
            </ul>
          </div>
          <div className="card-body border-primary ">
            <div className="form-group form-row ">
              <label className="col-lg-4 mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="form-control mb-2"
                name="email"
                value={state.email}
                onBlur={(e)=>{setDirty({...dirty,[e.target.name]:true});valid();}}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-group form-row">
              <label className="col-lg-4 mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="text"
                id="password"
                className="form-control mb-2"
                name="password"
                value={state.password}
                onBlur={(e)=>{setDirty({...dirty,[e.target.name]:true});valid();}}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-group form-row">
              <label className="col-lg-4 mb-1" htmlFor="fullName">
                fullName
              </label>
              <input
                type="text"
                id="fullName"
                className="form-control mb-2"
                name="fullName"
                value={state.fullName}
                onBlur={(e)=>{setDirty({...dirty,[e.target.name]:true});valid();}}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-group form-row">
              <label className="col-lg-4 mb-1" htmlFor="dateOfBirth">
                dateOfBirth
              </label>
              <input
                type="text"
                id="dateOfBirth"
                className="form-control mb-2"
                onBlur={(e)=>{setDirty({...dirty,[e.target.name]:true});valid();}}
                name="dateOfBirth"
                value={state.dateOfBirth}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-group form-row">
              <label className="col-lg-4 mb-1">gender</label>
              <div className="col-lg-8">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input mb-2"
                    id="male"
                    name="gender"
                    value="male"
                    checked={state.gender === "male" ? true : false}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                  />
                  <label htmlFor="male" className="form-check-inline mb-1">
                    male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input mb-2"
                    id="female"
                    name="gender"
                    value="female"
                    checked={state.gender === "female" ? true : false}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                  />
                  <label htmlFor="female" className="form-check-inline mb-1">
                    female
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group form-row">
              <label className="col-lg-4 mb-1" htmlFor="country">
                country
              </label>

              <select
                id="country"
                className="form-control mb-2"
                name="country"
                value={state.country}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.countyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group form-row">
              <input
                type="checkbox"
                id="receiveNewsLetters"
                className="form-check-input mb-2"
                name="receiveNewsLetters"
                value="true"
                checked={state.receiveNewsLetters ? true : false}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.checked })
                }
              />
              <label className="col-lg-4 ml-5" htmlFor="receiveNewsLetters">
                Receve News Letters
              </label>
            </div>
          </div>
          <div className="card-footer text-center">
            <div className="m-1">{message}</div>
            <div>
              <button className="btn btn-primary m-2" onClick={onRegisterClick}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
