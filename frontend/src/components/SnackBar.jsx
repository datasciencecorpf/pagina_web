import React, { useState, forwardRef , useImperativeHandle} from "react";

import "./css/Snackbar.css"
const  Snackbar = forwardRef((props,ref) =>{
const [showSnackBar,setSnackBar]= useState(false)
useImperativeHandle(ref, ()=>({
    show(){
        setSnackBar(true)
        setTimeout(()=>{
            setSnackBar(false)
        },3000);
    }
}))

 return (  <div className="snackbar"
        id={showSnackBar ? "show" :"hide"}
         style={{backgroundColor: props.type=="success"? "#00F593":"#FF0033"}}>
    <div className="symbol"></div>
    <div className="message" style={{backgroundColor: props.type=="success"? "#00F593":"#FF0033"}}>{props.message}</div>
   </div>
   );

})
export default Snackbar