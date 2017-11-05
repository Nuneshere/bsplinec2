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
var pontosBspline=[0,1]; // pontos do bspline até 4 pontos
var copy=[]; //array com as copias dos pontos do array antes de um click.
var valoresU = [0,10,20,30,40,50,60,70,80,90,100,110,120];
var fakePoints =[]; // pontos d adicionados ao clique ---> fake em forma de algorismo
var contador=0;   // para saber quantas vezes foram calculados novos pontos para a curva
var guarde;
var qntCurvas=1;


function imprimir(array){ //PRINTE ESTA OK
    if ( points.length <= 4 ){
        console.log("tamanho: ", array.length );
        for (var i = 0 ; i <= array.length-1 ; i++){
            console.log("esse é um ponto de bezier : ", array[i] );
        }
    } else{
        console.log("tamanho: ", array.length );
        for (var i = 0 ; i <= array.length-1; i++){
            console.log("esse é um ponto de bezier: ", array[i] );
        }
    }
        
}


function bspline(l,i,j){
    var pontosDaCurva=[];
    var ultimo = (3*l);
    var penultimo = (3*l)-1; 
    var antePenultimo = (3*l)-2;
    if( contador === 0){ //minifuncao para saber quantos do array antigo pontos guardar
        guarde = 1; //a variavel guarde deve guardar o primeiro e segunda posição do array
    }
    
    console.log(ultimo," ",penultimo," ",antePenultimo);
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
                pontosDaCurva[(3*k)-2] = pontoExtremoDir(k);
                pontosDaCurva[(3*k)-1] = pontoExtremoEsq(k);  
            }        
        }
        
        pontosDaCurva[antePenultimo] = antepenultimo(l); //recalculando o antepenultimo ponto pois o calculo deste é sempre estatico, e sobreescreve muitas vezes o calculo de extremo na direita;
        
        var dDaJuncao = 3; // essa é a posição d a qual estaremos calculando o ponto de junção, se ela for igual a 3 isso significa que estamos calculando o primeiro ponto de junção, levando em conta que b é o ponto que iremos calcular, nesse caso b-1 é com certeza o resultado do calculo do terceio, mas o b+1 pode ser tanto antepenultimo como mais um ponto qualquer extremo direito.
        
        for (var u = 1 ; u <= j ; u++){ //calculo de todos os pontos de junção note que não podemos simplemente colocar o calculo de pontos de junção para rodar, 
            if (dDaJuncao==3){
                if (qntPontos == 5){
                     pontosDaCurva[3*u]= juncaoEstatico(u,pontosDaCurva,antePenultimo);
                }else{
                    pontosDaCurva[3*u]= juncaoEsqEstatico(u,pontosDaCurva);
                } 
            } else if ( dDaJuncao == qntPontos-2 ) {
                if(qntPontos>5){
                    pontosDaCurva[3*u]= juncaoDirEstatico(u,pontosDaCurva,antePenultimo);    
                }
                
            } else{
                pontosDaCurva[3*u]= juncaoNoEstatico(u,pontosDaCurva);
            }
            dDaJuncao++;
        }
        
        pontosDaCurva[penultimo] = copy[copy.length-1]; //adicionando o penultimo ponto pelo array que salvamso
        

    } return pontosDaCurva;
}

// FUNCOES PARA CALCULO DE PONTOS DE BSPLINE
// ----- calculando o terceiro ponto que nunca muda

function terceiro(i){
    var corX = ( (ladoEsquerdo(1,0) * points[1].x ) + (ladoDireito(1,0)* points[2].x ) ) ; 
    var corY = ( (ladoEsquerdo(1,0) * points[1].y ) + (ladoDireito(1,0)* points[2].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}

function juncaoEstatico(i,pontosDaCurva,antePenultimo){
    var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].x ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].y ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}
function juncaoEsqEstatico(i,pontosDaCurva){
    var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].x ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].y ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}
function juncaoDirEstatico(i,pontosDaCurva,antePenultimo){
     var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].x ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].y ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}
