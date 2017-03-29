
(function(){

  var frog_controller = {
    x: 170,
    y: 503,
    width:23,
    height:17,
    image: [12, 369, 23, 17]
  };



var models = [
    {width: 30, height: 22, dir: 1},
    {width: 29, height: 24, dir: -1},
    {width:24, height: 26, dir: 1},
    {width: 24, height: 21, dir: -1}
];
var lengths = [{width: 179, height: 21},
  {width: 73, height: 28},
   {width: 118, height: 21},
   {width: 85, height: 22},
  ];


var rows = [473, 443, 413, 383, 353, 323, 288, 263, 233, 203, 173, 143, 113];
var context = null;

var start_game = function() {

  game = new Game();

  $("body").on("keydown", function(event){
     var key = event.which; //event uvijek prozivede isti broj bez obzira na tastaturu koja se koristi, to je univerzalno

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
var deadByCar = function () {
  if (change) {
    // console.log("cabbage");
      context.drawImage(sprites, frog_controller.image[0], frog_controller.image[1], frog_controller.image[2], frog_controller.image[3], frog_controller.x, frog_controller.y, 23, 17);
    }
    else {
      (context.drawImage(deadsprite, 4, 2, 19, 24, frog_controller.x, frog_controller.y, 19, 24));

      var what = setInterval(function() {
      // console.log("tomato");
      console.log("tomato");
      game.reset();
              clearInterval(what);
            },50);
            game.lives--;


    }
};

var deadInWater = function(){
  if ((frog_controller.y < 280) && (frog_controller.y > 113) && (onLog()===false)) {

  context.drawImage(deadsprite, 4, 2, 19, 24, frog_controller.x, frog_controller.y, 19, 24);
    var what1 = setTimeout(function() {
      // console.log("POTATO!");
      game.reset();
      // clearInterval(what1);
    },50);
game.lives--;
  }
};

var draw_frog = function () {

    if (deadByCar()){
    // game.lives--;
    console.log("Car");

    }
    else if (deadInWater()){
      // game.lives--;
      console.log("Water");
    }
};
var draw_info = function() {
    draw_lives();
    context.font = 'bold 14pt arial';
    context.fillStyle = '#00EE00';
    context.fillText('Score: ', 4, 560);
    draw_score();
};

var draw_lives = function() {
    var x = 4;
    var y = 530;
    for (var i = 0; i<game.lives; i++){
        context.drawImage(sprites, 13, 334, 17, 23, x, y, 11, 15);
        x += 14;
    }};

var draw_score = function() {
    context.font = 'bold 10pt arial';
    context.fillStyle = '#00EE00';
    context.fillText(game.score, 69, 560);
};


var draw_cars = function() {
    for (var i=0; i< cars.length; i++) {
        cars[i].move();
        cars[i].detect_collision();
        cars[i].draw_car();
        if (cars[i].collision > 1) {
          change = false;
          cars[i].collision = 0;
        console.log("it works");
      }
    }
};


//prva
var draw_logs = function() {
    for (var i=0; i< 11; i++) {
        logs[i].move();
        logs[i].detectcollision();
        logs[i].draw_log();
    }
};

var game_over = function() {
    context.font = 'bold 72pt arial';
    context.fillStyle = '#FFFFFF';
    context.fillText('GAME', 60, 150);
    context.fillText('OVER', 60, 300);
  };

//moves
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
  frog_controller.x -=5;
    frog_controller.image[0] = 80;
    frog_controller.image[1] = 335;
    frog_controller.image[2] = 19;
    frog_controller.image[3] = 23;
    if (frog_controller.x < 0){
      frog_controller.x = 0;
    }
};
var right = function(){
  frog_controller.x +=5;
    frog_controller.image[0] = 12;
    frog_controller.image[1] = 335;
    frog_controller.image[2] = 19;
    frog_controller.image[3] = 23;
    if (frog_controller.x > 378){
        frog_controller.x = 378;
    }
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
        make_single_car(5, 150, 2),
        make_single_car(5, 300)
    ];
};

// console.log(make_cars);

var make_single_car = function(row, x, model) {
    switch(row) {
        case 0:
            return new Car(x==null?-25:x, rows[row], row, 5, model==null?1:model);
        case 1:
            return new Car(x==null?399:x, rows[row], row, 2, model==null?0:model);
        case 2:
            return new Car(x==null?399:x, rows[row], row, 4, model==null?2:model);
        case 3:
            return new Car(x==null?-25:x, rows[row], row, 3, model==null?3:model);
        case 4:
            return new Car(x==null?399:x, rows[row], row, 3, model==null?0:model);
        case 5:
            return new Car(x==null?399:x, rows[row], row, 4, model==null?0:model);
    }
};
// console.log(make_single_car);
var logs;
//druga
var make_logs = function() {
    logs = [
        make_single_log(7),
        make_single_log(7, 150, 3),
        make_single_log(8),
        make_single_log(8, 200),
        make_single_log(9),
        make_single_log(9, 100, 1),
        make_single_log(10),
        make_single_log(11),
        make_single_log(11, 200),
        make_single_log(12),
        make_single_log(12, 200, 3)
    ];
    return logs;
};

//treca
var make_single_log = function(row, x, len) {
    switch(row) {
        case 7:
            return new Log(x==null?399:x, rows[row], row, 1, 1, len==null?2:len);
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

      this.posX =   this.posX - (this.dir * this.speed);
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
// console.log(this.collision);
      }
    };
    };

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
      // console.log(this.posX);
      console.log("i am working");

      frog_controller.x = frog_controller.x - (this.dir * this.speed);

    }
  };

};

var Game = function() {
  frog_controller.x = 187;
  frog_controller.y = 503;
  this.score = 0;
  this.lives = 5;
  this.current = -1;
  this.maximum = -1;
  this.reset = function () {
    this.current = -1;
    this.maximum = -1;
    change = true;
    // draw_frog();
        frog_controller.x = 187;
        frog_controller.y = 503;
        frog_controller.image = [12, 369, 23, 17];
        return change;
      };
return change;
};


start_game();

  })();
