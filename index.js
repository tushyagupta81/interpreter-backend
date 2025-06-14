// index.js
const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.text({ limit: "100kb" }));

app.post("/interpreter-zig", (req, res) => {
	const input = req.body;
	const interpreter = spawn("./interpreter", ["-e", `${input}`]);

	let output = "";
	let error = "";
	let exit;
	interpreter.stdout.on("data", (data) => {
		output += `${data}`;
	});
	interpreter.stderr.on("data", (data) => {
		error += `${data}`;
	});
	interpreter.on("exit", (code) => {
		exit = code;
		res.send(JSON.stringify({ output: output, error: error, exit: exit }));
	});
});

app.get("/status", (req, res) => {
	res.send("Alive");
});

app.listen(3000, () =>
	console.log("Zig interpreter server running on port 3000"),
);
