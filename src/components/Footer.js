// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">En memoria de Gordito</h3>
            <p className="text-sm">Un gordito hermoso y regalón</p>
          </div>
          <div className="text-sm">
            <p>&copy; {new Date().getFullYear()} Todos los derechos reservados</p>
            <p>Creado con amor por Juan Zúñiga Codoceo</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;