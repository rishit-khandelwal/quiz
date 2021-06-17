const rq = require;
import e from "express";
import { readFileSync, writeFileSync } from "fs";
const { resolve } = rq("path");
function rs(p: string) {
  return resolve(`../${p}`);
}
const a = e();

a.get("/", (_, r) => r.sendFile(rs("public/index.html")));
a.get("/play", (_, r) => r.sendFile(rs("public/play.html")));
a.get("/ask", (_, r) => r.sendFile(rs("public/ask.html")));
a.get("/quiz", (_, r) => r.sendFile(rs("public/quiz.html")));

a.get("/:file", (_, r) => r.sendFile(rs(`public/${_.params.file}`)));

a.get("/api/states", (_, r) => {
  const data = JSON.parse(readFileSync("../secret/questions.json").toString());

  const keys = Object.keys(data);

  return r.json({
    data: keys.map((_) => _.toUpperCase()[0] + _.slice(1)),
  });
});
a.get("/api/facts/", (req, res) => {
  const state = decodeURIComponent(req.header("state"));
  const data = JSON.parse(readFileSync("../secret/facts.json").toString());
  res.json({
    data: data[state],
  });
});
a.get("/api/getq/:state/:id", ({ params: { state, id } }, res) => {
  const data = readFileSync("../secret/questions.json").toString();
  const qs =
    JSON.parse(data)[decodeURIComponent(state)] || JSON.parse(data)["kerela"];

  res.json(qs.filter((v) => v["id"] == id));
});

a.post("/add", (req, res) => {
  const {
    state,
    ops: options,
    ...data
  } = JSON.parse(decodeURIComponent(req.header("data")));

  const questions = JSON.parse(
    readFileSync("../secret/questions.json").toString()
  );

  if (!questions[state]) {
    questions[state] = [];
    data["id"] = 0;
  } else {
    data["id"] =
      questions[state][(questions[state] || [1]).length - 1]["id"] + 1;
  }
  data["options"] = options;

  questions[state].push(data);

  console.log(questions[state]);

  writeFileSync("../secret/questions.json", JSON.stringify(questions));
  res.json({
    stat: 0xabc,
  });
});

a.listen(4000);
