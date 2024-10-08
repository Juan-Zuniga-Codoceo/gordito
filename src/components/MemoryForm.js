import React, { useState } from 'react';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';

const MemoryForm = ({ onMemoryAdded }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !description || !accessCode) {
      setError('Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Verificar el código de acceso
      const accessCodeDoc = await getDoc(doc(db, 'accessCodes', 'uploadCode'));
      if (!accessCodeDoc.exists() || accessCodeDoc.data().code !== accessCode) {
        setError('Código de acceso incorrecto.');
        setIsUploading(false);
        return;
      }

      // Subir archivo a Firebase Storage
      const storageRef = ref(storage, `memories/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Guardar metadatos en Firestore
      await addDoc(collection(db, 'memories'), {
        description,
        imageUrl: downloadURL,
        timestamp: serverTimestamp(),
        comments: []
      });

      setDescription('');
      setFile(null);
      setAccessCode('');
      if (onMemoryAdded) onMemoryAdded();
    } catch (error) {
      console.error("Error al subir el recuerdo:", error);
      setError('Hubo un error al subir el recuerdo. Por favor, intenta de nuevo.');
    }

    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows="3"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mt-1 block w-full"
          accept="image/*"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Código de acceso</label>
        <input
          type="password"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isUploading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
      >
        {isUploading ? 'Subiendo...' : 'Subir recuerdo'}
      </button>
    </form>
  );
};

export default MemoryForm;