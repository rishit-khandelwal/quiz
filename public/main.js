function init() {
  let scores;
  if ((scores = localStorage.getItem("scores"))) {
    scores = atob(scores);
    scores = JSON.parse(scores);

    let totalScore = scores
      .map((v) => {
        return [Object.keys(v)[0], v[Object.keys(v)[0]]];
      })
      .map(([, score]) => score)
      .reduce((v, acc) => v + acc, 0);

    if (totalScore >= 80) {
      document.getElementById("mega").hidden = false;
    } else {
      document.getElementById("mega").hidden = true;
    }
  }
}
