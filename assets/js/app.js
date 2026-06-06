const GAS_URL =
  "https://script.google.com/macros/s/AKfycbw4_EdbH04pf7m7WnliwdVUGOOifZY8eE2QKdgVD686DSNVL_-CUSy434usgJhXnm-9/exec";

async function login(){

  const response = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  });

  const result = await response.json();

  console.log(result);
}
