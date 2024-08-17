import React from 'react'
import PropTypes from 'prop-types'
import Button from '../button/button'
import { useNavigate, useParams } from 'react-router-dom';
import {
    IconSearch,
    IconBooks
} from "@tabler/icons-react";
import { useAuth } from '../../Auth/Auth';

const Navbar = (props) => {

    const navigate = useNavigate()
    const {isloggedin, logout} = useAuth()

    const onnav = () => {
        isloggedin? navigate("/profile"):navigate("/Auth")
    }

    return(
        <div className={"flex flex-row flex-wrap content-center justify-between w-full min-h-12 border-b-2 px-8 border-pink bg-green_nav " 
                        + " " 
                        + props.containerclassName}>

            <div className='flex title text-mehroon text-btn font-semibold items-center'>
                <IconBooks className='h-6 w-6 mr-1'/>
                Blog N Books
            </div>

            <div className='btns flex-row hidden md:flex'>
                <Button
                    onClick = {() => {navigate("/")}} 
                    name= "Home"
                />
                <Button
                    onClick = {() => {navigate("/Books")}} 
                    name= "Library"
                />
                <Button
                    name= "Search"
                >
                    <IconSearch className='h-4 w-4 mr-1'/>
                </Button>
            </div>

            <div className='contact'>
                <Button
                    containerclassName = "bg-transparent border text-mehroon hover:text-offwhite hover:bg-mehroon"
                    name= {props.title != "Title"? props.title : isloggedin? "Profile" : "Login"}
                    onClick = {props.onClick? onclick: onnav}
                />
            </div>

        </div>
    )
}

Navbar.prototypes = {
    onclick: PropTypes.func,
    title: PropTypes.string,
}

Navbar.defaultProps = {
    onClick: null,
    title: "Title",
}

export default Navbar;