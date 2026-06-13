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

async function loadQR(){

  const qr =
    await api.getAttendanceQR();

  document.getElementById("attendanceQR")
    .src = qr.image;
}

loadQR();

setInterval(loadQR, 120000);

let countdown = 120; // 2 minutes

function startQRTimer() {

  const timerElement = document.getElementById("qrTimer");

  setInterval(() => {

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    timerElement.textContent =
      `Refreshing in ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    countdown--;

    if (countdown < 0) {

      // Refresh QR here
      refreshQR();

      // Reset timer
      countdown = 120;
    }

  }, 1000);

}

function refreshQR() {

  console.log("Refreshing QR...");

  // Example: update QR image
  // document.getElementById("attendanceQR").src =
  //   newQrUrl + "?t=" + Date.now();

}
