(() => {
  let hazard_for_eyes = document.createElement("div");
  hazard_for_eyes.id = "hazard";
  const icon = document.createElement("i");
  icon.innerText = "light_mode";
  icon.classList.add("material-icons");
  icon.style.backgroundColor = "rgba(0,0,0,0)";
  icon.onclick = () => {
    if (document.body.classList.contains("lm")) {
      icon.innerText = "light_mode";
      document.body.classList.remove("lm");
    } else {
      document.body.classList.add("lm");
      icon.innerText = "dark_mode";
    }
  };
  hazard_for_eyes.appendChild(icon);

  document.body.appendChild(hazard_for_eyes);
})();
