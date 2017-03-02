$(document).ready(function(){

  var gold = 10;
  var tailleCase = 50; // taille en px
  var speed = 100; // intervalle de rafraichissement de l'image
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext('2d');
  var map = new Array(); // 0:vide 1:mur 2:tourelle
  var tower = document.getElementById("tower");
  var monster = document.getElementById("monster");
  var bullet = document.getElementById("bullet");
  var towers = new Array();
  var path = new Array();
  var enemys = new Array();
  var bullets = new Array();
  var spawnSpeed = 5000; // intervalle entre les spawns d'ennemis
  var shootSpeed = 60;
  var bulletSpeed = 1/10;
  var radius = 3;

  function init(){
    //path of enemys
    path[0] = {x: 1, y: 1};
    path[1] = {x: 1, y: 8};
    path[2] = {x: 8, y: 8};
    path[3] = {x: 8, y: 1};
    createMap();

    setInterval(animate, speed);
    setInterval(spawn, spawnSpeed);
  }

  init();

  function animate(){
    moveEnemys();
    paint();
    document.getElementById("gold").innerHTML = "gold : "+gold;


    for (var i = 0; i < towers.length; i++) {
      towers[i].nextShot --;
      if(towers[i].nextShot <= 0 && towers[i].aiming == true){
        shoot(towers[i]);
        towers[i].nextShot = shootSpeed;
      }
    }
  }

  function createTower(X,Y){
    for (var i = 0; i < towers.length; i++) {
      if(towers[i].x == X && towers[i].y == Y){
        var mytower = towers[i];
        mytower.aiming = false;
      }
    }

    var closestE = {x:1000, y:1000};

    for (var i = 0; i < enemys.length; i++) {
      if(Math.sqrt(Math.pow(enemys[i].x - X, 2)+Math.pow(enemys[i].y - Y, 2)) < Math.sqrt(Math.pow(closestE.x - X, 2)+Math.pow(closestE.y - Y, 2)))
        closestE = enemys[i];
    }

    if(Math.sqrt(Math.pow(closestE.x - X, 2)+Math.pow(closestE.y - Y, 2)) <= radius){
      rotateTower(mytower, closestE);
      mytower.aiming = true;
    }

    ctx.beginPath();
    ctx.fillStyle="brown";
    ctx.rect(X*tailleCase, Y*tailleCase, tailleCase, tailleCase);
    ctx.fill();

    ctx.save();
    ctx.translate(X*tailleCase+(tailleCase/2), Y*tailleCase+(tailleCase/2));
    ctx.rotate(mytower.angle+(Math.PI/2)); // +90degré pour ajuster l'image
    ctx.drawImage(tower,-tailleCase/2,-tailleCase/2, tailleCase, tailleCase);
    ctx.restore();
  }

  function shoot(mytower){

    if(mytower.aiming == true)
      bullets.push({x: mytower.x, y:mytower.y, angle:mytower.angle});

  }

  function rotateTower(myTower, myEnemy){
      //var diffX = parseInt(e.pageX)-parseInt($("#canvas").offset().left);
      //var diffY = parseInt(e.pageY)-parseInt($("#canvas").offset().top);

      var adj =(myEnemy.x+0.5)-(myTower.x+0.5);
      var opp = (myEnemy.y+0.5)-(myTower.y+0.5);

      var hyp = Math.sqrt(Math.pow(adj,2)+Math.pow(opp,2));
      var cosi_a = Math.abs(adj/hyp);
      var angl =  Math.acos(cosi_a);

      if (adj<0 && opp<0){myTower.angle= angl + Math.PI;}
      if (adj>0 && opp<0){myTower.angle= -angl;}
      if (adj<0 && opp>0){myTower.angle= -(angl + Math.PI);}
      if (adj>=0 && opp>=0){myTower.angle= angl;}
  }

  function moveEnemys(){
    for (var i = 0; i < enemys.length; i++) {
      if(enemys[i].pathPoint == 0){
        if(enemys[i].y < path[1].y)
          enemys[i].y += 1/10;
        else
            enemys[i].pathPoint = 1;
      }
      else if(enemys[i].pathPoint == 1){
        if(enemys[i].x < path[2].x)
          enemys[i].x += 1/10;
        else
          enemys[i].pathPoint = 2;

      }
      else if(enemys[i].pathPoint == 2){
        if(enemys[i].y > path[3].y)
          enemys[i].y -= 1/10;
        else
          enemys[i].pathPoint = 3;
      }
      else if(enemys[i].pathPoint == 3){
        if(enemys[i].x > path[0].x)
          enemys[i].x -= 1/10;
        else
          enemys[i].pathPoint = 0;
      }
    }
  }

  function spawn(){
    console.log('spawn');
    enemys.push({x: path[0].x, y:path[0].y, pathPoint: 0});
  }

  // initialisation de la carte
  function createMap(){
    for (var i = 0; i < canvas.width; i++) {
      map[i] = new Array();
    }

    for (var i = 0; i < 10; i++) {
      //rempli les bords
      map[i][0] = 1;
      map[i][9] = 1;
      map[0][i] = 1;
      map[9][i] = 1;

      //rempli le centre
      for (var j = 0; j < 10; j++) {
        if(i>1 && j>1 && i<8 && j<8){
          map[i][j] = 1;
        }
      }
    }

  }

  // appelé à chaque frame pour raffraichir l'affichage
  function paint(){

    ctx.clearRect( 0, 0, canvas.width, canvas.height )

    // map
    ctx.beginPath();
    ctx.fillStyle="white";
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fill();

    // contour de la map
    ctx.beginPath();
    ctx.lineWidth="5";
    ctx.strokeStyle="black";
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.stroke();

    // création de la grille
    ctx.lineWidth="1";
    // horizontal
    for (var i = 0; i < (canvas.width/tailleCase); i+=1) {
      for (var j = 0; j < (canvas.height/tailleCase); j+=1) {
        ctx.moveTo(0, j*tailleCase);
        ctx.lineTo(canvas.width, j*tailleCase);
        ctx.stroke();

        ctx.moveTo(i*tailleCase, 0);
        ctx.lineTo(i*tailleCase, canvas.height);
        ctx.stroke();

        // sol
        if(map[i][j] == 1){
          ctx.beginPath();
          ctx.fillStyle="brown";
          ctx.rect(i*tailleCase, j*tailleCase, tailleCase, tailleCase);
          ctx.fill();
        }
        // tourelle
        else if(map[i][j] == 2){
          createTower(i,j);
        }
      }
    }

    for (var i = 0; i < enemys.length; i++) {
      ctx.drawImage(monster,enemys[i].x*tailleCase,enemys[i].y*tailleCase, tailleCase, tailleCase);
    }

    for (var i = 0; i < bullets.length; i++) {

      dirX = Math.cos(bullets[i].angle);
      dirY = Math.sin(bullets[i].angle);
      console.log('x : '+dirX);
      console.log('y : '+dirY);

      ctx.drawImage(bullet,bullets[i].x*tailleCase+tailleCase/2,bullets[i].y*tailleCase+tailleCase/2, 10, 10);
      bullets[i].x += dirX;
      bullets[i].y += dirY;

      for (var j = 0; j < enemys.length; j++) {
        if(bullets[i]){
          var b = bullets[i];
          var e = enemys[j];

          if(b.x*tailleCase + 10 >= e.x*tailleCase && b.x*tailleCase <= e.x*tailleCase + tailleCase && b.y*tailleCase + 10 >= e.y*tailleCase && b.y*tailleCase <= e.y*tailleCase + tailleCase){
            bullets.splice(i,1);
            enemys.splice(j,1);
            gold ++;
          }
        }
      }



      if(bullets[i].x < 0 || bullets[i].x > 10 || bullets[i].y < 0 || bullets[i].y > 10){
        bullets.splice(i, 1);
        console.log('destroy bullet');
      }
    }


  }

  $("#canvas").click(function(e){
    var diffX = parseInt(e.pageX)-parseInt($("#canvas").offset().left);
    var diffY = parseInt(e.pageY)-parseInt($("#canvas").offset().top);
    var i = Math.floor(diffX/tailleCase);
    var j = Math.floor(diffY/tailleCase);

    if(map[i][j] == 1){
      if(gold >= 10){
        towers.push({x:i , y:j , angle:0, aiming: false, nextShot: shootSpeed});
        gold -= 10;
        map[i][j] = 2;
      }
      else{

      }
    }
  });

})
