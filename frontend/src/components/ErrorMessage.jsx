import React, { useState, forwardRef , useImperativeHandle} from "react";
// import "./css/Snackbar.css"

const  ErrorMessage = forwardRef((props,ref) =>{
const [showErrorMessage,setErrorMessage]= useState(false)
useImperativeHandle(ref, ()=>({
    show(){
        setErrorMessage(true)
        setTimeout(()=>{
            setErrorMessage(false)
        },3000);
    }
}))

 return (

    <p  id={showErrorMessage ? "show" :"hide"} className="has-text-weight-blod has-text-danger">{props.message}</p>)
 });

export default ErrorMessage