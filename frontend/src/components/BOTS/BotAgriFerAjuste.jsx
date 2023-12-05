import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React, { useEffect, useState, useContext, useRef } from "react";
import Navbar from "../NavBar";
import CircularLoading from "../CircularLoading";
import jsonData from '../FarmAjuste/data_farm.json';
import ReadGranjas from "../Ajuste";
import '../css/TablaAjuste.css'
import ModalDialog from '../DialogConf'
import ErrorMessage from "../ErrorMessage";



const BotAgriFerAjuste = ({ title }) => {
    const [token, setToken] = useContext(UserContext);
    const [username, setUserName] = useState(null);
    const [secondName, setUserSecondName] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageDespacho, setErrorMessageDespacho] = useState("");
    const [errorMessageAvesIniciales, setErrorMessageAvesIniciales] = useState("");
    const [errorMessageConsumo, setErrorMessageConsumo] = useState("");
    const [errorMessagePesoBascula, setErrorMessagePesoBascula] = useState("");
    const [selectedGranja, setSelectedGranja] = useState('');
    const [selectedLotes, setSelectedLotes] = useState([]);
    const [selectedLote, setSelectedLote] = useState('');
    const [selectedLoteData, setLoteData] = useState('');
    const [avesInicialValue, setAvesInicialValue] = useState('');
    const [totalConsumoValue, setTotalConsumoValue] = useState('');
    const [pesoBasculaValue, setpesoBasculaValue] = useState('');
    const [muertesValue, setMuertesValue] = useState('');
    const [despachosValue, setDespachosValue] = useState('');
    const [liquidacionValue, setLiquidacionValue] = useState('');
    const [selectedLotesList, setSelectedLotesList] = useState([]);
    const [inactivityTime, setInactivityTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const errorMessageRefDespacho = useRef(null);
    const errorMessageRef = useRef(null);
    const inactivityTimeoutRef = useRef(null);
    const [textEstimado, setTextEstimado] = useState('');
    const [textReal, setTextReal] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);


    const handleOpenModal = () => {
        setShowModal(true);
        setLiquidacionValue('YES');
        const conversionEstimadaTxt = (selectedLoteData.TotalConsumo / selectedLoteData.PesoBascula).toFixed(3);
        const conversionEstimadaAjustadaTxt = convertsionAjustada(selectedLoteData.TotalConsumo ,selectedLoteData.PesoBascula,selectedLoteData.Despachos);
        const conversionRealTxt = (parseFloat(totalConsumoValue) / parseFloat(pesoBasculaValue)).toFixed(3);
        const conversionRealAjustadaTxt = convertsionAjustada(parseFloat(totalConsumoValue) ,parseFloat(pesoBasculaValue),parseFloat(despachosValue));
        setTextEstimado(<p>El valor de la conversión estimada es <b>{conversionEstimadaTxt}</b> y ajustada <b>{conversionEstimadaAjustadaTxt}</b></p>);
        setTextReal(<p>El valor de la conversión real es <b>{conversionRealTxt}</b> y ajustada <b> {conversionRealAjustadaTxt}</b></p>);

        const inventario = handleInventarioChange(); // Obtener el valor del inventario
        if (inventario < 0) {
            setShowModal(false);
            // Mostrar mensaje de error y retornar
            setErrorMessage("No se permiten valores negativos en el inventario.");
            errorMessageRef.current.show();
            return;
        }




    };

    const handleCloseModal = () => {
        setShowModal(false);
        setLiquidacionValue('NO');
    };

    const handleSaveModal = () => {
        // Realizar acciones al almacenar el modal
        setShowModal(false);
        const jsonEstimado = {
            Lote: selectedLoteData.Lote,
            Granja: selectedLoteData.Granja,
            AvesInicial: selectedLoteData.AvesInicial,
            TotalConsumo: selectedLoteData.TotalConsumo,
            Muertes: selectedLoteData.MUERTES,
            DespachoAves: selectedLoteData.Despachos,
            InventarioAves: selectedLoteData.Inventario,
            PesoBascula: selectedLoteData.PesoBascula,
            Liquidacion: liquidacionValue
        };
        const jsonAjuste = {
            Lote: selectedLote,
            Granja: selectedGranja,
            AvesInicial: parseFloat(avesInicialValue),
            TotalConsumo: parseFloat(totalConsumoValue),
            Muertes: parseFloat(muertesValue),
            DespachoAves: parseFloat(despachosValue),
            InventarioAves: parseFloat(handleInventarioChange()),
            PesoBascula: parseFloat(pesoBasculaValue),
            Liquidacion: liquidacionValue
        };

        const jsonFinal = {
            Estimado: jsonEstimado,
            Real: jsonAjuste,
            Responsable: username + " "+ secondName,
        }


        executeproject("-i insertar", JSON.stringify(jsonFinal).replace(/"/g, "'"));

        setSelectedLotesList((prevList) => [...prevList, selectedLote]);
        // Limpiar los valores de los inputs
        setAvesInicialValue('');
        setTotalConsumoValue('');
        setMuertesValue('');
        setDespachosValue('');
        setpesoBasculaValue('');
        setLiquidacionValue('');

        setLoteData('');
    };

    const handleGranjaSelect = (granja) => {
        // Realiza las operaciones necesarias con el valor seleccionado
        setSelectedGranja(granja);
        // Filtrar el JSON por la granja seleccionada
        const granjaData = jsonData.filter((item) => item.Granja === granja);
        // Realizar las operaciones con los datos filtrados

        // Filtrar los lotes que ya están seleccionados
        const availableLotes = granjaData.filter((item) => !selectedLotesList.includes(item.Lote));

        const lotes = availableLotes.map((item) => item.Lote);
        setSelectedLotes(lotes);
        // ...
    };
    const handleInventarioChange = () => {
        // Calcula el valor para el Inventario basado en la fórmula
        const avesInicial = parseFloat(avesInicialValue) || 0;
        const muertes = parseFloat(muertesValue) || 0;
        const despachos = parseFloat(despachosValue) || 0;
        const inventario = avesInicial - muertes - despachos;
        return inventario; // Devuelve el valor calculado del inventario
    };
    const handleLoteSelect = (lote) => {
        setSelectedButton(lote);
        setSelectedLote(lote);
        const granjaLote = jsonData.filter((item) => item.Lote === lote);
        // setLoteData(granjaLote);
        setLoteData(granjaLote.length > 0 ? granjaLote[0] : null);
        setAvesInicialValue('');
        setTotalConsumoValue('');
        setMuertesValue('');
        setDespachosValue('');
        setpesoBasculaValue('');
        setLiquidacionValue('');
    };


    const loadData = async (command) => {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response_project = await fetch(`/api/projects/${"p11"}/${command}`, requestOptions);

            if (!response_project.ok) {
                setErrorMessage("Something went wrong. Couldn't load the leads");
            } else {
                const data_project = await response_project.json();
                console.log(data_project);
            }

        } catch (error) {
            console.error("Error loading data:", error);
            setErrorMessage("Error loading data. Please try again.");
        } finally {
            setLoading(false); // Marcar la carga como completa
        }
    };

    const executeproject = async (command, json_file) => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const requestDownload = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };

        const response_json_file = await fetch(`/save_insert/${json_file}/${"ajustes.json"}`, requestDownload);

        const response_project = await fetch(`/api/projects/${"p11"}/${command}`, requestOptions);


        if (!response_project.ok) {
            setErrorMessage("Something went wrong. Couldn't load the leads");
        } else {
            const data_project = await response_project.json();
            console.log(data_project);
        }
    }


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


    const convertsionAjustada = (TotalConsumo,PesoBascula,Despachos) =>{
        
        return (((2750 - (parseInt(PesoBascula)*1000 / parseInt(Despachos))) /
        (3500 + (TotalConsumo / PesoBascula))) + (TotalConsumo /PesoBascula)).toFixed(3);
                                            

    }

      // Función que maneja el evento 'keydown' para deshabilitar las teclas direccionales
  const handleKeyDownEvent = (event) => {
    const arrowsKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowsKeys.includes(event.key)) {
      event.preventDefault();
    }
  };
    const resetInactivityTimeout = () => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        inactivityTimeoutRef.current = setTimeout(() => {
            window.location.reload();
        }, 300000);
    };

    useEffect(() => {
        getUserdata();
        loadData("-r leerGranjas");
        resetInactivityTimeout();

        document.addEventListener("mousemove", () => {
            setInactivityTime(0);
            resetInactivityTimeout();
        });

        const intervalId = setInterval(() => {
            setInactivityTime(prevTime => prevTime + 1000);
        }, 1000);

        return () => {
            document.removeEventListener("mousemove", resetInactivityTimeout);
            clearInterval(intervalId);
        };
    }, []);


    return (
        <>
            <Navbar />
            <div className="has-text-centered m-6">
                <div className="has-text-left m-6">
                    <h1 className="title">{"Bienvenid@ " + username + " " + secondName + " - " + title}</h1>
                </div>
                {token ? (
                    <>
                        <div></div>
                    </>
                ) : <Navigate to='/' />}
                {loading ? (
                    <>
                        <CircularLoading />
                        <p>Cargando datos...</p>
                    </>
                ) : (
                    <>

                        <div>
                            Tiempo de inactividad: {inactivityTime / 1000} segundos
                        </div>

                        <ReadGranjas onGranjaSelect={handleGranjaSelect} jsonData={jsonData} />
                        <div>
                            {selectedLotes.length > 0 && (
                                <div>
                                    <div>
                                        <p>Lotes de la granja seleccionada: </p>
                                    </div>
                                    <div>
                                        {selectedLotes.filter((lote) => !selectedLotesList.includes(lote)).map((lote, index) => (
                                            <button key={index}  className={`button is-warning m-2 ${selectedButton === lote ? 'selected' : ''}`} onClick={() => handleLoteSelect(lote)}>
                                                <b>{lote}</b>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            {selectedLote && selectedLoteData && (
                                <>
                                    <h2>Datos del lote seleccionado: </h2>
                                    <b>
                                        <p>{selectedLoteData.Lote}</p>
                                    </b>
                                    <div className="table-container">
                                        <table className="table is-bordered is-striped is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th>Estimado</th>
                                                    <th>Real</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }}>
                                                        <strong>Aves Inicial:</strong>
                                                        <span>{selectedLoteData.AvesInicial}</span>
                                                    </td>
                                                    <td>
                                                        <div className="inputGroup">
                                                            <input
                                                                className="input"
                                                                type="Text"
                                                                placeholder="Ingrese ajuste aves"
                                                                style={{ marginLeft: '10px' }}
                                                                value={avesInicialValue}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    const sanitizedValue = inputValue.replace(/[^0-9]/g, ''); // Acepta solo números enteros positivos
                                                                    setAvesInicialValue(sanitizedValue);
                                                                    setErrorMessage("");

                                                                    // Validar que el valor sea mayor que cero
                                                                    if (parseInt(inputValue) === 0) {
                                                                        setErrorMessageAvesIniciales("Hay valores en cero.");
                                                                        errorMessageRef.current.show();

                                                                    }
                                                                    else {
                                                                        setErrorMessageAvesIniciales("")

                                                                    }

                                                                }}
                                                            />
                                                            <ErrorMessage ref={errorMessageRef} message={errorMessageAvesIniciales} />
                                                            <label className="name" htmlFor="name" id="label-fname"></label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }}>
                                                        <strong>TotalConsumo:</strong>
                                                        <span>{selectedLoteData.TotalConsumo}</span>
                                                    </td>
                                                    <td>
                                                        <div className="inputGroup">
                                                            <input
                                                                className="input"
                                                                type="Text"
                                                                placeholder="Ingrese ajuste consumo"
                                                                style={{ marginLeft: '10px' }}
                                                                value={totalConsumoValue}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
                                                                    setTotalConsumoValue(sanitizedValue);
                                                                    setErrorMessage("");
                                                                    if (parseInt(inputValue) === 0) {
                                                                        setErrorMessageConsumo("Hay valores en cero.");
                                                                        errorMessageRef.current.show();

                                                                    }
                                                                    else {
                                                                        setErrorMessageConsumo("")

                                                                    }

                                                                }}
                                                            />
                                                            <ErrorMessage ref={errorMessageRef} message={errorMessageConsumo} />
                                                            <label className="name" htmlFor="name" id="label-fname"></label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }}>
                                                        <strong>Muertes:</strong>
                                                        <span>{selectedLoteData.MUERTES}</span>
                                                    </td>
                                                    <td>
                                                        <div className="inputGroup">
                                                            <input
                                                                className="input"
                                                                type="Text"
                                                                placeholder="Ingrese ajuste muertes"
                                                                style={{ marginLeft: '10px' }}
                                                                value={muertesValue}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
                                                                    setMuertesValue(sanitizedValue);
                                                                    setErrorMessage("");
                                                                }}
                                                            />
                                                            <label htmlFor="name"></label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }}>
                                                        <strong>Despacho:</strong>
                                                        <span>{selectedLoteData.Despachos}</span>
                                                    </td>
                                                    <td>
                                                        <div className="inputGroup">
                                                            <input
                                                                className="input"
                                                                type="Text"
                                                                placeholder="Ingrese ajuste despachos"
                                                                style={{ marginLeft: '10px' }}
                                                                value={despachosValue}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    const sanitizedValue = inputValue.replace(/[^0-9]/g, ''); // Acepta solo números enteros positivos
                                                                    setDespachosValue(sanitizedValue);
                                                                    setErrorMessage("");
                                                                    if (parseInt(inputValue) === 0) {
                                                                        setErrorMessageDespacho("Hay valores en cero.");
                                                                        errorMessageRefDespacho.current.show();

                                                                    }
                                                                    else {
                                                                        setErrorMessageDespacho("")

                                                                    }

                                                                }}
                                                               
                                                            />
                                                            <ErrorMessage ref={errorMessageRef} message={errorMessageDespacho} />
                                                            <label htmlFor="name"></label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }}>
                                                        <strong>Inventario:</strong>
                                                        <span>{selectedLoteData.Inventario}</span>
                                                    </td>
                                                    <td>
                                                        <div className="inputGroup">
                                                            <input
                                                                className="input"
                                                                type="Text"
                                                                placeholder="Ingrese ajuste inventario"
                                                                style={{ marginLeft: '10px' }}
                                                                value={handleInventarioChange()}
                                                               

                                                            />


                                                            <label htmlFor="name"></label>

                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }}>
                                                        <strong>Peso Bascula:</strong>
                                                        <span>{selectedLoteData.PesoBascula}</span>
                                                    </td>
                                                    <td>
                                                        <div className="inputGroup">
                                                            <input
                                                                className="input"
                                                                type="Text"
                                                                placeholder="Ingrese ajuste pesaje"
                                                                style={{ marginLeft: '10px' }}
                                                                value={pesoBasculaValue}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
                                                                    setpesoBasculaValue(sanitizedValue);

                                                                    // Validar que el valor sea mayor que cero
                                                                    if (parseInt(inputValue) === 0) {
                                                                        setErrorMessagePesoBascula("Hay valores en cero.");
                                                                        errorMessageRef.current.show();

                                                                    }
                                                                    else {
                                                                        setErrorMessagePesoBascula("")

                                                                    }

                                                                }
                                                                }
                                                            />
                                                            <ErrorMessage ref={errorMessageRef} message={errorMessagePesoBascula} />
                                                            <label htmlFor="name"></label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                </>

                            )}
                            {selectedLoteData && (
                                <> <ErrorMessage ref={errorMessageRef} message={errorMessage} />
                                    <button className="button is-warning" onClick={handleOpenModal}>
                                        <b>Generar ajuste</b>
                                    </button>

                                    <div className="container mt-3">

                                        <ModalDialog
                                            show={showModal}
                                            title={"Confirmar Ajuste"}
                                            handleClose={handleCloseModal}
                                            handleSave={handleSaveModal}
                                            primeraLinea= {textEstimado}
                                            segundaLinea= {textReal}                                           
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default BotAgriFerAjuste;
