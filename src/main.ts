import e from "express";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import * as formidable from "formidable";

console.log(process.env.DEVENV);

function rs(p: string) {
  return resolve(`../${p}`);
}
const a = e();

a.get("/", (_, r) => r.sendFile(rs("public/index.html")));
a.get("/play", (_, r) => r.sendFile(rs("public/play.html")));
a.get("/ask", (_, r) => r.sendFile(rs("public/ask.html")));
a.get("/quiz", (_, r) => r.sendFile(rs("public/quiz.html")));

a.get("/mega", (req, res) => {
  res.sendFile(rs("mega/index.html"));
});

a.get("/:file", (_, r) => r.sendFile(rs(`public/${_.params.file}`)));
a.get("/uploads/:file", (_, r) =>
  r.sendFile(rs(`public/uploads/${_.params.file}`))
);

a.get(`/api/mega/:question`, (_, res) => {
  const questions = JSON.parse(readFileSync("../secret/mega.json").toString());

  res.json({ data: questions.questions[_.params.question] });
});

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
  if (process.env.DEVENV) {
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
    data["options"] = options.map((v) => v.trim());

    questions[state].push(data);

    writeFileSync("../secret/questions.json", JSON.stringify(questions));
    res.json({
      stat: 0xabc,
    });
  }
});

a.post("/addmega", (req, res) => {
  if (process.env.DEVENV) {
    const { prompt, options, correct } = JSON.parse(
      decodeURIComponent(req.header("data"))
    );

    let obj: any = {
      prompt,
      options,
      correct,
    };

    let file;
    if ((file = req.header("file")) != "undefined") {
      obj.file = file;
    }

    const questions = JSON.parse(
      readFileSync("../secret/mega.json").toString()
    );

    questions.questions.push(obj);

    writeFileSync("../secret/mega.json", JSON.stringify(questions));
    res.json({
      stat: 0xabc,
    });
  }
});

a.post("/upload-media", (req, res) => {
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      throw err;
    }

    const fpath = files.media.path;
    const fname = files.media.name;

    const newPath = resolve(`../public/uploads/${fname}`);
    const data = readFileSync(fpath);

    writeFileSync(newPath, data);
  });
});

a.listen(4000);
