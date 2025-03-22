import React, { useState } from "react";

const ModalUbicacion = ({ setUbicacion }) => {
  const [provincia, setProvincia] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [modalAbierto, setModalAbierto] = useState(true);

  const provincias = {
    "La Habana": ["Playa", "Centro Habana", "Habana Vieja"],
    "Matanzas": ["Cárdenas", "Colón", "Matanzas"],
  };

  const manejarSeleccion = () => {
    if (provincia && municipio) {
      setUbicacion({ provincia, municipio });
      setModalAbierto(false);
      localStorage.setItem("ubicacion", JSON.stringify({ provincia, municipio }));
    }
  };

  return (
    modalAbierto && (
      <div className="modal">
        <div className="modal-content">
          <h2>Selecciona tu ubicación</h2>
          <select onChange={(e) => setProvincia(e.target.value)} value={provincia}>
            <option value="">Selecciona una provincia</option>
            {Object.keys(provincias).map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          <select onChange={(e) => setMunicipio(e.target.value)} value={municipio} disabled={!provincia}>
            <option value="">Selecciona un municipio</option>
            {provincia && provincias[provincia].map((mun) => (
              <option key={mun} value={mun}>{mun}</option>
            ))}
          </select>
          <button onClick={manejarSeleccion} disabled={!municipio}>Confirmar</button>
        </div>
      </div>
    )
  );
};

export default ModalUbicacion;
