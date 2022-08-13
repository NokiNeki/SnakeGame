const r = require('raylib')

const screenWidth = 1020
const screenHeight = 640
const squareSize = 20

const line_color = r.Color(180, 180, 180, 255)
const background_color = r.Color(60, 60, 60, 255)

var game_over = false
var frame_counter = 0 // Move on 10


const fruit = {
    pos : new r.Vector2(),
    x : 0,
    y : 0,
    size : new r.Vector2(),
    color : r.RED
}

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

// Initializes the game
r.InitWindow(screenWidth, screenHeight, "raylib.js Game            MADE BY: Znoki & Pinny~Poo")
r.SetTargetFPS(60)
initialize_vars()


function initialize_vars() {
    game_over = false

    fruit.size = new r.Vector2(squareSize-0.5, squareSize-0.5)
    fruit.x = new_fruit_pos_x(), fruit.y = new_fruit_pos_y() 
    fruit.pos = r.Vector2(fruit.x*squareSize, fruit.y*squareSize)

    snake.x = Math.floor(screenWidth/2/squareSize)
    snake.y = Math.floor(screenHeight/2/squareSize)
    snake.pos = r.Vector2(snake.x*squareSize, snake.y*squareSize)
    snake.size = new r.Vector2(squareSize, squareSize)
    snake.length = 0
    snake.head_color = r.Color(115, 84, 222, 255)
    snake.body_color = r.Color(83, 48, 209, 255)
}


function new_fruit_pos_x() {
    var x = Math.floor(Math.random()*screenWidth / squareSize)
    return x
}

function new_fruit_pos_y() {
    var y = Math.floor(Math.random()*screenHeight / squareSize)
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

function print_body() {
    for (let i = 0; i < snake.length; i++) {
        var x = snake_body_pos[i][0]
        var y = snake_body_pos[i][1]
        r.DrawRectangle(x*squareSize, y*squareSize, squareSize, squareSize, snake.body_color)
    }
}

function death_by_body() {
    for (let i = 0; i < snake.length; i++) {
        var x = snake_body_pos[i][0]
        var y = snake_body_pos[i][1]
        if (snake.x == x) {
            if (snake.y == y) {
                game_over = true
            }
        }
    }
}

function death_by_wall() {
    if (snake.x >= screenWidth/squareSize || snake.x < 0) {
        game_over = true
    }
    if (snake.y >= screenHeight/squareSize || snake.y < 0) {
        game_over = true
    }
}

function death_screen() {
    r.DrawText("You LOST!!!", screenWidth/2-100, screenHeight/2, 100, r.RAYWHITE)
    r.DrawText("Press 'R' to restart", screenWidth/2-100, screenHeight/2+100, 20, r.RAYWHITE)
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
        initialize_vars()
    }
}

function game_update() {
    controls()

    if (game_over) {
        return
    }

    
    if (frame_counter == 10) {

        if (snake.x == fruit.x) {
            if (snake.y == fruit.y) {
                snake.length += 1
                fruit.x = new_fruit_pos_x(), fruit.y = new_fruit_pos_y()
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
        fruit.pos = r.Vector2(fruit.x*squareSize, fruit.y*squareSize)

        frame_counter = -1
    }

    frame_counter += 1
}

function draw_screen() {

    game_update()

    r.BeginDrawing()

    r.ClearBackground(background_color)
    
    // Drawas lines to screen
    if (!game_over) {

        for (let i = 0; i < screenWidth/squareSize; i++) {
            r.DrawLineV(new r.Vector2(squareSize*i, 0), new r.Vector2(squareSize*i, screenHeight), line_color)
        }

        for (let i = 0; i < screenHeight/squareSize; i++) {
            r.DrawLineV(new r.Vector2(0, squareSize*i), new r.Vector2(screenWidth, squareSize*i), line_color) 
        }
    }

    r.DrawText(("Length: " + snake.length), 30, 25, 40, r.Color(120, 120, 250, 150))

    if (!game_over) {
        r.DrawRectangleV(fruit.pos, fruit.size, fruit.color)
        print_body()
        r.DrawRectangleV(snake.pos, snake.size, snake.head_color)
    }

    if (game_over) {
        death_screen()
    }

    r.EndDrawing()
}



// Game Loop
while (!r.WindowShouldClose()) {
    draw_screen()
    // if (game_over) {
    //     break
    // }
}
r.CloseWindow()