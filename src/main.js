const r = require('raylib')
const fs = require('fs')


// Variables --------------------------------

var score = {'highscore':0}
score.highscore = JSON.parse(fs.readFileSync('scores.json'))

const screenWidth = 820
const screenHeight = 640
const top_border = 100
const squareSize = 20

const line_color = r.Color(180, 180, 180, 255)
const background_color = r.Color(60, 60, 60, 255)
const top_border_color = r.Color(40, 40, 40, 255)

var game_over = false
var speed_check = 0 // Move on 10
var speed = 1


var fruit_count = 200;

const fruit = {
    pos : new r.Vector2(),
    x : 0,
    y : 0,
    size : new r.Vector2(),
    color : r.RED
}

var fruit_array = []


const snake = {
    pos : new r.Vector2(),
    x : 0,
    y : 0,
    size : new r.Vector2(),
    length : 0,
    head_color : r.color,
    body_color : r.color,
    direction : 0 // 0 = right, 1 = left, 2 = up, 3 = down
}

const snake_body_pos = []

// Initializes the game --------------------------------

r.InitWindow(screenWidth, screenHeight, "raylib.js Game            MADE BY: Znoki & Pinny~Poo & Koki")
r.SetTargetFPS(60)
init_vars()


// Game Loop --------------------------------

while (!r.WindowShouldClose()) {
    game_update()
    draw_screen()
}
r.CloseWindow()




// Functions --------------------------------

function init_vars() {
    game_over = false

    for (var i = 0; i < fruit_count; i++) {
        fruit_array[i] = JSON.parse(JSON.stringify(fruit))
    }

    for (var i = 0; i < fruit_array.length; i++) {
        fruit_array[i].size = new r.Vector2(squareSize-0.5, squareSize-0.5)
        fruit_array[i].x = new_fruit_pos_x(), fruit_array[i].y = new_fruit_pos_y() 
        fruit_array[i].pos = r.Vector2(fruit_array[i].x*squareSize, fruit_array[i].y*squareSize)
    }
    
    speed = 1

    snake.x = Math.floor(screenWidth/2/squareSize)
    snake.y = Math.floor(screenHeight/2/squareSize)
    snake.pos = r.Vector2(snake.x*squareSize, snake.y*squareSize)
    snake.size = new r.Vector2(squareSize, squareSize)
    snake.length = 0
    snake.head_color = r.Color(115, 84, 222, 255)
    snake.body_color = r.Color(83, 48, 209, 255)
}

function update_highscore(new_score) {
    score.highscore = new_score
    fs.writeFileSync('scores.json', JSON.stringify(score.highscore))
}

function new_fruit_pos_x() {
    while (true) {
        var x = Math.floor(Math.random()*screenWidth / squareSize)
        for (const body in snake_body_pos) {
            if (x == body.x) {
                continue
            }
        }
        for (const piece in fruit_array) {
            if (x == piece.x) {
                continue
            }
        }
        break
    }
    return x
}

function new_fruit_pos_y() {
    while (true) {
        var y = Math.floor(((Math.random()*(screenHeight-top_border))+top_border) / squareSize)
        for (const body in snake_body_pos) {
            if (y == body.y) {
                continue
            } 
        }
        for (const piece in fruit_array) {
            if (y == piece.y) {
                continue
            }
        }
        break
    }
    return y
}

function update_body() {
    for (let i = snake.length; i > 0; i--) {
        if (i == 1) {
            snake_body_pos[0] = [snake.x, snake.y]
        } else {
            snake_body_pos[i-1] = snake_body_pos[i-2]
        }
    }
}

function display_snake_body() {
    for (let i = 0; i < snake.length; i++) {
        try {
            var x = snake_body_pos[i][0]
            var y = snake_body_pos[i][1]
            r.DrawRectangle(x*squareSize, y*squareSize, squareSize, squareSize, snake.body_color)
        } catch(err) {}
    }
}

function death_by_body() {
    for (let i = 0; i < snake.length; i++) {
        try {
            var x = snake_body_pos[i][0]
            var y = snake_body_pos[i][1]
            if (snake.x == x) {
                if (snake.y == y) {
                    game_over = true
                    if (snake.length > score.highscore) {
                        update_highscore(snake.length)
                    }
                }
            }
        } catch(err) {console.log(err)}
    }
}

