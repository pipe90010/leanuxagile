// createCardBackSection :: Card -> String
const createHypothesisCard = (cardTypeJson, hypothesisJson) => `
  <div class="header">
    <h4 class="title">${cardTypeJson['cardType']} Card</h4>
  </div>
  <div class="content">
    <div class="value">${(new showdown.Converter()).makeHtml(cardTypeJson['cardType'])}</div>
  </div>
  <div class="statement"> 
  <div class="value">
      <p> We believe that ${hypothesisJson['hypothesis']['businessOutcome']} will be achieved,<br>
        if ${hypothesisJson['hypothesis']['user']} attains ${hypothesisJson['hypothesis']['benefit']} <br>
        with ${hypothesisJson['hypothesis']['feature']}
      </p>      
    </div>
</div>
  <div class="container">
  <h5>With your asumptions:</h5>
    <form id="hypothesis" class="form-inline">
      <div class="form-group">
        <label for="businessOutcome">We believe that:</label>
        <input type="text" class="form-control" id="businessOutcome" placeholder="Your business outcome" name="businessOutcome">
      </div>
      <div class="form-group">
        <label for="user">Will be achieved if:</label>
        <input type="text" class="form-control" id="user" placeholder="User" name="user">
      </div>
      <div class="form-group">
        <label for="benefit">Attains:</label>
        <input type="text" class="form-control" id="benefit" placeholder="A benefit" name="benefit">
      </div>
      <div class="form-group">
        <label for="feature">With:</label>
        <input type="text" class="form-control" id="feature" placeholder="A feature" name="feature">
      </div>
      <button type="submit" onclick="setHypothesis()" class="btn btn-default">Submit</button>
      <button type="reset" onclick="resetHypothesis()" class="btn btn-default">Reset</button>
    </form>
  </div>
`

function setHypothesis() {
    var businessOutcome = document.getElementById('businessOutcome').value;
    var user = document.getElementById('user').value;
    var benefit = document.getElementById('benefit').value;
    var feature  = document.getElementById('feature').value;
    var hypothesisStr = `{ "businessOutcome":"${businessOutcome}", "user":"${user}", "benefit":"${benefit}", "feature": "${feature}" }`;
    t.set('card', 'shared', 'hypothesis',hypothesisStr)
    }

function resetHypothesis() {
    t.set('card', 'shared','hypothesis');
}    