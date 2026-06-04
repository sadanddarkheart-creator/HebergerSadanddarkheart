/* ===================== */
/* LOCK GLOBAL */
/* ===================== */

let isBusy = false;

/* ===================== */
/* CASSETTE */
/* ===================== */

const cassettePlayer = document.getElementById("CassettePlayer");
const cassette = document.getElementById("cassette");

const audio = new Audio("https://github.com/sadanddarkheart-creator/HebergerSadanddarkheart/raw/refs/heads/main/Popee%20The%20Performer%20OST%20-%20Tahmano.mp3");

cassettePlayer.addEventListener("click", () => {

  if (cassette.dataset.done || isBusy) return;

  isBusy = true;
  cassette.dataset.done = "true";

  cassette.classList.add("active");

  setTimeout(() => {
    cassette.classList.add("flipped");
  }, 600);

  setTimeout(() => {
    cassette.classList.add("exit-up");
  }, 1400);

  setTimeout(() => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, 2200);

  cassettePlayer.style.pointerEvents = "none";
 cassettePlayer.style.opacity = "0";
cassettePlayer.style.pointerEvents = "none";
cassettePlayer.style.transform = "scale(0.95)";

  // 🔓 libération fiable = AUDIO FINI UNIQUEMENT
  audio.onended = () => {
    isBusy = false;
  };

  // sécurité fallback (si autoplay bloqué ou bug navigateur)
  setTimeout(() => {
    isBusy = false;
  }, 5000);
});


/* ===================== */
/* TV */
/* ===================== */

const tv = document.getElementById("TV");
const wrapper = document.querySelector(".tv-wrapper");
const video = document.getElementById("tv-video");

let tvDone = false;

tv.addEventListener("click", () => {

  if (tvDone || isBusy) return;

  isBusy = true;
  tvDone = true;

  // cacher TV cliquable immédiatement
  tv.style.opacity = "0";
  tv.style.pointerEvents = "none";

  setTimeout(() => {
    tv.style.display = "none";

    // IMPORTANT : attendre que le DOM ait bien switch avant play
    wrapper.classList.add("active");

    requestAnimationFrame(() => {
      video.currentTime = 0;

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // si blocage autoplay → retry léger
          setTimeout(() => video.play().catch(()=>{}), 200);
        });
      }
    });

  }, 300);
});


video.addEventListener("ended", () => {

  wrapper.style.opacity = "0";

  setTimeout(() => {
    wrapper.classList.remove("active");
    wrapper.style.display = "none";
    isBusy = false;
  }, 500);

});

video.addEventListener("error", () => {
  console.log("❌ VIDEO ERROR - lien cassé ou incompatible");
});

video.addEventListener("ended", () => {

  wrapper.style.opacity = "0";

  setTimeout(() => {
    wrapper.classList.remove("active");
    wrapper.style.display = "none";

    isBusy = false; // libère enfin le système
  }, 500);

});

/* ===================== */
/* TICKET */
/* ===================== */

const ticket = document.getElementById("ticket");
const scratchCard = document.getElementById("scratch-card");
const canvas = document.getElementById("scratch");
const ctx = canvas.getContext("2d");
const hint = document.getElementById("hint");

function enterFocus() {
  document.body.classList.add("focus");
}

function exitFocus() {
  document.body.classList.remove("focus");
}

/* ===================== */
/* resize canvas */
/* ===================== */

function resizeScratch() {
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#c7c7c7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ===================== */
/* STATE */
/* ===================== */

let scratching = false;
let lastX = 0;
let lastY = 0;
let finished = false;
let checkCooldown = false;

/* ===================== */
/* CLICK TICKET */
/* ===================== */

ticket.addEventListener("click", () => {

  // ❗ IMPORTANT : ticket ne dépend PAS de cassette/TV
  if (ticket.dataset.done) return;

  ticket.dataset.done = "true";

  enterFocus();

  scratchCard.style.display = "block";
  scratchCard.classList.add("active");

  resizeScratch();

  setTimeout(() => {
    ticket.style.opacity = "0";
    ticket.style.pointerEvents = "none";
  }, 150);
});

/* ===================== */
/* SCRATCH */
/* ===================== */

canvas.addEventListener("mousedown", (e) => {
  scratching = true;

  const rect = canvas.getBoundingClientRect();

  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;

  hint.style.opacity = "0";
});

canvas.addEventListener("mouseup", () => scratching = false);
canvas.addEventListener("mouseleave", () => scratching = false);

canvas.addEventListener("mousemove", (e) => {

  if (!scratching || finished) return;

  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 30;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;

  if (!checkCooldown) {
    checkCooldown = true;

    setTimeout(() => {
      const percent = getScratchPercentage();

      if (percent > 55) finishScratch();

      checkCooldown = false;
    }, 200);
  }
});

/* ===================== */
/* PROGRESS */
/* ===================== */

function getScratchPercentage() {
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let transparent = 0;
  const total = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] === 0) transparent++;
  }

  return (transparent / total) * 100;
}

/* ===================== */
/* FINISH */
/* ===================== */

function finishScratch() {

  if (finished) return;
  finished = true;

  scratchCard.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  scratchCard.style.opacity = "0";
  scratchCard.style.transform = "translate(-50%, -50%) scale(0.9)";

  setTimeout(() => {
    scratchCard.style.display = "none";
    exitFocus();
  }, 600);
}

document.getElementById("next-page").addEventListener("click", () => {
  window.location.href = "page2.html";
});