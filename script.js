var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// NOTAS
// a bspline é calculada todas vezes que damos um click pela funcao bspline, a funcao makecurva cria uma curva e é chamada em cada click 


// ----------------- INICIALIZANDO VARIAVEIS GERAIS

var points = []; // pontos d adicionados ao clique
var index = -1;
var qntPontos = 0;
var grau = qntPontos - 1;
var precisao = 2000, parametro = 1 / precisao; //precisao de bezier

// -------------- TODAS ESSAS VARIAVEIS SAO IMPORTANTES PARA BSPLINE C2 
var l = 0; //segmento
var i= 2; // i inicializado para calculo de bspline no segmento tipico
var j= 1; // j inicializado para calculo de bspline nas juncoes
var pontosBspline=[0,1]; // array final com todos os pontos de bspline
var copy=[]; //array com as copias dos pontos bspline do array antes de um click.

var u = 0; //qual parametro u devemos calcular
var valoresU =[];  //esses valores previamente são os da "corda"

//var fakePoints =[]; // pontos d adicionados ao clique ---> fake em forma de algorismo

var qntCurvas=1; //quantidade de curvas no nosso bspline

var fechada = false; // se a curva deve ou não ser fechada



function imprimir(array){ 
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
    
    console.log(ultimo," ",penultimo," ",antePenultimo);
    if ( points.length <= 4){
        pontosDaCurva.push(points[0]);
        pontosDaCurva.push(points[1]);
        pontosDaCurva.push(points[2]);
        pontosDaCurva.push(points[3]);
    }
    else{
        for ( var m = 0 ; m <= 1 ; m++){ // guardando os primeiros 2 pontos
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
} // calculo geral da bspline

//--------------------  FUNCOES PARA CALCULO DE PONTOS DE BSPLINE

function terceiro(i){
    var corX = ( (ladoEsquerdo(1,0) * points[1].x ) + (ladoDireito(1,0)* points[2].x ) ) ; 
    var corY = ( (ladoEsquerdo(1,0) * points[1].y ) + (ladoDireito(1,0)* points[2].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}  //este metodo é o que cacula o B2 nas bspline, também chamado de ponto 3 de bezier

function juncaoEstatico(i,pontosDaCurva,antePenultimo){
    var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].x ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].y ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
} //essa é a formula para calcular pontos de juncao caso so tenhamos 5 pontos, estatico pois o ponto a sua esquerda e direita nao necessitam de formulas "tipicas" para serem calculados

function juncaoEsqEstatico(i,pontosDaCurva){
    var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].x ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[2].y ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
} // calcula ponto de juncao no cenario que o ponto a direita é calculado com formula tipica, e o esquerda é estatico, sendo o ponto 3 de bezier

function juncaoDirEstatico(i,pontosDaCurva,antePenultimo){
     var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].x ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].y ) + (ladoDireito(i,i-1)* pontosDaCurva[antePenultimo].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
}

 // calcula ponto de juncao no cenario que o ponto a esquerda é calculado com formula tipica, e o direita é estatico, sendo o penultimo ponto de bezier

