import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { db, storage } from '../firebaseConfig';
import { doc, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

const MemoryCard = ({ memory, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(memory.description);

  function closeModal() {
    setIsOpen(false);
    setIsEditing(false);
  }

  function openModal() {
    setIsOpen(true);
    setIsEditing(false);
    setEditedDescription(memory.description);
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este recuerdo?')) {
      setIsDeleting(true);
      try {
        const imageRef = ref(storage, memory.imageUrl);
        try {
          await deleteObject(imageRef);
        } catch (storageError) {
          console.log('La imagen ya no existe en Storage o hubo un error al eliminarla:', storageError);
        }

        await deleteDoc(doc(db, 'memories', memory.id));

        if (typeof onDelete === 'function') {
          onDelete(memory.id);
        } else {
          console.error('onDelete is not a function');
        }
      } catch (error) {
        console.error('Error al eliminar el recuerdo:', error);
        alert('Hubo un error al eliminar el recuerdo. Por favor, intenta de nuevo.');
      }
      setIsDeleting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    try {
      const memoryRef = doc(db, 'memories', memory.id);
      await updateDoc(memoryRef, {
        comments: arrayUnion(newComment)
      });
      setNewComment('');
      memory.comments = [...(memory.comments || []), newComment];
    } catch (error) {
      console.error("Error al añadir comentario:", error);
      alert("Hubo un error al añadir el comentario. Por favor, intenta de nuevo.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDescription(memory.description);
  };

  const handleSaveEdit = async () => {
    try {
      const memoryRef = doc(db, 'memories', memory.id);
      await updateDoc(memoryRef, {
        description: editedDescription
      });
      setIsEditing(false);
      memory.description = editedDescription;
    } catch (error) {
      console.error("Error al actualizar la descripción:", error);
      alert("Hubo un error al actualizar la descripción. Por favor, intenta de nuevo.");
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img 
          src={memory.imageUrl} 
          alt={memory.description} 
          className="w-full h-48 object-cover cursor-pointer" 
          onClick={openModal}
        />
        <div className="p-4">
          <p className="text-gray-700 text-base">{memory.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">{memory.comments?.length || 0} comentarios</span>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:text-gray-400"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <img src={memory.imageUrl} alt={memory.description} className="w-full h-auto mb-4" />
                  {isEditing ? (
                    <div>
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        rows="3"
                      />
                      <div className="mt-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 mt-4"
                      >
                        {memory.description}
                      </Dialog.Title>
                      <button
                        onClick={handleEdit}
                        className="mt-2 text-blue-500 hover:text-blue-700"
                      >
                        Editar descripción
                      </button>
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="font-bold text-sm mb-2">Comentarios:</h4>
                    <ul className="text-sm text-gray-600 mb-4">
                      {memory.comments && memory.comments.map((comment, index) => (
                        <li key={index} className="mb-1">{comment}</li>
                      ))}
                    </ul>
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Comentar
                      </button>
                    </form>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cerrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MemoryCard;