document.querySelector("select").onchange = (e) => {
  state = e.target.value.toLowerCase();

  window.location = `/ask.html?state=${encodeURIComponent(state)}`;
};

let states;
window.onload = async () => {
  const state = document.getElementById("state");
  const value = await (await fetch("/api/states")).json();

  states = value["data"];

  value["data"].forEach((v) => {
    state.add(
      (() => {
        let x = document.createElement("option");
        x.innerText = v;
        return x;
      })()
    );
  });
};
