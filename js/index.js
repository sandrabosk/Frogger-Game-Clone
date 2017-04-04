
(function(){

//defines frog's start position, dimensions and image on sprite map
var frog_controller = {
    x: 170,
    y: 503,
    width:23,
    height:17,
    image: [12, 369, 23, 17]
};

//the array of different models of cars
var models = [
    {width: 30, height: 22, dir: 1},
    {width: 29, height: 24, dir: -1},
    {width:24, height: 26, dir: 1},
    {width: 24, height: 21, dir: -1}
];

//the array of logs, first to last: longest, turtles, medium, shortest
var lengths = [{width: 179, height: 21},
    {width: 73, height: 28},
    {width: 118, height: 21},
    {width: 85, height: 22},
];

//the array of rows on the board, from bottom to the top, difference between them is 30px
var rows = [473, 443, 413, 383, 353, 323, 288, 263, 233, 203, 173, 143, 113];
var context = null;

var start_game = function() {

  game = new Game();

  $("body").on("keydown", function(event){

//assigning functions to the keys which allow moving of the frog
     var key = event.which;

     if (game.lives===0) {
        key.preventDefault();
     }

       if (key === 38){
       up();
     }

       if (key === 40){
       down();
     }

      if (key === 37){
       left();
   }

       if (key === 39){
       right();
   }
   });


  board = document.getElementById('game');
  context = board.getContext('2d');
  sprites = new Image();
  deadsprite = new Image();
    sprites.src = 'images/frogger_sprites.png';
    deadsprite.src = 'images/dead_frog.png';
    sprites.onload = function() {
      draw_bg();
      draw_info();
      make_cars();
      make_logs();
      draw_frog();
        setInterval(game_loop, 100);
    };
  };

//game_loop is a function that's been called onload and executes 10 times per second
//it consists of all draw functions used in the code
  var game_loop = function() {
    draw_bg();
    draw_info();
    draw_cars();
    draw_logs();
    if (game.lives > 0) {
        draw_frog();
    } else {
        game_over();
    }
  };

  var draw_bg = function() {
    context.fillStyle = '#191970';
    context.fillRect(0,0,399,288);
    context.fillStyle = '#000000';
    context.fillRect(0,288,399,283);
    context.drawImage(sprites, 0, 0, 399, 53, 20, 0, 399, 53);
    context.drawImage(sprites, 0, 47, 399, 60, 0, 47, 399, 60);
    context.drawImage(sprites, 0, 119, 399, 34, 0, 288, 399, 34);
    context.drawImage(sprites, 0, 119, 399, 34, 0, 495, 399, 34);
};

//checking if the frog is on the log or on the turtle
function onLog(){
  var onLog = false;
  logs.forEach(function(eachLog){
      if ((frog_controller.x >= eachLog.posX)&&(frog_controller.x <= eachLog.posX + eachLog.width) &&(frog_controller.y === eachLog.posY)){
    onLog = true;
  }
});
return onLog;
}


var change = true;
var draw_frog = function () {
  if (change) {
      context.drawImage(sprites, frog_controller.image[0], frog_controller.image[1], frog_controller.image[2], frog_controller.image[3], frog_controller.x, frog_controller.y, 23, 17);
    }
    else {
      (context.drawImage(deadsprite, 4, 2, 19, 24, frog_controller.x, frog_controller.y, 19, 24));
      game.reset();
      game.lives--;
      if (game.lives >= 1){
        fadeOut('WATCH OUT!!!');
      }
    }

    if ((frog_controller.y < 280) && (frog_controller.y > 113) && (onLog()===false)) {
    context.drawImage(deadsprite, 4, 2, 19, 24, frog_controller.x, frog_controller.y, 19, 24);
      // var what1 = setTimeout(function() {
        game.reset();
        // clearInterval(what1);
      // },50);
      game.lives--;
      if (game.lives >= 1){
        fadeOut('OOOOOPS!!');
        }
      }
      check_win();
};

var draw_info = function() {
    draw_lives();
      context.font = 'bold 14pt arial';
      context.fillStyle = '#00EE00';
      context.fillText('Level ', 74, 545);
      draw_level();
      context.fillText('Score: ', 4, 560);
      context.fillText('Highscore: ', 170, 560);
    draw_score();
};

var draw_lives = function() {
    var x = 4;
    var y = 530;
    for (var i = 0; i<game.lives; i++){
        context.drawImage(sprites, 13, 334, 17, 23, x, y, 11, 15);
        x += 14;
  }};

var draw_level = function() {
    context.font = 'bold 14pt arial';
    context.fillStyle = '#00EE00';
    context.fillText(game.level, 131, 545);
};

var draw_score = function() {
    context.font = 'bold 10pt arial';
    context.fillStyle = '#00EE00';
    context.fillText(game.score, 69, 560);
    if (window.localStorage.highscore) {
      //window.localStorage.clear();
        highscore = localStorage.highscore;
    } else highscore = 0;
    context.fillText(highscore, 272, 560);
};

var draw_cars = function() {
    for (var i=0; i< cars.length; i++) {
        cars[i].move();
        cars[i].detect_collision();
        cars[i].draw_car();
        if (cars[i].collision > 1) {
          change = false;
          cars[i].collision = 0;
      }
    }
};

var draw_logs = function() {
    for (var i=0; i< 11; i++) {
        logs[i].move();
        logs[i].detectcollision();
        logs[i].draw_log();
    }
};

function fadeOut(text) {
    var alpha = 1.0,   // full opacity
        interval = setInterval(function () {
          context.font = 'bold 36pt arial';
            context.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
            context.fillText(text, 60, 240);
            alpha = alpha - 0.05; // decrease opacity (fade out)
            if (alpha < 0) {
                clearInterval(interval);
            }
        }, 100);
}

var check_win = function () {
  if (frog_controller.y > 60 && frog_controller.y < 100){
    game.won = true;
    game.score += 500;
    game.reset();
    fadeOut('YOU MADE IT');
    level();
  }
};

var level = function() {
      if (game.score > 5000){
          game.level = 3;
        }
      else if (game.score > 2000 && game.score <=5000){
          game.level = 2;
        }
};

var game_over = function() {
    if (game.score >= highscore) {
        context.font = 'bold 72pt arial';
        context.fillStyle = '#FFFFFF';
        context.fillText('GAME', 60, 150);
        context.fillText('OVER', 60, 300);
        localStorage.highscore = game.score;
        context.font = 'bold 48pt arial';
        context.fillStyle = '#00EE00';
        context.fillText('YOU GOT A', 20, 380);
        context.fillText('HIGHSCORE', 6, 460);
        context.font = 'bold 30pt arial';
        context.fillStyle = '#00EE00';
        context.fillText(highscore, 140, 520);

    }
    else {
      context.font = 'bold 72pt arial';
      context.fillStyle = '#FFFFFF';
      context.fillText('GAME', 60, 150);
      context.fillText('OVER', 60, 300);
      context.fillStyle = '#FFA500';
      context.font = 'bold 24pt arial';
      context.fillText('YOUR SCORE IS:', 60, 400);
      context.fillText(game.score, 170, 460);
    }
  };

//move functions - up, down, left and right
 var up = function (){
   frog_controller.y -=30;
   game.current++;
   if (game.current > game.maximum) {
       game.score += 10;
       game.maximum++;
   }
     frog_controller.image[0] = 12;
     frog_controller.image[1] = 369;
     frog_controller.image[2] = 23;
     frog_controller.image[3] = 17;
 };

 var down = function(){
   frog_controller.y +=30;
   game.current--;
     frog_controller.image[0] = 80;
     frog_controller.image[1] = 369;
     frog_controller.image[2] = 23;
     frog_controller.image[3] = 17;
   if (frog_controller.y > 505){
     frog_controller.y = 505;
   }
};

var left = function(){
  frog_controller.x -=20;
    frog_controller.image[0] = 80;
    frog_controller.image[1] = 335;
    frog_controller.image[2] = 19;
    frog_controller.image[3] = 23;
};

var right = function(){
  frog_controller.x +=20;
    frog_controller.image[0] = 12;
    frog_controller.image[1] = 335;
    frog_controller.image[2] = 19;
    frog_controller.image[3] = 23;
};

var make_cars = function() {
    cars = [
        make_single_car(0),
        make_single_car(0, 130, 3),
        make_single_car(0, 260, 3),
        make_single_car(1),
        make_single_car(2),
        make_single_car(2, 150, 0),
        make_single_car(3, 200),
        make_single_car(4),
        make_single_car(5),
        make_single_car(5, 150),
        make_single_car(5, 260)
    ];
};


var make_single_car = function(row, x, model) {
    switch(row) {
        case 0:
            return new Car(x==null?-25:x, rows[row], row, 3, model==null?1:model);
        case 1:
            return new Car(x==null?399:x, rows[row], row, 3, model==null?0:model);
        case 2:
            return new Car(x==null?399:x, rows[row], row, 4, model==null?2:model);
        case 3:
            return new Car(x==null?-25:x, rows[row], row, 4, model==null?3:model);
        case 4:
            return new Car(x==null?399:x, rows[row], row, 3, model==null?1:model);
        case 5:
            return new Car(x==null?399:x, rows[row], row, 3, model==null?0:model);
    }
};

var make_logs = function() {
    logs = [
        make_single_log(7),
        make_single_log(7, 150),
        make_single_log(8),
        make_single_log(8, 200),
        make_single_log(9),
        make_single_log(9, 100),
        make_single_log(10),
        make_single_log(11),
        make_single_log(11, 200),
        make_single_log(12),
        make_single_log(12, 200, 3)
    ];
    return logs;
};

var make_single_log = function(row, x, len) {
    switch(row) {
        case 7:
            return new Log(x==null?399:x, rows[row], row, 2, 1, len==null?2:len);
        case 8:
            return new Log(x==null?0:x, rows[row], row, 4, -1, len==null?3:len);
        case 9:
            return new Log(x==null?399:x, rows[row], row, 2, 1, len==null?3:len);
        case 10:
            return new Log(x==null?0:x, rows[row], row, 2, -1, len==null?2:len);
        case 11:
            return new Log(x==null?399:x, rows[row], row, 3, 1, len==null?1:len);
        case 12:
            return new Log(x==null?0:x, rows[row], row, 3, -1, len==null?0:len);
    }
};

//the car constructor
  var Car = function(x, y, row, speed, model) {
    this.collision = 0;
    this.posX = x;
    this.posY = y;
    this.row = row;
    this.speed = speed;
    this.model = model;
    this.dir = models[model].dir;
    this.width = models[model].width;
    this.height = model.height;
    this.draw_car = function() {
        switch(this.model) {
            case 0:
                context.drawImage(sprites, 8, 265, 30, 22, this.posX, this.posY, 30, 22);
                break;
            case 1:
                context.drawImage(sprites, 45, 264, 29, 24, this.posX, this.posY, 29, 24);

                break;
            case 2:
                context.drawImage(sprites, 81, 263, 24, 26, this.posX, this.posY, 24, 26);
                break;
            case 3:
                context.drawImage(sprites, 9, 300, 24, 21, this.posX, this.posY, 24, 21);
                break;
            case 4:
                context.drawImage(sprites, 105, 301, 46, 19, this.posX, this.posY, 46, 19);
                break;
        }
    };
    this.move = function() {
      this.posX =   this.posX - (this.dir * this.speed*game.level);
         if (this.posX> 399) {
           this.posX = 0;
         }
         if ((this.posX + this.width) < 0) {
           this.posX = 399;
         }
    };
    this.detect_collision = function () {
      var centerX = this.posX;
      var halfX = this.width/2;
      var maxX = centerX - halfX;
      var minX = centerX + halfX;
      if ((frog_controller.x + frog_controller.width >= minX) && (frog_controller.x - frog_controller.width <= maxX) && (frog_controller.y === this.posY)) {
      this.collision++;
        }
      };
    };

//the log constructor
var Log = function (x, y, row, speed, dir, length) {
  this.posX = x;
  this.posY = y;
  this.row = row;
  this.speed = speed;
  this.dir = dir;
  this.length = length;
  this.width = lengths[length].width;
  this.draw_log = function() {
    switch (this.length) {
      case 0:
          context.drawImage(sprites, 6, 165, 179, 21, this.posX, this.posY, 179, 21);
          break;
      case 1:
          context.drawImage(sprites, 8, 402, 73, 28, this.posX, this.posY, 73, 28);
          break;
      case 2:
          context.drawImage(sprites, 5, 197, 118, 21, this.posX, this.posY, 118, 21);
          break;
      case 3:
          context.drawImage(sprites, 6, 229, 85, 22, this.posX, this.posY, 85, 22);
          break;
      case 4:
          context.drawImage(sprites, 8, 402, 73, 28, this.posX, this.posY, 73, 28);
          break;
      case 5:
          context.drawImage(sprites, 5, 197, 118, 21, this.posX, this.posY, 50, 21);
          break;
    }
  };
  this.move = function() {
    this.posX =   this.posX - (this.dir * this.speed);
       if (this.posX> 399) {
         this.posX = 0;
       }
       if ((this.posX + this.width) < 0) {
         this.posX = 399;
       }
  };
  this.detectcollision = function () {
    var centerX = this.posX;
    var halfX = this.width/2;

    var maxX = centerX + halfX;
    var minX = centerX - halfX;
    if ((frog_controller.x + frog_controller.width >= minX) && (frog_controller.x - frog_controller.width <= maxX) && (frog_controller.y === this.posY)) {
      frog_controller.x = frog_controller.x - (this.dir * this.speed);
      if (frog_controller.x < 0){
        frog_controller.x = 0;
      }
      if (frog_controller.x > 378){
          frog_controller.x = 378;
      }
    }
  };
};

//the game constructor
var Game = function() {
  frog_controller.x = 187;
  frog_controller.y = 503;
  this.score = 0;
  this.lives = 3;
  this.level = 1;
  this.current = false;
  this.maximum = false;
  this.won = false;
  this.reset = function () {
    this.current = false;
    this.maximum = false;
    this.won = false;
    change = true;
        frog_controller.x = 187;
        frog_controller.y = 503;
        frog_controller.image = [12, 369, 23, 17];
      };
      return change;
};

start_game();

  })();
