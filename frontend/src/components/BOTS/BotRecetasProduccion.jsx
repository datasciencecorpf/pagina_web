import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React ,{ useEffect,useState,useContext}from "react";
import Navbar from "../NavBar";
import Loading from "../Loading";


const BotRecetasProduccion = ({ title }) => {
  const [token, setToken] = useContext(UserContext);
  const [username,setUserName] = useState(null);
  const [usuario,setUsuario] = useState(null);
  const [secondName,setUserSecondName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataM, setDataM] =  useState("");
  const [path_file,setPathFile] = useState("");
  const [file_name,setFileName] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  let path_doc_generate="";
 
  const getUserdata= async()=>{ 
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      
    const response =  await fetch("/api/users/me",requestOptions)
    const response_project = await fetch(`/api/projects/${"p2"}/-u jneira`, requestOptions)
    if(!response.ok){
         setErrorMessage("Something went wrong. Couldn't load the leads");
    } else {
        const data = await response.json();
        const usuario =data.email;

        setUserName(data.nombre);
        setUserSecondName(data.apellido);

        setIsLoadingUser(false);

       

    }
    if(!response_project.ok){
      setErrorMessage("Something went wrong. Couldn't load the leads");
    } else {
     const data_project = await response_project.json();
     path_doc_generate= data_project[0].data.split('Documentos Generados\\')[1]
     path_doc_generate= path_doc_generate.trim()
     const encodedFilePath = encodeURIComponent(path_doc_generate);
     var file_name_path= path_doc_generate.split("\\").at(-1);
     setPathFile(encodedFilePath);
     setFileName(file_name_path);
     setDataM(path_doc_generate);
    

 }

    }
    useEffect(() => {
        getUserdata();
      }, []);
    
  
  const handleLogout = () => {
    setToken(null);
  };
  const requestDownload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  
    function downloadFile() {
      var date = new Date();
      var current_date = date.getDate()+"-"+(date.getMonth()+1)+"-"+ date.getFullYear();
      var current_time = date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();

        fetch(`/return_excel_file/${path_file}`,requestDownload)
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
    

  return (
    <>
  <Navbar />
  <div className="has-text-centered m-6">
    <h1 className="title">{title}</h1>
    {token + username ? (
      <>
        <p>{username + " " + secondName}</p>
        <h1>
          Proyecto en ejecucion
          <p>
            {dataM ? (
              <button method="post" onClick={downloadFile}>
                Descargar
              </button>
            ) : (
              <Loading />
            )  }
          </p>
        </h1>
      </>
    ) : (
      <Navigate to="/" />
    )}
  </div>
</>


  );
};

export default BotRecetasProduccion;