/*
  All rights belongs to Students for the Exploration and Development of Space Sri Lanka (SEDS-SL)
  @ 2020
  Designed by SupulCFG -github.com/SupulCFG
*/

//Global Variables

// let db = firebase.firestore();


//   firebase.auth().onAuthStateChanged(user => {
//       if(user) {
//           if(window.localStorage.teamName){
//             document.getElementById('logged-user').innerHTML = window.localStorage.getItem('teamName');
//           }else {
//             let email = firebase.auth().currentUser.email;
//             db.collection("teams").doc("teams").get().then(doc => {
//               if(doc.exists) {
//                 let teamName = doc.get('users')[email];
          
//                 if(window.localStorage) {
//                     window.localStorage.setItem('teamName', teamName);
//                     document.getElementById('logged-user').innerHTML = window.localStorage.getItem('teamName');
//                 }
//               }
//             });
//           }
          
//       }else {

//       window.location.href = "index.html";
//       }
      
//   }); 



function nextQ() {
  let qNum = window.localStorage.getItem('obsCurrentQ');
  document.getElementById(`q${qNum}`).style.backgroundColor ='white';
  document.getElementById(`q${qNum}`).style.color ='DodgerBlue';
  qNum++;
  document.getElementById(`q${qNum}`).style.backgroundColor ='DodgerBlue';
  document.getElementById(`q${qNum}`).style.color ='white';
  window.localStorage.setItem('obsCurrentQ', qNum);
  submitAns();
  getQuestion(qNum);
}

function previousQ() {
  let qNum = window.localStorage.getItem('obsCurrentQ');
  document.getElementById(`q${qNum}`).style.backgroundColor ='white';
  document.getElementById(`q${qNum}`).style.color ='DodgerBlue';
  

   qNum--;
  document.getElementById(`q${qNum}`).style.backgroundColor ='DodgerBlue';
  document.getElementById(`q${qNum}`).style.color ='white';
 
  window.localStorage.setItem('obsCurrentQ', qNum);
  submitAns();
  getQuestion(qNum);
}

function goBack() {

  let teamName;
  let qID;

  if(window.localStorage){
    teamName = window.localStorage.getItem('teamName');
    qID = window.localStorage.getItem('obsQID');
  }
  let ansDocRef = db.collection("teams").doc(teamName);

  let checkRadio = document.querySelector('input[name="qradio"]:checked');
  
  if(checkRadio) {
    let map = 'observationAns.' +qID; 
    ansDocRef.update({
      [map] : parseInt(checkRadio.value)
    }).then(function() {
      console.log("Done Updating");
      window.location.href ="dashboard.html";
    });

  }else {
    window.location.href = "dashboard.html";
  }




  
}


function submitAns() {
  let teamName;
  let qID;
  if(window.localStorage){
    teamName = window.localStorage.getItem('teamName');
    qID = window.localStorage.getItem('obsQID');
  }
  let ansDocRef = db.collection("teams").doc(teamName);

  let checkRadio = document.querySelector('input[name="qradio"]:checked');
  //Look for NULL
  
  if(checkRadio) {
    let map = 'observationAns.' +qID; 
    ansDocRef.update({
      [map] : parseInt(checkRadio.value)
    }).then(function() {
      console.log("Done Updating");
    });

    //updates answered cell colours
    const questions = JSON.parse(window.localStorage.getItem('obsQObject'));
    let answered = JSON.parse(window.localStorage.getItem('obsAnsObject'));
    if(!answered) {
      answered = {};
    }
    for(x in questions) {
      if(qID == questions[x]) {
        answered[x] = parseInt(checkRadio.value);
        document.getElementById(`q${x}`).style.backgroundColor = 'greenyellow';
        break;
      }
    }
    window.localStorage.setItem('obsAnsObject', JSON.stringify(answered));


  }
}


