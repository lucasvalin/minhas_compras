import firebase from 'firebase/compat/app'; // Importe desta forma para carregar os tipos corretamente
import 'firebase/compat/database'; // Importe os módulos que você precisa usar

// Copie as informações de configuração do seu projeto Firebase aqui
const firebaseConfig = {
    apiKey: "AIzaSyCUzqClwQYbeOuEXFqG92bzNVeUYE0hBXE",
    authDomain: "minhas-compras-v2.firebaseapp.com",
    databaseURL: "https://minhas-compras-v2-default-rtdb.firebaseio.com",
    projectId: "minhas-compras-v2",
    storageBucket: "minhas-compras-v2.appspot.com",
    messagingSenderId: "967970789565",
    appId: "1:967970789565:web:605b1aa4a7bea72a2f3fd4",
    measurementId: "G-LXVYGNB1H1"
};

// Inicialize o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
