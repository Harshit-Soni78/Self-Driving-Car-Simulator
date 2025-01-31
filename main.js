Traffic_count = 80;
const N=150;


const carCanvas=document.getElementById("carCanvas");
carCanvas.width=300;


const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=400;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const cars=generateCars(N);

let bestCar=cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i=0; i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic=[]
for(let i=0; i<Traffic_count;i++){
    car = new Car(road.getLaneCenter(
        Math.round(Math.random()*road.laneCount)),
        -Math.round(Math.random()*5000),30,50,"DUMMY",
        Math.random()*2.8);
    traffic.push(car);
}


animate();

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    console.log(bestCar.brain)
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0; i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0; i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    road.draw(carCtx)
    for(let i=0; i<traffic.length;i++){
        traffic[i].draw(carCtx,"lightgreen");
    }

    carCtx.globalAlpha=0.2;
    for(let i=0; i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    
    bestCar.draw(carCtx,"blue",true);
    carCtx.globalAlpha=1;

    carCtx.restore();
    // networkCtx.lineDashOffset=-time/10;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
