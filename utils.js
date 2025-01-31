function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){
/*

    Ix = Ax+(Bx-Ax)t = Cx+(Dx-Cx)u
    Iy = Ay+(By-Ay)y = Cy+(Dy-Cy)u

    (Ax-Cx)+(Bx-Ax)t = (Dx-Cx)u ---- Eq-1
    (Ay-Cy)+(By-Ay)y = (Dy-Cy)u ---- Eq-2

    
    We want u = ? (eliminate t)

    uTop = (Cy-Ay)(Ax-Bx) - (Cx-Ax)(Ay-By)
    uBottom = (Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)
    u = uTop / uBottom
    

    We want t = ? (eliminate u)

    tTop = (Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx)
    tBottom = (Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)
    t = tTop / tBottom

    Also ... try to check bottom != 0

*/
    const uTop = (C.y-A.y)*(A.x-B.x) - (C.x-A.x)*(A.y-B.y)
    const tTop = (D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x);
    const bottom = (D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y);
    if(bottom!=0){
        const u = uTop / bottom;
        const t = tTop / bottom;
        if(t>0 && t<=1 && u>=0 && u<= 1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t,
            }
        }
    }
    return null;
    
}


function polyIntersect(poly1,poly2){
    for(let i=0; i<poly1.length; i++){
        for(let j=0; j<poly2.length; j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}
