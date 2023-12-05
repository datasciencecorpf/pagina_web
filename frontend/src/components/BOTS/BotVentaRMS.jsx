import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React ,{ useEffect,useState,useContext}from "react";


const BotVentaRMS =  ({ title }) => {
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
      
      // alert("Intento")
      if(!response.ok){
           setErrorMessage("Something went wrong. Couldn't load the leads");

      } else {
          const data = await response.json();
          setUserName(data.nombre);
          setUserSecondName(data.apellido);
         
            const response_project = await fetch(`/api/projects/${5}`, requestOptions);
            
            if(!response_project.ok){
              setErrorMessage("Something went wrong. Couldn't load the leads");
            } else {
             const data_project = await response_project.json();
             console.log(data_project);
             setDataM(data_project);
             

             
            //  alert(data_project)
            
        
          }
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
          
            fetch('/return_excel_file/',requestDownload)
               .then(response => {
                  const disposition = response.headers.get('Content-Disposition');
                  console.log(disposition)
                  return response.blob();
               })
               .then(blob => {
                  var url = window.URL.createObjectURL(blob);
                  var a = document.createElement('a');
                  a.href = url;
                  a.download = "VentasRms_"+ username+"_"+current_date+"-"+current_time+".xlsx";
                  document.body.appendChild(a); // append the element to the dom
                  a.click();
                  a.remove(); // afterwards, remove the element
               })
               .catch(error => {
                  console.error(error);
               })
         }
        

    

    return (
      <div className="has-text-centered m-6">
        <h1 className="title">{title}</h1>
        
        <p> {username +" "+ secondName}</p>
        <form>
  <div className="nativeDatePicker">
    <label for="fini">Fecha de inicio: </label>
    <input type="date" id="bday" name="bday" />
    <span className="validity"></span>
  </div>
  <div className="nativeDatePicker">
    <label for="ffin">Fecha de fin: </label>
    <input type="date" id="bday" name="bday" />
    <span className="validity"></span>
  </div>
  
</form>
        {token ? (
          <h1>Proyecto en ejecucion<p>{dataM}</p></h1>
        ): <Navigate to='/'/>}
        <button method='post'
          onClick={downloadFile }
        >Descargar</button>
        
      </div>
    );
  };
  

export default BotVentaRMS;