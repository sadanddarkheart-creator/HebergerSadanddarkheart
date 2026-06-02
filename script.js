document.addEventListener("DOMContentLoaded", () => {

  /* ===================== */
  /* JOUET */
  /* ===================== */

  const toy = document.querySelector(".toy");
  const secret = document.getElementById("secret");

  if (toy && secret){

    toy.addEventListener("click", () => {

      toy.classList.remove("bounce");

      void toy.offsetWidth;

      toy.classList.add("bounce");

      secret.style.opacity = "1";

    });

  }

  /* ===================== */
  /* TV */
  /* ===================== */

  const tv = document.querySelector(".tv");

  const staticNoise = document.getElementById("static");
  const video = document.getElementById("memory-video");
  const black = document.getElementById("screen-black");

  /* 🔥 retour écran noir quand la vidéo finit */

  if (video) {

    video.addEventListener("ended", () => {

      video.style.opacity = "0";
      black.style.opacity = "1";

    });

  }

  let started = false;

  function startTV(){

    if(started) return;

    started = true;

    let i = 0;

    const interval = setInterval(() => {

      if(i % 2 === 0){

        black.style.opacity = "0";
        staticNoise.style.opacity = "1";

      }else{

        black.style.opacity = "1";
        staticNoise.style.opacity = "0";

      }

      i++;

      if(i > 14){

        clearInterval(interval);

        black.style.opacity = "0";
        staticNoise.style.opacity = "0";

        video.style.opacity = "1";

        video.play().catch(() => {});

      }

    },120);

  }

  const observer = new IntersectionObserver(entries => {

    if(entries[0].isIntersecting){

      startTV();

      observer.disconnect();

    }

  });

  if(tv){

    observer.observe(tv);

  }

});

/* ===================== */
/* CASSETTE */
/* ===================== */

const cassette =
  document.getElementById("cassette");

const audioContainer =
  document.getElementById("audio-container");

const audio =
  document.getElementById("cassette-audio");

if (
  cassette &&
  audioContainer &&
  audio
) {

  cassette.addEventListener("click", () => {

    if (
      cassette.dataset.state === "done"
    ) return;

    cassette.dataset.state = "done";

    cassette.classList.add("flipped");

    setTimeout(() => {

      cassette.classList.add("exit-up");

      setTimeout(() => {

        audioContainer.style.display = "flex";

        audio.play().catch(err => {
          console.log(
            "AUDIO ERROR:",
            err
          );
        });

      }, 500);

    }, 800);

  });

}