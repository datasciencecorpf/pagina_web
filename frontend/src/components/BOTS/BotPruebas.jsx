
import '../css/Discount.css';
import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "../NavBar";
import ModalDialog from '../DialogConf'
import CircularLoading from "../CircularLoading";
import cloudSyncPNG from "../../assets/sincronizando.png";
import cloudDownloadPNG from "../../assets/descargar.png";
import downloadPNG from "../../assets/btn_descargar.png";
import cargarDescuentos from "../../../src/assets/aprobado.png";
import PageNotFound from './PageNotFoud';
import FileUpload from '../FileUpload';
import Toast from "../Toast";
import Loading from "../Loading";

const BotPruebas = ({ title }) => {
    const [token, setToken] = useContext(UserContext);
    const [username, setUserName] = useState(null);
    const [secondName, setUserSecondName] = useState(null);
    const [email, setUserEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [messageErrorFamilia, setErrorMessageFamilia] = useState("");
    const [messageErrorDesc, setErrorMessageDesc] = useState("");
    const [messageErrorCod, setErrorMessageCod] = useState("");
    const [messageErrorPrice, setErrorMessagePrice] = useState("");
    const images = [cloudSyncPNG, cloudDownloadPNG]; // Reemplaza con tus imágenes
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [file_path, setFilePath] = useState(null);
    const [confirmLoading, setConfirm] = useState(false);
    const [opcion, setOpcion] = useState("");

    const handleCloseModal = () => {
        setShowModal(false);

    };
    const handleSaveModal = () => {
        // Realizar acciones al almacenar el modal
        setShowModal(false);
    }
    const requestDownload = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
   
    const execute_project = async (command) => {
        try {
            setLoading(!loading);
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response_project = await fetch(`/api/projects/${"p12"}/${command}`, requestOptions);

            if (!response_project.ok) {
                setErrorMessage("Error with execute");
            } else {

                const data_project = await response_project.json();

                if (command === "-m sincronizar") {

                    setOpcion("sincronizar");
                    const data_msg = (data_project[0].data);
                    console.log((typeof data_msg));
                    const cadenaFormateada = data_msg.replace(/'/g, '"');

                    console.log((cadenaFormateada));

                    const Tipo = JSON.parse(cadenaFormateada).Tipo;
                    console.log(Tipo);
                    if (Tipo != "OK") {

                        const FD = JSON.parse(cadenaFormateada).FD;
                        const DM = JSON.parse(cadenaFormateada).DM;
                        const EC = JSON.parse(cadenaFormateada).EC;
                        const EP = JSON.parse(cadenaFormateada).EP;



                        if (Tipo !== "OK") {
                            setShowModal(true);
                            setErrorMessageFamilia(FD);
                            setErrorMessageDesc(DM);
                            setErrorMessageCod(EC);
                            setErrorMessagePrice(EP);
                        }

                    }
                    else {
                        handleToastNotify(); // Lanzar la notificación

                    }
                } if (command === "-m reporte") {
                    setOpcion("reporte");
                    const data_msg = (data_project[0].data);

                    console.log(data_msg)

                    if (data_project[0].ok) {
                        handleToastNotify();
                        setConfirm(!confirmLoading);
                    }
                    else {
                        setShowModal(true);
                    }
                   
                }


            }

        } catch (error) {
            console.error("Error loading data:", error);
            setErrorMessage("Error loading data. Please try again.");
        } finally {
            setLoading(true); // Marcar la carga como completa
        }
    };


    const handleToastNotify = () => {
        toast.success('Se ejecutó correctamente!', {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
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
            console.log(data);

        }
    }

    useEffect(() => {

        getUserdata();
        const intervalId = setInterval(() => {
            // Cambia a la siguiente imagen
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000); // Cambia la imagen cada 2 segundos (2000 milisegundos)

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);

    }, []);
    // Carga de descuentos aprobados
        return (
            <>
              <Navbar />
              <div className="has-text-left m-6">
                <h1 className="title">{"Bienvenid@ " + username + " " + secondName + " - " + title}</h1>
              </div>
              <div>
                <ToastContainer></ToastContainer>
                {loading ? (
                  <>
                    <div className='circulo'>
                      <div className='image-cloud-content'>
                        <img className="cloud-image" src={cargarDescuentos} alt="Icono" />
                      </div>
                    </div>
                    <div className="has-text-left m-6">
                      {/* Additional content for loading state */}
                    </div>
                    <div className='btn-funct'>
                      <div className="btn-empezar">
                        <button className="button is-large is-warning m-1" onClick={() => execute_project("-m cargar")}>
                          <span>{"Forecast"}</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <CircularLoading />
                    </div>
                  </>
                )}
              </div>
            </>
          );
          


    

}
export default BotPruebas;