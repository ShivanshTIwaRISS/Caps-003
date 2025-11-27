setInterval(() => {
  fetch("https://caps-003.onrender.com/")
    .then(() => console.log("Pinged backend"))
    .catch(() => {});
}, 20000);  
