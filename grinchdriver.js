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
    var cell = 20;
    var numPresents = 10;
    var direction;
    var present;
    var score;

    var grinch

    function start() {
        direction = "right";
        // create the grinch
        grinch = [];
        grinch.push({x:1, y:0});
        present = [];
        // for (var i = 0; i < numPresents; i++)
        drop_present();

        // Set the initial score to 0
        score = 0;

        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(draw, 120);
    }
    start();


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

        switch (direction) {
            case "right":
                newx++;
            case "left":
                newx--;
            case "up":
                newy--;
            case "down":
                newy++;
        }

        /* Add end cases
         * 1) the grinch ran into the wall
         * 2) the grinch ran into his own presents
        */
        if (newx == -1 || newx == w/cell || newy == -1 || newy == h/cell || check_collision(newx, newy, grinch)) {
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
         }
         //for (var i = 0; i < numPresents; i++) {
         draw_cell(present.x, present.y, "present");
         //}
         var score_text = "Presents Stolen: " + score;
         ctx.fillStyle(score_text, 5, h-5);
    }

    function draw_cell(x, y, type) {
        var image = new Image();
        if (type == "grinch")
            image.src = "grinch.jpg"
        else
            image.src = "present.png"
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
        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
    })
})
