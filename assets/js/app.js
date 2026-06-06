const GAS_URL =
  "https://script.google.com/macros/s/AKfycbw4_EdbH04pf7m7WnliwdVUGOOifZY8eE2QKdgVD686DSNVL_-CUSy434usgJhXnm-9/exec";

async function login(){

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value;

  const msg =
    document.getElementById("msg");

  if(!username || !password){
    msg.innerText = "Please fill in all fields";
    return;
  }

  try{

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "login",
        username: username,
        password: password
      })
    });

    const res = await response.json();

    if(res.success){

      // Save session
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userId", res.userId);

      // Redirect logic
      if(res.role === "ADMIN" || res.role === "HR"){
        window.location.href = "admin-dashboard.html";
      }else{
        window.location.href = "dashboard.html";
      }

    }else{

      msg.innerText = res.message || "Invalid login";

    }

  }catch(err){

    console.error(err);
    msg.innerText = "Server error. Please try again.";

  }
}
