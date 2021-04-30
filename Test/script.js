import firebase from 'firebase'
import "firebase/auth"

const app = firebase.initializeApp({
 
  databaseURL:"https://algo-hommie-web.firebaseapp.com",
  apiKey: "AIzaSyAIN-5flo_9XjP57SjtwhIWLnHU_PeTNGc",
  authDomain: "algo-hommie-web.firebaseapp.com",
  projectId: "algo-hommie-web",
  storageBucket: "algo-hommie-web.appspot.com",
  messagingSenderId: "451932794664",
  appId: "1:451932794664:web:599007f433966e8bb46a1d"
})

uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }}

document.getElementById('myB').addEventListener("click",function(){
    alert('hi')
})