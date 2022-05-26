import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTKGWRsShofUEcsI83sVVEAZN3dCLO_3Q",
  authDomain: "task-manager-7bf3e.firebaseapp.com",
  projectId: "task-manager-7bf3e",
  storageBucket: "task-manager-7bf3e.appspot.com",
  messagingSenderId: "53768565854",
  appId: "1:53768565854:web:a7f47783552d82b33330cf",
};

const app = firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = app.auth();

export default app;
