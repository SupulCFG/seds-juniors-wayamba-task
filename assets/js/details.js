/*
  All rights belongs to Students for the Exploration and Development of Space Sri Lanka (SEDS-SL)
  @ 2020
  Designed by SupulCFG -github.com/SupulCFG
*/
firebase.auth().onAuthStateChanged(user => {
    if(user) {

        let thisUser = firebase.auth().currentUser;
        
        setTeamName(thisUser.email);

        
        
        if(window.localStorage && window.localStorage.teamName){
          console.log(window.localStorage.getItem('teamName'));
          document.getElementById('logged-user').innerHTML = window.localStorage.getItem('teamName');
        }else {
          let email = firebase.auth().currentUser.email;
          firebase.firestore().collection("teams").doc("teams").get().then(doc => {
            if(doc.exists) {
              let teamName = doc.get('users')[email];
        
              if(window.localStorage) {
                  window.localStorage.setItem('teamName', teamName);
                  document.getElementById('logged-user').innerHTML = window.localStorage.getItem('teamName');
              }
            }
          });
        }
        

        
        
        
    } else {
      // No user is signed in.
     // document.getElementById("login_div").style.display = "block";
     window.location.href = "index.html";
    }
    
  }); 

//Countdown Timer 
var finishingTime = 1590960600000;
var now = new Date().getTime();
var distance = finishingTime - now;

  // Time calculations for days, hours, minutes and seconds
 // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  if(hours <= 0) {
    if(minutes <= 0) {
        document.getElementById('timer').innerHTML = 'TIME UP!!!';
    }else {
        if(minutes == 1)
        document.getElementById('timer').innerHTML = "Time Remaining : "+ minutes + " minute";
        else 
        document.getElementById('timer').innerHTML = "Time Remaining : "+ minutes + " minutes";
    }
    
  }else {
    if(hours == 1)
        document.getElementById('timer').innerHTML = "Time Remaining : "+ hours + " hour " + minutes + " minutes";
    else
        document.getElementById('timer').innerHTML = "Time Remaining : "+ hours + " hours " + minutes + " minutes";

  }



console.log(finishingTime);
// Update the count down every 1 minute
var x = setInterval(function() {

  // Get today's date and time
  now = new Date().getTime();
  // Find the distance between now and the count down date
  var distance = finishingTime - now;
    console.log(distance)
  // Time calculations for hours and minutes
  var hours = Math.floor((distance) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));    
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "EXPIRED";
  }

  if(hours <= 0) {
    if(minutes <= 0) {
        document.getElementById('timer').innerHTML = 'TIME UP!!!';
    }else {
        if(minutes == 1)
        document.getElementById('timer').innerHTML = "Time Remaining : "+ minutes + " minute";
        else 
        document.getElementById('timer').innerHTML = "Time Remaining : "+ minutes + " minutes";
    }
    
  }else {
    if(hours == 1)
        document.getElementById('timer').innerHTML = "Time Remaining : "+ hours + " hour " + minutes + " minutes";
    else
        document.getElementById('timer').innerHTML = "Time Remaining : "+ hours + " hours " + minutes + " minutes";

  }

}, 60000);


function checkSession() {
  const ref = firebase.firestore().collection('teams').doc(window.localStorage.getItem('teamName'));
  ref.get().then(doc => {
    if(doc.exists) {
      let finished = doc.get('isFinished');
      if(finished){
        console.log("Finish : Some User Finished Session");
        window.localStorage.clear();
        firebase.auth().signOut();
        window.location.href = "index.html";
      }
    }
  })
}


 //Gets Team Name from FireStore and Strores it in LocalStorage 
function setTeamName(email) {
  let db = firebase.firestore();
  let docRef = db.collection("teams").doc("teams");


  docRef.get().then(doc => {
    if(doc.exists) {
      let teamName = doc.get('users')[email];

      if(window.localStorage) {
          window.localStorage.setItem('teamName', teamName);

      }
    }
  });
}



function paperclicked(subject) {
  subject += ".html";
  //console.log(subject);
  window.location.href = subject;
}


function logout() {
  window.localStorage.clear();
    firebase.auth().signOut();
    console.log("Logged Out from Dashboard");
    window.location.href = "index.html";
}