window.onload = async () => {
  const state = new URLSearchParams(window.location.search).get("state");
  let score = 0;
  let question_number = 0;
  if (!state) window.location.pathname = "/ask";

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
          // let confetti = new Confetti("demo");

          // // Edit given parameters
          // confetti.setCount(75);
          // confetti.setSize(1);
          // confetti.setPower(25);
          // confetti.setFade(false);
          // confetti.destroyTarget(true);
        } else {
          el.classList.add("wrong");
          document.body.classList.add("wrong");
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
                else playAnimation(el, false);
                setTimeout(() => {
                  document.body.classList.remove("wrong");
                  putQuestion(question_number + 1);
                }, 1000);
              }
              if (i == correct) {
                // el.style.color = "green";
                el.onclick = () => {
                  score += 1;
                  onclick(true);
                };
              } else {
                el.onclick = () => {
                  onclick();
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
