function StatefulVariable(name, value) {
  this[name] = { value };
  this[name].assign = function (val) {
    this.value = val;
    const assignment = this.assign;
    this.assign = (..._) => {
      // Nothing will happen if someone tries to assign value to the same variable in the `change`
      // method
    };
    (this.change || ((_) => {}))(this);
    this.assign = assignment;
  };

  return this[name];
}

const pn = StatefulVariable("page_no", 1);
const pageCount = 10;

for (let c = 1; c <= pageCount; c++) {
  try {
    document.getElementById(`page${c}`).hidden = true;
  } catch {
    break;
  }
}

pn.change = (self) => {
  for (let c = 1; c <= pageCount; c++) {
    try {
      if (c == self.value)
        document.getElementById(`page${self.value}`).hidden = false;
      else {
        document.getElementById(`page${self.value}`).hidden = true;
      }
    } catch {
      break;
    }
  }
};

function nextPage() {
  pn.assign(pn.value + 1);
}
