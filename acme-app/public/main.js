window.onload = function() {
  fetch('https://atko.id:3000/account', {
    mode: 'cors',
    credentials: 'include'
  })
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      if (data.e) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://atko.id:3000/iframe/select')
        iframe.setAttribute('style', 'height: 300px; width: 391px; overflow: hidden;border:0');
        const c = document.getElementById('credential_picker_container');
        c.appendChild(iframe);
        c.style.display = 'block';
      }
    });
};
