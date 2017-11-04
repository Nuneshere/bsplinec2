var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// INICIALIZANDO VARIAVEIS-----------------

var points = []; // pontos d adicionados ao clique
var move = false;
var index = -1;
var qntPontos = 0;
var grau = qntPontos - 1;
var precisao = 1000, parametro = 1 / precisao;

//BSPLINE ARRAY
var l = 0; //segmento

var pontosBspline= []; // pontos do bspline até 4 pontos
var copy=[]; //array com as copias dos pontos do array antes de um click.

var fakePoints =[]; // pontos d adicionados ao clique ---> fake em forma de algorismo
var contador=0;   // para saber quantas vezes foram calculados novos pontos para a curva
var guarde;

function imprimir(array){ //PRINTE ESTA OK
    if ( points.length <= 4 ){
        console.log("tamanho: ", array.length );
        for (var i = 0 ; i <= array.length-1 ; i++){
            console.log("ponto da curva inferior ou igual 4 : ", array[i] );
        }
    } else{
        console.log("tamanho: ", array.length );
        for (var i = 0 ; i <= array.length-1; i++){
            console.log("ponto da curva superior a 4: ", array[i] );
        }
    }
        
}


function bspline(l){
    var pontosDaCurva=[];
    if( contador === 0){ //minifuncao para saber quantos do array antigo pontos guardar
        guarde = 1; //a variavel guarde deve guardar o primeiro e segunda posição do array
    } else {
        guarde =contador*3; //variavel deve guarda primeiro e segundo + todos pontos extras calculados
    }
    console.log("entrei no array e esse é o valor de contador: ", contador )
    if ( fakePoints.length <= 4){
        pontosDaCurva.push(fakePoints[0]);
        pontosDaCurva.push(fakePoints[1]);
        pontosDaCurva.push(fakePoints[2]);
        pontosDaCurva.push(fakePoints[3]);
        contador= 0 ; //até aqui ta ok!
        
    }
    else{
            for ( var m = 0 ; m <= guarde ; m++){ //guardando os primeiros pontos
                pontosDaCurva.push(copy[m]);
            }  
            for ( var n = contador+1; n <= copy.length-1 ; n++){ //calculando os pontos entre 
                
                //var x =  dCalculos(n);
                //pontosDaCurva.push(x);
            }
       
        pontosDaCurva.push(copy[copy.length-1]); //adicionando o penultimo ponto
        contador = contador + 1 ;
        console.log("sai do array e esse é o valor de contador: ", contador );

    } return pontosDaCurva;
}


function dCalculos(i){
    var x  = 10*i;
    return x
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
    fakePoints.push(qntPontos); //adicionando no points fake 
    points.push(click); //adicionando no points
    l = qntPontos - 3;   //alterando valor de l   
      
    var pontosDaCurva = bspline(l); //analisando quais devem ser os pontos da bspline
    if ( qntPontos >4 ){
        pontosDaCurva.push(qntPontos); //adicionando o ponto no final
    }
    imprimir(pontosDaCurva);
    copy = pontosDaCurva.slice(0,pontosDaCurva.length+1);  //O COPY TA FUNCIONANDO 
    
    console.log("esse é o ultimo ponto: ", copy[copy.length-1]);
    console.log("quantidade de cliques lenght: ", points.length );
    drawCircles(); //traçando a bspline
    
    //imprimir(pontosDaCurva);
  } else {
    move = true;
  }
});


canvas.addEventListener('mouseup', e => {
  move = false;
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
