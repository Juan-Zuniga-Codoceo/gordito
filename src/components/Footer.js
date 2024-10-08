// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">En memoria de Limachito</h3>
            <p className="text-sm">Nuestro gordito regalón.</p>
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