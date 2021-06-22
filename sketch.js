let egg;
let hatch;
let openedMouth;
let closedMouth;
let iLoveOrange;
let orange;
let mushroom;
let Tmad;
let full;
let hungry;
let looksGood;
//이미지

let myTokomon;
let foods = [];
//class

let stage = 0; //0;시작 1;인트로화면3초 2; 게임화면 3;배부른엔딩 4;배고픈엔딩
let mouth = false;
let startClick = false;
let totalO = 0;
let timer = 15;
let rnd;
let areMoving = [];
let hadSwitch = false;
let isEatingO = 0;

function preload() {
    egg = loadImage('tokomonImages/egg.png');
    hatch = loadImage('tokomonImages/hatching.png');
    openedMouth = loadImage('tokomonImages/openedmouth.PNG');
    closedMouth = loadImage('tokomonImages/closedmouth.PNG');
    iLoveOrange = loadImage('tokomonImages/iloveorange.PNG');
    orange = loadImage('tokomonImages/orange.PNG');
    mushroom = loadImage('tokomonImages/mushroom.PNG');
    Tmad = loadImage('tokomonImages/mad.jpeg');
    full = loadImage('tokomonImages/full.png');
    hungry = loadImage('tokomonImages/hungry.png');
    looksGood = loadImage('tokomonImages/looksgood.png');
}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.position ('fixed');
    imageMode(CENTER);
    myTokomon = new Tokomon;
    
    for (let i = 0; i < 10; i++) {
        rnd = floor(random(2));
        if (rnd > 0) {
            totalO++;
        }
        foods[i] = new Food(rnd);
    }
    console.log(totalO);
}

function draw() {
    background(255);
    textSize(20);
    textAlign(CENTER, CENTER)
    let d = dist(mouseX, mouseY, windowWidth / 2, windowHeight / 2);
    let sumSelecting = 0;
    let sumOrange = 0;
    
    if (stage == 0) {
        image(egg, windowWidth / 2, windowHeight / 2, 75, 100);
        text('부화하고 싶다..', windowWidth / 2, windowHeight / 2 + 100); //시작화면

        if (d < 100) {
            if (mouseIsPressed) {
                image(hatch, windowWidth / 2, windowHeight / 2, 75, 100);
                startClick = true;
            }
        }
        if (!mouseIsPressed && startClick) {
            background(255);
            image(closedMouth, windowWidth / 2, windowHeight / 2, 150, 150); //스타트 눌렀을 때
            textSize(20);
            text('아싸!', windowWidth / 2, windowHeight / 2 + 100);
            setTimeout(goToStage1, 2000);
        }

    } else if (stage == 1) {
        image(looksGood, windowWidth / 2, windowHeight / 2, windowWidth, windowWidth * 0.75);
        textSize(20);
        text('오렌지..맛있겠다..', windowWidth / 2 , windowHeight * 0.8);
        setTimeout(goToStage2, 2500);

    } else if (stage == 2) { //게임화면
        myTokomon.display();
        gameTime();
        for (let i = 0; i < 10; i++) {
            if (!foods[i].taken) {
                foods[i].display();
            } else {
                if (foods[i].kind == 1) {
                    sumOrange++;
                }
            }
            if (foods[i].isMoving) {
                areMoving[i] = 1;
            } else {
                areMoving[i] = 0;
            }
            sumSelecting += areMoving[i];
            if (sumSelecting < 2) {
                foods[i].move();
            }
        }
        console.log(sumOrange);
        if (sumOrange == totalO) {
            stage = 3;
        }

    } else if (stage == 3) {
        image(full, windowWidth / 2, windowHeight / 2, windowWidth, windowWidth * 0.7);
        textSize(25);
        text('배불러..', windowWidth / 2, windowHeight * 0.8);

    } else if (stage == 4) {
        image(hungry, windowWidth / 2, windowHeight / 2, windowWidth, windowWidth * 0.7);
        textSize(25);
        fill(0);
        text('배고파..', windowWidth / 2, windowHeight * 0.8);
    }
}

function goToStage1() {
    stage = 1;
}

function goToStage2() {
    stage = 2;
}

function gameTime() {
    textSize(20);
    text("밥시간", windowWidth / 2, windowHeight / 10 - 25);
    text(timer, windowWidth / 2, windowHeight / 10);
    if (frameCount % 60 == 0 && timer > 0) {
        timer--;
    }
    if (timer == 0) {
        stage = 4;
    }

}



//게임 시작하기
class Tokomon {
    constructor() {
    }
    
    display() {
        background(255);

        if (hadSwitch) {
            if (isEatingO == 1) {
                image(iLoveOrange, windowWidth / 2, windowHeight / 2, 150, 150);
            } else {
                image(Tmad, windowWidth / 2, windowHeight / 2, 200, 200);
            }
        } else {
            if (!mouth) {
                image(closedMouth, windowWidth / 2, windowHeight / 2, 110, 110);
            } else {
                image(openedMouth, windowWidth / 2, windowHeight / 2, 120, 160);
            }
        }
    }
}


class Food {
    constructor(_kind) {
        this.kind = _kind; //0 -> 버섯, 1 -> 오렌지
        this.x = random(25, width - 25);
        this.y = random(25, height - 25);
        this.foodSize = 60;
        this.d;
        this.taken = false;

        this.xOffset = mouseX - this.x;
        this.yOffset = mouseY - this.y;
        this.overOrange = false;
        this.overMushroom = false;

        this.locked = false;

        this.isPressed = false;
        this.isMoving = false;
    }

    display() {
        if (!this.taken) {
            if (this.kind == 0) {
                image(mushroom, this.x, this.y, this.foodSize, this.foodSize);
            } else if (this.kind == 1) {
                image(orange, this.x, this.y, this.foodSize, this.foodSize);
            }
        }
    }

    move() {
        this.d = dist(mouseX, mouseY, this.x, this.y);
        this.dT = dist(mouseX, mouseY, width / 2, height / 2);
        if (!this.taken && !hadSwitch) {
            if (this.d < 40) { //food에 마우스 올리면
                // this.foodSize = 55;
                if (mouseIsPressed) { //food누르면
                    this.x = mouseX;
                    this.y = mouseY;
                    this.isMoving = true;
                    this.foodSize = 65;
                    if (this.dT < 50) { //food를 토코몬에 가져다대면
                        mouth = true;
                        this.isPressed = true;
                    } else {
                        mouth = false;
                    }
                } else {
                    // this.foodSize = 55;
                    this.isMoving = false;
                }
            } else {
                this.foodSize = 60;
                this.isMoving = false;
            }
        }
        if (!mouseIsPressed && this.isPressed && mouth && !this.taken) { //food를 토코몬에서 놓으면
            hadSwitch = true;
            setTimeout(hadFoods(this.kind), 1000);
            this.isMoving = false;
            this.taken = true;
        }
    }
}

function hadFoods(k) {
    let kind = k;
    mouth = false;
    if (kind == 1) {
        isEatingO = 1;
    } else if (kind == 0) {
        isEatingO = 0;
    }
    hadSwitch = true;
    setTimeout(finishEat, 1000);
}

function finishEat() {
    hadSwitch = false;
}