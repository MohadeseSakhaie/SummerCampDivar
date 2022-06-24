const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];


const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) =>
	`It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const isLineSelected = (line) =>
	line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
	const gameGridContainer = document.getElementsByClassName(
		"game-grid-container"
	)[0];


	const rows = Array(N)
		.fill(0)
		.map((_, i) => i);
	const cols = Array(M)
		.fill(0)
		.map((_, i) => i);

	rows.forEach((row) => {
		cols.forEach((col) => {
			const dot = document.createElement("div");
			dot.setAttribute("class", "dot");

			const hLine = document.createElement("div");
			hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
			hLine.setAttribute("id", `h-${row}-${col}`);
			hLine.addEventListener("click", handleLineClick);
			// console.log(hLine);

			gameGridContainer.appendChild(dot);
			if (col < M - 1) gameGridContainer.appendChild(hLine);
		});

		if (row < N - 1) {
			cols.forEach((col) => {
				const vLine = document.createElement("div");
				vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
				vLine.setAttribute("id", `v-${row}-${col}`);
				vLine.addEventListener("click", handleLineClick);
				// console.log(vLine);

				const box = document.createElement("div");
				box.setAttribute("class", "box");
				box.setAttribute("id", `box-${row}-${col}`);
				// console.log(box);
				gameGridContainer.appendChild(vLine);
				if (col < M - 1) gameGridContainer.appendChild(box);
			});
		}
	});

	document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
	const nextTurn = turn === "R" ? "B" : "R";

	const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

	lines.forEach((l) => {
		//if line was not already selected, change it's hover color according to the next turn
		if (!isLineSelected(l)) {
			l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
		}
	});
	turn = nextTurn;
	document.getElementById("game-status").innerHTML = playersTurnText(turn);

};
//point checker
let point = {
	blue: 0,
	red: 0
}
let pointValue = document.getElementById('point');

const handleLineClick = (e) => {
	// const bgClass = { B: "bg-red", R: "bg-blue" };
	const lineId = e.target.id;
	const selectedLine = document.getElementById(lineId);
	let boxComplete = false;

	//console.log(lineId);
	if (isLineSelected(selectedLine)) {
		//if line was already selected, return
		return alert('select another line');

	}
	selectedLines = [...selectedLines, lineId];
	colorLine(selectedLine);


	if (lineId.startsWith('h')) {

		const arr = lineId.split('-');

		const row = parseInt(arr[1]);
		const col = parseInt(arr[2]);

		//boxex with hLine start
		const boxAbove = [`h-${row}-${col}`, `v-${row - 1}-${col}`, `h-${row - 1}-${col}`, `v-${row - 1}-${col + 1}`];
		const boxBelow = [`h-${row}-${col}`, `h-${row + 1}-${col}`, `v-${row}-${col}`, `v-${row}-${col + 1}`];


		const isBoxCompleted = (box) => box.every(r => selectedLines.includes(r));
		//hline
		if (isBoxCompleted(boxBelow)) {
			const gameGridContainer = document.getElementsByClassName("game-grid-container")[0];
			let boxId = gameGridContainer.querySelector(`#box-${row}-${col}`);
			boxId.classList.add(bgClasses[turn]);
			boxComplete = true;
			//score 
			const pointer = bgClasses[turn] === "bg-red" ? point.red += 1 : point.blue += 1;

		};
		if (isBoxCompleted(boxAbove)) {
			const gameGridContainer = document.getElementsByClassName("game-grid-container")[0];
			const boxId = gameGridContainer.querySelector(`#box-${row - 1}-${col}`);
			boxId.classList.add(bgClasses[turn]);
			boxComplete = true;
			const pointer = bgClasses[turn] === "bg-red" ? point.red += 1 : point.blue += 1;

			// console.log(pointer);//0
			// console.log(point.blue);//1
		};
		isBoxCompleted(boxBelow);
		isBoxCompleted(boxAbove);
	}

	if (lineId.startsWith('v')) {
		const arr = lineId.split('-');

		const row = parseInt(arr[1]);
		const col = parseInt(arr[2]);

		//box with vline start
		const boxLeft = [`v-${row}-${col}`, `v-${row}-${col - 1}`, `h-${row}-${col - 1}`, `h-${row + 1}-${col - 1}`];
		const boxRight = [`v-${row}-${col}`, `v-${row}-${col + 1}`, `h-${row}-${col}`, `h-${row + 1}-${col}`];

		const isBoxCompleted = (box) => box.every(r => selectedLines.includes(r));

		//vline
		if (isBoxCompleted(boxLeft)) {
			const gameGridContainer = document.getElementsByClassName("game-grid-container")[0];
			const boxId = gameGridContainer.querySelector(`#box-${row}-${col - 1}`);
			boxId.classList.add(bgClasses[turn]);
			boxComplete = true;
			const pointer = bgClasses[turn] == "bg-red" ? point.red++ : point.blue++;
			// console.log(pointer);
		};

		if (isBoxCompleted(boxRight)) {
			const gameGridContainer = document.getElementsByClassName("game-grid-container")[0];
			const boxId = gameGridContainer.querySelector(`#box-${row}-${col}`);
			boxId.classList.add(bgClasses[turn]);
			boxComplete = true;
			const pointer = bgClasses[turn] == "bg-red" ? point.red += 1 : point.blue += 1;

		};

		isBoxCompleted(boxLeft);
		isBoxCompleted(boxRight);
	}
	// const pointHandler = addEventListener
	if (boxComplete == false) {
		changeTurn()
	};

	pointValue.textContent = `Blue Points:${point.blue}, Red Points:${point.red} `;
	if (selectedLines.length === 24) {
		const winner = point.red > point.blue ? "Red is Winner" : "blue is Winner";
		const getChangeContextTo = document.getElementById("game-status").innerHTML = `${winner}`;
	}

}

const colorLine = (selectedLine) => {
	selectedLine.classList.remove(hoverClasses[turn]);
	selectedLine.classList.add(bgClasses[turn]);
};


createGameGrid();
