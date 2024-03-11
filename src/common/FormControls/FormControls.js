import React   from "react";
import         "./form-controls.scss"
import {Field} from "redux-form";

export const FormControl = (Component) => ({input, meta: {touched, error}, ...props}) => {

    const isError = touched && error

    return (
        <div className={`${"form-control"} ${isError ? "error" : ""}`}>
            <div>
                <Component  {...input} {...props}/>
            </div>
                {isError && <span>{error}</span>}
        </div>
    )
}

export const  createField = (placeholder, name, validators, component, props={}, text="") => (
    <div>
        <Field placeholder={placeholder}
               name={name}
               component={component}
               validate={validators}
               {...props}
        /> {text}
    </div>
)