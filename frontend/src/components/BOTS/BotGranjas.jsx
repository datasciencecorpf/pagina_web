import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React ,{ useEffect,useState,useContext}from "react";
import Navbar from "../NavBar";


const BotGranjas = ({ title }) => {
  const [token, setToken] = useContext(UserContext);
  const [username,setUserName] = useState(null);
  const [secondName,setUserSecondName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataM, setDataM] =  useState("");
 
 
  const getUserdata= async()=>{ 
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      
    const response =  await fetch("/api/users/me",requestOptions)
    const response_project = await fetch(`/api/projects/${"p6"}`, requestOptions)
    if(!response.ok){
         setErrorMessage("Something went wrong. Couldn't load the leads");
    } else {
        const data = await response.json();
        setUserName(data.nombre);
        setUserSecondName(data.apellido);
       

    }
    if(!response_project.ok){
      setErrorMessage("Something went wrong. Couldn't load the leads");
    } else {
     const data_project = await response_project.json();
     console.log(data_project);
     setDataM(data_project);
    

 }

    }
    useEffect(() => {
        getUserdata();
      }, []);
    
  
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <><Navbar></Navbar><div className="has-text-centered m-6"></div>
    <div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      <p> {username +" "+ secondName}</p>
      {token ? (
        <h1>Proyecto en ejecucion<p>{dataM}</p></h1>
      ): <Navigate to='/'/>}
    </div></>
  );
};

export default BotGranjas;