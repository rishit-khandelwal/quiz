window.onload = async () => {
  const state = new URLSearchParams(window.location.search).get("state");
  const history = localStorage.getItem("scores");
  if (history) {
    const dones = JSON.parse(atob(history));
    console.log(dones, history);
    if (dones.map((v) => Object.keys(v)[0]).includes(state)) {
      window.location.pathname = "/";
    }
  } else window.location.pathname = "/";
  let score = 0;
  let question_number = 0;
  let pressed = false;
  if (!state) window.location.pathname = "/ask";

  function startTimer(seconds) {
    const timerEl = document.querySelector("#timer");

    timerEl.innerText = `${seconds}`;
    let ctime = seconds;
    let wtime = seconds;

    // ! wtime seconds 0
    // ! width 100 0

    const timer = setInterval(() => {
      timerEl.innerText = `${ctime-- - 1}`;
      if (ctime == 0) {
        clearInterval(timer);
      }
    }, 1000);

    const widthTimer = setInterval(() => {
      if ((wtime / seconds) * 100 == 0) clearInterval(widthTimer);
      timerEl.style.width = `${(wtime / seconds) * 100}px`;
      timerEl.style.paddingLeft = `${(wtime / seconds) * 20}px`;
      timerEl.style.paddingRight = `${(wtime / seconds) * 20}px`;
      wtime -= 1 / 100;
    }, 10);
  }

  function displayScore(score) {
    document.querySelector("div.options").style.display = "none";
    document.querySelector("h1.prompt").hidden = true;
    document.querySelector("div.score-popup").classList.add("visible");
    document.querySelector(
      "div.score-popup .score"
    ).innerText = `Your score is: ${score}`;
    let scores;
    if ((scores = localStorage.getItem("scores"))) {
      try {
        scores = atob(scores);
        scores = JSON.parse(scores);

        if (scores.map((v) => Object.keys(v)[0]).includes(state)) {
          return;
        }

        scores.push(JSON.parse(`{"${state}": ${score}}`));

        localStorage.setItem("scores", btoa(JSON.stringify(scores)));
      } catch (e) {
        console.error(e);
        return;
      }
    } else {
      localStorage.setItem("scores", btoa(JSON.stringify([])));
    }
    setTimeout(() => (window.location.href = window.location.origin), 2000);
  }

  async function putQuestion(question_number) {
    try {
      pressed = false;
      let html_prompt,
        htmlMode = false;
      const [{ correct, options, prompt }] = await fetch(
        `/api/getq/${state}/${question_number}`
      ).then((r) => r.json());
      if (prompt.startsWith("html:")) {
        const parts = prompt.split(";");
        const html = parts[0].split(":")[1];
        html_prompt = `${html}${parts[1]}`;
        htmlMode = true;
      }
      const promptElem = document.querySelector("h1.prompt");
      if (!htmlMode) {
        promptElem.innerText = `
          ${question_number + 1}. ${prompt}
          `;
      } else {
        promptElem.innerHTML = `
          ${question_number + 1}. ${html_prompt}
          `;
      }

      const optionsEl = document.querySelector("div.options");
      while (optionsEl.firstChild) {
        optionsEl.removeChild(optionsEl.lastChild);
      }

      function playAnimation(el, correct = true) {
        if (correct) {
          el.classList.add("correct");
        } else {
          el.classList.add("wrong");
        }
      }

      options
        .map((v) => `${v}`)
        .forEach((v, i) => {
          optionsEl.appendChild(
            (() => {
              const el = document.createElement("div");
              el.innerText = v;
              function onclick(correct) {
                if (correct) playAnimation(el);
                else {
                  playAnimation(el, false);
                }
                setTimeout(() => {
                  putQuestion(question_number + 1);
                }, 4000);
              }
              if (i == correct) {
                el.onclick = () => {
                  if (!pressed) score += 1;
                  onclick(true);

                  const popupEl = document.querySelector("#popup");
                  popupEl.innerText = `Yay! You got it right!`;
                  popupEl.classList.add("narrator-text");
                  setTimeout(() => {
                    popupEl.innerText = ``;
                    popupEl.classList.remove("narrator-text");
                  }, 4000);

                  pressed = true;
                };
              } else {
                el.onclick = () => {
                  onclick();

                  const correctOption = options[correct];

                  const popupEl = document.querySelector("#popup");
                  popupEl.innerText = `Correct Answer was "${correctOption}"`;
                  popupEl.classList.add("narrator-text");
                  setTimeout(() => {
                    popupEl.innerText = ``;
                    popupEl.classList.remove("narrator-text");
                  }, 4000);

                  pressed = true;
                };
              }
              return el;
            })()
          );
        });
    } catch (e) {
      displayScore(score);
    }
  }

  await putQuestion(question_number);
};
