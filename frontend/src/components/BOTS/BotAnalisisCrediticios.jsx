import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../NavBar";
import Loading from "../Loading";
import Toast from "../Toast";

import { ToastContainer, toast } from 'react-toastify';

const BotAnalisisCrediticio = ({ title }) => {
  const [token, setToken] = useContext(UserContext);
  const [username, setUserName] = useState(null);
  const [secondName, setUserSecondName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataM, setDataM] = useState("");
  const [loading, setLoading] = useState(true);
  const [path_file, setPathFile] = useState("");
  const [file_name, setFileName] = useState("");
  const [detalle, setDetalle] = useState("");
  const [dataProjectJSON, setDataProjectJSON] = useState(null);

  let path_doc_generate = "";

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
  const handleToastNotify = () => {
    toast.success('Se ejecutó correctamente!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const requestDownload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  function downloadFile() {

    fetch(`/return_excel_file/${path_file}`, requestDownload)
      .then(response => {
        const disposition = response.headers.get('Content-Disposition');

        console.log(disposition)
        return response.blob();
      })
      .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;

        a.download = file_name
        document.body.appendChild(a); // append the element to the dom
        a.click();
        a.remove(); // afterwards, remove the element
      })
      .catch(error => {
        console.error(error);
      })
  }

  const executeproject = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response_project = await fetch(`/api/projects/${"p10"}/0`, requestOptions)
    if (!response_project.ok) {
      setErrorMessage("El proyecto no se encuentra disponible :(");

    } else {
      const data_project = await response_project.json();
      
      console.log(data_project);
      setErrorMessage("Projecto en ejecución");
      setErrorMessage(data_project);
      path_doc_generate = data_project[0].data.split('Documentos Generados\\')[1]
      path_doc_generate = path_doc_generate.trim()
      const encodedFilePath = encodeURIComponent(path_doc_generate);
      var file_name_path = path_doc_generate.split("\\").at(-1);
      setPathFile(encodedFilePath);
      setFileName(file_name_path);
      setDataM(data_project);
      
      var frases = data_project[0].data.split("|"); // Divide el texto en frases separadas

      var frasesFiltradas = "";

      for (var i = 0; i < frases.length; i++) {
        if (frases[i].includes("Documentos del RUC:")) {
          frasesFiltradas += frases[i] + "\n";
        }
      }
      setDetalle(frasesFiltradas);
      setLoading(false);

    }
    

  }

  
  useEffect(() => {
    getUserdata();
    executeproject();
    handleToastNotify();
    
  }, []);
  return (
    <>
      <Navbar />
      <div className="has-text-centered m-6"></div>
      <div className="has-text-left m-6">
        <h1 className="title">{"Bienvenid@ " + username + " " + secondName + " - " + title}</h1>
      </div>
      {token ? (
        <div className="has-text-centered m-6">
          {loading ? (
            <>
              <Loading />
              <p>Cargando datos...</p>
              <h>{}</h>
            </>
          ) : (
            <>
              <h1>
                <ToastContainer></ToastContainer>
                <button onClick={downloadFile}>
                  Descargar
                </button>
                <p>{detalle}</p>
              </h1>
            </>
          )}
        </div>
      ) : (
        <Navigate to='/' />
      )}
          
      
      {dataProjectJSON && (
        <div className="has-text-centered m-6">
          <h2>Contenido de data_project:</h2>
          <pre>{dataProjectJSON}</pre>
        </div>
      )}
    </>
  );
};

export default BotAnalisisCrediticio;