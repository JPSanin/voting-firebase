const firebaseConfig = {
    apiKey: "AIzaSyCQ24GybnV1BED9itRYmvLscZ6VBQ5mkiw",
    authDomain: "practica-semana-10.firebaseapp.com",
    databaseURL: "https://practica-semana-10-default-rtdb.firebaseio.com",
    projectId: "practica-semana-10",
    storageBucket: "practica-semana-10.appspot.com",
    messagingSenderId: "468233868666",
    appId: "1:468233868666:web:e9fb86032200937ce772c3"
};

export function getFirebaseConfig(){
    if (!firebaseConfig || !firebaseConfig.apiKey){
        throw new Error("Firebase configuration error");
    } else {
        return firebaseConfig;
    }
}