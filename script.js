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
var i= 2;
var j= 1;
var pontosBspline= []; // pontos do bspline até 4 pontos
var copy=[]; //array com as copias dos pontos do array antes de um click.
var valoresU = [0,10,20,30,40,50,60,70];
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


function bspline(l,i,j){
    var pontosDaCurva=[];
    var ultimo = (3*l);
    var penultimo = (3*l)-1; 
    var antePunultimo = (3*l)-2;
    if( contador === 0){ //minifuncao para saber quantos do array antigo pontos guardar
        guarde = 1; //a variavel guarde deve guardar o primeiro e segunda posição do array
    }
    
    console.log(ultimo," ",penultimo," ",antePunultimo);
    if ( fakePoints.length <= 4){
        pontosDaCurva.push(points[0]);
        pontosDaCurva.push(points[1]);
        pontosDaCurva.push(points[2]);
        pontosDaCurva.push(points[3]);
        contador= 0 ; //até aqui ta ok!
        
    }
    else{
        for ( var m = 0 ; m <= guarde ; m++){ //guardando os primeiros 2 pontos
            pontosDaCurva.push(copy[m]);
        }  
        
        pontosDaCurva.push( terceiro() );
        if (qntPontos > 5){
            for (var k = 2 ; k <= i ; k++ ){ // calculo de todos pontos extremos novamente
                pontosDaCurva[(3*k)-2] = pontoExtremoEsq(k);
                pontosDaCurva[(3*k)-1] = pontoExtremoDir(k);    
            }
            
        }
        
        for (var u = 1 ; u <= j ; u++){ //calculo de todos os pontos de junção novamente
            pontosDaCurva[3*u]= pontoJuncao(u);
        }
        
        pontosDaCurva[antePunultimo] = antepenultimo(l); //recalculando o antepenultimo ponto pois o calculo deste é sempre estatico, e sobreescreve muitas vezes o calculo de extremo na direita;
        pontosDaCurva[penultimo] = copy[copy.length-1]; //adicionando o penultimo ponto pelo array que salvamso
        

    } return pontosDaCurva;
}

function terceiro(i){
    var corX = ( (ladoEsquerdo(1,0) * points[1].x ) + (ladoDireito(1,0)* points[2].x ) ) ; 
    var corY = ( (ladoEsquerdo(1,0) * points[1].y ) + (ladoDireito(1,0)* points[2].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}

function pontoJuncao(i){
    var corX = ( (ladoEsquerdo(i,i-1) * points[((3*i)-1)+1].x ) + (ladoDireito(i,i-1)* points[((3*i)+1)+1].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * points[((3*i)-1)+1].y ) + (ladoDireito(i,i-1)* points[((3*i)+1)+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}

function pontoExtremoEsq(i){
    var x  = 2000;
    return x;
}

function pontoExtremoDir(i){
    var x  = 4000;
    return x; 
}

function antepenultimo(l){
    var corX = ( (ladoEsquerdo(l-1,l-2) * points[(l-1)+1].x ) + (ladoDireito(l-1,l-2)* points[l+1].x )) ; 
    var corY = ( (ladoEsquerdo(l-1,l-2) * points[(l-1)+1].y ) + (ladoDireito(l-1,l-2)* points[l+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto; 
}
    
function ladoEsquerdo(valor1,valor0){
    var resposta = (delta(valoresU[(valor1)+1],valoresU[valor1])/ ( delta(valoresU[valor1],valoresU[valor0]) + delta(valoresU[(valor1)+1],valoresU[valor1])));
    return resposta;
}

function ladoDireito(valor1,valor0){
    var resposta = (delta(valoresU[valor1],valoresU[valor0])/ ( delta(valoresU[valor1],valoresU[valor0]) + delta(valoresU[(valor1)+1],valoresU[valor1])));
    return resposta;
}

function esquerdoPenultimo(valor1,valor0){
    var resposta = (delta(valoresU[(valor1)+1],valoresU[valor1])/ ( delta(valoresU[valor1],valoresU[valor0]) + delta(valoresU[(valor1)+1],valoresU[valor1])));
    return resposta;
}

function direitoPenultimo(valor1,valor0){
    var resposta = (delta(valoresU[valor1],valoresU[valor0])/ ( delta(valoresU[valor1],valoresU[valor0]) + delta(valoresU[(valor1)+1],valoresU[valor1])));
    return resposta;
}

function delta(u1,u0){
    var resposta = u1-u0;
    return resposta;
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
    l = qntPontos - 3;   //alterando valor de l -- segmentos utilizado por vezes no bspline
    var pontosDaCurva = bspline(l,i,j); //rodando o bspline
    if ( qntPontos >4 ){
        pontosDaCurva.push(click); //adicionando o ponto no final
    }
    if( qntPontos > 4){
        i = i + 1;
        j = j + 1;
    }
    imprimir(pontosDaCurva);
    
    copy = pontosDaCurva.slice(0,pontosDaCurva.length+1);  //O COPY TA FUNCIONANDO 
    console.log( "valor de i: ",i, "valor de j: ", j);
    console.log("segmento: ", l);
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
