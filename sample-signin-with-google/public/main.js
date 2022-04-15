function handleCredentialResponse(response) {
  const jwt = response.credential;
  const userProfile = jwt_decode(jwt);
  const slimProfile = {
    iss: userProfile.iss,
    name: userProfile.name,
    email: userProfile.email,
    picture: userProfile.picture,
  }
  document.getElementById('userProfile').innerText = JSON.stringify(slimProfile , null, 2);
}
window.onload = function() {
  google.accounts.id.initialize({
    client_id: "895286685956-278lqa3k09mj6tb845alllr800snj2i1.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    // itp_support: true
  });
  // google.accounts.id.renderButton(
  //   document.getElementById("buttonDiv"),
  //   {
  //     theme: "outline",
  //     size: "large"
  //   }
  // );
  // also display the One Tap dialog
  google.accounts.id.prompt();
}