function juncaoNoEstatico(i,pontosDaCurva){
     var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].x ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].y ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
    
}
// ----- calculando pontos extremos esquerdos e direitos
function pontoExtremoEsq(i){
    var corX = ( (esquerdoExtremoEsq(i) * points[(i-1)+1].x ) + (direitoExtremoEsq(i)* points[i+1].x ) ) ; 
    var corY = ( (esquerdoExtremoEsq(i) * points[(i-1)+1].y ) + (direitoExtremoEsq(i)* points[i+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}

function pontoExtremoDir(i){ //3*i-2
    var corX = ( (esquerdaExtremoDir(i) * points[(i-1)+1].x ) + (direitaExtremoDir(i)* points[i+1].x ) ) ; 
    var corY = ( (esquerdaExtremoDir(i) * points[(i-1)+1].y ) + (direitaExtremoDir(i)* points[i+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}
// ----- calculando pontos antepenultimo
function antepenultimo(l){
    var corX = ( (ladoEsquerdo(l-1,l-2) * points[(l-1)+1].x ) + (ladoDireito(l-1,l-2)* points[l+1].x )) ; 
    var corY = ( (ladoEsquerdo(l-1,l-2) * points[(l-1)+1].y ) + (ladoDireito(l-1,l-2)* points[l+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto; 
}
  


// FUNCOES AUXILIARES PARA CALCULO DOS PONTOS BSPLINE
function ladoEsquerdo(valor1,valor0){
    var resposta = (delta(valoresU[(valor1)+1],valoresU[valor1])/ ( delta(valoresU[valor1],valoresU[valor0]) + delta(valoresU[(valor1)+1],valoresU[valor1])));
    return resposta;
}

function ladoDireito(valor1,valor0){
    var resposta = (delta(valoresU[valor1],valoresU[valor0])/ ( delta(valoresU[valor1],valoresU[valor0]) + delta(valoresU[(valor1)+1],valoresU[valor1])));
    return resposta;
}

function esquerdoExtremoEsq(i){ //3k-1
    var resposta = ((delta(valoresU[i+1],valoresU[i])) / ( delta(valoresU[i-1],valoresU[i-2]) + delta(valoresU[i],valoresU[i-1]) + delta(valoresU[i+1],valoresU[i]))  );
    return resposta;
}

function direitoExtremoEsq(i){ //3k-1
    var resposta = ( ((delta(valoresU[i],valoresU[i-1])) + delta(valoresU[i-1],valoresU[i-2])) / ( delta(valoresU[i-1],valoresU[i-2]) + delta(valoresU[i],valoresU[i-1]) + delta(valoresU[i+1],valoresU[i])));
    return resposta;
}

function esquerdaExtremoDir(i){ //3k-2
    var resposta = ((delta(valoresU[i],valoresU[i-1]) + delta(valoresU[i+1],valoresU[i])) / ( delta(valoresU[i-1],valoresU[i-2]) + delta(valoresU[i],valoresU[i-1]) + delta(valoresU[i+1],valoresU[i]) ));
    return resposta;
}

function direitaExtremoDir(i){ //3k-2
    var resposta = ((delta(valoresU[i-1],valoresU[i-2])) / ( delta(valoresU[i-1],valoresU[i-2]) + delta(valoresU[i],valoresU[i-1]) + delta(valoresU[i+1],valoresU[i])));
    return resposta;
}


function delta(u1,u0){
    var resposta = u1-u0;
    return resposta;
}




// CASTEJAU-----------------------------------

function makeCurva(bspline){
    var pointsCurve = [];
    console.log("HELLOOOOO");
    for (t = 0 ; t <= 1 ; t = t + parametro){
        var pontosCastel = [];
        for (var e = 0 ; e < bspline.length ; e++){
            pontosCastel.push({x: bspline[e].x , y:bspline[e].y });
        }
        deCasterjao(pontosCastel);
        pointsCurve.push(pontosCastel[0]);
    }   
    drawCurve(pointsCurve);
}
function deCasterjao(pontosCastel){   
    for(n = 1; n < pontosCastel.length ; n++) {
      for(p = 0; p < pontosCastel.length - n; p++) {
        var cordX = (1 - t) * pontosCastel[p].x + t * pontosCastel[p+1].x;
        var cordY = (1 - t) * pontosCastel[p].y + t * pontosCastel[p+1].y;
        pontosCastel[p] = {x: cordX, y: cordY};
      }
    }
}

function drawCurve(pointsCurve) {
  if(qntPontos >= 3) {
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
    var l = 0; //segmento
    i= 2;
    j= 1;
    pontosBspline=[]; // pontos do bspline até 4 pontos
    copy=[]; //array com as copias dos pontos do array antes de um click.
    fakePoints =[]; // pontos d adicionados ao clique ---> fake em forma de algorismo
    contador=0;   // para saber quantas vezes foram calculados novos pontos para a curva
    guarde;
    qntPontos = 0;
    points = [];
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
}


function drawBsplines() {
  for (var i in pontosBspline) {
    ctx.beginPath();
    ctx.arc(pontosBspline[i].x, pontosBspline[i].y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#64B5F6';
    ctx.fill();

    if(i>0){
        var posX= pontosBspline[i-1].x;
        var posY= pontosBspline[i-1].y;
        ctx.moveTo(posX,posY);
        ctx.lineTo(pontosBspline[i].x,pontosBspline[i].y);
        ctx.strokeStyle= '#64B5F6';
        ctx.lineWidth=3;
        ctx.stroke();
    }
  }
  for(var w = 0 ; w < qntCurvas ; w++){
      //pontosBspline  4-4
        var inferior = w*3; 
        var superior = inferior+3;
        var array=[];

        for (var e = inferior ; e <= superior ; e++){
            array.push({x: pontosBspline[e].x , y:pontosBspline[e].y });
        }
        if(qntPontos >= 3){
            makeCurva(array);
        }  
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
        qntCurvas++;
    }
    if( qntPontos > 4){
        i = i + 1;
        j = j + 1;
    }
    imprimir(pontosDaCurva);
    
    pontosBspline.splice(0,pontosBspline.length);
    pontosBspline = pontosDaCurva.slice(0, pontosDaCurva.length);

    copy = pontosDaCurva.slice(0,pontosDaCurva.length+1);  //O COPY TA FUNCIONANDO 
    //console.log( "valor de i: ",i, "valor de j: ", j);
    //console.log("segmento: ", l);
    console.log("quantidade de pontos: ", qntPontos,"quantidade de curvas : ",qntCurvas );
    
  } else {
    move = true;
  }
});


canvas.addEventListener('mouseup', e => {
  move = false;
});


setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (qntPontos>=3){
        drawBsplines();
    }
    drawCircles();
  
}, 500 / 30);
