// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in: ', user);
      db.collection('DailyTracker').where("userId", "==", user.email)
      .onSnapshot(snapshot => {
        setupGuides([])
        setupGuides(snapshot.docs);
        setupUI(user)
    },(err) => {
        console.log(err.message)
        })
    } else {
      console.log('user logged out');
      setupUI();
      setupGuides([]);
    }
  })
function convertDate(dateInput){
  const date = new Date(dateInput)
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}
// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit',async (e) => {
  e.preventDefault();

  await db.collection('DailyTracker').add({
    qNumPass: parseInt(createForm.qNumPass.value),
    qNumFail: parseInt(createForm.qNumFail.value),
    qType: createForm.qType.value,
    date: createForm.dateInput.value,
    userId: firebase.auth().currentUser.email
  }).then(() => {

    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log('new sign up: ', cred.user);
    return db.collection('user').doc(cred.user.uid).set({
        name: document.getElementById('signup-name').value,
        signUpDate: new Date(),
        userId: cred.user.uid,
        email:cred.user.email
    })
 
  }).then(()=>{
           // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  d3.select('#my_dataviz').selectAll('svg').remove()
  auth.signOut()
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
  
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});