function getQuestion(qnum = 1){
  let teamName;  
  if(window.localStorage.teamName) {
    teamName = window.localStorage.getItem('teamName');
  }else {
    db.collection("teams").doc("teams").get().then(doc => {
      if(doc.exists) {
        
        let uEmail = firebase.auth().currentUser.email;
        let teamName = doc.get('users')[uEmail];
          if(window.localStorage) {
              window.localStorage.setItem('teamName', teamName);
          }
      }
    });
  }
  

  let qdocRef = db.collection("teams").doc(teamName);

  qdocRef.get().then(doc =>{
    if(doc.exists){ 
      if(doc.get('isFinished')){
        console.log("Finish : Some User Finished Session");
        window.localStorage.clear();
        firebase.auth().signOut();
        window.location.href = "index.html";
      }

      document.getElementById(`q${qnum}`).style.backgroundColor ='DodgerBlue';
      document.getElementById(`q${qnum}`).style.color ='white';

      qn = doc.get('observation')[qnum];
      window.localStorage.setItem('obsQID', qn);
      
      let db = firebase.firestore();

      let docRef = db.collection("observation").doc(qn);

      docRef.get().then(doc => {
          if (doc.exists) {
            document.getElementById('questionNumber').innerHTML = "Question : " + qnum;
            document.getElementById('questionText').innerHTML = doc.get('question');
            let arrAns = doc.get('answers');
    
            let ansRadio = "";
    
            for(let i = 0; i < 5; i++){
              let ans = arrAns[i];
              if(ans == ""){
    
                break;
              }
    
              ansRadio  += `<div class="answer">
                  <input type="radio" name="qradio" id="answer${i+1}" value="${i+1}">
                  <label for="answer${i+1}" id="answer${i+1}-text">${ans}</label>
                  </div>`;
              
            }
            document.getElementById(`answers-main`).innerHTML = ansRadio;
    
            //Checks radio box if the Value is previously entered
            firebase.firestore().collection('teams').doc(window.localStorage.getItem('teamName')).get().then(doc => {
              if(doc.exists) {
                
                if(window.localStorage.obsQID && doc.get('observationAns') && doc.get('observationAns')[window.localStorage.getItem('obsQID')]){
                  let ans = doc.get('observationAns')[window.localStorage.getItem('obsQID')];
                  document.getElementById(`answer${ans}`).checked = true;
                }  
              }
            });
    
            if(window.localStorage) {
              window.localStorage.setItem('obsCurrentQ', qnum);
            }
    
    
            if(qnum == 1) {
              document.getElementById('btnNext').style.display = 'block';          
              document.getElementById('btnPrevious').style.display = 'none';          
              document.getElementById('btnFinish').style.display = 'none';          
            }else if(qnum == 50) {
              document.getElementById('btnPrevious').style.display = 'block';      
              document.getElementById('btnNext').style.display = 'none';      
              document.getElementById('btnFinish').style.display = 'block';      
            }else {
              document.getElementById('btnPrevious').style.display = 'block';
              document.getElementById('btnNext').style.display = 'block';
              document.getElementById('btnFinish').style.display = 'none';
    
            }
    
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
    
    
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

    }else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
    }
  });

}

function getQsp(num) {
  let old = window.localStorage.getItem('obsCurrentQ')
  if(old){
    document.getElementById(`q${old}`).style.backgroundColor ='white';
    document.getElementById(`q${old}`).style.color ='DodgerBlue';
  }
  

  document.getElementById(`q${num}`).style.backgroundColor ='DodgerBlue';
  document.getElementById(`q${num}`).style.color = 'white';
  submitAns();
  getQuestion(num);
}

function qAnswered() {
  let teamName = window.localStorage.getItem('teamName');
  db.collection('teams').doc(teamName).get().then(doc => {
    if(doc.exists) {
      let questions = doc.get('observation');
      window.localStorage.setItem('obsQObject', JSON.stringify(questions));


      let answers;
      if(doc.get('observationAns')) {
        answers = doc.get('observationAns');
        window.localStorage.setItem('obsAObject', JSON.stringify(answers));

        let answered = {};
        for(x in questions) {
          if(answers.hasOwnProperty(questions[x])) {
            answered[x] = answers[questions[x]];
          }
        }
        window.localStorage.setItem('obsAnsObject', JSON.stringify(answered));
        for(x in answered) {
          document.getElementById(`q${x}`).style.backgroundColor = 'greenyellow';
        }        
      }else {
        answers = {};
        window.localStorage.setItem('obsAObject', JSON.stringify(answers));
      }
    }
  });
}

function loadMe() {
  qAnswered();
  if(window.localStorage.obsCurrentQ){
    let current = window.localStorage.getItem('obsCurrentQ');
    document.getElementById(`q${current}`).style.backgroundColor ='DodgerBlue';
    document.getElementById(`q${current}`).style.color = 'white';
    getQuestion(current);
  }else {
    document.getElementById(`q1`).style.backgroundColor ='DodgerBlue';
    document.getElementById(`q1`).style.color = 'white';
    getQuestion(1);
  }
}


function logout() {
  //TODO: Add a confirmation dialogue box
  window.localStorage.clear();
    firebase.auth().signOut();
    console.log("Logged Out");
    window.location.href = "index.html";
}