/* =====================================================
   LOADING SYSTEM
===================================================== */

let loadingProgress = 0;


const progressFill =
    document.getElementById(
        "progressFill"
    );


const loadingText =
    document.getElementById(
        "loadingText"
    );


const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );


const gameScreen =
    document.getElementById(
        "gameScreen"
    );


const loadingInterval =
    setInterval(() => {

        loadingProgress += 1;


        progressFill.style.width =
            loadingProgress + "%";


        loadingText.textContent =
            "Loading resources... " +
            loadingProgress +
            "%";


        if (loadingProgress >= 100) {

            clearInterval(
                loadingInterval
            );


            loadingText.textContent =
                "Loading complete!";


            setTimeout(() => {

                openGame();

            }, 700);

        }

    }, 30);



function openGame() {

    loadingScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "hidden"
    );


    createBoard();

}


/* =====================================================
   GAME DATA
===================================================== */


const symbols = [

    "🀇",
    "🀈",
    "🀉",
    "🀙",
    "🀚",
    "🀛",
    "🀀",
    "🀁",
    "🀂",
    "🀄",
    "🌸",
    "🐉"

];


let balance = 2460;

let bet = 0.40;

let win = 0;

let spinning = false;

let turbo = false;


/* =====================================================
   ELEMENT
===================================================== */


const reelsContainer =
    document.getElementById(
        "reels"
    );


const balanceElement =
    document.getElementById(
        "balance"
    );


const betElement =
    document.getElementById(
        "bet"
    );


const winElement =
    document.getElementById(
        "win"
    );


const messageElement =
    document.getElementById(
        "gameMessage"
    );


const spinButton =
    document.getElementById(
        "spinButton"
    );


const spinNumber =
    document.getElementById(
        "spinNumber"
    );


const turboButton =
    document.getElementById(
        "turboButton"
    );


/* =====================================================
   RANDOM SYMBOL
===================================================== */


function randomSymbol() {

    const index =
        Math.floor(
            Math.random()
            * symbols.length
        );


    return symbols[index];

}


/* =====================================================
   CREATE BOARD
===================================================== */


function createBoard() {

    reelsContainer.innerHTML = "";


    for (
        let column = 0;
        column < 5;
        column++
    ) {


        const reel =
            document.createElement(
                "div"
            );


        reel.className =
            "reel";


        for (
            let row = 0;
            row < 7;
            row++
        ) {


            const tile =
                document.createElement(
                    "div"
                );


            tile.className =
                "tile";


            tile.textContent =
                randomSymbol();


            reel.appendChild(
                tile
            );

        }


        reelsContainer.appendChild(
            reel
        );

    }

}


/* =====================================================
   UPDATE
===================================================== */


function updateDisplay() {

    balanceElement.textContent =
        balance.toLocaleString(
            "id-ID"
        );


    betElement.textContent =
        bet.toFixed(2);


    winElement.textContent =
        win.toFixed(2);

}


/* =====================================================
   CHANGE BET
===================================================== */


function changeBet(amount) {

    if (spinning) {
        return;
    }


    bet += amount;


    if (bet < 0.10) {

        bet = 0.10;

    }


    if (bet > 10) {

        bet = 10;

    }


    updateDisplay();

}


/* =====================================================
   TURBO
===================================================== */


function toggleTurbo() {

    if (spinning) {
        return;
    }


    turbo = !turbo;


    turboButton.classList.toggle(
        "active",
        turbo
    );


    if (turbo) {

        messageElement.textContent =
            "Turbo aktif";

    } else {

        messageElement.textContent =
            "Turbo nonaktif";

    }

}


/* =====================================================
   SPIN
===================================================== */


function spin() {

    if (spinning) {
        return;
    }


    /*
       Pengecekan poin demo
    */

    if (balance < bet) {

        messageElement.textContent =
            "Koin demo tidak cukup.";

        return;

    }


    spinning = true;

    spinButton.disabled = true;


    /*
       Kurangi koin virtual
    */

    balance -= bet;

    win = 0;


    updateDisplay();


    messageElement.textContent =
        "Memutar tile Mahjong...";


    const reels =
        document.querySelectorAll(
            ".reel"
        );


    reels.forEach(
        reel => {

            reel.classList.add(
                "spinning"
            );

        }
    );


    /*
       Turbo lebih cepat
    */

    const duration =
        turbo
            ? 450
            : 1300;


    setTimeout(() => {

        generateResult();

    }, duration);

}


/* =====================================================
   RESULT
===================================================== */


function generateResult() {

    const reels =
        document.querySelectorAll(
            ".reel"
        );


    const results = [];


    /*
       Hapus animasi
    */

    reels.forEach(
        reel => {

            reel.classList.remove(
                "spinning"
            );

        }
    );


    /*
       Buat hasil baru
    */

    reels.forEach(
        reel => {

            const tiles =
                reel.querySelectorAll(
                    ".tile"
                );


            tiles.forEach(
                tile => {

                    tile.classList.remove(
                        "win"
                    );


                    const symbol =
                        randomSymbol();


                    tile.textContent =
                        symbol;


                    results.push(
                        symbol
                    );

                }
            );

        }
    );


    /*
       Hitung jumlah simbol
    */

    const counts = {};


    results.forEach(
        symbol => {

            if (!counts[symbol]) {

                counts[symbol] = 0;

            }


            counts[symbol]++;

        }
    );


    let winningSymbol =
        null;


    let highestCount =
        0;


    for (
        const symbol in counts
    ) {

        if (
            counts[symbol]
            >= 3
            &&
            counts[symbol]
            > highestCount
        ) {

            winningSymbol =
                symbol;


            highestCount =
                counts[symbol];

        }

    }


    /*
       Kalau menang
    */

    if (winningSymbol) {


        /*
           Hadiah virtual
        */

        const reward =
            highestCount * 10;


        win =
            reward;


        balance +=
            reward;


        /*
           Highlight tile
        */

        reels.forEach(
            reel => {

                const tiles =
                    reel.querySelectorAll(
                        ".tile"
                    );


                tiles.forEach(
                    tile => {

                        if (
                            tile.textContent
                            ===
                            winningSymbol
                        ) {

                            tile.classList.add(
                                "win"
                            );

                        }

                    }
                );

            }
        );


        messageElement.textContent =
            "🎉 KOMBINASI COCOK! +" +
            reward +
            " koin demo";


    } else {


        messageElement.textContent =
            "Belum ada kombinasi. Coba lagi.";

    }


    updateDisplay();


    spinning = false;

    spinButton.disabled = false;

}


/* =====================================================
   RESET
===================================================== */


function resetGame() {

    if (spinning) {
        return;
    }


    balance = 2460;

    bet = 0.40;

    win = 0;


    updateDisplay();


    createBoard();


    messageElement.textContent =
        "Demo berhasil di-reset.";

}


/* =====================================================
   INITIAL DISPLAY
===================================================== */


updateDisplay();