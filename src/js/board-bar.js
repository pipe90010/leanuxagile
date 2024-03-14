/* global TrelloPowerUp */

var t = window.parent.TrelloPowerUp.iframe();

// want to know when you are being closed?
window.addEventListener('unload', function(e) {
  // Our board bar is being closed, clean up if we need to
});

document.getElementById("showImage").onclick = function() {
    if(document.getElementById("fivepoints").style.visibility=="hidden" && document.getElementById("tenpoints").style.visibility=="hidden")
      {
      document.getElementById("fivepoints").style.visibility = "visible";
      document.getElementById("tenpoints").style.visibility = "visible";
      }
    else{
      document.getElementById("fivepoints").style.visibility = "hidden";
      document.getElementById("tenpoints").style.visibility = "hidden";
    }        
}

var fivepoints=0;
var tenpoints=0;

t.render(() => t.get('board', 'shared','fivepoints')
  .then(five => {
      let fiveStr = JSON.stringify(five, null, 2)
      //console.log(fiveStr);
      fivepoints = parseInt(fiveStr, 10);      
    })
    .then( ()=> t.get('board', 'shared','tenpoints'))
    .then(ten=>{
      let tenStr = JSON.stringify(ten, null, 2)
      //console.log(tenStr);
      tenpoints = parseInt(tenStr, 10);
    })
)

function incrementFivePoints() {
  if(fivepoints<=11)
  fivepoints += 1;
  console.log(fivepoints);
  t.set('board', 'shared','fivepoints',fivepoints);
}

function decrementFivePoints() {
  if(fivepoints>0)
    fivepoints -= 1;
  console.log(fivepoints);
  t.set('board', 'shared','fivepoints',fivepoints);
}

function resetFivePoints() {
  t.set('board', 'shared','fivepoints',0);
}

function eraseFivePoints() {
  t.set('board', 'shared','fivepoints');
}

function incrementTenPoints() {
  if(tenpoints<=14)
  tenpoints += 1;
  console.log(tenpoints);
  t.set('board', 'shared','tenpoints',tenpoints);
}

function decrementTenPoints() {
  if(tenpoints>0)
    tenpoints -= 1;
  console.log(tenpoints);
  t.set('board', 'shared','tenpoints',tenpoints);
}

function resetTenPoints() {
  t.set('board', 'shared','tenpoints',0);
}

function eraseTenPoints() {
  t.set('board', 'shared','tenpoints');
}
