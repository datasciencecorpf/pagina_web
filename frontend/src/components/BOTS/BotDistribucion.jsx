import '../css/DistribucionStyle.css';
import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "../NavBar";
import CircularLoading from "../CircularLoading";



const BotDistribucion = ({ title }) => {
    const [token, setToken] = useContext(UserContext);
    const [username, setUserName] = useState(null);
    const [secondName, setUserSecondName] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [confirmLoading, setConfirm] = useState(false);

    const init_distro = async (command) => {
        try {
            setLoading(!loading); 
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response_project = await fetch(`/api/projects/${"p200"}/${command}`, requestOptions);

            if (!response_project.ok) {
                setErrorMessage("Something went wrong. Couldn't load the leads");
            } else {
                const data_project = await response_project.json();
                console.log(data_project);
                setConfirm(!confirmLoading);
            }

        } catch (error) {
            console.error("Error loading data:", error);
            setErrorMessage("Error loading data. Please try again.");
        } finally {
            setLoading(true); // Marcar la carga como completa
        }
    };

    

    const getUserdata = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };

        const response = await fetch("/api/users/me", requestOptions)

        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't load the leads");
        } else {
            const data = await response.json();
            setUserName(data.nombre);
            setUserSecondName(data.apellido);

        }
    }

    useEffect(() => {
        getUserdata();

    });
    return (
        <><Navbar />
            <div className="has-text-left m-6">
                <h1 className="title">{"Bienvenid@ " + username + " " + secondName + " - " + title}</h1>
            </div>
            {loading ? (
  
    <>
      <div className="has-text-left m-6">
     
      </div>
      <div className="btn-empezar">
        <button className="button is-large is-warning m-1" onClick={() => init_distro("-c NP")}>
          <b>{"Empezar"}</b>
        </button>
      </div>
    </>
  
) : (
  <>
    <CircularLoading />
    
  </>
)}

        </>);
}

export default BotDistribucion;