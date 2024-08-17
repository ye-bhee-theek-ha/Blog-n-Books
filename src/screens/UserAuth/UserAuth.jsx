import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconSearch, IconBooks } from "@tabler/icons-react";
import Button from "../../components/button/button";
import BookCard from "../../components/bookCard/bookCard";
import Card from "../../components/card/Card";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import Navbar from "../../components/navbar/navbar";
import SignupForm from "../../components/SignupForm/SignupForm";
import LoginForm from "../../components/LoginForm/LoginForm";

const UserAuth = (props) => {
    const [Form, SetForm] = useState("Login")

    const SetToSignup = () => {
        SetForm("Signup")
    }

    const SetToLogin = () => {
        SetForm("Login")
    }
  return (
    <div className="bg-lgreen">
        <Navbar />
        <div className="h-full bg-green flex flex-col justify-center py-4 sm:px-6 lg:px-8">
            {Form == "Login"?
                <div >
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-2 text-center text-heading font-Display text-mehroon">
                            Login
                        </h2>
                    </div>
                </div>
                :
                <div>
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-2 text-center text-heading font-Display text-mehroon">
                            Signup
                        </h2>
                    </div>
                </div>
            }

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className={`bg-grey bg-opacity-70 border-2 border-orange rounded-lg mx-5 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 `}>
                    {Form == "Login"?
                        <LoginForm move_to_signup={SetToSignup}/> : <SignupForm move_to_login={SetToLogin}/>
                    }
                </div>
            </div>
        </div>
    </div>
  );
};

UserAuth.propTypes = {};

UserAuth.defaultProps = {};

export default UserAuth;