function juncaoNoEstatico(i,pontosDaCurva){
     var corX = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].x ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].x ) ) ; 
    var corY = ( (ladoEsquerdo(i,i-1) * pontosDaCurva[(3*i)-1].y ) + (ladoDireito(i,i-1)* pontosDaCurva[(3*i)+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
    
} //calcula ponto de juncao quando nao temos pontos estaticos

// ------------------  calculando pontos extremos esquerdos e direitos
function pontoExtremoEsq(i){
    var corX = ( (esquerdoExtremoEsq(i) * points[(i-1)+1].x ) + (direitoExtremoEsq(i)* points[i+1].x ) ) ; 
    var corY = ( (esquerdoExtremoEsq(i) * points[(i-1)+1].y ) + (direitoExtremoEsq(i)* points[i+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
} //calculo do ponto tipico mais a esquerda 

function pontoExtremoDir(i){ //3*i-2
    var corX = ( (esquerdaExtremoDir(i) * points[(i-1)+1].x ) + (direitaExtremoDir(i)* points[i+1].x ) ) ; 
    var corY = ( (esquerdaExtremoDir(i) * points[(i-1)+1].y ) + (direitaExtremoDir(i)* points[i+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto;
} //calculo do ponto tipico mais a direita

// ---------------------- calculando pontos antepenultimo
function antepenultimo(l){
    var corX = ( (ladoEsquerdo(l-1,l-2) * points[(l-1)+1].x ) + (ladoDireito(l-1,l-2)* points[l+1].x )) ; 
    var corY = ( (ladoEsquerdo(l-1,l-2) * points[(l-1)+1].y ) + (ladoDireito(l-1,l-2)* points[l+1].y ) ) ; 
    var ponto = {x:corX, y:corY}; 
    return ponto; 
} 
  

// -------------------FUNCOES AUXILIARES PARA CALCULO DOS PONTOS BSPLINE
// essas funcoes partes das formulas necessarias para o calculo dos pontos.
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

// ------------------- FUNCAO DE CALCULO DE CORDA

function calculoCorda(u){
    console.log("valor da norma :", norma(points[u-1],points[u-2]) ) ;
    var corda = (valoresU[u-2]) + (norma(points[u-1],points[u-2]));
    console.log("valor da corda: ",corda );
    return corda;
}
function norma(ponto1,ponto2){
    var x = (ponto1.x - ponto2.x);
    var y = (ponto1.y - ponto2.y);
    var quadradox = Math.pow(x,2);
    var quadradoy = Math.pow(y,2);
    var normaa = Math.sqrt(quadradox + quadradoy);
    return normaa;
}



// ----------------------------------- CASTEJAU 

function makeCurva(bspline){
    var pointsCurve = [];
    console.log("Atualizando...");
    for (t = 0 ; t <= 1 ; t = t + parametro){
        var pontosCastel = [];
        for (var e = 0 ; e < bspline.length ; e++){
            pontosCastel.push({x: bspline[e].x , y:bspline[e].y });
        }
        deCasterjao(pontosCastel,t); // o mito!
        pointsCurve.push(pontosCastel[0]);
    }   
    drawCurve(pointsCurve);
} //metodo que irá chamar o deCasterjao, gerando pontos da curva

function deCasterjao(pontosCastel,t){   
    for(n = 1; n < pontosCastel.length ; n++) {
      for(p = 0; p < pontosCastel.length - n; p++) {
        var cordX = (1 - t) * pontosCastel[p].x + t * pontosCastel[p+1].x;
        var cordY = (1 - t) * pontosCastel[p].y + t * pontosCastel[p+1].y;
        pontosCastel[p] = {x: cordX, y: cordY};
      }
    }
} //calculo de castejau

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
} // metodo para desenhar curvas



// ----------------- FUNCOES BASICAS DE CANVAS 
function addInput(pointNumber, pointValue){
    var rowInputs = $("#u-inputs");
    
    var div = $("<div/>")
        .attr("id", pointNumber)
        .attr("style", "margin-left:10px;margin-right:10px; width:55px;")
        .attr("class", "input-field col l3 s3 m");
    
    var input = $("<input/>")
        .attr("id", pointNumber)
        .attr("value", pointValue.toFixed(2)) //coloquei isso para não ficar aparecendo muitos digitos depois da virgula
        .attr("class", "active")
        .attr("type", "number")
    
    var label = $("<label/>")
        .attr("for", pointNumber)
        .attr("class", "active")
        .text("Ponto "+pointNumber);
    
    div.append(input);
    div.append(label);
    
    rowInputs.append(div);
}  //metodo para adicionar inputs

function clearInputs() {
    $( "#u-inputs" ).empty();
} // metodo para limpar o canvas

$("#u-update-button").on("click", updateValuesU);

function updateValuesU() {
    var uInputs = $("#u-inputs input");
    for (var i = 0 ; i < uInputs.length ; i++) {
        valoresU[i] = parseInt(uInputs[i].value);
    }
}

function clearCanvas() {
  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var l = 0; //segmento
    i= 2;
    j= 1;
    
    points = []; // pontos d adicionados ao clique
    qntPontos = 0;
    grau = qntPontos - 1;
    precisao = 2000, parametro = 1 / precisao;

    //BSPLINE ARRAY
    l = 0; //segmento
    i= 2;
    j= 1;
    pontosBspline=[0,1]; // pontos do bspline até 4 pontos
    copy=[]; //array com as copias dos pontos do array antes de um click.

    
    valoresU = [];
    u = 0; 
    
    fakePoints =[]; // pontos d adicionados ao clique ---> fake em forma de algorismo
    qntCurvas = 1;

    fechada = false;
    
    clearInputs();
} //metodo que reinicia todas variveis

function initCanvasSize() {
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
        
      if(qntPontos >= 3)    {
            makeCurva(array);
        }  
  }
  

}

function verdade(){
    fechada=true;
} //metodo que diz se o radio button de fechado foi clicado

function falso(){
    fechada=false;
    drawBsplines();
} //metodo que diz se o radio button de fechado não foi clicado

initCanvasSize();



// ----------------- ACOES NO MOUSE
canvas.addEventListener('mousedown', e => {
    var click = {x: e.offsetX, y: e.offsetY, v:{x: 0, y:0}};
    
    points.push(click); //adicionando no points
    u  = u + 1; 
    if (u===1){
        valoresU.push(0); //se u1 entao o parametro sera igual a 0
    }else{
        var cordaU = calculoCorda(u); // se u>1 entao o parametro sera igual a corda.
        valoresU.push(cordaU);
        
    }
    console.log("valores de default: ", valoresU);
    qntPontos = points.length;

    //incrementValoresU();
    addInput(qntPontos-1, valoresU[qntPontos-1]);

    //fakePoints.push(qntPontos); //adicionando no points fake 
    l = qntPontos - 3;   //alterando valor de l -- segmentos utilizado por vezes no bspline
    var pontosDaCurva = bspline(l,i,j); //rodando o bspline
    if (qntPontos > 4){
        if(fechada===false){
            pontosDaCurva.push(click);
        }else {
            pontosDaCurva.push(points[0]);
        } //adicionando o ponto no final
        qntCurvas++;
    }
    if(qntPontos > 4){
        i = i + 1;
        j = j + 1;
    }
    //imprimir(pontosDaCurva);

    pontosBspline.splice(0,pontosBspline.length);
    pontosBspline = pontosDaCurva.slice(0, pontosDaCurva.length);

    copy = pontosDaCurva.slice(0,pontosDaCurva.length+1);  //O COPY TA FUNCIONANDO 
    //console.log( "valor de i: ",i, "valor de j: ", j);
    //console.log("segmento: ", l);
    //console.log("quantidade de pontos: ", qntPontos,"quantidade de curvas : ",qntCurvas );
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
  
}, 500);