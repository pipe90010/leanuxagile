const t = window.TrelloPowerUp.iframe({
    appKey: 'a467bedc9730247166a1c359649e3932',
    appName: 'Lean-UX'
  })
  
  const  seniorDesignersBadge = t.arg('seniorDesignersBadge')
  const designersBadge = t.arg('designersBadge')
  const thinkersBadge = t.arg('thinkersBadge')
  const philosophersBadge = t.arg('philosophersBadge')
  const makersBadge = t.arg('makersBadge')
  const buildersBadge = t.arg('buildersBadge')
  const testersBadge = t.arg('testersBadge')
  const seniorTestersBadge = t.arg('seniorTestersBadge')

  t.render(()=>{
    console.log(`value of seniorDesignersBadge is ${seniorDesignersBadge}`)
    console.log(`value of seniorDesignersBadge is ${designersBadge}`)
    console.log(`value of makersBadge is ${makersBadge}`)
    console.log(`value of buildersBadge is ${buildersBadge}`)
    var div = document.createElement('div')

    var designersBadgeImg = document.createElement('img')
    designersBadgeImg.src = './images/designers.png'
    designersBadgeImg.className = "over-img"
    designersBadgeImg.style.left = `23.8%`
    designersBadgeImg.style.top = `42.6%`
    designersBadgeImg.style.width = `9.1%`
    designersBadgeImg.style.visibility = (designersBadge ? 'visible' : 'hidden')
    div.appendChild(designersBadgeImg)

    var seniorDesignersBadgeImg = document.createElement('img')
    seniorDesignersBadgeImg.src = './images/senior-designers.png'
    seniorDesignersBadgeImg.className = "over-img"
    seniorDesignersBadgeImg.style.left = `33.3%`
    seniorDesignersBadgeImg.style.top = `42.3%`
    seniorDesignersBadgeImg.style.width = `9.1%`
    seniorDesignersBadgeImg.style.visibility = (seniorDesignersBadge ? 'visible' : 'hidden')
    div.appendChild(seniorDesignersBadgeImg)
    document.getElementById("parent").appendChild(div)

    var thinkersBadgeImg = document.createElement('img')
    thinkersBadgeImg.src = './images/thinkers.png'
    thinkersBadgeImg.className = "over-img"
    thinkersBadgeImg.style.left = `24.1%`
    thinkersBadgeImg.style.top = `70.4%`
    thinkersBadgeImg.style.width = `9.1%`
    thinkersBadgeImg.style.visibility = (thinkersBadge ? 'visible' : 'hidden')
    div.appendChild(thinkersBadgeImg)
    document.getElementById("parent").appendChild(div)

    var philosophersBadgeImg = document.createElement('img')
    philosophersBadgeImg.src = './images/philosophers.png'
    philosophersBadgeImg.className = "over-img"
    philosophersBadgeImg.style.left = `33.5%`
    philosophersBadgeImg.style.top = `70.3%`
    philosophersBadgeImg.style.width = `9.1%`
    philosophersBadgeImg.style.visibility = (philosophersBadge ? 'visible' : 'hidden')
    div.appendChild(philosophersBadgeImg)
    document.getElementById("parent").appendChild(div)

    var makersBadgeImg = document.createElement('img')
    makersBadgeImg.src = './images/makers.png'
    makersBadgeImg.className = "over-img"
    makersBadgeImg.style.left = `47.1%`
    makersBadgeImg.style.top = `38.6%`
    makersBadgeImg.style.width = `9.1%`
    makersBadgeImg.style.visibility = (makersBadge ? 'visible' : 'hidden')
    div.appendChild(makersBadgeImg)
    document.getElementById("parent").appendChild(div)

    var buildersBadgeImg = document.createElement('img')
    buildersBadgeImg.src = './images/builders.png'
    buildersBadgeImg.className = "over-img"
    buildersBadgeImg.style.left = `56.8%`
    buildersBadgeImg.style.top = `37.8%`
    buildersBadgeImg.style.width = `9.1%`
    buildersBadgeImg.style.visibility = (buildersBadge ? 'visible' : 'hidden')
    div.appendChild(buildersBadgeImg)
    document.getElementById("parent").appendChild(div)

    var testersBadgeImg = document.createElement('img')
    testersBadgeImg.src = './images/testers.png'
    testersBadgeImg.className = "over-img"
    testersBadgeImg.style.left = `49.9%`
    testersBadgeImg.style.top = `73.2%`
    testersBadgeImg.style.width = `9.1%`
    testersBadgeImg.style.visibility = (testersBadge ? 'visible' : 'hidden')
    div.appendChild(testersBadgeImg)
    document.getElementById("parent").appendChild(div)

    var seniorTestersBadgeImg = document.createElement('img')
    seniorTestersBadgeImg.src = './images/senior-testers.png'
    seniorTestersBadgeImg.className = "over-img"
    seniorTestersBadgeImg.style.left = `59.3%`
    seniorTestersBadgeImg.style.top = `73.2%`
    seniorTestersBadgeImg.style.width = `9.1%`
    seniorTestersBadgeImg.style.visibility = (seniorTestersBadge ? 'visible' : 'hidden')
    div.appendChild(seniorTestersBadgeImg)
    document.getElementById("parent").appendChild(div)

    }       
  )
  
  