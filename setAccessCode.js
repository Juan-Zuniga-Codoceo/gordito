require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore, setDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const setAccessCode = async () => {
  try {
    await setDoc(doc(db, "accessCodes", "uploadCode"), {
      code: "gordito"  // Código actualizado
    });
    console.log("Código de acceso actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar el código de acceso:", error);
  } finally {
    process.exit(0);
  }
};

setAccessCode();