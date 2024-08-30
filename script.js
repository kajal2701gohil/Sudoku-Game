const main = document.querySelector("main");
const level = document.querySelector("#level");
const square = [
    [1, 2, 3, 10, 11, 12, 19, 20, 21],
    [4, 5, 6, 13, 14, 15, 22, 23, 24],
    [7, 8, 9, 16, 17, 18, 25, 26, 27],
    [28, 29, 30, 37, 38, 39, 46, 47, 48],
    [31, 32, 33, 40, 41, 42, 49, 50, 51],
    [34, 35, 36, 43, 44, 45, 52, 53, 54],
    [55, 56, 57, 64, 65, 66, 73, 74, 75],
    [58, 59, 60, 67, 68, 69, 76, 77, 78],
    [61, 62, 63, 70, 71, 72, 79, 80, 81]
];
let fixBoxVal = [];
let box = [];
let key = 0;
let number = 1;
let fnCall = 0;
let second = 0;
let minute = 0;
let incorrect = 0;
let boxClickable = false;
let timeInterval;
let currentLevel = level.children[0];
let currentBox;
let filledBox = JSON.parse(localStorage.getItem("filledBox")) || [];
let listing = [];
let isPlayer = false || JSON.parse(localStorage.getItem("isPlayer"));
let exitBox = [];
let scoreBoard = {
    easy: [{
        player: "Emily",
        time: "05:20"
    },
    {
        player: "Partrica",
        time: "03:05"
    },
    {
        player: "Remi",
        time: "09:10"
    },
    {
        player: "Kiera",
        time: "02:25"
    },
    {
        player: "Heli",
        time: "12:30"
    }],
    medium: [
        {
            player: "Leanne",
            time: "06:20"
        },
        {
            player: "Ervin",
            time: "10:05"
        },
        {
            player: "Chelsey",
            time: "08:10"
        },
        {
            player: "Dennis",
            time: "12:25"
        },
        {
            player: "Glenna",
            time: "15:30"
        }
    ],
    hard: [
        {
            player: "Mark",
            time: "10:20"
        },
        {
            player: "Stephany",
            time: "05:05"
        },
        {
            player: "Angela",
            time: "12:10"
        },
        {
            player: "Jackson",
            time: "14:25"
        },
        {
            player: "Melissa",
            time: "18:30"
        }
    ]
};


const displayBoxes = () => {
    for (let i = 1; i <= square.length; i++) {
        main.innerHTML += ` <div class="div1" id="row${i}">`;
        for (let j = 1; j <= square.length; j++) {
            key++;
            document.getElementById(`row${i}`).innerHTML += `<input type="text"  inputMode="number" class="box col${j}" id="${key}"  maxLength="1" autocomplete="off" oninput="checkNumber(this)" onfocus="focusEffect(this)"></input>`;
        };
        box = document.querySelectorAll(".box");
    };
};

displayBoxes();


const startGame = (blank) => {
    const player = document.getElementById("player");
    if (player.value || isPlayer) {
        exitBox = [];
        isPlayer = true;
        localStorage.setItem("isPlayer", isPlayer);
        filledBox = [];
        localStorage.setItem("filledBox", JSON.stringify(filledBox));
        currentLevel.style.backgroundColor = '#1C76D0';
        document.querySelector("#score-board").style.display = "block";
        clearInterval(timeInterval);
        boxClickable = true;
        timeInterval = setInterval(timeStart, 1000);
        fillBox(number);
        removeRandomBox(blank);
        visibleBoxDisable();
        currentBox = box[0];
        focusEffect(box[0]);
        showScore(currentLevel);
    }
    else {
        alert("enter the player name");
    };
};


const timeStart = () => {
    second++;
    if (second > 60) {
        minute++;
        second = 0;
    }
    document.querySelector("#second").textContent = (second.toString().length < 2) ? `${"0" + second}` : second;
    document.querySelector("#minute").textContent = (minute.toString().length < 2) ? `${"0" + minute}` : minute;
    let timeStop = document.getElementById("time").textContent;
    localStorage.setItem("timeStop", JSON.stringify(timeStop));
};


