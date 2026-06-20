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

let qrExpiry = 0;

async function loadQR() {

  const response = await fetch(
    GAS_URL + "?action=getAttendanceQR"
  );

  const data = await response.json();

  qrExpiry = data.expiresAt;

  document.getElementById("attendanceQR").src =
    data.qr;

}

function startGlobalTimer() {

  const timer =
    document.getElementById("qrTimer");

  setInterval(() => {

    const now =
      Math.floor(Date.now() / 1000);

    let remaining =
      qrExpiry - now;

    if(remaining <= 0){

      timer.textContent = "Refreshing...";

      loadQR();

      return;
    }

    const minutes =
      Math.floor(remaining / 60);

    const seconds =
      remaining % 60;

    timer.textContent =
      `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

  }, 1000);

}

window.onload = async () => {

  await loadQR();

  startGlobalTimer();

};

function openModal(modal){
  modal.classList.add('show');
}

function closeModal(modal){
  modal.classList.remove('show');
}

document
  .getElementById("loginBtn")
  .addEventListener("click", () => {
    openModal(document.getElementById("loginModal"));
});



function closeLogin(modal){
 closeModal(document.getElementById("loginModal"););
}

window.addEventListener("click", e => {

  if(e.target === modal){

    closeLogin(modal);

  }

});
