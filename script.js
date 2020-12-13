var canvas = document.getElementById("myCanvas")
var brush = canvas.getContext("2d")

var scorString = document.getElementById("scor")
var scor = 0
scorString.innerHTML = scor

var images = []
for(var i = 0; i < 14; i++) {
    images.push(new Image())
}

{
images[0].src = 'Photos/headUp.png'
images[1].src = 'Photos/headRight.png'
images[2].src = 'Photos/headDown.png'
images[3].src = 'Photos/headLeft.png'
images[4].src = 'Photos/bodyV.png'
images[5].src = 'Photos/bodyH.png'
images[6].src = 'Photos/turn<^.png'
images[7].src = 'Photos/turn^>.png'
images[8].src = 'Photos/turnv>.png'
images[9].src = 'Photos/turn<v.png'
images[10].src = 'Photos/tailUp.png'
images[11].src = 'Photos/tailRight.png'
images[12].src = 'Photos/tailDown.png'
images[13].src = 'Photos/tailLeft.png'
}

var isbotOn = true

function botMode() {
    isbotOn = true
}

function regilerMode() {
    isbotOn = false
}

var Counter = function(num, direction) {
    this.num = num
    this.countNum = 0;
    this.direction = direction

    this.count = function() {
        limit = (this.countNum < num) 
        if(limit){
            this.countNum++
        }
        return limit
    }

    this.addSquad = function() {
        num++
    }
}

var Snake = function() {
    this.snakeLength = 5
    this.direction = 0
    this.vertebrae = new Array()
    this.turns = new Array()

    for(i = 0; i < this.snakeLength; i++) {
        this.vertebrae.push(new Square(200, 400 + (i * 20), i == 0))
    }

    this.getHeadX = function() {
        return this.vertebrae[0].placeX
    }

    this.getHeadY = function() {
        return this.vertebrae[0].placeY
    }

    this.getSize = function() {
        return this.vertebrae[0].size
    }

    this.moveSnake = function() {
        for(x of this.vertebrae) {
            x.moveSquare()
        }
    }

    this.drawSnake = function() {

        var i = -1
        for(x of this.vertebrae) {
            if(i == -1) {
                x.drawSquare(5,0)
            } else if(i + 2 == this.vertebrae.length){
                x.drawSquare(this.vertebrae[i].direction,1)
            } else {
                x.drawSquare(this.vertebrae[i].direction,2)
            }
            i++
        }
    }
    this.directSnake = function(dir) {
        if((this.direction == 0 && dir != 2 && dir != 0) ||
        (this.direction == 1 && dir != 3 && dir != 1) ||
        (this.direction == 2 && dir != 0 && dir != 2) ||
        (this.direction == 3 && dir != 1 && dir != 3)) {
            this.direction = dir
            this.turns.push(new Counter(this.vertebrae.length, this.direction))
        }
    }

    this.turnSnake = function() {
        var isOut = false
        for(x of this.turns) {
            if(x.count()) {
                this.vertebrae[x.countNum - 1].directSquare(x.direction)
            } else {
                isOut = true
            }
        }
        if(isOut) {
            this.turns.shift()
        }
    }

    this.addChain = function() {
        this.snakeLength++
        x = this.vertebrae[this.vertebrae.length -1].placeX
        y = this.vertebrae[this.vertebrae.length -1].placeY
        var dir = this.vertebrae[this.vertebrae.length -1].direction
        if(dir == 0) {
            this.vertebrae.push(new Square(x,y + 20))
        } else if(dir == 1) {
            this.vertebrae.push(new Square(x - 20,y))
        } else if(dir == 2) {
            this.vertebrae.push(new Square(x,y - 20))
        } else if(dir == 3) {
            this.vertebrae.push(new Square(x + 20,y))
        }
        this.vertebrae[this.vertebrae.length -1].directSquare(dir)
        for(x of this.turns) {
            x.addSquad()
        }
    }

    this.checkBodyPlace = function(x,y) {
        for(i = 1; i < this.vertebrae.length; i++) {
            if(this.vertebrae[i].placeX == x && this.vertebrae[i].placeY == y) {
                return true
            }
        }
        return false
    }
    
    this.checkBodyCollision = function() {
        var headX =  this.vertebrae[0].placeX
        var headY =  this.vertebrae[0].placeY

        return this.checkBodyPlace(headX, headY)
    }
}


