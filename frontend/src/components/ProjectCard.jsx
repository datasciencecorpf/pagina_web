
import React from "react";
import './css/Card.css'
import faviconICO from "C:\\Users\\datascience\\Documents\\Webpage\\demo-app\\frontend\\src\\ico_fernadez.ico";

function ProjectCard({ name, alias,path, link ,backgroundColor}) {
  return (
    <a className="scale_card" href={link}>
    <div className="project-card-cf">
      <h2 className="random-background-cf" style={{ backgroundColor }}>{alias}</h2>
      <div className="image-container">
        <img className= "centered-image" src={faviconICO} alt="Icono"></img>

      </div>
      
    </div>
    </a>
  );
}

export default ProjectCard;
