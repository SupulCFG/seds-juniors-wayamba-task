/*
  All rights belongs to Students for the Exploration and Development of Space Sri Lanka (SEDS-SL)
  @ 2020
  Designed by SupulCFG -github.com/SupulCFG
*/
firebase.auth().onAuthStateChanged(user => {
  if(user) {
    //User is signed in
    if(window.localStorage.timeStamped)
    window.location.href = "dashboard.html";
  } else {
    // No user is signed in.
    document.getElementById("login_div").style.display = "block";

  }
  
}); 

function login() {
      const email = document.getElementById('txtEmail').value;
      const pass  = document.getElementById('txtPassword').value;

      firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(user => {
          if(user) {
            let thisUser = firebase.auth().currentUser;
            
            let db = firebase.firestore();
            let docRef = db.collection("teams").doc("teams");
          
          
            docRef.get().then(doc => {
              if(doc.exists) {
                let teamName = doc.get('users')[thisUser.email];
          
                if(window.localStorage) {
                    window.localStorage.setItem('teamName', teamName);
                }
                
                db.collection('teams').doc(teamName).get().then(doc => {
                  if(doc.exists) {
                    if(!doc.get('isFinished')){
                      if(doc.get('startedAt')){
                        console.log("Someone Already Logged In");
                        window.localStorage.setItem('timeStamped', 'true');
                        window.location.href = 'dashboard.html';
                      } else {
                        const ref =firebase.firestore().collection('teams').doc(window.localStorage.getItem('teamName'));
                        ref.update({
                          startedAt : firebase.firestore.FieldValue.serverTimestamp()
                        }).then(() => {
                          console.log("TimeStamped");
                          window.localStorage.setItem('timeStamped', 'true');
                          window.location.href = 'dashboard.html';
                        }).catch(e => {
                          console.error(e);
                        });

                     }
                    }else{
                      let time_now = new Date().getTime();
                      if(time_now < 1606491000000) {
                        document.getElementById('alreadyFinished').innerHTML = "Quiz hasn't started yet!!";

                        document.getElementById('alreadyFinished').style.display = 'block';
                          // Auto Hide the Alert after 10 seconds! 
                        setTimeout(() =>  {
                          document.getElementById('alreadyFinished').style.display = 'none';
                        }, 10000);

                      }else {
                      document.getElementById('alreadyFinished').innerHTML = "Your Login has been disabled since you have already finished the quiz and submited the answers. If not please contact (+94)714387473 (Supul Edirisinghe)";
                      console.log("Someone Finished your paper");
                      document.getElementById('alreadyFinished').style.display = 'block';
                      }
                  
                      
                    }
                    
                  }
                });

              }
            });

            
          }
        })
        .catch(error => {
          let errorCode = error.code;
          let errorMessage = error.message;

          alert(errorMessage);
          console.log(errorCode , ':' , errorMessage);
        });

}


// Enter Key Detection For Login Form
$("#txtPassword").keypress(event => {
  if(event.keyCode === 13) {
    $("#btnLogin").click();
  }
})