var Square = function(x, y, isHead) {

        this.size = 20;
        this.placeX = x;
        this.placeY = y;
        var imageIndex


        this.direction = 0

        this.getImage = function(piec , d) {
            if(piec == 0) {
                switch(d) {
                    case 0:
                        imageIndex =  0
                        break 
                    case 1:
                        imageIndex =  1
                        break
                    case 2:
                        imageIndex =  2
                        break
                    case 3:
                        imageIndex =  3
                    }
            } else if(piec == 1) {
                if(d == 0) {
                    imageIndex =  4
                } else {
                    imageIndex =  5
                }
            } else if(piec == 2){
                switch(d) {
                    case 0:
                        //<^
                        imageIndex =  6
                        break
                    case 1:
                        //^>
                        imageIndex =  7
                        break
                    case 2:
                        //v>
                        imageIndex =  8
                        break  
                    case 3:
                        //<v
                        imageIndex =  9
                        break                  
                }
            } else {
                switch(d) {
                    case 0:
                        //<^
                        imageIndex =  10
                        break
                    case 1:
                        //^>
                        imageIndex =  11
                        break
                    case 2:
                        //v>
                        imageIndex =  12
                        break  
                    case 3:
                        //<v
                        imageIndex =  13
                        break                  
                }  
            }
        }

        this.drawSquare = function(d, p) {
            brush.beginPath()
            // brush.rect( this.placeX, this.placeY, this.size, this.size)
            if(p == 0) {
                this.getImage(0,this.direction)
            } else if(d == this.direction){
                if(p == 1) {
                    this.getImage(3,this.direction)
                } else {
                    this.getImage(1, this.direction % 2)
                }
            } else {
                if(p == 1) {
                    this.getImage(3,d)

                } else if(this.direction == 1) {
                    if(d == 0) {
                        this.getImage(2,0)
                    } else {
                        this.getImage(2,3)
                    }
                } else if(this.direction == 0) {
                    if(d == 1) {
                        this.getImage(2,2)
                    } else {
                        this.getImage(2,3)
                    }
                } else if(this.direction == 2) {
                    if(d == 1) {
                        this.getImage(2,1)
                    } else {
                        this.getImage(2,0)
                    }  
                } else if(this.direction == 3){
                    if(d == 0) {
                        this.getImage(2,1)
                    } else {
                        this.getImage(2,2)
                    }  
                }
            }
            brush.drawImage(images[imageIndex], this.placeX, this.placeY);
            // brush.rec(this.placeX, this.placeY, 20, 20)
            brush.closePath()
        }
        this.directSquare = function(dir){
            this.direction = dir
        }

        this.moveSquare = function() {
            if(this.direction == 0) {
                this.placeY -= this.size
            } else if(this.direction == 1) {
                this.placeX += this.size
            } else if(this.direction == 2) {
                this.placeY += this.size
            } else if(this.direction == 3) {
                this.placeX -= this.size
            }
        //  console.log(this.direction)
        }
}

var Apple = function(x, y) {
    this.size = 20;
    this.placeX = x
    this.placeY = y

    this.setPlace = function(x, y) {
        this.placeX = x
        this.placeY = y
    }

    this.drawApple = function() {
        brush.beginPath()
        brush.arc(this.placeX + 10, this.placeY + 10, 10, 0, Math.PI * 2)
        brush.fillStyle = "red"
        brush.fill()
        brush.closePath()
    }
}

var snake = new Snake()

var bordDiv = 500 /20
var apple = new Apple(Math.floor(Math.random() * bordDiv) * 20, Math.floor(Math.random() * bordDiv) * 20)
// console.log("{" + apple.placeX + "," + apple.placeY + "}," + appleCount)
// var apple = new Apple(60, 320)


function checkCollision(x, y) {
    var bodyHit = snake.checkBodyCollision()
    var hit = (x < 0 ||
            y < 0 ||
            x + snake.getSize() > canvas.clientWidth ||
            y + snake.getSize() > canvas.clientHeight); 
            return hit || bodyHit
}

