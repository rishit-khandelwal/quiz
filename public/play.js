document.querySelector("select").onchange = (e) => {
  state = e.target.value.toLowerCase();

  window.location = `/ask.html?state=${encodeURIComponent(state)}`;
};

window.onload = async () => {
  let states;
  const state = document.getElementById("state");
  const value = await (await fetch("/api/states")).json();

  states = value["data"];

  states.sort();

  states.forEach((v) => {
    state.add(
      (() => {
        let x = document.createElement("option");
        x.innerText = v;
        return x;
      })()
    );
  });
};
