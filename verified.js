import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { auth, db } from '/js/config.js';

const createAccountModal = document.getElementById("create-account-modal");
const crushesContainer = document.getElementById("crushes-container");

const addCrushButton = document.getElementById("crush-button");

window.addEventListener('load', async () => {
  try {
    const selectEmail = getUrlParameter('email');
    const isLogin = getUrlParameter('login');
    
    if (await isSignInWithEmailLink(auth, window.location.href)) {
      const result = await signInWithEmailLink(auth, selectEmail, window.location.href);
      const domain = selectEmail.split("@")[1];
      localStorage.setItem("domain", domain);

      const userDoc = await getDoc(doc(db, domain, result.user.uid));
      if (userDoc.exists()) {
        window.location.href = "main.html";
      } else {
        document.getElementById("login-email").value = selectEmail;
        const emailDomainSpans = document.querySelectorAll('.email-domain');
        emailDomainSpans.forEach(span => {
          span.textContent = "@" + domain;
        });
        if (isLogin !== 'false') {
          document.getElementById("name-input-container").style.display = "flex";
        }
        createAccountModal.style.display = "flex";
      }
    }
  } catch (error) {
    console.error("Error during window load event:", error);
    alert("Invalid Link. Try logging in again.");
    window.location.href = "main.html";
  }
});


window.addCrush = function() {
  const domain = localStorage.getItem('domain');

  const crushInputs = document.querySelectorAll(".crush-email");
  if (crushInputs.length >= 3) {
    alert("You can only add up to 3 crushes.");
    return;
  }

  const crushInputWrapper = document.createElement("div");
  crushInputWrapper.classList.add("crush-input-wrapper");

  const deleteCrushButton = document.createElement("span");
  deleteCrushButton.classList.add("delete-crush");
  deleteCrushButton.textContent = "✖";
  deleteCrushButton.addEventListener("click", function() {
    crushInputWrapper.remove();
    updateAddCrushButtonState();
  });

  const newCrushInput = document.createElement("input");
  newCrushInput.type = "text";
  newCrushInput.classList.add("crush-email");
  newCrushInput.placeholder = "Peer's School Email";

  const emailDomainSpan = document.createElement("span");
  emailDomainSpan.classList.add("email-domain");
  emailDomainSpan.textContent = "@" + domain;

  crushInputWrapper.appendChild(deleteCrushButton);
  crushInputWrapper.appendChild(newCrushInput);
  crushInputWrapper.appendChild(emailDomainSpan);
  crushesContainer.appendChild(crushInputWrapper);

  // Disable the add crush button if the limit is reached
  if (crushInputs.length + 1 >= 3) {
    updateAddCrushButtonState();
  }
};

window.submit = async function() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const crushEmails = [];
  const crushInputs = document.querySelectorAll(".crush-email");
  let hasEmptyFields = false;

  const regex = /<([^@]+)@/;
  const regex2 = /^([^@]+)/;
  crushInputs.forEach(input => {
    if (input.value.trim() === '') {
      hasEmptyFields = true;
    } else {
      const inputName = (input.value.includes('<') && input.value.includes('@')) ? input.value.match(regex)[1] : input.value;
      const inputName2 = (inputName.includes('@')) ? inputName.match(regex2)[1] : inputName; 
      crushEmails.push((inputName2 + input.nextElementSibling.textContent).toLowerCase());
    }
  });

  const isLogin = getUrlParameter('login');
  
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;

  if ((!firstName || !lastName) && isLogin !== 'false') {
    alert("Please fill in both First Name and Last Name");
    return;
  }

  if (hasEmptyFields) {
    alert("Please fill or delete empty crush fields");
    return;
  }

  const userEmail = user.email;
  const userDomain = userEmail.split("@")[1];
  
  
  

  await setDoc(doc(db, userDomain, user.uid), {
    name: isLogin !== 'false' ? firstName + ' ' + lastName : getUrlParameter('name'),
    email: userEmail,
    emailDomain: userDomain,
    crushes: crushEmails,
    emailedCrushes: crushEmails,
    createdAt: new Date().toISOString(),
    matches: []
  });

  await setDoc(doc(db, 'domains', userDomain), {
    updatedBy: userEmail
  });

  const response = await fetch('https://us-central1-murmurwebsite.cloudfunctions.net/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emails: crushEmails }),
  });

  localStorage.setItem("domain", userDomain);

  window.location.href = "main.html";
};


function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user);
    localStorage.setItem("user", JSON.stringify({
      email: user.email,
      uid: user.uid
    }));
  }
});


function updateAddCrushButtonState() {
  const crushInputs = document.querySelectorAll(".crush-email");
  if (crushInputs.length >= 3) {
    addCrushButton.style.backgroundColor = 'grey';
    addCrushButton.style.cursor = 'not-allowed';
    addCrushButton.disabled = true;
  } else {
    addCrushButton.style.backgroundColor = '';
    addCrushButton.style.cursor = '';
    addCrushButton.disabled = false;
  }
}

