// src/App.js
import React from "react";
import HomePage from "./pages/HomePage";
import Footer from './components/Footer'; // Importa el nuevo componente Footer
import ScrollToTop from './components/ScrollToTop'; // Importa el nuevo componente ScrollToTop

function App() {
  return (
    <div className="App">
      <HomePage />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
