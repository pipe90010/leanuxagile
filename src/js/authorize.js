const t = window.TrelloPowerUp.iframe({
    appKey: 'a467bedc9730247166a1c359649e3932',
    appName: 'Lean-UX'
  });
  
  // authorize :: () -> _
  const authorize = () =>
    t.getRestApi()
      .authorize({ scope: 'read,write' })
      .then(() => console.warn('Success!'))
      .catch(TrelloPowerUp.restApiError.AuthDeniedError, () => console.warn('Error !'))
  
  t.render(
    () => t.get('card', 'shared', 'cardType').then(
      R.pipe(
        R.tap(translations => document.querySelector('p.message').innerHTML = 'This application needs your authorization to access this card history. Click the button below to grant access.'),
        R.tap(translations => document.querySelector('button').innerHTML = 'Authorize'),
        R.tap(translations => document.querySelector('button').addEventListener('click', authorize)),
      )
    )
  );