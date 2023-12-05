import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Header from "./components/Header"
import { UserContext } from "./context/UserContext";
import Table from "./components/Table";

const LazyLoginPage = React.lazy(() => import("./components/Login.jsx"));
const LazyBotGranjas = React.lazy(() => import("./components/BOTS/BotGranjas"));
const LazyBotCiclico = React.lazy(() => import("./components/BOTS/BotCiclico"));
const LazyBotVentaRMS = React.lazy(() => import("./components/BOTS/BotVentaRMS"));
const LazyBotAgriFerETL = React.lazy(() => import("./components/BOTS/BotAgriFerETL"));
const LazyBotRecetasProduccion = React.lazy(() => import("./components/BOTS/BotRecetasProduccion"));
const LazyBotAnalisisCrediticio = React.lazy(() => import("./components/BOTS/BotAnalisisCrediticios"));
const LazyBotAgriFerAjuste = React.lazy(() => import("./components/BOTS/BotAgriFerAjuste"));
const LazyBotDistribucion = React.lazy(() => import("./components/BOTS/BotDistribucion.jsx"));
const LazyBotInventarioAlmacenamiento = React.lazy(()=> import("./components/BOTS/BotInventarioAlmacenamiento.jsx"));
const LazyBotDiscount = React.lazy(() => import("./components/BOTS/BotDiscount.jsx"));
const LazyPageNotFound = React.lazy(() => import("./components/BOTS/PageNotFoud"));
const LazyBotPruebas = React.lazy(()=> import("./components/BOTS/BotPruebas.jsx"));
const LazyBotFalcon = React.lazy(() => import("./components/BOTS/BotFalcon.jsx"));


export default function App() {
  const [message, setMessage] = useState("");
  const [token] = useContext(UserContext);

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

      }
    };
    const response = await fetch("/api", requestOptions);
    const data = await response.json();
    if (!response.ok) {
      console.log("something messed up")

    }
    else {
      setMessage(data.message)
    }
  };

  useEffect(() => {
    getWelcomeMessage()
  }, [])
  return (

    <Router>
      <div>

        <Routes>
          {/* Agregar previamente el projecto a la base de datos database.db */}
          {/* path conformado por /projecto/(nombre_del_projecto)/(indice_del_projecto): el nombre del projecto debe ser igual al env de conda */}
          <Route path={"/project/Granjas/p6&" + token} element={<LazyBotGranjas title={"Bot Granjas"} />} />
          <Route path={"/project/TomaCiclica/p6&" + token} element={<LazyBotCiclico title={"Bot Ciclico"} />} />
          <Route path={"/project/VentaRMS/p8&" + token} element={<LazyBotVentaRMS title={"Bot VentasRms"} />} />
          <Route path={"/project/AgriFerETL/6&" + token} element={<LazyBotAgriFerETL title={"AgriFer ETL"} />} />
          <Route path={"/project/RecetasProduccion/p2&" + token} element={<LazyBotRecetasProduccion title={"Recetas Produccion"} />} />
          <Route path={"/project/AnalisisCrediticio/p10&" + token} element={<LazyBotAnalisisCrediticio title={"Análisis Crediticio"} />} />
          <Route path={"/project/AgriFerAjuste/p11&" + token} element={<LazyBotAgriFerAjuste title={"Liquidación de Aves"} />} />
          <Route path={"/project/AppDiscount/p12&" + token} element={<LazyBotDiscount title={"App Descuentos"} />} />
          <Route path={"/project/InventarioAlmacenamiento/p13&" + token} element={<LazyBotInventarioAlmacenamiento title={"Inventario Almacenamiento"} />} />
          <Route path={"/project/pruebas/p200&" + token} element={<LazyBotPruebas title={"Forecast Aves"} />} />
          <Route path={"/project/AppFalcon/p14&" + token} element={<LazyBotFalcon title={"App Falcon"} />} />
          <Route path="*" element={<LazyPageNotFound title={message} />} />


          <Route path="/table" element={
            <>
              <Header title={message} />

              <Table />
            </>
          }>
          </Route>

          <Route path="/" element={
            <>
              <div className="bg-img">

                {!token ? (
                  <div className="hero is-fullheight is-primary has-background">
                    <img alt="Fill Murray" className="hero-background is-transparent" src="background.jpg" />
                    <div className="hero-body">
                      <div className="container">
                        <Login></Login>

                      </div>
                    </div>
                  </div>
                ) : (
                  <Navigate to='/table' />
                )}


              </div>
            </>
          }  >


          </Route>
        </Routes>
      </div>
    </Router>


  );
}

