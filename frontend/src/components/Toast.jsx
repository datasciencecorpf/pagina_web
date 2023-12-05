import React from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Toast = ({ type, message}) => {
  const handleClose = () => {
    toast.dismiss();
  };

  return (
    <div className={`toast-notification ${type}`}>
      <div className="message">{message}</div>
      <div className="close" onClick={handleClose}>X</div>
    </div>
  )
}

export default Toast;
