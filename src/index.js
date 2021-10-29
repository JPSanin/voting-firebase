import {
    initializeApp
} from 'firebase/app';
import {
    getDatabase,
    ref,
    set,
    onValue,
    get,
    push
} from 'firebase/database';

import {
    getFirebaseConfig
} from './firebase-config';

const ID = document.getElementById("ID");
const nombre = document.getElementById("nombre");
const ID_voto = document.getElementById("ID_voto");
const registrar_btn = document.getElementById("registrar_btn");
const votar_btn = document.getElementById("votar_btn");
const candidatos_btn = document.getElementById("candidatos_btn");
const votaciones_btn = document.getElementById("votaciones_btn");

// Inicializar firebase
const firebaseAppConfig = getFirebaseConfig();
const firebaseApp = initializeApp(firebaseAppConfig);

function registrarCandidato(candidato) {
    // Obtener la base datos
    const db = getDatabase();
    const newCandidatoRef = push(ref(db, 'candidatos'));
    console.log(newCandidatoRef);

    // injectar el id
    candidato["key"] = newCandidatoRef.key
    // escribir un nuevo usuario
    set(newCandidatoRef, candidato);
    ID.value="";
    nombre.value="";
}

const registrarEventoCandidato = (e, event) => {
    console.log("ejecutó evento");
    const candidato = {
        id: ID.value,
        nombre: nombre.value,
        votos: 0
    }
    registrarCandidato(candidato)
}

const verCandidatosEvento = (e, event) => {
    const db = getDatabase();
    const dbRef = ref(db, 'candidatos');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        console.log("lista", data);
        candidatosAlert(data);
    });
}

function candidatosAlert(info) {
    let message = "";
    if (info) {
        message = "";
        Object.keys(info).forEach((k, index) => {
            console.log(k, index);
            console.log("Objeto", info[k]);
            message += "Nombre Candidato: " + info[k].nombre + " Id: " + info[k].id;
            message += "\n";
        });

    } else {
        message = "No hay candidatos registrados";
    }
    alert(message);
}

const votarEvento = (e, event) => {
    const db = getDatabase();
    const dbRef = ref(db, 'candidatos');
    let idVote=ID_voto.value;
    //Método get para traer los datos una sola vez ***
    get(dbRef).then((snapshot) =>{
        const data = snapshot.val();
        console.log("lista", data);
        candidatosVote(data,idVote);
    });
}

function candidatosVote(info,voto){
    let message = "";
    let isVote=false;
    const db = getDatabase();
    if (info) {
        
        Object.keys(info).forEach((k, index) => {
           
            console.log(k, index);
            console.log("Objeto", info[k])
            if(info[k].id==voto){
                //Editar votos
                set(ref(db, 'candidatos/'+info[k].key+'/votos'),info[k].votos+1);
                message = "Se voto exitosamente por: " + info[k].nombre + " Id: " + info[k].id;
                isVote=true;
                return;
            }else if(isVote==false){
                message = "No se encontró un candidato con ese ID";
            }
           
           
        });

    } else {
        message = "No hay candidatos registrados, no se puede votar";
    }
    alert(message);
}


const verVotacionesEvento = (e, event) => {
    const db = getDatabase();
    const dbRef = ref(db, 'candidatos');
    //Método get para traer los datos una sola vez ***
    get(dbRef).then((snapshot) =>{
        const data = snapshot.val();
        console.log("lista", data);
        mostrarVotos(data);
    });
}

function mostrarVotos(info){
    let message = "";
    let totalVotos=0;
    const db = getDatabase();
    if (info) {
        Object.keys(info).forEach((k, index) => {  
            console.log(k, index);
            console.log("Objeto", info[k]);
            totalVotos+=info[k].votos;
        });

        if(totalVotos>0){
            Object.keys(info).forEach((k, index) => {  
                console.log(k, index);
                console.log("Objeto", info[k]);
                let porcentajeVotos= (info[k].votos/totalVotos)*100;
                message += "Nombre Candidato: " + info[k].nombre + " Id: " + info[k].id + " Porcentaje Votos: "+ porcentajeVotos+"%";
                message +="\n";
            });
        }
    } else {
        message = "No hay candidatos registrados, no se ver votaciones";
    }

    

   
    alert(message);
}

registrar_btn.addEventListener("click", registrarEventoCandidato);
candidatos_btn.addEventListener("click", verCandidatosEvento);
votar_btn.addEventListener("click", votarEvento);
votaciones_btn.addEventListener("click", verVotacionesEvento);