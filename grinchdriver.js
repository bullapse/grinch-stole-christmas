/* Modified version of: http://thecodeplayer.com/walkthrough/html5-game-tutorial-make-a-snake-game-using-html5-canvas-jquery
 * This is a "snake" like game where the grinch runs around the board stealing presents
*/
$(document).ready(function() {
    // setup HTML5 canvas
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();


    // var numPresents = 10;
    var direction;
    var present;
    var score = 0;

    // Hack the highscore to a very big number to cheat
    // TODO STEP #7 (If you made it here, then you're a coder. Coders are cool! :P)
    var highscore = 0;

    // Change the speed to 144
    // TODO STEP #5 This will slow dows the speed
    var speed = 300;

    // Change the size of cell to make the grinch larger
    // SET cell to 30
    // TODO STEP #6 (This will make the grinch and presents larger)
    var cell = 10;

    var grinch;

    function start() {
        direction = "right";

        // First we need to create the grinch
        // TODO STEP #1 (Does the game work yet? Try it by double clicking index.html file.)

        // Next we need to drop a present on the game board
        // TODO STEP #2 (Does the game work yet? Try it by refreshing the index.html file in the browser.)

        // Set the starting score to 0
        // TODO STEP #3 (Does teh game work yet? Nope.)


        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(draw, speed);
    }

    // Now we need to run the program using our start function
    // TODO STEP #4 (Does the game work? Yes! Is the grinch moving fast or slow?)
    // call start()


    function create_grinch() {
        var length = 5;
        grinch = []
        for (var i = length-1; i >= 0; i--) {
            var newPresent = {x : i, y : 0};
            grinch.push(newPresent)
        }
    }

    function drop_present() {
        // drop a present on the map
        present = {
			x: Math.round(Math.random()*(w-cell)/cell),
			y: Math.round(Math.random()*(h-cell)/cell),
		}
    }

    function draw() {
        //To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

        var newx = grinch[0].x;
        var newy = grinch[0].y;

        if(direction == "right") newx++;
		else if(direction == "left") newx--;
		else if(direction == "up") newy--;
		else if(direction == "down") newy++;
        /* Add end cases
         * 1) the grinch ran into the wall
         * 2) the grinch ran into his own presents
        */
        if (newx == -1 || newx >= w/cell || newy == -1 || newy >= h/cell || check_collision(newx, newy, grinch)) {
            start();
            // TODO add start screen to show score
            return;
        }

        /* Have the grinch steal a present
         * eat and drop a present or keep the grinch moving
         */
         if (newx == present.x && newy == present.y) {
             var lastPresent = {x : newx, y : newy};
             score++;
             drop_present();
         } else {
             var lastPresent = grinch.pop()
             lastPresent.x = newx;
             lastPresent.y = newy;
         }

         grinch.unshift(lastPresent)

         var head = grinch[0];
         draw_cell(head.x, head.y, "grinch");
         for (var i = 1; i < grinch.length; i++) {
             var block = grinch[i];
             draw_cell(block.x, block.y, "present");
             console.log("x: " + block.x + "y: " + block.y)
         }
         draw_cell(present.x, present.y, "present");

         //  Update the Score
         if (score > highscore) {
            highscore = score;
         }
         $('#highscore').text('High Score: ' + highscore)
         var score_text = "Presents Stolen: " + score
         $('#score').text(score_text)
    }

    function draw_cell(x, y, type) {
        image = new Image();
        if (type == "grinch")
            image.src = "css/images/grinch.jpg"
        else
            image.src = "css/images/present.png"
        ctx.drawImage(image, x*cell, y*cell, cell, cell)
    }

    function check_collision(x, y, array) {
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
             return true;
        }
        return false;
    }

    //Lets add the keyboard controls now
    $(document).keydown(function(e){
        var key = e.which;
        if(key == "37" && direction != "right") direction = "left";
        else if(key == "38" && direction != "down") direction = "up";
        else if(key == "39" && direction != "left") direction = "right";
        else if(key == "40" && direction != "up") direction = "down";
    })
})
