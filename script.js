var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// INICIALIZANDO VARIAVEIS-----------------

var points = [];
var move = false;
var index = -1;
var qntPontos = 0;
var grau = qntPontos - 1;
var precisao = 1000, parametro = 1 / precisao;

//BSPLINE

var l = 0; //segmento
var pontosBspline= [];

function imprimir(){
    console.log("tamanho: ", pontosBspline.length);
    for (var i = 0 ; i < pontosBspline.lenght-1 ; i++){
        console.log(pontosBspline[i], " ");
    }
}

function extremePoints(pontosOriginais,i){
    if ( i === 0 & pontosBspline.length === 0){
        pontosBspline.push(pontosOriginais[i]);
    } else if (i === 1 & pontosBspline.length === 1){
        pontosBspline.push(pontosOriginais[i]);
    } else if ( i == pontosOriginais.length-1 & pontosOriginais.length >3){
        pontosBspline.push(pontosOriginais[i]);
        
    } else if ( i == pontosOriginais.length-2 & pontosOriginais.length >3){
        pontosBspline.push(pontosOriginais[i]);
    }
}

function bspline(){
    var pontosOriginais = points.slice(0, qntPontos+1);
    for ( var i = 0  ; i<pontosOriginais.length; i++){
        if (points.length >= 3 ){
            extremePoints(pontosOriginais,i);
        }
    }
}
    

// CASTEJAU

function makeCurva(){
    var pointsCurve = [];
    for (t = 0 ; t <= 1 ; t = t + parametro){
        var pontosCastel = points.slice(0, qntPontos+1);
        deCasterjao(pontosCastel)
        pointsCurve.push(pontosCastel[0]);
    }   
    drawCurve(pointsCurve);
}
function deCasterjao(pontosCastel){   
    for(n = 1; n < qntPontos ; n++) {
      for(p = 0; p < qntPontos - n; p++) {
        var cordX = (1 - t) * pontosCastel[p].x + t * pontosCastel[p+1].x;
        var cordY = (1 - t) * pontosCastel[p].y + t * pontosCastel[p+1].y;
        pontosCastel[p] = {x: cordX, y: cordY};
      }
    }
}

function drawCurve(pointsCurve) {
  if(qntPontos > 3) {
    for(var i in pointsCurve) {
      ctx.beginPath();
      
      if(i > 0) {
        var xAtual = pointsCurve[i-1].x;
        var yAtual = pointsCurve[i-1].y;
        ctx.moveTo(xAtual, yAtual);
        ctx.lineTo(pointsCurve[i].x, pointsCurve[i].y);
         ctx.strokeStyle= '#FDD835';
        ctx.lineWidth=5;
        ctx.stroke();
      }
    }
  }
}

// FUNCOES BASICAS DE CANVAS-----------------
function clearCanvas()
{
  var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.splice(0,points.length);
  p
  drawCircles();
}

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}

function drawCircles() {
  for (var i in points) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#CFD8DC';
    ctx.fill();

    if(i>0){
        var posX= points[i-1].x;
        var posY= points[i-1].y;
        ctx.moveTo(posX,posY);
        ctx.lineTo(points[i].x,points[i].y);
        ctx.strokeStyle= '#CFD8DC';
        ctx.lineWidth=3;
        ctx.stroke();
    }
  }
  if(qntPontos > 3) {
    makeCurva();
  }
}

function dist(p1, p2) {
  var v = {x: p1.x - p2.x, y: p1.y - p2.y};
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function getIndex(click) {
  for (var i in points) {
    if (dist(points[i], click) <= 10) {
      return i;
    }
  }
  return -1;
}




resizeCanvas();



// ACOES NO MOUSE-----------------


canvas.addEventListener('mousedown', e => {
  var click = {x: e.offsetX, y: e.offsetY, v:{x: 0, y:0}};
  index = getIndex(click);
  if (index === -1) {
    qntPontos++;
    points.push(click);
    drawCircles();
    if ( qntPontos >4){
        l = qntPontos - 3;     
    }
    bspline();
    console.log(l , "<- segmentos");
    imprimir();
  } else {
    move = true;
  }
});


canvas.addEventListener('mouseup', e => {
  move = false;
});

canvas.addEventListener('dblclick', e => {
  if (index !== -1) {
    points.splice(index, 1);
    qntPontos--;
  }
});


canvas.addEventListener('mousemove', e => {
  if (move) {
    var old = points[index];
    points[index] = {x: e.offsetX, y: e.offsetY, v: {x: 0, y: 0}};
    points[index].v = {x: e.offsetX - old.x, y: e.offsetY - old.y};
    drawCircles();
  }
});

setInterval(() => {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircles();


}, 500 / 30);
