const t = window.TrelloPowerUp.iframe({
  appKey: 'a467bedc9730247166a1c359649e3932',
  appName: 'Lean-UX'
})

t.render(() => t.get('card', 'shared', 'cardType')
  .then(renderSection(t))
)

// renderSection :: Object -> String -> _
const renderSection = t => {
  return cardType => t.getRestApi().getToken()
    .then(R.pipeP(getCardValue(t.getRestApi().appKey,
      t.getContext().card), 
      response => response.json(), 
      R.tap(() => document.getElementById('section').innerHTML = ''),
      R.map(renderCard)))
    .catch(error => console.error(error))
}

  const getCardValue = (key, cardId) => token =>
  fetch(R.join('', [
    `https://api.trello.com/1/cards/${cardId}/plugindata`,
    `?key=${key}`,
    `&token=${token}`,
  ]), {
    method: 'GET',
  })

const renderCard = card => R.pipe(
  R.tap(article => {
    let cardValue = `${card['value']}`;
    let cardValueJson = JSON.parse(cardValue);
    let cardType = `${cardValueJson['cardType']}`;
      if(cardType.includes('Hypothesis')){        
        let hypothesis = `${cardValueJson['hypothesis'] || '{ "businessOutcome":"your busines outcome", "user":"a user", "benefit":"a benefit", "feature": "a feature" }' }` ;
        let hypothesisStr = `{"hypothesis":${hypothesis}}`;
        let hypothesisJson = JSON.parse(hypothesisStr);
        article.innerHTML = createHypothesisCard(cardValueJson, hypothesisJson);
      }
      else 
      if(cardType.includes('Design') ){
        article.innerHTML = createDesignCard(cardValueJson);
      }
      else if(cardType.includes('Experiment')){
        let experiment = `${cardValueJson['experiment'] || '{ "businessOutcome":"your busines outcome", "user":"a user", "benefit":"a benefit", "feature": "a feature" }' }` ;
        let experimentStr = `{"experiment":${experiment}}`;
        let experimentJson = JSON.parse(experimentStr);
        article.innerHTML = createExperimentCard(cardValueJson, experimentJson);
      }
    }),
  R.tap(article => document.getElementById('section').appendChild(article)),
)(document.createElement('article'))



const createDesignCard = data => `
  <div class="header">
    <h4 class="title">${data['cardType']} Card</h4>
  </div>
  <div class="content">
    <div class="value">
    <p><span style="color:blue; font-size: 19px;">UX Design Studio</span> is a collaborative session where the team design together to build a shared understanding of the problem being solved, and the design of the solution.</p>
    
    </div>
  </div>
`

/*const createExperimentCard = data => `
  <div class="header">
    <h4 class="title">${data['cardType']} Card</h4>
  </div>
  <div class="content">
    <div class="value">${(new showdown.Converter()).makeHtml(data['cardType'])}</div>
  </div>
`*/

var hypothesisTag = document.getElementById('hypothesis');
if(hypothesisTag){
    document.getElementById('hypothesis').addEventListener('submit', function(event){
        event.preventDefault();
        var businessOutcome = window.businessOutcome.value;
        var user = window.user.value;
        var benefit = window.benefit.value;
        var feature  = window.feature.value;
        var hypothesisStr = `{ "businessOutcome":"${businessOutcome}", "user":"${user}", "benefit":"${benefit}", "feature": "${feature}" }`;
        return t.set('card', 'shared', 'hypothesis',hypothesisStr)
        .then(function(){
          t.closePopup();
        });
      });
}

var experimentTag = document.getElementById('experiment');
if(experimentTag){
    document.getElementById('experiment').addEventListener('submit', function(event){
        event.preventDefault();
        var businessOutcome = window.businessOutcome.value;
        var user = window.user.value;
        var benefit = window.benefit.value;
        var feature  = window.feature.value;
        var experimentStr = `{ "businessOutcome":"${businessOutcome}", "user":"${user}", "benefit":"${benefit}", "feature": "${feature}" }`;
        return t.set('card', 'shared', 'experiment',experimentStr)
        .then(function(){
          t.closePopup();
        });
      });
}