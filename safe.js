
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