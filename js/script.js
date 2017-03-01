$(document).ready(function(){

  var tailleCase = 50; // taille en px
  var speed = 100; // intervalle de rafraichissement de l'image
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext('2d');
  var map = new Array(); // 0:vide 1:mur 2:tourelle 3:ennemi
  //var tower=document.getElementById("tower");

  function init(){
    createMap();

    setInterval(animate, speed);
  }

  init();

  function animate(){
    paint();
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
          //ctx.drawImage(tower,i*tailleCase,j*tailleCase, tailleCase, tailleCase);
          drawing = new Image();
          drawing.src = "img/tower.png";
          drawing.onload = function() {
             ctx.drawImage(drawing,i*tailleCase,j*tailleCase, tailleCase, tailleCase);
          };
        }
        // ennemi
        else if(map[i][j] == 3){
          //TODO
        }
      }
    }
  }

  $("#canvas").click(function(e){
    var diffX = parseInt(e.pageX)-parseInt($("#canvas").offset().left);
    var diffY = parseInt(e.pageY)-parseInt($("#canvas").offset().top);
    console.log('x: '+diffX);
    console.log('y: '+diffY);
    var i = Math.floor(diffX/tailleCase);
    var j = Math.floor(diffY/tailleCase);
    console.log('i:'+i);
    console.log('j:'+j);
    map[i][j] = 2;
  })

})
