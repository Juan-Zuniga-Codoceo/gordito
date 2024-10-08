import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import MemoryCard from '../components/MemoryCard';
import MemoryForm from '../components/MemoryForm';
import limachitoPic from '../images/limachito.png';

const HomePage = () => {
  const [memories, setMemories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'memories'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const memoriesArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMemories(memoriesArray);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    setMemories(memories.filter(memory => memory.id !== id));
  };

  const handleMemoryAdded = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            En memoria de Limachito
          </h1>
          <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
            <img src={limachitoPic} alt="Limachito" className="w-full h-full object-cover" />
          </div>
          <p className="mt-3 max-w-md mx-auto text-xl text-gray-600">
            Nuestro querido compañero felino, siempre curioso y lleno de vida.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Añadir Recuerdo
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {memories.map((memory) => (
            <MemoryCard 
              key={memory.id} 
              memory={memory} 
              onDelete={handleDelete}
            />
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Añadir Nuevo Recuerdo</h2>
              <MemoryForm onMemoryAdded={handleMemoryAdded} />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;