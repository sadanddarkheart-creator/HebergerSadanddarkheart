/* ===================== */
/* GLOBAL STATE */
/* ===================== */

let isBusy = false;

let cassetteDone = false;
let tvDone = false;
let ticketDone = false;
let tutorialDone = false;

/* ===================== */
/* NEXT PAGE */
/* ===================== */

const nextPage = document.getElementById("next-page");

function updateNextPage() {

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) return;

  const progress = window.scrollY / maxScroll;

  nextPage.style.opacity = Math.min(progress * 2, 1);
}

window.addEventListener("scroll", updateNextPage);
window.addEventListener("touchmove", updateNextPage);
window.addEventListener("resize", updateNextPage);

updateNextPage();

function checkTutorialComplete() {
  if (cassetteDone && tvDone && ticketDone) {
    tutorialDone = true;
  }
}

nextPage.addEventListener("click", () => {

  if (!tutorialDone) {
    alert("You need to finish the tutorial first!");
    return;
  }

  window.location.href = "page2.html";
});

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

/* scratch helpers */

function getPos(e) {
  const rect = canvas.getBoundingClientRect();

  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  return { x, y };
}

canvas.addEventListener("mousedown", startScratch);
canvas.addEventListener("touchstart", startScratch);

function startScratch(e) {
  scratching = true;

  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;

  hint.style.opacity = "0";
}

canvas.addEventListener("mouseup", () => scratching = false);
canvas.addEventListener("mouseleave", () => scratching = false);
canvas.addEventListener("touchend", () => scratching = false);

canvas.addEventListener("mousemove", drawScratch);
canvas.addEventListener("touchmove", drawScratch);

function drawScratch(e) {

  if (!scratching || finished) return;

  const pos = getPos(e);

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 30;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  lastX = pos.x;
  lastY = pos.y;

  if (!checkCooldown) {
    checkCooldown = true;

    setTimeout(() => {

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

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
}

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