function restart(bool) {
    if(!bool) {
        return
    }
    alert("game over \n your scor is:  " + scor)
    document.location.reload()
    clearInterval(interval) 
}

function placeApple() {
    var x = Math.floor(Math.random() * bordDiv) * 20
    var y = Math.floor(Math.random() * bordDiv) * 20
    while(snake.checkBodyPlace(x,y)) {
            x = Math.floor(Math.random() * bordDiv) * 20
            y = Math.floor(Math.random() * bordDiv) * 20
    }
    apple.setPlace(x,y)
}

var appleCount = 0
function eat() {
    var headX = snake.getHeadX()
    var headY = snake.getHeadY() 
    var appleX = apple.placeX
    var appleY = apple.placeY
    if(headX == appleX && headY == appleY) {
        if(appleCount == 1) {
            apple.setPlace(480, 200)
        } else if(appleCount == 2){
            apple.setPlace(100, 480)
        } else {
            placeApple()
        }
        snake.addChain()
        scorString.innerHTML = ++scor
        appleCount++
        // console.log("{" + apple.placeX + "," + apple.placeY + "}," + appleCount)
    }
}

var num = 0

var dir = 0

var Bot1 = function() {
    this.count = 0

    this.getGap = function(x, y, c, p) {
        var gapX = 1, gapY = 1, constX, constY, boundX, boundY, pushX = 0, pushY = 0


        switch (p) {
            case 0:
                pushY = -20
                break;
            case 1:
                pushX = 20
                break;
            case 2:
                pushY = 20
                break;        
            default:
                pushX = -20
                break;
        }

        switch(c) {
            case 0:
                constX = -20
                constY = -20 
                boundX = 0
                boundY = 0
                break
            case 1:
                constX = 20
                constY = -20 
                boundX = canvas.clientWidth
                boundY = 0
                break   
            case 2:
                constX = 20
                constY = 20 
                boundX = canvas.clientWidth
                boundY = canvas.clientHeight
                break  
            case 3:
                constX = -20
                constY = 20 
                boundX = 0
                boundY = canvas.clientHeight
                break  
        }

        var wall = true
        
        for(var i = y; i >= 0 && i < canvas.clientHeight; i += constY) {
            if(snake.checkBodyPlace(x + pushX, i)) {
                wall = false
                break
            }
            // console.log("yyyyyyyyyyyyyyyyy  " + gapY)
            gapY++
        }


        for(var i = x; i >= 0 && i < canvas.clientWidth; i += constX) {
            if(snake.checkBodyPlace(i, y + pushY)) {
                wall = false
                break
            }
            // console.log("xxxxxxxxxxxxxxxxx  " + gapX)
            gapX++
        }

        if(x + pushX >= canvas.clientWidth || x + pushX < 0) {
            gapX = 1
            wall = false
        }

        if(y + pushY >= canvas.clientHeight || y + pushY < 0) {
            gapY = 1
            wall = false
        }

        return [(gapX + gapY) / 2, wall]

    }

    this.play = function() {

        var headX = snake.getHeadX()
        var headY = snake.getHeadY()
        var appleX = apple.placeX
        var appleY = apple.placeY

        if(snake.direction == 1) {
            
            if(snake.checkBodyPlace(headX + 20, headY) || headX + 20 == canvas.clientWidth) {

                var up = this.getGap(headX, headY, 0, 0)
                var down = this.getGap(headX, headY, 3, 2)

                if((up[1] && down[1]) || (!up[1] && !down[1])) {
                    if(up[0] >= down[0]) {
                        dir = 0
                    } else {
                        dir = 2
                    }
                } else if(up[1]) {
                    dir = 0
                } else {
                    dir = 2
                }

            } else if(headX >= appleX) {
                if(headY < appleY && !snake.checkBodyPlace(headX, headY + 20)) {
                    dir = 2
                } else if(headY > appleY && !snake.checkBodyPlace(headX, headY - 20)) {
                    dir = 0
                }
            }
        } else if(snake.direction == 3) {

            if(snake.checkBodyPlace(headX -20, headY) || headX - 20 == 0) {

                var up = this.getGap(headX, headY, 1, 0)
                var down = this.getGap(headX, headY, 2, 2)

                if((up[1] && down[1]) || (!up[1] && !down[1])) {
                    if(up[0] >= down[0]) {
                        dir = 0
                    } else {
                        dir = 2
                    }
                } else if(up[1]) {
                    dir = 0
                } else {
                    dir = 2
                }

            } else if(headX <= appleX) {
                if(headY < appleY && !snake.checkBodyPlace(headX, headY + 20)) {
                    dir = 2
                } else if(headY > appleY && !snake.checkBodyPlace(headX, headY - 20)) {
                    dir = 0
                }
            }
        } else if(snake.direction == 0) {
            if(snake.checkBodyPlace(headX, headY - 20) || headY - 20 == 0) {

                var right = this.getGap(headX, headY, 2, 1)
                var left = this.getGap(headX, headY, 3, 3)

                if((right[1] && left[1]) || (!right[1] && !left[1])) {
                    if(right[0] >= left[0]) {
                        dir = 1
                    } else {
                        dir =3
                    }
                } else if(right[1]) {
                    dir = 1
                } else {
                    dir = 3
                }

            } else if(headY <= appleY) {
                if(headX < appleX && !snake.checkBodyPlace(headX + 20, headY)) {
                    dir = 1
                } else if(headX > appleX && !snake.checkBodyPlace(headX -20, headY)) {
                    dir = 3
                }           
            }
        } else if(snake.direction == 2) {
            if(snake.checkBodyPlace(headX, headY + 20) || headY + 20 == canvas.clientHeight) {

                var right = this.getGap(headX, headY, 1, 1)
                var left = this.getGap(headX, headY, 0, 3)

                if((right[1] && left[1]) || (!right[1] && !left[1])) {
                    if(right[0] >= left[0]) {
                        dir = 1
                    } else {
                        dir =3
                    }
                } else if(right[1]) {
                    dir = 1
                } else {
                    dir = 3
                }
            } else if(headY >= appleY) {
                if(headX < appleX && !snake.checkBodyPlace(headX + 20, headY)) {
                    dir = 1
                } else if(headX > appleX && !snake.checkBodyPlace(headX -20, headY)) {
                    dir = 3
                }
            }
        }
        this.count++
    }
}

