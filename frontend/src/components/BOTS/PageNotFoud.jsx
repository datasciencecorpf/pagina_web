import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const PageNotFound = ({ title }) => {
  const [token] = useContext(UserContext);  // Suponiendo que obtienes el token del UserContext

  if (!token) {
    // Redirigir a la página de inicio si el usuario no está autenticado
    return <Navigate to="/" />;
  }

  return (
    <div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      <h6 className="title"> PAGINA NO ENCONTRADA </h6>
      <h1>Error 404</h1>
    </div>
  );
};

export default PageNotFound;
