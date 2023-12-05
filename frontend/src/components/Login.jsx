import React, { useRef, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import './css/Login.css'

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [, setToken] = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const errorMessageRef = useRef(null);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${usuario}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };
    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data.detail);
      errorMessageRef.current.show();
    } else {
      setToken(data.access_token);
      // window.location.href = "/table"; // Comentar esta línea para evitar redireccionamiento automático
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario.length > 0 && password.length > 0) {
      submitLogin();
    } else {
      setErrorMessage("No se permiten campos vacíos"); // Corregir el mensaje de error
      errorMessageRef.current.show();
    }
  };
    
  return (
    <div className="primay-box">
      <div className="box-login">
        <div>
          <form className="box" onSubmit={handleSubmit}>
            <h1 className="title has-text-centered">Login</h1>
            <div className="field">
              <label className="label">Usuario</label>
              <div className="control">
                <input type="name" placeholder="Ingrese su usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Contraseña</label>
              <div className="control">
                <input type="password" placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <ErrorMessage ref={errorMessageRef} message={errorMessage} />

            <br></br>
            <div className="button-container">
              <button className="button is-warning is-lig" type="submit">
                Iniciar sesión
              </button>
            </div>
                        
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
