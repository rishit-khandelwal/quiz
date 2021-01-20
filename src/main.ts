const rq = require;
import e from "express";
import { readFileSync } from "fs";
const { resolve: rs } = rq("path");
const a = e();
a.get("/", (_, r) => r.sendFile(rs("public/index.html")));
a.get("/play", (_, r) => r.sendFile(rs("public/play.html")));
a.get("/quiz", (_, r) => r.sendFile(rs("public/quiz.html")));
a.get("/:file", (_, r) => r.sendFile(rs(`public/${_.params.file}`)));

a.get("/api/states", (_, r) =>
  r.json({
    data: ["Kerela"],
  })
);

a.get("/api/getq/:state/:id", ({ params: { state, id } }, res) => {
  const qs =
    JSON.parse(readFileSync("public/secret/questions.json").toString())[
      state
    ] ||
    JSON.parse(readFileSync("public/secret/questions.json").toString())[
      "kerela"
    ];
  res.json(qs.filter((v) => v["id"] == id));
});

a.listen(3000);
