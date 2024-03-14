const t = window.parent.TrelloPowerUp.iframe({
  appKey: 'a467bedc9730247166a1c359649e3932',
  appName: 'Lean-UX'
})



function enable_due(status) {
  status = (status) ? false : true; //convert status boolean to text 'disabled'
  document.form_due.due.disabled = status;
}

var value;

function incrementValue() {
  value = parseInt(document.getElementById('number').textContent.match(/\d+$/)[0], 10);
  value = isNaN(value) ? 0 : value;
  if(value<=183)
  value++;
  document.getElementById('number').textContent = 'Sprint ' + value;
}

function decrementValue() {
  value = parseInt(document.getElementById('number').textContent.match(/\d+$/)[0], 10);
  value = isNaN(value) ? 0 : value;
  if(value>0&&value<=183)
  value--;
  document.getElementById('number').textContent = 'Sprint ' + value;
}

var dueDate = document.form_due.due.valueAsDate = new Date();

function eraseSprintDueDate() {
  let sprintNumber = value;
  t.set('board', 'shared', `S${sprintNumber}`);
  console.log(`S${sprintNumber}`);
}

function createSprintList() {
    var sprintNumber = value;
    var status = document.form_due.due.disabled;
    var sprintStr;
    if(!status){
      sprintStr = `Sprint ${sprintNumber} Done`;
      dueDate = document.form_due.due.value;
      console.log(dueDate);
      var sprintKey =  t.get('board', 'shared', `S${sprintNumber}`);
      var _bitField= sprintKey._bitField;
      if(_bitField==0){
        t.set('board', 'shared', `S${sprintNumber}`, dueDate);
      }      
    }
    else{
      sprintStr = `Sprint ${sprintNumber}`;
    }
    var token = t.arg('token');
    var tokenstr = token.fulfillmentValue;
    console.log("hola")
    var key = t.getRestApi().appKey;
    var context = t.getContext()
    var board = context.board;
    //var name = 'Nuevisima lista 3';    
    //var contextarg = t.arg('context');
    //var borardgstr = contextarg.board;
    var url = `https://api.trello.com/1/boards/${board}/lists?name=${sprintStr}&key=${key}&token=${tokenstr}`;
    console.log(url);
    fetch(url,
    {
      method: 'POST',
    })
  .then(response => response.json())
  .catch(err => console.error(err));
 
}

const postList = (key, name,board, token) =>
  fetch(`https://api.trello.com/1/boards/${board}/lists?
  name=${name}&key=${key}&token=${token}`,
  {
    method: 'POST',
  })