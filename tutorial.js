/* ===================== */
/* GLOBAL STATE */
/* ===================== */

let isBusy = false;

let cassetteDone = false;
let tvDone = false;
let ticketDone = false;
let tutorialDone = false;

/* ===================== */
/* ELEMENTS PAGE NEXT */
/* ===================== */

const nextPage = document.getElementById("next-page");

/* ===================== */
/* CHECK GLOBAL COMPLETION */
/* ===================== */

function checkTutorialComplete() {
  if (cassetteDone && tvDone && ticketDone) {
    tutorialDone = true;
    nextPage.style.opacity = "1";
  }
}

/* ===================== */
/* CASSETTE */
/* ===================== */

const cassettePlayer = document.getElementById("CassettePlayer");
const cassette = document.getElementById("cassette");

const audio = new Audio("https://github.com/sadanddarkheart-creator/HebergerSadanddarkheart/raw/refs/heads/main/Popee%20The%20Performer%20OST%20-%20Tahmano.mp3");

cassettePlayer.addEventListener("click", () => {

  if (cassetteDone || isBusy) return;

  isBusy = true;
  cassetteDone = true;

  cassette.classList.add("active");

  setTimeout(() => cassette.classList.add("flipped"), 600);
  setTimeout(() => cassette.classList.add("exit-up"), 1400);

  setTimeout(() => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, 2200);

  cassettePlayer.style.opacity = "0";
  cassettePlayer.style.pointerEvents = "none";

  audio.onended = () => {
    isBusy = false;
    checkTutorialComplete();
  };

  setTimeout(() => {
    isBusy = false;
    checkTutorialComplete();
  }, 5000);
});

/* ===================== */
/* TV */
/* ===================== */

const tv = document.getElementById("TV");
const wrapper = document.querySelector(".tv-wrapper");
const video = document.getElementById("tv-video");

tv.addEventListener("click", () => {

  if (tvDone || isBusy) return;

  isBusy = true;
  tvDone = true;

  tv.style.opacity = "0";
  tv.style.pointerEvents = "none";

  setTimeout(() => {

    tv.style.display = "none";
    wrapper.classList.add("active");

    video.currentTime = 0;
    video.play().catch(() => {});

  }, 300);
});

video.addEventListener("ended", () => {

  wrapper.style.opacity = "0";

  setTimeout(() => {
    wrapper.classList.remove("active");
    wrapper.style.display = "none";

    isBusy = false;
    checkTutorialComplete();

  }, 500);
});

/* ===================== */
/* SCRATCH CARD */
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

function resizeScratch() {
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#c7c7c7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let scratching = false;
let lastX = 0;
let lastY = 0;
let finished = false;
let checkCooldown = false;

ticket.addEventListener("click", () => {

  if (ticketDone || isBusy) return;

  ticketDone = true;

  enterFocus();

  scratchCard.classList.add("active");
  resizeScratch();

  ticket.style.opacity = "0";
  ticket.style.pointerEvents = "none";
});

/* SCRATCH */
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

      const pixels = ctx.getImageData(0,0,canvas.width,canvas.height).data;

      let transparent = 0;
      const total = pixels.length / 4;

      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) transparent++;
      }

      const percent = (transparent / total) * 100;

      if (percent > 55) finishScratch();

      checkCooldown = false;
    }, 200);
  }
});

function finishScratch() {

  if (finished) return;
  finished = true;

  scratchCard.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  scratchCard.style.opacity = "0";
  scratchCard.style.transform = "translate(-50%, -50%) scale(0.9)";

  setTimeout(() => {
    scratchCard.style.display = "none";
    exitFocus();

    ticketDone = true;
    checkTutorialComplete();

  }, 600);
}

/* ===================== */
/* NEXT PAGE LOCKED */
/* ===================== */

nextPage.addEventListener("click", () => {

  if (!tutorialDone) {
    alert("Fini d'abord le tutoriel 🙂");
    return;
  }

  window.location.href = "page2.html";
});