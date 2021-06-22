"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const path_1 = require("path");
const formidable = __importStar(require("formidable"));
console.log(process.env.DEVENV);
function rs(p) {
    return path_1.resolve(`../${p}`);
}
const a = express_1.default();
a.get("/", (_, r) => r.sendFile(rs("public/index.html")));
a.get("/play", (_, r) => r.sendFile(rs("public/play.html")));
a.get("/ask", (_, r) => r.sendFile(rs("public/ask.html")));
a.get("/quiz", (_, r) => r.sendFile(rs("public/quiz.html")));
a.get("/mega", (req, res) => {
    res.sendFile(rs("mega/index.html"));
});
a.get("/:file", (_, r) => r.sendFile(rs(`public/${_.params.file}`)));
a.get("/uploads/:file", (_, r) => r.sendFile(rs(`public/uploads/${_.params.file}`)));
a.get(`/api/mega/:question`, (_, res) => {
    const questions = JSON.parse(fs_1.readFileSync("../secret/mega.json").toString());
    res.json({ data: questions.questions[_.params.question] });
});
a.get("/api/states", (_, r) => {
    const data = JSON.parse(fs_1.readFileSync("../secret/questions.json").toString());
    const keys = Object.keys(data);
    return r.json({
        data: keys.map((_) => _.toUpperCase()[0] + _.slice(1)),
    });
});
a.get("/api/facts/", (req, res) => {
    const state = decodeURIComponent(req.header("state"));
    const data = JSON.parse(fs_1.readFileSync("../secret/facts.json").toString());
    res.json({
        data: data[state],
    });
});
a.get("/api/getq/:state/:id", ({ params: { state, id } }, res) => {
    const data = fs_1.readFileSync("../secret/questions.json").toString();
    const qs = JSON.parse(data)[decodeURIComponent(state)] || JSON.parse(data)["kerela"];
    res.json(qs.filter((v) => v["id"] == id));
});
a.post("/add", (req, res) => {
    if (process.env.DEVENV) {
        const _a = JSON.parse(decodeURIComponent(req.header("data"))), { state, ops: options } = _a, data = __rest(_a, ["state", "ops"]);
        const questions = JSON.parse(fs_1.readFileSync("../secret/questions.json").toString());
        if (!questions[state]) {
            questions[state] = [];
            data["id"] = 0;
        }
        else {
            data["id"] =
                questions[state][(questions[state] || [1]).length - 1]["id"] + 1;
        }
        data["options"] = options.map((v) => v.trim());
        questions[state].push(data);
        fs_1.writeFileSync("../secret/questions.json", JSON.stringify(questions));
        res.json({
            stat: 0xabc,
        });
    }
});
a.post("/addmega", (req, res) => {
    if (process.env.DEVENV) {
        const { prompt, options, correct } = JSON.parse(decodeURIComponent(req.header("data")));
        let obj = {
            prompt,
            options,
            correct,
        };
        let file;
        if ((file = req.header("file")) != "undefined") {
            obj.file = file;
        }
        const questions = JSON.parse(fs_1.readFileSync("../secret/mega.json").toString());
        questions.questions.push(obj);
        fs_1.writeFileSync("../secret/mega.json", JSON.stringify(questions));
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
        const newPath = path_1.resolve(`../public/uploads/${fname}`);
        const data = fs_1.readFileSync(fpath);
        fs_1.writeFileSync(newPath, data);
    });
});
a.listen(4000);
//# sourceMappingURL=main.js.map