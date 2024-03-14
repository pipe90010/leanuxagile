'use strict'

function allowModals(){
  for (const i of document.getElementsByTagName('iframe')) {
    if (!i.sandbox.supports('allow-modals')) {
      console.warn("Your browser doesn't support the 'allow-modals' attribute :(");
      break;
    }
    if (i.sandbox.contains('allow-modals')) continue;
    console.info(i, "doesn't allow modals");
    i.sandbox.add('allow-modals');
    console.info(i, 'now allows modals');
  }
}

if (!Promise ) {
  // load promise polyfill for crap like internet explorer
  var Promise = TrelloPowerUp.Promise
}

var cardLabelRegex = /^#? ?(\d+)/
var doneListRegex = /(?:Done|done|DONE)/
var deployedListRegex = /(?:Deployed|deployed|DEPLOYED)/
var sprintBacklogRegex = /(?:Sprint|sprint|SPRINT)[[\s-](?:Backlog|backlog|BACKLOG)/
var sprintNumberRegex = /(\w*\s)(\d)/
var cardPointsRegex = /^\((\d+)\)/

var cards = {}
var cardNumIdMap = {}
var children = {}
var lists = {}
var board_members = new Array();
var sprints = [[]]
var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';
var BLACK_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg';
var BLACK_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg';

function cardNoBadge(cardNo,cardType) {
  if(cardType){
    return {
      title: 'Card Number',
      text: cardNo,
      icon: `./images/${cardType}.svg`,
      refresh: 10,
    }
  }
  else
  return {
    title: 'Card Number',
    text: cardNo,
    icon: `./images/logo.svg`,
    refresh: 10,
  }
}

function depOfBadge(cardId,cardType) {
  if(cardType){
    return {
      title: 'Dependency of',
      text: cards[cards[cardId].parent].name,
      icon: `./images/${cardType}.svg`,
      refresh: 10,
    }
  }  
  else
  return {
    title: 'Dependency of',
    text: cards[cards[cardId].parent].name,
    icon: `./images/logo.svg`,
    refresh: 10,
  }
}

function cardCounterBadge(childrenDone, numChildren,cardType) {
  if(cardType){
    return {
      title: 'Dependent Cards',
      text: '(' + childrenDone + ' / ' + numChildren + ')',
      icon: `./images/${cardType}.svg`,
      color: childrenDone === 0 ? 'red' :
        childrenDone === numChildren ? 'green' :
        'yellow',
      refresh: 10,
    }
  }
  else
  return {
    title: 'Dependent Cards',
    text: '(' + childrenDone + ' / ' + numChildren + ')',
    icon: `./images/logo.svg`,
    color: childrenDone === 0 ? 'red' :
      childrenDone === numChildren ? 'green' :
      'yellow',
    refresh: 10,
  }  
}

function pointsCounterBadge(donePoints, totalPoints) {
  return {
    title: 'Points Done of Total',
    text: '(' + donePoints + ' / ' + totalPoints + ')',
    icon: './images/logo.svg',
    color: donePoints === 0 ? 'red' :
      donePoints === totalPoints ? 'green' :
      'yellow',
    refresh: 10,
  }
}

function dynamicCardBadges(cardId, cardType) {
  return [{
    dynamic: function() {
      var cardNo = cards[cardId].number
      var badge = cardNoBadge(cardNo,cardType)
      if (cards[cardId].parent) {
        badge = depOfBadge(cardId,cardType)
      }
      if (children[cardNo]) {
        var doneChildCards = children[cardNo].filter(function(child) {return child.done})
        var childrenDone = doneChildCards.length
        var numChildren = children[cardNo].length
        badge = cardCounterBadge(childrenDone, numChildren,cardType)
      }
      return badge
    },
  }]
}

function staticCardBadges(cardId,cardType) {
  var cardNo = cards[cardId].number
  var badges = [cardNoBadge(cardNo,cardType)]
  if (cards[cardId].parent) {
    badges.push(depOfBadge(cardId,cardType))
  }
  if (children[cardNo]) {
    var doneChildCards = children[cardNo].filter(function(child) {return child.done})
    var childrenDone = doneChildCards.length
    var numChildren = children[cardNo].length
    var donePoints = doneChildCards.reduce(function(sum, child) {return sum + child.points}, 0)
    var totalPoints = children[cardNo].reduce(function(sum, child) {return sum + child.points}, 0)
    badges = badges.concat([
      cardCounterBadge(childrenDone, numChildren,cardType),
      pointsCounterBadge(donePoints, totalPoints),
    ])
  }
  return badges
}

var cardHypothesisCreation;
var cardDesignCreation;
var cardExperimentCreation;
var token;
var board
var key 
var members_url=''
var sprintBacklogListID=''
var deployedListID=''
var doneListID=''
var sprintDesignCount=0;
var sprintHypothesisCount=0;
var sprintExperimentCount=0;
var sprintMVPCount= 0;
var sprintBacklogCount= 0;
var userStoriesOfBacklogList = new Array();
var userStoriesOfDeployedList = new Array();
var dsgnStdCardDoneList = new Array();
var dsgnStdCardDoneIdArray = new Array();
var designersBadge= false;
var seniorDesignersBadge= false;
var thinkersBadge= false;
var philosophersBadge= false;
var makersBadge=false;
var buildersBadge=false;
var seniorTestersBadge=false;
var testersBadge= false;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const placedFunct = (t, cardType) => {
  if(typeof cardType === 'undefined'){
    t.set('card', 'shared', 'placed',true)
  }else
  if(cardType=='Hypothesis'){
    var result;
    switch (sprintHypothesisCount) {
      case 1:
        sprintHypothesisCount += 1
        thinkersBadge=true;
        result ={ message: 'Writing your first hyphotesis!! you have been awarded', display:'success', timer:3500};
        return result;
      case 5:
        sprintHypothesisCount += 1
        philosophersBadge=true;
        result ={ message: 'Reviewing hypothesis 3 Sprints in row. You have been awarded!!', display:'success',timer:3500};
        return result;
      default:
        sprintHypothesisCount += 1
        result ={ message: 'New hyphotesis! you have been rewarded', display:'info',timer:200};
        return result;
    }
  }else
  if(cardType=='Experiment'){
    switch (sprintExperimentCount) {
      case 1:
        testersBadge=true
        sprintExperimentCount += 1        
        result ={ message: 'Writing your first Experiment!! you have been awarded', display:'success',timer:3500};
        return result;
      case 5:
        seniorTestersBadge=true         
        sprintExperimentCount += 1
        result ={ message: 'Reviewing Experiments 3 Sprints in row. You have been awarded!!', display:'success',timer:3500};
        return result;
      default:        
        result ={ message: 'New Experiment! you have been rewarded', display:'info',timer:200};
        sprintExperimentCount += 1
        return result
    }            
  }
}

const getBoardMembers = (board,key,token) => {
  members_url = `https://api.trello.com/1/boards/${board}/members?key=${key}&token=${token}`;        
  if(Object.keys(cards).length==0){
    fetch(members_url,
      {
        method: 'GET',
      }).then(response => {              
        //console.log(`response: ${response}`)
        response.json().then((data) => {
          //console.log(data);
          board_members = data;              
      })
    })
    .catch(err => console.error(err))
  }
}

const designRewardingFunction = () => {
  let result;
    switch (sprintDesignCount) {
      case 1:
        result ={ message: 'Running your first design studio!! you have been awarded', display:'success',timer:3500};                        
        return result;
      case 3:        
        result ={ message: 'Running a design studio 3 Sprints in row. You have been awarded!!', display:'success',timer:3500};       
        return result;
      default:          
        result ={ message: 'Design studio finished!! you have been rewarded', display:'info',timer:3500};        
        return result;
    }
}

const MVP_RewardingFunction = (sprint) => { 
    var result;    
    switch (sprint) {
      case 1:
        makersBadge=true;
        result ={ message: 'An MVP was delivered!! you have been awarded', display:'success', timer:3500};
        return result;        
      case 3:
        buildersBadge=true;        
        result ={ message: 'Delivering MVP 3 Sprints in row. You have been awarded!!', display:'success', timer:3500};
        return result; 
      default:        
        result ={ message: 'An MVP was delivered!! you have been rewarded', display:'info', timer:200};
        return result;
    }
  }

  const printRewardingFunction = (result,t) => {
    sleep(result.timer).then(() => {
      t.alert({
      message: result.message,
      duration: 2,
      display: result.display
      });
    })
  }

const getCardMembers = (cardId,key,token) => {
  var cardMembers = new Array();
  var memberCard_url = `https://api.trello.com/1/cards/${cardId}/members?key=${key}&token=${token}`;
  fetch(memberCard_url,
    {
      method: 'GET',
    }).then(response => {              
      //console.log(`response: ${response}`)
      response.json().then((data) => {
        //console.log(data)
        cardMembers = data
        cards[cardId].members = cardMembers
        if(cards[cardId].members.length == board_members.length){
          cards[cardId].colaboration = true
        }
    })
  })
  .catch(err => console.error(err))
}

TrelloPowerUp.initialize({
  'card-badges': function(t) {
    var cardId = ''
    return Promise.all([
      t.card('id', 'url', 'labels', 'idList', 'name'),
      t.list('id','name','cards'),
      t.get('card', 'shared', 'cardType'),
      t.get('card', 'shared', 'cardHypothesisCreation'),
      t.get('card', 'shared', 'cardExperimentCreation'),
      t.getContext().board,
      t.getRestApi().appKey,
      t.get('member', 'private', 'token'),
      t.lists('all'),
      t.get('card', 'shared', 'placed'),
      t.get('card', 'shared','sprint'),
      t.get('card', 'shared','makersBadge'),
      t.get('card', 'shared','buildersBadge')
    ]).then(function(context) {
        var card = context[0]
        var list = context[1]
        var cardType = context[2]

        var cardHypothesisCreation
        var created       
        var cardMembers = new Array();
        var placed=false;
        lists = context[8]

        placed = sprintBacklogRegex.test(list.name)
        cardId = card.id
        var sprint=0
        if(placed==true){
          sprintBacklogListID= list.id;          
          takeSBSnapshot(cardId);          
          if(typeof cardType === 'undefined'){
            t.set('card', 'shared','sprint',sprintBacklogCount)
          }
        }
        if(placed==false)
          if(typeof context[10] !='undefined'){
            sprint=context[10]
        }
        
        if(typeof context[9] === 'undefined'){
          if(placed==true){            
            if(typeof cardType === 'undefined'){
              t.set('card', 'shared', 'placed',true)
            }else{
              if(cardType != 'Design'){
                var result = placedFunct(t, cardType);
                sleep(result.timer).then(() => {
                  t.alert({
                  message: result.message,
                  duration: 2,
                  display: result.display
                  });
                })
              }
            }                        
          }
        }
        else{
          if(typeof cardType === 'undefined'){
            placed= context[9]            
          }              
        }      

        board = context[5]
        key = context[6]
        token =  context[7]
        
        getBoardMembers(board,key,token)

        var done = doneListRegex.test(list.name)

        if(done == true){
          doneListID = list.id;
          if(cardType=='Design'){
            getDoneDS()
            for (sprintDesignCount=0; sprintDesignCount < dsgnStdCardDoneList.length; ) {
              sprintDesignCount += 1;
              switch (sprintDesignCount) {
                case 1:
                  designersBadge=true
                  break;
                case 3:
                  seniorDesignersBadge=true
                  break;
              }
            }
            let result = designRewardingFunction();
              sleep(result.timer).then(() => {
                t.alert({
                message: result.message,
                duration: 2,
                display: result.display
                });
              })
          }
        }

        lists[card.idList] = {done: done}
                
        let collaborated= false
                
        if (!cards[cardId]) {
          var cardNumber = card.url.slice(card.url.lastIndexOf('/') + 1, card.url.indexOf('-'))
          cards[cardId] = {
            t: t,
            number: cardNumber,
            labels: [],
            idList: card.idList,
            done: done,
            created: created,
            cardHypothesisCreation: cardHypothesisCreation,
            members: cardMembers,
            placed: placed,
            colaboration: collaborated,
            sprint: sprint,
            cardType: cardType,
            id: cardId
          }
          cardNumIdMap[cardNumber] = cardId
        }
        else{
          cards[cardId].name = card.name
          cards[cardId].done = done
          cards[cardId].idList =card.idList
          cards[cardId].placed = placed          
          cards[cardId].created = created
          cards[cardId].colaboration = collaborated
          cards[cardId].sprint = sprint
          cards[cardId].cardType = cardType
          cards[cardId].id = cardId
        }

        var deployed = deployedListRegex.test(list.name)

        if(deployed==true){
          deployedListID = list.id;      
          if(typeof cardType === 'undefined'){
            if(cards[cardId].placed==true){              
              for (let index = 0; index < userStoriesOfBacklogList.length; index++) {
                const SBcard = userStoriesOfBacklogList[index];
                if(SBcard.id==cardId && SBcard.sprint ==cards[cardId].sprint)
                {
                  userStoriesOfBacklogList.splice(index, 1)
                }
              }
              getDeployedUS()
              if(userStoriesOfBacklogList.length==0){
                for (let index = 0; index < userStoriesOfDeployedList.length; index++){
                  const SBcard = userStoriesOfDeployedList[index];
                  if(SBcard.id==cardId ){
                    let result
                    switch (cards[cardId].sprint){
                      case 1:
                        if(makersBadge== false){
                          result = MVP_RewardingFunction(cards[cardId].sprint);
                          printRewardingFunction(result,t)
                          makersBadge=true
                          buildersBadge=false
                        }                          
                        break;
                      case 2:
                        if(makersBadge== true){
                          result = MVP_RewardingFunction(cards[cardId].sprint);
                          printRewardingFunction(result,t)
                          makersBadge=true
                          buildersBadge=false
                        }
                        break;
                      case 3:
                        if(makersBadge== true && buildersBadge==false){
                          result = MVP_RewardingFunction(cards[cardId].sprint);
                          printRewardingFunction(result,t)
                          makersBadge=true
                          buildersBadge=true
                        }                                                 
                        break;
                      default:
                        deployed=false                        
                        break;
                    }
                  }
                }                  
              }else{
                t.alert({
                  message: 'Card deployed!! you have been rewarded!!!',
                  duration: 1,
                  display: 'info'
                })
              }
            }
          }
        }

        if(cards[cardId].colaboration == true){
          collaborated = true;
          t.alert({
            message: 'All members participated!! you have been rewarded',
            duration: 2,
            display: 'info'
          });
        }

        getCardMembers(cardId,key,token)        

        var oldLabels = cards[cardId].labels
        var currentLabels = card.labels.map(function(label) {return label.name})
        currentLabels
          .map(function(label) {return cardLabelRegex.exec(label)})
          .forEach(function(match) {
            if (match && match[1]) {
              // Label matches regex for linking card dependencies
              var cardNo = match[1]

              var pointsMatch = cardPointsRegex.exec(card.name)
              var points = pointsMatch ? parseInt(pointsMatch[1], 10) : 0

              if (oldLabels.indexOf(match.input) === -1) {
                // We've only just added the label to this card
                var newChild = {id: cardId, done: lists[card.idList].done, points: points}
                children[cardNo] = children[cardNo] ? children[cardNo].concat([newChild]) : [newChild]
              } else {
                // We already know about this dependency, maybe we need to update if it's done and points
                children[cardNo].forEach(function(child) {
                  if (child.id === cardId) {
                    child.done = lists[card.idList].done
                    child.points = points
                  }
                })
              }
              if (cardNumIdMap[cardNo]) {
                cards[cardId].parent = cardNumIdMap[cardNo]
              }
            }
          })
        oldLabels
          .filter(function(label) {  return currentLabels.indexOf(label) === -1})
          .map(function(label) { return cardLabelRegex.exec(label)})
          .forEach(function(match) {          
            if (match && match[1]) {
              var cardNo = match[1]
              children[cardNo] = children[cardNo].filter(function(child) {return child.id !== cardId})
              if (cardNumIdMap[cardNo]) {
                cards[cardId].parent = undefined
              }
            }
          })
        cards[cardId].labels = currentLabels
        if (cards[cardId].labels.length>0) {
          //console.log(cards[cardId].labels)
        }        
        return dynamicCardBadges(cardId,cardType)
      })      
  },

  'card-detail-badges': function(t) {
    return Promise.all([
      t.card('id'),
      t.get('card', 'shared', 'cardType')
    ])
      .then(function(context) {
        var card = context[0]
        var cardType = context[1]
        return staticCardBadges(card.id,cardType)
      })
  },

  'authorization-status': function(t, options){  
    return t.get('member', 'private', 'token')
    .then(function(token){
      if(token){
        return { authorized: true };
      }
      return { authorized: false };
    });
  },
  'show-authorization': function(t, options){
    let trelloAPIKey = t.getRestApi().appKey;    
    if (trelloAPIKey) {
      return t.popup({
        title: 'My Auth Popup',
        args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
        url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 140,
      });
    } else {
      console.log("Looks like you need to add your API key to the project!");
    }
  },
  'card-buttons': function(t, options){
    return [{
      icon:  './images/logo.svg',
      text: 'Type of card',
      condition: 'always',
      callback : function(t){
        return t.popup({
        title: "Type of card",
        url: './card.html'
        });
      }      
    }
    , {
      icon: GRAY_ICON,
      text: 'Use REST API',
      callback: restApiCardButtonCallback,
    }
    ];
  },

'card-back-section': function(t) {
  return t.getRestApi()
    .isAuthorized()
    .then(function(isAuthorized) {
      if (!isAuthorized) {
        return [{
          title: 'Authorization',
          icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
          content: {
            type: 'iframe',
            url: t.signUrl('./authorize.html', { apiKey: 'a467bedc9730247166a1c359649e3932' } ),
            height: 200 // Max height is 500
          }
        }];
      } else {
        return [{
          title: 'My Card Back Section',
          icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
          content: {
            type: 'iframe',
            url: t.signUrl('./section.html'),
            height: 230 // Max height is 500
          }
        }];
      }
    });
  },

  'board-buttons': function (t, opts) {
    return [
      /*{
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Callback',
      callback: onBtnClick,
      condition: 'edit'
    },*/
    {
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Score',
      callback: scoreBoardClick,
      condition: 'edit'
    },
    {
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Badges',
      callback: badgesBoardClick,
      condition: 'edit'
    },
    {
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Sprint Snapshot',
      callback: removeSprintCount(t),
      condition: 'edit'
    }
    /*{
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Sprint Snapshot',
      callback: takeSBSnapshot(t),
      condition: 'edit'
    }*/
  ];
  }
},
{
  appKey: 'a467bedc9730247166a1c359649e3932',
  appName: 'Lean-UX'
})


function showIframe(t) {
  return t.popup({
    title: 'Authorize to continue',
    args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
    url: './authorize.html',
    height: 110 
  });
}

var fivePoints;
var tenPoints;



const cardDesignFiltered = (card)=>{
  return card.cardType === 'Design'
}

const removeSprintCount= (t)=>{
  t.set('card', 'shared','sprint');
}

const setSprintCount= (t,sprint)=>{
  return t.set('card', 'shared','sprint',sprint)
}

var getDeployedUS =()=>{
  var cardsDeployedList = new Array();
  Object.keys(lists).forEach(function (key){
    if(lists[key].id==deployedListID){
      cardsDeployedList =  lists[key].cards
     }
  })  
  userStoriesOfDeployedList = cardsDeployedList
}

const getDoneDS =()=>{
  var dsgnCardDoneList = new Array();
  Object.keys(lists).forEach(function (key_i){
    if(lists[key_i].id==doneListID){
      dsgnCardDoneList =  lists[key_i].cards
     }
  })  
  dsgnCardDoneList.forEach(desgCardDone => {
    if(dsgnStdCardDoneList.length==0){
      dsgnStdCardDoneList.push(desgCardDone)
      dsgnStdCardDoneIdArray.push(desgCardDone.id)
    }
    else{
      if (!dsgnStdCardDoneIdArray.includes(desgCardDone.id)){
        dsgnStdCardDoneList.push(desgCardDone)
        dsgnStdCardDoneIdArray.push(desgCardDone.id)
      }
    }
  });  
}

var getDeployedCards =()=>{
  for (let index = 0; index < userStoriesOfDeployedList.length; index++){
    const SBcard = userStoriesOfDeployedList[index];
    Object.keys(cards).forEach(function (key){
      if(SBcard.id==key){
        if(cards[key].sprint>=sprintBacklogCount){
          sprintBacklogCount=cards[key].sprint
        }
      }
    })
  }  
}

var setInitialSprintBacklogCount = function (cardId){
  getDeployedUS()
  getDeployedCards()
  for (let index = 0; index < userStoriesOfDeployedList.length; index++){
    const SBcard = userStoriesOfDeployedList[index];
    if(SBcard.id==cardId){
      if(cards[cardId].sprint>=sprintBacklogCount){
        sprintBacklogCount=cards[cardId].sprint
      }
    }
  }  
}

var takeSBSnapshot = function (cardId) {
  setInitialSprintBacklogCount(cardId)
  if(userStoriesOfBacklogList.length==0){sprintBacklogCount++;}

  var cardsOfBacklogList = new Array();
  
  /*Object.keys(lists).forEach(function (key){
    if(lists[key].id==sprintBacklogListID){
      cardsOfBacklogList =  lists[key].cards
    }
  })*/

  Object.keys(cards).forEach(function (key){
    if(key==cardId){
      cardsOfBacklogList.push(cards[key]);      
    }
  })

  userStoriesOfBacklogList = cardsOfBacklogList.filter(userStoriesFiltered);  
  userStoriesOfBacklogList.forEach(function (element) {
    element.sprint = sprintBacklogCount;
  });  
}

const userStoriesFiltered = (card)=>{
  return typeof card.cardType === 'undefined';
}

var scoreBoardClick = function (t, opts) {  
  token =  t.get('member', 'private', 'token');
  fivePoints=0;
  tenPoints=0;
  Object.keys(cards).forEach(function (key){
    console.log(`status: ${cards[key].done}`);
    if(cards[key].done){
      fivePoints += 1;
      if(cards[key].created){
        fivePoints +=1
      }
      if(cards[key].colaboration){          
        tenPoints +=1;
      }
      if(cards[key].placed){
      fivePoints += 1;        
      }
    }else{
      if(cards[key].placed){
        fivePoints += 1;        
      }
    }
  });
  return t.modal({            
    url: './modal.html', // The URL to load for the iframe
    args: { fiveScore: fivePoints, tenScore : tenPoints  }, // Optional args to access later with t.arg('text') on './modal.html'
    accentColor: '#F2D600', // Optional color for the modal header 
    height: 400, // Initial height for iframe; not used if fullscreen is true
    fullscreen: false, // Whether the modal should stretch to take up the whole screen
    callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
    title: 'Score', // Optional title for modal header
    // You can add up to 3 action buttons on the modal header - max 1 on the right side.
    actions: [{
      icon: GRAY_ICON,
      url: 'https://google.com', // Opens the URL passed to it.
      alt: 'Leftmost',
      position: 'left',
    },],
  })
};

var badgesBoardClick = function (t, opts) {
  console.log('Someone clicked the button');
  var context = t.getContext();
  token =  t.get('member', 'private', 'token');    
  return t.modal({            
    url: './modal-badges.html', // The URL to load for the iframe
    args: { designersBadge: designersBadge, seniorDesignersBadge: seniorDesignersBadge , thinkersBadge: thinkersBadge, philosophersBadge: philosophersBadge , makersBadge: makersBadge, buildersBadge: buildersBadge, seniorTestersBadge: seniorTestersBadge, testersBadge : testersBadge}, // Optional args to access later with t.arg('text') on './modal.html'
    accentColor: '#F2D600', // Optional color for the modal header 
    height: 500, // Initial height for iframe; not used if fullscreen is true
    fullscreen: false, // Whether the modal should stretch to take up the whole screen
    callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
    title: 'Badges', // Optional title for modal header
    // You can add up to 3 action buttons on the modal header - max 1 on the right side.
    actions: [{
      icon: GRAY_ICON,
      url: 'https://google.com', // Opens the URL passed to it.
      alt: 'Leftmost',
      position: 'left',
    },],
  })
};
  
  /*var onBtnClick = function (t, opts) {
    console.log('Someone clicked the button');
    var context = t.getContext();
    token =  t.get('member', 'private', 'token');
    fivePoints=0;
    tenPoints=0;
    Object.keys(cards).forEach(function (key){
      console.log(`status: ${cards[key].done}`);
      if(cards[key].done){
        fivePoints += 1;
        if(cards[key].created){
          fivePoints +=1
        }
        if(cards[key].colaboration){          
          tenPoints +=1;
        }
        if(cards[key].placed){
        fivePoints += 1;        
        }
      }else{
        if(cards[key].placed){
          fivePoints += 1;        
        }
      }
    });
    return t.popup({
      title: 'Menu',
      items: [
        {
          text: 'Score',
          callback: function(t){
            return t.modal({            
              url: './modal.html', // The URL to load for the iframe
              args: { fiveScore: fivePoints, tenScore : tenPoints  }, // Optional args to access later with t.arg('text') on './modal.html'
              accentColor: '#F2D600', // Optional color for the modal header 
              height: 500, // Initial height for iframe; not used if fullscreen is true
              fullscreen: true, // Whether the modal should stretch to take up the whole screen
              callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
              title: 'Score', // Optional title for modal header
              // You can add up to 3 action buttons on the modal header - max 1 on the right side.
              actions: [{
                icon: GRAY_ICON,
                url: 'https://google.com', // Opens the URL passed to it.
                alt: 'Leftmost',
                position: 'left',
              },],
            })
          }
        },
        {
          text: 'Badges',
          callback: function(t){
            return t.modal({            
              url: './modal-badges.html', // The URL to load for the iframe
              args: { designersBadge: designersBadge, seniorDesignersBadge: seniorDesignersBadge , thinkersBadge: thinkersBadge, philosophersBadge: philosophersBadge , makersBadge: makersBadge, buildersBadge: buildersBadge, seniorTestersBadge: seniorTestersBadge, testersBadge : testersBadge}, // Optional args to access later with t.arg('text') on './modal.html'
              accentColor: '#F2D600', // Optional color for the modal header 
              height: 500, // Initial height for iframe; not used if fullscreen is true
              fullscreen: true, // Whether the modal should stretch to take up the whole screen
              callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
              title: 'Score', // Optional title for modal header
              // You can add up to 3 action buttons on the modal header - max 1 on the right side.
              actions: [{
                icon: GRAY_ICON,
                url: 'https://google.com', // Opens the URL passed to it.
                alt: 'Leftmost',
                position: 'left',
              },],
            })
          }
        },
        {
          text: 'Open Board Bar',
          callback: function(t){
            return t.boardBar({
              url: './board-bar.html',
              args: {context: context, token: token},
              height: 200
            })
            .then(function(){
              return t.closePopup();
            });
          }
        }        
      ]
    });
  };*/
  
  var restApiCardButtonCallback = function(t) {
    return t.getRestApi()
     .isAuthorized()
     .then(function(authorized) {
       if (!authorized) {
         // You might be tempted to call client.authorize from a capability handler like the one we are in right now.
         // Unfortunately this does not register as a click by the browser, and it will block the popup. Instead, we need to
         // open a t.popup from our capability handler, and load an iframe that contains a button that calls client.authorize.
         return t.popup({
           title: 'Authorize Trello\'s REST API',   
           url: './api-client-authorize.html',
         })
       } else {
         return t.popup({
           title: "Make a choice",
           items: [{
             // We'll use the client on the authorization page to make an example request.
             text: 'Make an example request',
             callback: function(t) { 
               return t.popup({
                 title: 'Authorize Trello\'s REST API',   
                 url: './api-client-authorize.html',
               })
             }
           }, {
             // You can de-authorize the REST API client with a call to .clearToken()
             text: 'Unauthorize',
             callback: function(t) {
               return t.getRestApi()
                 .clearToken()
                 .then(function() {
                   alert('You\'ve successfully deauthorized!'); 
                   t.closePopup(); 
                 })
             }
           }]
         })
       }
     });
   }