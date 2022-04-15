const baseUrl = 'https://atko.id:3000';
window.onload = function() {
  fetch(`${baseUrl}/account`, {
    mode: 'cors',
    credentials: 'include'
  })
    .then(resp => resp.json())
    .then(data => {
      console.log('account detection from atko.id:', data);
      if (data.e) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://atko.id:3000/iframe/select')
        iframe.setAttribute('style', 'height: 300px; width: 391px; overflow: hidden;border:0');
        const c = document.getElementById('credential_picker_container');
        c.appendChild(iframe);
        c.style.display = 'block';
      }
    });

  window.addEventListener('message', (message) => {
    const data = message.data;
    const origin = message.origin;

    if (origin === baseUrl) {
      console.log('Get message from iframe:', data);
      const userE = document.getElementById('user');
      const pre = document.createElement('pre');
      pre.setAttribute('style', 'font-size: 20px');
      pre.innerText = JSON.stringify(data, null, 2);
      userE.appendChild(pre);
      userE.style.display = 'block';
    } else {
      console.info('Unexpected message', message);
    }

    const c = document.getElementById('credential_picker_container');
    c.remove();
  });

};
