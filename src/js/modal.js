const t = window.TrelloPowerUp.iframe({
  appKey: 'a467bedc9730247166a1c359649e3932',
  appName: 'Lean-UX'
})

let fivepoints;
let tenpoints;

t.render(() => t.get('board', 'shared','fivepoints')
  .then(data => {
      let score = JSON.stringify(data, null, 2)
      console.log(`t.get(board..:${score}`);
      //fivepoints = parseInt(score, 10);
    })
  .then(() => t.get('board', 'shared','tenpoints'))
  .then((data) =>{let score = JSON.stringify(data, null, 2)
    console.log(score);
    //tenpoints = parseInt(score, 10);
  })
  .then(() => t.arg('fiveScore'))
  .then(data => {
    let score = JSON.stringify(data, null, 2)
    console.log(`t.arg(score:${score}`);
    fivepoints = parseInt(score, 10);
  })
  .then(() => t.arg('tenScore'))
  .then(data => {
    let score = JSON.stringify(data, null, 2)
    console.log(`t.arg(score:${score}`);
    tenpoints = parseInt(score, 10);
  })
  .then(()=>{
      var scripts = document.getElementsByTagName( "script" );
      for ( let i = 0; i < scripts.length; ++ i )
      {
        if ( scripts[i].id == "five-points" )
        {
          var div = document.createElement('div');
          var left = 6;
          var top = 51.4;
          var width = 5.2;
          if(fivepoints< 0)
            fivepoints=0;
          if(fivepoints > 11)
            fivepoints=12;                    
          for(let i = 0; i< fivepoints; i++)
            {
              var img = document.createElement('img');
              img.src = './images/five.png';
              img.className = "over-img";
              img.style.left = `${left}%`;
              img.style.top = `${top}%`;
              img.style.width = `${width}%`;
              if(i>3 && i<=7){
                img.style.top = img.style.top = '28.6%';
              }
              if( i>7){
                img.style.top = img.style.top = '3.8%';
              }
              div.appendChild(img);
              if(i==3){
                left +=12.3;
              }else
              if(i==7){
                left +=11.3;
              }
              else
              left += 6;
            }
          document.getElementById("parent").appendChild(div);
        }
        if ( scripts[i].id == "ten-points" )
        {
          var div = document.createElement('div');
          var left = 12.1;
          var top = 65.5;
          var width = 4.5;
          for(let i = 0; i< tenpoints; i++)
            {
              var img = document.createElement('img');
              img.src = './images/ten.png';
              img.className = "over-img";
              img.style.left = `${left}%`;
              img.style.top = `${top}%`;
              img.style.width = `${width}%`;
              if(i>4 && i<=9){
                img.style.top = img.style.top = '51.7%';
              }
              if( i>9){
                img.style.top = img.style.top = '17.2%';
              }
              div.appendChild(img);
              if(i==4){
                left +=6.5;
              }else
              if(i==9){
                left +=8.3;
              }
              else
              left += 6;
            }
          document.getElementById("parent").appendChild(div);
        }
      }
    })
)

