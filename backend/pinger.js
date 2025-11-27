setInterval(() => {
  fetch("https://caps-003.onrender.com/")
    .then(() => console.log("Pinged backend"))
    .catch(() => {});
}, 1000 * 60 * 5);  // every 5 minutes
