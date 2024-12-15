import { getFirestore, collection, addDoc, doc, setDoc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { auth, db } from './config.js';

const createAccountModal = document.getElementById("create-account-modal");
const step1 = document.getElementById("create-account-step1");
const step2 = document.getElementById("create-account-step2");
const crushesContainer = document.getElementById("crushes-container");
const infoButton = document.getElementById("info-button");
const popupContainer = document.createElement("div");
const popupText = document.createElement("div");
const closePopup = document.createElement("div");
const createAccountError = document.getElementById("create-account-error");
let emailVerificationCheckInterval;

const addCrushButton = document.getElementById("crush-button");
const maxCrushes = 3;

function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

createAccountModal.style.display = "none";
window.openCreateAccountModal = function() {
  const schoolEmailInput = document.getElementById('school-email');
  const textInput = document.querySelector('input[type="text"]');
  
  schoolEmailInput.value = textInput.value;
  step1.style.display = "flex";
  step2.style.display = "none";
  createAccountModal.style.display = "flex";
};

window.closeCreateAccountModal = function() {
  createAccountModal.style.display = "none";
};

window.closeLoginModal = function() {
  document.getElementById('login-modal').style.display = 'none';
}


const loginModal = document.getElementById("login-modal");


window.loginUser = async function() {
  const email = document.querySelector('input[type="text"]').value;
  const loginError = document.getElementById("login-error");
  
  const isLogin = true;
  

  const actionCodeSettings = {
    url: `http://murmurmatch.com/verified.html?email=${email}&login=${isLogin}`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    loginModal.style.display = "flex";

    

  } catch (error) {
    loginError.style.display = "block";
    loginError.textContent = error.message;
  }
};



document.addEventListener("DOMContentLoaded", async function () {
  const selectEmail = getUrlParameter('email');
  const isLogin = getUrlParameter('login');

  
  popupContainer.classList.add("popup-container");
  popupContainer.style.display = "none";

  popupText.classList.add("popup-text");
  popupText.textContent = "Curious if your crush likes you back? Register and input the school emails of your crushes. This notifies them via email that they have a secret admirer. If they enter your email back, a chat will open."

  closePopup.classList.add("close-popup");
  closePopup.textContent = "✖";

  popupContainer.appendChild(popupText);
  popupContainer.appendChild(closePopup);
  document.body.appendChild(popupContainer);

  closePopup.addEventListener("click", function () {
    popupContainer.style.display = "none";
  });

  infoButton.addEventListener("click", function () {
    popupContainer.style.display = popupContainer.style.display === "none" ? "block" : "none";
  });
  
  document.getElementById("school-email-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      loginUser();
    }
  });

  const donate = document.getElementById('donate-button');
  donate.addEventListener('click', function() {
    window.open("https://github.com/MaxwellFung/MurmurWebsite", "_blank");
  });
});


window.nextStep = async function() {
  const email = document.getElementById("school-email").value;

  createAccountError.style.display = "none";
  createAccountError.textContent = "";
  
  const isLogin = false;
  
  const fullName = document.getElementById('name').value;
  
  console.log(fullName);

  try {
    const actionCodeSettings = {
        url: `http://murmurmatch.com/verified.html?email=${email}&login=${isLogin}&name=${fullName}`,
        handleCodeInApp: true,
    };


    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    step1.style.display = "none";
    step2.style.display = "flex";
    
  } catch (error) {
    createAccountError.style.display = "block";
    createAccountError.textContent = error.message;
  }
};

//onAuthStateChanged(auth, user => {
//  if (user) {
//    console.log("User is signed in:", user);
//    localStorage.setItem("user", JSON.stringify({
//      email: user.email,
//      uid: user.uid
//    }));
//    if (user.emailVerified) {
//      step1.style.display = "none";
//      step2.style.display = "none";
//    } else {
//      step1.style.display = "none";
//      step2.style.display = "flex";
//    }
//  } else {
//    clearInterval(emailVerificationCheckInterval);
//  }
//});
