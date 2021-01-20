"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rq = require;
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const { resolve: rs } = rq("path");
const a = express_1.default();
a.get("/", (_, r) => r.sendFile(rs("public/index.html")));
a.get("/play", (_, r) => r.sendFile(rs("public/play.html")));
a.get("/quiz", (_, r) => r.sendFile(rs("public/quiz.html")));
a.get("/:file", (_, r) => r.sendFile(rs(`public/${_.params.file}`)));
a.get("/api/states", (_, r) => r.json({
    data: ["Kerela"],
}));
a.get("/api/getq/:state/:id", ({ params: { state, id } }, res) => {
    const qs = JSON.parse(fs_1.readFileSync("public/secret/questions.json").toString())[state] ||
        JSON.parse(fs_1.readFileSync("public/secret/questions.json").toString())["kerela"];
    res.json(qs.filter((v) => v["id"] == id));
});
a.listen(3000);
//# sourceMappingURL=main.js.map