import React from 'react'
import PropTypes from 'prop-types'

const Button = (props) => {

    return(
        <div className={"flex items-center justify-center m-2 px-3 min-w-24 w-fit rounded-full bg-offwhite text-mehroon border-mehroon" 
                        + " " 
                        + props.containerclassName}>
            <button 
                className={"text-btn flex flex-wrap flex-row items-center" + " " + props.btnclassName}
                onClick={props.onClick}
                type={props.type}
                disabled={props.disabled}
            >
                {props.children}
                {props.name}
            </button>
        </div>
    )
}

Button.prototypes = {
    onClick: PropTypes.func,
    name: PropTypes.string,
    type: PropTypes.string,
    containerclassName: PropTypes.string,
    btnclassName: PropTypes.string,
    disabled: PropTypes.bool,
}

Button.defaultProps = {
    onClick: () => {console.log("btn pressed.")},
    name: "Button",
    type: "button",
    containerclassName: "",
    btnclassName: "",
    disabled: false,
}

export default Button;