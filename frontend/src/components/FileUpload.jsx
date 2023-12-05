import React, { useState } from 'react';
// import '../css/DragDrop.css';
const FileUpload = ({ onFilePath }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [file_path2, setFilePath] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('Ningún archivo seleccionado');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/uploadfile/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Archivo cargado exitosamente:', data);
        setUploadResult(data);
         // Guardar la ruta del archivo en el estado
      setFilePath(data.file_path);

      // Llamar a la función proporcionada por la prop onFilePath
      onFilePath(data.file_path);

      setUploadResult(data);
      } else {
        console.error('Error al cargar el archivo');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' , maxHeight:'400px'}}>
      <div
        style={{
        borderRadius: '10px',
          background: '#E8C2AA',
          padding: '10px',
          textAlign: 'center',
          marginTop: '10px',
        }}
      >
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #ccc',
            padding: '50px', // Ajusta el tamaño del margen
            textAlign: 'center',
            cursor: 'pointer',
            background: '#EFD6C6', // Color del área de arrastre
          }}
        >
          {selectedFile ? (
            <><p>Archivo: {selectedFile.name}</p>
            <button onClick={handleUpload} style={{ marginTop: '10px' }}>
            Subir Archivo
            </button></>
          ) : (
            <p>Arrastra y suelta un archivo aquí o <input type="file" onChange={handleFileChange} style={{ marginTop: '10px' }} /> </p>
          )}
        </div>
      </div>

      {uploadResult && (
        <div>
          <p>Resultado de la carga:</p>
          <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
