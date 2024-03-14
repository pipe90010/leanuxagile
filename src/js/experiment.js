// createCardBackSection :: Card -> String
const createExperimentCard = (cardTypeJson, experimentJson) => `
  <div class="header">
    <h4 class="title">${cardTypeJson['cardType']} Card</h4>
  </div>
  <div class="content">
    <div class="value">${(new showdown.Converter()).makeHtml(cardTypeJson['cardType'])}</div>
  </div>
  <div class="statement">
  <div class="value">
      <p> We believe that ${experimentJson['experiment']['businessOutcome']} will be achieved,<br>
        if ${experimentJson['experiment']['user']} attains ${experimentJson['experiment']['benefit']} <br>
        with ${experimentJson['experiment']['feature']}
      </p>      
    </div>
</div>
  <div class="container">
  <h5>With your asumptions:</h5>
    <form id="experiment" class="form-inline">
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
      <button type="submit" onclick="setExperiment()" class="btn btn-default">Submit</button>
      <button type="reset" onclick="resetExperiment()" class="btn btn-default">Reset</button>
    </form>
  </div>
`

function setExperiment() {
    var businessOutcome = document.getElementById('businessOutcome').value;
    var user = document.getElementById('user').value;
    var benefit = document.getElementById('benefit').value;
    var feature  = document.getElementById('feature').value;
    var experimentStr = `{ "businessOutcome":"${businessOutcome}", "user":"${user}", "benefit":"${benefit}", "feature": "${feature}" }`;
    t.set('card', 'shared', 'experiment',experimentStr)    
    }

function resetExperiment() {
    t.set('card', 'shared','experiment');
}    