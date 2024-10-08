// setAccessCode.js
const { initializeApp } = require("firebase/app");
const { getFirestore, setDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC1haLQw7IUtCMvFoi0acLWUqh3mp1RL-k",
  authDomain: "gorditoo-2af62.firebaseapp.com",
  projectId: "gorditoo-2af62",
  storageBucket: "gorditoo-2af62.appspot.com",
  messagingSenderId: "824140633961",
  appId: "1:824140633961:web:aadf5d3a4462610d9b4ff8",
  measurementId: "G-CJ9KJJSVPL"
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