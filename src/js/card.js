var t = TrelloPowerUp.iframe();

let cardType;
var cardHypothesisCreation;
var cardExperimentCreation;

window.card.addEventListener('submit', function(event){
  event.preventDefault();
  cardType = window.cardType.value;
  if(cardType!='Select'){
    if (cardType == 'Hypothesis'){      
      if(!cardHypothesisCreation){
        cardHypothesisCreation = Math.floor(Date.now() / 1000);
        return t.set('card', 'shared', 'cardType', cardType)
        .then(()=>t.set('card', 'shared', 'cardHypothesisCreation',cardHypothesisCreation))
        .then(()=>t.closePopup());
      }
    }
    if (cardType == 'Experiment'){      
      if(!cardExperimentCreation){
        cardExperimentCreation = Math.floor(Date.now() / 1000);
        return t.set('card', 'shared', 'cardType', cardType)
        .then(()=>t.set('card', 'shared', 'cardExperimentCreation',cardExperimentCreation))
        .then(()=>t.closePopup());
      }
    }
    if (cardType == 'Design'){           
      return t.set('card', 'shared', 'cardType', cardType).then(()=>t.closePopup());
    }
  }    
});

t.render(function(){
  return t.get('card', 'shared', 'cardType')
  .then(function(cardTypeLocale){
    if(cardTypeLocale){
      window.cardType.value = cardTypeLocale;
      cardType = cardTypeLocale;
    }
    else{
      window.cardType.value = 'Select';
      console.log(window.cardType.value);
    }
  })
  .then(t.get('card', 'shared', 'cardHypothesisCreation'))
  .then((hypothesisCreationLocale) =>cardHypothesisCreation = hypothesisCreationLocale)
  .then(t.get('card', 'shared', 'cardExperimentCreation'))
  .then((experimentCreationLocale) =>cardExperimentCreation = experimentCreationLocale)  
});

function resetHypothesis() {
  t.set('card', 'shared','hypothesis');
}

function resetCardCreation(){
  let variable =  `card${cardType}Creation`;
  console.log(variable);
  t.set('card', 'shared', `${variable}`);
}