import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './css/Dialog.css';

function ModalDialog({
  show,
  handleClose,
  handleSave,
  primeraLinea = '',
  segundaLinea = '',
  title = '',
  showSaveButton = true, // Nueva propiedad para mostrar/ocultar el botón "Guardar"
  showCancelButton = true, // Nueva propiedad para mostrar/ocultar el botón "Cancelar"
}) {
  return (
    <Modal className='Dialog' show={show} onHide={handleClose} centered>
      <div className="Dialog-content">
        <Modal.Header closeButton>
          <Modal.Title className="Dialog-title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {primeraLinea}
          {segundaLinea}
        </Modal.Body>
        <Modal.Footer>
          {showCancelButton && ( // Mostrar el botón "Cancelar" si showCancelButton es verdadero
            <Button variant="danger" onClick={handleClose}>
              Cancelar
            </Button>
          )}
          {showSaveButton && ( // Mostrar el botón "Guardar" si showSaveButton es verdadero
            <Button variant="dark" onClick={handleSave}>
              Guardar
            </Button>
          )}
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default ModalDialog;
