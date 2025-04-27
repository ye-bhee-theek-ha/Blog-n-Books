import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

import { IconLoader } from "@tabler/icons-react";

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slices/authSlice";


const SignupForm = (props) => {

  const dispatch = useDispatch(); 
  const { status, error: authError, isLoggedIn } = useSelector((state) => state.auth);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    Repassword: "",
  });

  const [errMsg, SeterrMsg] = useState("");
  const isloading = status === 'loading'; 

  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'succeeded' && localStorage.getItem('token')) {
      navigate("/");
    }
  }, [status, navigate]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    SeterrMsg(""); // Clear previous errors

    if (!(formData.password === formData.Repassword)) {
      SeterrMsg("Passwords do not Match.");
      return;
    }

    dispatch(registerUser({ name: formData.username, email: formData.email, password: formData.password }))
      .unwrap()
      .catch((err) => {
        SeterrMsg(err || "Registration failed. Please try again.");
      });
  };

  useEffect(() => {
    if (status === 'succeeded' && isLoggedIn) {
      navigate("/");
    }
  }, [status, isLoggedIn, navigate]);


  return (
        <>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-md font-medium font-display text-mehroon"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-md font-medium font-display text-mehroon"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-md font-medium font-display text-mehroon"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-md font-medium font-display text-mehroon"
              >
                Re-Enter Password
              </label>
              <div className="mt-1">
                <input
                  id="Repassword"
                  name="Repassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.Repassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            {errMsg && (
              <div className="text-base text-red-600 flex justify-start">
                {errMsg}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="mx-6 w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mehroon ring-mehroon bg-opacity-80 hover:ring-2 focus:outline-none focus:bg-red-50 focus:text-mehroon"
              >
                Sign up
                {
                 isloading && <IconLoader className="animate-spin h-6 w-6 text-mehroon" /> 
                }
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                className="font-medium text-mehroon hover:text-red-700"
                onClick={props.move_to_login}
              >
                Log in here
                
              </button>
            </p>
          </div>
        </>
  );
};

SignupForm.propTypes = {
    move_to_login : PropTypes.func
};

SignupForm.defaultProps = {
    move_to_login : () => {console.log("move to login btn pressed.")}
};

export default SignupForm;