const fillBox = (number) => {
    let arr = [];
    arr = [...arr, ...square];
    fnCall++;
    let conflict = false;
    for (let i = 0; i < square.length; i++) {
        arr[i]?.forEach(z => {
            if (document.getElementById(`${z}`).classList.contains("fill") || document.getElementById(`${z}`).value != "") {
                arr[i] = arr[i].filter(x => x != z);
            };
        });

        if (arr[i].length > 0) {
            let random = Math.floor(Math.random() * arr[i].length);
            let target = document.getElementById(arr[i][random]);
            conflict = false;
            target.value = number;
            let row = target.parentElement.children;
            let column = document.querySelectorAll(`.${target.getAttribute("class").split(" ")[1]}`);
            for (let x of row) {
                x.classList.add("fill");
            };
            for (let y of column) {
                y.classList.add("fill");
            };
        }
        else {
            conflict = true;
            if (number >= square.length - 1) {
                if (fnCall < box.length) {
                    fillBox(number);
                }
                else {
                    box?.forEach(x => {
                        x.classList.remove("fill");
                        x.value = "";
                    });
                    fillBox(1);
                };
            }
            else {
                box?.forEach(x => {
                    x.classList.remove("fill");
                    if (Number(x.value) === number) {
                        x.value = "";
                    };
                });
                fillBox(number);
            };
            break;
        };
    };

    if (!conflict) {
        if (number < square.length) {
            box?.forEach(x => x.classList.remove("fill"));
            number++;
            fnCall = 0;
            fillBox(number);
        }
        else {
            box?.forEach(x => {
                fixBoxVal = [...fixBoxVal, x.value];
            });
            localStorage.setItem("fixBoxVal", JSON.stringify(fixBoxVal));
        };
    };
};


const removeRandomBox = (blank) => {
    for (let i = 0; i < blank; i++) {
        let random = Math.floor(Math.random() * box.length);
        if (box[random].value === "") {
            i--;
        }
        else {
            box[random].value = "";
        };
    };
};


const visibleBoxDisable = () => {
    box?.forEach((x, i) => {
        if (x.value) {
            x.setAttribute("readonly", true);
            x.style.color = "gray";
            exitBox.push({ id: i + 1, val: x.value });
        };
    });
    localStorage.setItem("exitBox", JSON.stringify(exitBox));
};


const checkNumber = (e) => {
    if (boxClickable && e.value > 0 && e.value <= 9) {
        let hasCorrect = fixBoxVal[e.id - 1] === e.value;
        if (hasCorrect) {
            e.style.color = "black";
            focusEffect(e);
        };
        if (!hasCorrect) {
            e.style.color = "red";
            incorrect++;
            localStorage.setItem("mistake", JSON.parse(incorrect));
        };
        if (incorrect >= 3) {
            document.querySelector("#over").textContent = "Game Over!"
            document.querySelector("#restart").style.display = "inline-block";
            box?.forEach(x => x.setAttribute("readonly", true));
            clearInterval(timeInterval);
        };
        document.querySelector("#mistake").textContent = incorrect;
        filledBox = [...filledBox, { id: e.id, val: e.value, type: e.style.color }];
        localStorage.setItem("filledBox", JSON.stringify(filledBox));
    }
    else {
        e.value = "";
    };

    let emptyBox = 0;
    for (let x of box) {
        if (x.value === "") {
            emptyBox++;
        };
    };
    if (emptyBox <= 0) {
        document.querySelector("#over").textContent = "You are Winner!"
        document.querySelector("#restart").style.display = "inline-block";
        clearInterval(timeInterval);
        let addWinner = {};
        addWinner.player = document.getElementById("player").value;
        addWinner.time = document.querySelector("#time").textContent;
        listing.push(addWinner);
        for (let x in scoreBoard) {
            if (x == currentLevel.id) {
                scoreBoard[x] = listing;
                localStorage.setItem("scoreboard", JSON.stringify(scoreBoard));
                showScore(currentLevel);
            };
        };
    };
};


