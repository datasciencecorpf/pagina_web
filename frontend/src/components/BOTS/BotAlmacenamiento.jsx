import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React ,{ useEffect,useState,useContext}from "react";


const BotAlmacenamiento = ({ title }) => {
  const [token, setToken] = useContext(UserContext);
  const [username,setUserName] = useState(null);
  const [secondName,setUserSecondName] = useState(null);
  const [activate, setActivate] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

 
 
  const getUserdata= async()=>{ 
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      
    const response =  await fetch("/api/users/me",requestOptions)
    if(!response.ok){
         setErrorMessage("Something went wrong. Couldn't load the leads");
    } else {
        const data = await response.json();
        
        
        setUserName(data.nombre);
        setUserSecondName(data.apellido);

       

    }

    }
    const alerta =()=>{
      if (activate){
        alert("HOLA")
        setActivate(false)

      }
    }
    useEffect(() => {
        getUserdata();
        alerta();
      }, []);
    
  
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <><div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      <p> {username + " " + secondName}</p>
      {token ? (
        <h1>Proyecto en ejecucion</h1>
      ) : <Navigate to='/' />}
    </div></>
  );
};

export default BotAlmacenamiento;