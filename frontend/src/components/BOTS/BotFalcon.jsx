import '../css/InventarioAlmacenamiento.css';
import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "../NavBar";
import CircularLoading from "../CircularLoading";
import { ToastContainer, toast } from 'react-toastify';
import Toast from "../Toast";
import Loading from "../Loading";
import ModalDialog from '../DialogConf'
import powerbiPNG from "../../assets/merma.png";
import falconPNG from "../../assets/falconapp.png";



const BotFalcon = ({ title }) => {
    const [token, setToken] = useContext(UserContext);
    const [username, setUserName] = useState(null);
    const [secondName, setUserSecondName] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [confirmLoading, setConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const handleCloseModal = () => {
        setShowModal(false);

    };
    const handleSaveModal = () => {
        // Realizar acciones al almacenar el modal
        setShowModal(false);
    }

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

                setErrorMessage("Error with execute");

            } else {
                const data_project = await response_project.json();

                console.log(data_project)

                if (data_project[0].ok) {
                    handleToastNotify();
                    setConfirm(!confirmLoading);
                }
                else {
                    setShowModal(true);
                }

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
            <div className="has-text-center m-6">
                <h1 className='bot-name'>Bot para la actualización automática de Reporte de Mermas - Falcon</h1>
            </div>

            <ToastContainer></ToastContainer>

            {loading ? (

                <>
                    <ModalDialog
                        showSaveButton={false}
                        showCancelButton={false}
                        show={showModal}
                        title={"Reporte - Inventario Almacenamiento"}
                        handleClose={handleCloseModal}
                        handleSave={handleSaveModal}
                        primeraLinea={
                            <><p><h2>El reporte se esta actualizando</h2></p>

                            </>
                        }
                        segundaLinea={<h6><i>Por favor espere</i></h6>}
                    />


                    <div className="has-text-left m-6">

                    </div>
                    <div className='btn-funct'>
                        <div className='card-icon'>
                            <img className="download-image" src={falconPNG} alt="Icono" />
                            <div className="btn-empezar">
                                <button className="button is-large is-warning m-1" onClick={() => init_distro("-m falcon")}>
                                    <div className="button-content">
                                        <span>{"Consolidación"}</span>
                                    </div>
                                </button>

                            </div>
                        </div>


                        <div className='card-icon'>
                            <img className="download-image" src={powerbiPNG} alt="Icono" />
                            <div className="btn-empezar">
                                <button className="button is-large is-warning m-1" onClick={() => init_distro("-m update")}>
                                    <div className="button-content">
                                        <span>{"Act. BI"}</span>
                                    </div>
                                </button>

                            </div>
                        </div>
                    </div>

                </>

            ) : (
                <>
                    <CircularLoading />

                </>
            )}

        </>);
}

export default BotFalcon;