var bot = new Bot1()

var count = 0

function draw() {

    brush.clearRect(0,0, canvas.clientWidth, canvas.clientHeight)
    brush.clearRect(0,0, canvas.clientWidth, canvas.clientHeight)
    snake.directSnake(dir);
    restart(checkCollision(snake.getHeadX(),snake.getHeadY()))
    snake.turnSnake()
    snake.moveSnake();
    snake.drawSnake()
    eat()
    apple.drawApple()
    if(isbotOn) {
        bot.play()
    }

    // if(dir == 0) {
    //     console.log("up   " + snake.getHeadX() / 20 + " , " + snake.getHeadY() / 20)
    // } else if(dir == 1) {
    //     console.log("right   " + snake.getHeadX() / 20 + " , " + snake.getHeadY() / 20)
    // } else if(dir == 2) {
    //     console.log("down   " + snake.getHeadX() / 20 + " , " + snake.getHeadY() / 20)
    // } else if(dir == 3) {
    //     console.log("left   " + snake.getHeadX() / 20 + " , " + snake.getHeadY() / 20)
    // }
    console.log(count)
    count++
}

document.addEventListener("keydown", keyDown, false)

function legalMove(num) {
    if(((dir == 0 && num != 2 && num != 0) ||
    (dir == 1 && num != 3 && num != 1) ||
    (dir == 2 && num != 0 && num != 2) ||
    (dir == 3 && num != 1 && num != 3))) {
        dir = num
        return true
    }
    return false
}

function keyDown(e) {
    isbotOn = false
    if(e.key == "Up" || e.key == "ArrowUp") {
        legalMove(0)
    } else if(e.key == "Right" || e.key == "ArrowRight") {
        legalMove(1)
    } else if(e.key == "Down" || e.key == "ArrowDown") {
        legalMove(2)
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
        legalMove(3)
    } else if(e.code == "Space") {
        isbotOn = true
    }

}

// draw()
var interval = setInterval(draw, 50)