/* Modified version of: http://thecodeplayer.com/walkthrough/html5-game-tutorial-make-a-snake-game-using-html5-canvas-jquery
 * This is a "snake" like game where the grinch runs around the board stealing presents
*/
$(document).ready(function() {
    // setup HTML5 canvas
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    // set the cell width
    var cell = 30;
    // var numPresents = 10;
    var direction;
    var present;
    var score = 0;
    var highscore = 0;
    var speed = 144;

    var grinch

    function start() {
        direction = "right";
        // create the grinch
        create_grinch();
        // for (var i = 0; i < numPresents; i++)
        drop_present();

        // Set the initial score to 0
        score = 0;

        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(draw, speed);
    }
    start();

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
        // present.push(newPresent);
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
        //  for (var i = 0; i < numPresents; i++) {
         if (newx == present.x && newy == present.y) {
             var lastPresent = {x : newx, y : newy};
             score++;
            // console.log("Score: " + score)
             drop_present();
         } else {
             var lastPresent = grinch.pop()
             lastPresent.x = newx;
             lastPresent.y = newy;
         }
        //  }

         grinch.unshift(lastPresent)

         var head = grinch[0];
         draw_cell(head.x, head.y, "grinch");
         for (var i = 1; i < grinch.length; i++) {
             var block = grinch[i];
             draw_cell(block.x, block.y, "present");
             console.log("x: " + block.x + "y: " + block.y)
         }
         //for (var i = 0; i < numPresents; i++) {
         draw_cell(present.x, present.y, "present");
         //}
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
