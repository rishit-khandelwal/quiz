window.onload = async () => {
  if (window.location.search == "") window.location.pathname = "/play";
  const state = new URLSearchParams(window.location.search).get("state");
  if (!state) return;
  const { data: facts } = await (
    await fetch(`/api/facts/`, {
      headers: new Headers({
        state: state,
      }),
    })
  ).json();

  if (!facts) {
    return;
  }

  if ((fact = randomItemFromArr(facts)))
    document.querySelector("div#fact").innerText = fact;
};
function randomItemFromArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
