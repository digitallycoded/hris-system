const GAS_URL =
  "https://script.google.com/macros/s/AKfycbw4_EdbH04pf7m7WnliwdVUGOOifZY8eE2QKdgVD686DSNVL_-CUSy434usgJhXnm-9/exec";

async function login(){

  try{

    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
      })
    });

    const text = await res.text();   // IMPORTANT DEBUG STEP

    console.log("RAW RESPONSE:", text);

    const data = JSON.parse(text);

    if(data.success){

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      if(data.role === "ADMIN" || data.role === "HR"){
        window.location.href = "admin-dashboard.html";
      }else{
        window.location.href = "dashboard.html";
      }

    }else{
      document.getElementById("msg").innerText = data.message;
    }

  }catch(err){

    console.error(err);
    document.getElementById("msg").innerText =
      "Server error. Check GAS deployment.";

  }
}

function requireAuth(){

  const token = localStorage.getItem("token");

  if(!token){
    window.location.href = "index.html";
  }

}