function death_by_wall() {
    if (snake.x >= screenWidth/squareSize || snake.x < 0) {
        game_over = true
        if (snake.length > score.highscore) {
            update_highscore(snake.length)
        }
    }
    if (snake.y >= screenHeight/squareSize || snake.y < top_border/squareSize) {
        game_over = true
        if (snake.length > score.highscore) {
            update_highscore(snake.length)
        }
    }
}

function death_screen() {
    r.DrawText("You LOST!!!", screenWidth/2-100, screenHeight/2, 100, r.RAYWHITE)
    r.DrawText("Press 'R' to restart", screenWidth/2-100, screenHeight/2+100, 20, r.RAYWHITE)
}

function draw_grid() {
    for (let i = 0; i < screenWidth/squareSize; i++) {
        r.DrawLineV(new r.Vector2(squareSize*i, 0), new r.Vector2(squareSize*i, screenHeight), line_color)
    }

    for (let i = 0; i < screenHeight/squareSize; i++) {
        r.DrawLineV(new r.Vector2(0, squareSize*i), new r.Vector2(screenWidth, squareSize*i), line_color) 
    }
}

function controls() {
    if (r.IsKeyDown(r.KEY_RIGHT)) {
        if (snake.direction != 1) {
            snake.direction = 0
        }
    }
    if (r.IsKeyDown(r.KEY_LEFT)) {
        if (snake.direction != 0) {
            snake.direction = 1
        }
    }
    if (r.IsKeyDown(r.KEY_UP)) {
        if (snake.direction != 3) {
            snake.direction = 2
        }
    }
    if (r.IsKeyDown(r.KEY_DOWN)) {
        if (snake.direction != 2) {
            snake.direction = 3
        }
    }

    if (r.IsKeyPressed(r.KEY_R)) {
        init_vars()
    }
}

function game_update() {
    controls()

    if (game_over) {
        return
    }

    
    if (speed_check >= 10) {

        for (var i = 0; i < fruit_array.length; i++) {
            if (snake.x == fruit_array[i].x) {
                if (snake.y == fruit_array[i].y) {
                    snake.length += 1
                    fruit_array[i].x = new_fruit_pos_x(), fruit_array[i].y = new_fruit_pos_y()
                }
            }
        }

        update_body()
        switch(snake.direction) {
            case 0: 
                snake.x += 1
                break
            case 1:
                snake.x -= 1
                break
            case 2:
                snake.y -= 1
                break
            case 3:
                snake.y += 1
                break
        }
        death_by_body()
        death_by_wall()

        snake.pos = r.Vector2(snake.x*squareSize, snake.y*squareSize)
        for (var i = 0; i < fruit_array.length; i++) {
            fruit_array[i].pos = r.Vector2(fruit_array[i].x*squareSize, fruit_array[i].y*squareSize)
        }

        if (speed < 3.3) {
            speed += 0.001
        }
        speed_check = -1
    }

    speed_check = speed_check + speed
}

function draw_screen() {
    r.BeginDrawing()

    r.ClearBackground(background_color)
    
    // Draws lines to screen
    if (!game_over) {
        draw_grid()
    }

    
    if (!game_over) {
        for (var i = 0; i < fruit_array.length; i++) {
            r.DrawRectangleV(fruit_array[i].pos, fruit_array[i].size, fruit_array[i].color)
        }
        display_snake_body()
        r.DrawRectangleV(snake.pos, snake.size, snake.head_color)
        
        r.DrawRectangle(0, 0, screenWidth, top_border, top_border_color)
    }

    r.DrawText(("Length: " + snake.length), 30, 25, 40, r.Color(120, 120, 250, 200))
    r.DrawText(("HighScore: " + score.highscore), 400, 25, 40, r.Color(120, 120, 250, 200))
    r.DrawText(("Speed: " + speed.toFixed(3)), 30, 80, 15, r.Color(120, 120, 250, 200))
    
    if (game_over) {
        death_screen()
    }

    r.EndDrawing()
}