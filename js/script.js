$(document).ready(function(){

  var tailleCase = 50; // taille en px
  var speed = 100; // intervalle de rafraichissement de l'image
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext('2d');
  var map = new Array(); // 0:vide 1:mur 2:tourelle 3:ennemi
  var tower = document.getElementById("tower");
  var monster = document.getElementById("monster");
  var towers = new Array();
  var path = new Array();
  var enemys = new Array();
  var spawnSpeed = 5000; // intervalle entre les spawns d'ennemis

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

    //createTower();
  }

  function createTower(X,Y){
    for (var i = 0; i < towers.length; i++) {
      if(towers[i].x == X && towers[i].y == Y)
      var mytower = towers[i];
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
        // ennemi
        else if(map[i][j] == 3){
          //TODO
        }
      }
    }

    for (var i = 0; i < enemys.length; i++) {
      ctx.drawImage(monster,enemys[i].x*tailleCase,enemys[i].y*tailleCase, tailleCase, tailleCase);
    }
  }

  $("#canvas").mousemove(function(e){
    for (var i = 0; i < towers.length; i++) {
      var diffX = parseInt(e.pageX)-parseInt($("#canvas").offset().left);
      var diffY = parseInt(e.pageY)-parseInt($("#canvas").offset().top);

      var adj = diffX-(towers[i].x*tailleCase + tailleCase/2);
       var opp = diffY-(towers[i].y*tailleCase + tailleCase/2);

       var hyp = Math.sqrt(Math.pow(adj,2)+Math.pow(opp,2));
       var cosi_a = Math.abs(adj/hyp);
       var angl =  Math.acos(cosi_a);

       if (adj<0 && opp<0){towers[i].angle= angl + Math.PI;}
       if (adj>0 && opp<0){towers[i].angle= -angl;}
       if (adj<0 && opp>0){towers[i].angle= -(angl + Math.PI);}
       if (adj>=0 && opp>=0){towers[i].angle= angl;}
    }
  });

  $("#canvas").click(function(e){
    var diffX = parseInt(e.pageX)-parseInt($("#canvas").offset().left);
    var diffY = parseInt(e.pageY)-parseInt($("#canvas").offset().top);
    var i = Math.floor(diffX/tailleCase);
    var j = Math.floor(diffY/tailleCase);

    if(map[i][j] == 1){
      towers.push({x:i , y:j , angle:0});
      map[i][j] = 2;
    }
  });

})