const focusEffect = (e) => {
    currentBox = e;
    box?.forEach(x => x.style.backgroundColor = "white");
    if (boxClickable) {
        if (e.value !== "") {
            box?.forEach(y => {
                if (y.value === e.value) {
                    y.style.backgroundColor = "#bbdefb";
                };
            });
        };
        let row = e.parentElement.children;
        let column = document.querySelectorAll(`.${e.getAttribute("class").split(" ")[1]}`);
        let index = square.findIndex(d => d.includes(Number(e.id)));

        for (let x of row) {
            x.style.backgroundColor = " #e2ebf3";
        };
        for (let x of column) {
            x.style.backgroundColor = " #e2ebf3";
        };
        for (let x of square[index]) {
            document.getElementById(`${x}`).style.backgroundColor = " #e2ebf3";
        };
        e.style.backgroundColor = "#bbdefb";
    };
};


const levelChange = (a, e) => {
    main.innerHTML = "";
    key = 0;
    incorrect = 0;
    for (let x of level.children) {
        x.style.backgroundColor = "#777070";
    };
    currentLevel = e;
    localStorage.setItem("level", JSON.stringify(currentLevel.id))
    document.querySelector("#mistake").textContent = incorrect;
    document.querySelector("#over").textContent = "";
    document.querySelector("#restart").style.display = "none";
    second = 0;
    minute = 0
    displayBoxes();
    fixBoxVal = [];
    startGame(a);
};
document.querySelector("#restart").addEventListener("click", () => {
    let blank = currentLevel.getAttribute("onclick").split(/[(),]/)[1];
    levelChange(blank, currentLevel);
});


const erase = () => {
    if (!currentBox.getAttribute("readonly")) {
        currentBox.value = "";
    };
};


const undo = () => {
    let empty = filledBox.pop();
    let undoBox = document.getElementById(`${empty?.id}`);
    let undoVal = empty?.val;

    if (undoBox) {
        if (undoBox.value === "") {
            undoBox.value = undoVal;
            undoBox.style.color = "red";
            filledBox.push(empty);
        }
        else {
            undoBox.value = "";
        };
        focusEffect(undoBox);
    }
    else {
        focusEffect(box[40]);
    };
};


const showScore = (level) => {
    let data = JSON.parse(localStorage.getItem("scoreboard"));
    if (data === null) {
        localStorage.setItem("scoreboard", JSON.stringify(scoreBoard));
        data = scoreBoard;
    }
    else {
        data = JSON.parse(localStorage.getItem("scoreboard"));
    };

    for (let x in data) {
        if (x == level.id) {
            listing = data[x];
        };
    };

    listing.sort((x, y) => (Number(x.time.split(":")[0] * 60) + Number(x.time.split(":")[1])) - Number(y.time.split(":")[0] * 60) + Number(y.time.split(":")[1]));
    let str = "";
    listing?.map((x, i) => {
        str += `<tr>  
        <td>${i + 1}</td>   
        <td>${x.player}</td>     
        <td>${x.time}</td>     
        </tr>`;
    });
    document.querySelector("#scoreTable").innerHTML = str;
};


if (isPlayer) {
    boxClickable = true;
    clearInterval(timeInterval);
    incorrect = JSON.parse(localStorage.getItem("mistake")) || 0;
    fixBoxVal = JSON.parse(localStorage.getItem("fixBoxVal"));
    exitBox = JSON.parse(localStorage.getItem("exitBox"));
    for (let x of exitBox) {
        document.getElementById(`${x.id}`).value = x.val;
        document.getElementById(`${x.id}`).setAttribute("readonly", true);
        document.getElementById(`${x.id}`).style.color = "gray";
    }
    for (let x of level.children) {
        if (x.id == JSON.parse(localStorage.getItem("level"))) {
            currentLevel = x;
        }
    }
    focusEffect(box[0]);
    showScore(currentLevel);
    currentLevel.style.backgroundColor = '#1C76D0';
    timeInterval = setInterval(timeStart, 1000);
    document.querySelector("#score-board").style.display = "block";
    document.querySelector("#mistake").textContent = incorrect;
    for (let y of filledBox) {
        document.getElementById(`${y.id}`).value = y.val;
        document.getElementById(`${y.id}`).style.color = y.type;
    }
    second = JSON.parse(localStorage.getItem("timeStop")).split(":")[1];
    minute = JSON.parse(localStorage.getItem("timeStop")).split(":")[0];
}