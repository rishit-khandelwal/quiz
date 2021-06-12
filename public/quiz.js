let blocking = false;
let _i = new URLSearchParams(window.location.search).get("id") || 0;
const popup = document.getElementById("popup");
popup.hidden = true;
window.score = 0;

const displayScore = () => {
  popup.innerHTML = `<h3>Your score was: ${window.score}</h3>
          <div></div>
        <a href="/play">Go to menu</a>`;
  popup.hidden = false;
};
window.onload = async () => {
  const audio = document.getElementById("sound");
  document.addEventListener("click", () => {
    audio.play();
  });

  let scoreBait = 1000;
  setInterval(() => {
    scoreBait /= 2;
  }, 4000);
  try {
    let [{ id, prompt, options, correct }] = await (
      await fetch(
        "/api/getq/" +
          (new URLSearchParams(window.location.search).get("state") ||
            "kerala") +
          "/" +
          _i.toString()
      )
    ).json();

    if (prompt.startsWith("html:")) {
      document.getElementById("question").innerHTML = prompt
        .slice(5)
        .replaceAll(";", "");
    } else {
      document.getElementById("question").innerText = prompt;
    }

    options.forEach((_, i, a) => {
      let x = document.createElement("div");
      x.innerText = _;

      x.onclick = () => {
        if (blocking) {
          return;
        }
        if (i == correct) {
          x.classList.add("yeehaw");
          window.score += scoreBait;
          setTimeout(() => {
            x.classList.remove("yeehaw");
          }, 1000);
        } else {
          console.log("wrong");
          x.classList.add("cry");
          setTimeout(() => x.classList.remove("cry"), 1000);
        }
        _i += 1;
        blocking = true;
        setTimeout(() => {
          blocking = false;
          document.getElementById("question").innerText = "";
          document.getElementById("options").innerHTML = "";
          window.onload();
        }, 700);
      };

      document.getElementById("options").appendChild(x);
    });
  } catch {
    displayScore();
  }
};
