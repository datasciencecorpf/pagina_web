import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React ,{ useEffect,useState,useContext,useRef}from "react";
import Navbar from "../NavBar";
import Calendario from "../Calendario";
import Dropdown from "../Locales";
import Loading from "../Loading";
import Toast from "../Toast";
import { ToastContainer, toast } from 'react-toastify';

const BotCiclico = ({ title }) => {


  const sucursales = {
    "01": "PPG",
    "03": "GARZOTA",
    "05": "CALIFORNIA",
    "07": "CEIBOS",
    "09": "TEJAS",
    "11": "POLARIS",
    "13": "MUCHO LOTE",
    "15": "LIBERTAD",
    "17": "PORTAL AL SOL",
    "19": "PORTETE",
    "21": "RECREO",
    "23": "BUENAVISTA",
    "25": "MILAN",
    "27": "PLAYITA",
    "29": "ESCLUSAS",
    "31": "23 Y Q",
    "33": "FORTIN",
    "35": "MALVINAS",
    "37": "PASCUALES",
    "39": "ENTRADA DE LA 8",
    "43": "BLUE COAST",
    "45": "DURAN",
    "47": "CRISTO CONSUELO",
    "49": "MARTHA DE ROLDOS",
    "53": "PLAYA VILLAMIL",
    "55": "OASIS",
    "61": "BABAHOYO",
    "62": "MILAGRO",
  };
  const [token, setToken] = useContext(UserContext);
  const [username,setUserName] = useState(null);
  const [secondName,setUserSecondName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataM, setDataM] =  useState("");
  const [selectedDateIni, setSelectedIniDate] = useState(null);
  const [selectedDateFin, setSelectedFinDate] = useState(null);
  const [selectLocal, setSelectLocal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

  const handleShowNotification = () => {
    setShowNotification(true);
  }

  const handleCloseNotification = () => {
    setShowNotification(false);
  }
  const handleClick1 = () => {
    toast(<Toast type="success" message="Operación exitosa" />, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  /* Selectores de fecha*/
  const handleDateIniChange = (date) => {
    setSelectedIniDate(date);
  };
  const handleDateFinChange = (date) => {
    setSelectedFinDate(date);
  };

  const handleLocalChange = (key) =>{
    setSelectLocal(key);
  };

  const execProject = async()=>{
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
      var fecha_inicial = selectedDateIni.toLocaleDateString('es-ES', options).replace(RegExp('/', 'g'), '|');
      var fecha_final = selectedDateFin.toLocaleDateString('es-ES', options).replace(RegExp('/', 'g'), '|');
      var command_promt = "-u "+selectLocal+ " -t 1 -i " +fecha_inicial +" -f "+fecha_final+" -v2 1 -v3 1"
      const response_project = await fetch(`/api/projects/${"p6"}/${command_promt}`, requestOptions);
          
          if(!response_project.ok){
            setErrorMessage("Something went wrong. Couldn't load the leads");
          } else {
           const data_project = await response_project.json();
           console.log(data_project);
           setDataM(data_project);
           setShowNotification(true);

           

          }

  }
  }
 
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
        handleClick1()


    

    }

    }

    const handleClick = async () => {
      setLoading(true);
      await execProject();
      setLoading(false);
    };
  
    useEffect(() => {
        getUserdata();

      }, []);
    
  

    
  

  return (
   <><Navbar></Navbar><div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      <p> {username + " " + secondName}</p>
      
    
      {token ? (
        <>
        {/* <ToastNotification type="success" 
          message="Esta es una notificación de éxito"
          onClick={handleClick1} /> */}

<div>
      <button onClick={handleClick}>Mostrar notificación</button>
    </div>
        <Calendario title={"Fecha de inicio"}  onDateChange={handleDateIniChange}/>
        <Calendario title={"Fecha de fin"} onDateChange={handleDateFinChange}/>
        <Dropdown  options={sucursales} onSelect={handleLocalChange}/>
        {selectedDateIni && <p>Fecha seleccionada: {selectedDateIni.toLocaleDateString('es-ES', options)}</p>}
        {selectedDateFin && <p>Fecha seleccionada: {selectedDateFin.toLocaleDateString('es-ES', options)}</p>}
        {selectLocal && (
        <p>Ha seleccionado el local: {selectLocal}</p>
      )}
        
        </>
      ) : <Navigate to='/' />}
      {loading ? 
          (<Loading></Loading>):
          (<button onClick={handleClick} disabled={loading}>
            {loading ? "Cargando..." : "Ejecutar Bot"}
          </button>)}
      

    
    </div></>
  );
};

export default BotCiclico;