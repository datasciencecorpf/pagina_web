import React, { useContext, useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import ProjectCard from "./ProjectCard";


const Table = () => {
  const [token] = useContext(UserContext);
  const [projects, setProjects] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);



  // Obtener todas las etiquetas h2 con la clase "random-background"
  const headings = document.querySelectorAll('.random-background');


  // Función para generar un color aleatorio en formato hexadecimal
  function getRandomColor() {
    const colors = ['#394867', '#293241', '#e53935', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c', '#689f38', '#fbc02d', '#ffa000', '#f57c00', '#e64a19', '#5d4037', '#616161', '#455a64'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
  // Función para obtener el brillo del color en una escala del 0 al 255
  function getBrightness(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness;
  }


  const getProjects = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/projects", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the leads");
    } else {
      const data = await response.json();
      setProjects(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getProjects();
    // Establecer un color de fondo aleatorio para cada etiqueta h2
    headings.forEach((heading) => {
      const color = getRandomColor();
      heading.style.backgroundColor = color;
      // Verificar si el color de fondo es demasiado oscuro
      const brightness = getBrightness(color);
      if (brightness < 128) {
        heading.style.color = "#fff";
      }

      // Agregar la clase "animated" para animar la transición de fondo
      heading.classList.add("animated");
    });


  }, []);




  // const execute_proyect = async()
  return (
    <>


      <ErrorMessage message={errorMessage} />
      {loaded && projects ? (

        <div className="project-dashboard">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.project_name}
              path={project.project_path}
              alias={project.alias}
              link={`/project/${project.project_name}/${project.id}&${token}`}
              backgroundColor={getRandomColor()}
            />
          ))}
        </div>
      ) : (<p>Loading</p>
      )}

    </>
  );
};

export default Table;