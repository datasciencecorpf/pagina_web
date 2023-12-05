import React, { useEffect } from "react";
import 'bulma/css/bulma.min.css';
import Navbar from "./NavBar";
const Header = ({ title }) => {

 useEffect(() => {
  
}, []);


  return (
    <><Navbar></Navbar><div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      
    </div></>
  );
};

export default Header;