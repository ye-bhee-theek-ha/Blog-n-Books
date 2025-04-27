import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Loader from "../Loader/Loader";
import { IconLadder, IconLoader } from "@tabler/icons-react";

import {useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";




const LoginForm = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch()
  const { status, error: authError, isLoggedIn } = useSelector((state) => state.auth);
  const isloading = status === 'loading';

  const [errMsg, SeterrMsg] = useState("");

  useEffect(() => {
    if (status === 'succeeded' && localStorage.getItem('token')) {
      navigate("/");
    }
  }, [status, navigate]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginUser({ email: formData.email, password: formData.password }))
    .unwrap()
    .catch((err) => {
      SeterrMsg(err || "Login failed. Please check your credentials."); // Update local error state
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
                Login
                {
                 isloading && <IconLoader className="animate-spin h-6 w-6 text-mehroon" /> 
                }
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={props.move_to_signup}
                className="font-medium text-mehroon hover:text-red-700"
              >
                Sign Up here.
              </button>
            </p>
          </div>
        </>
  );
};

LoginForm.propTypes = {
  move_to_signup : PropTypes.func
};

LoginForm.defaultProps = {
  move_to_signup : () => {console.log("move to login btn pressed.")}
};

export default LoginForm;
