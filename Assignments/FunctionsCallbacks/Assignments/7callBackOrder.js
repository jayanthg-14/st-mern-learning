function cookRice(callback){
    console.log("Cooking Rice");
    setTimeout(() => {
        console.log("Rice Ready");
        callback();
    }, 2000);
}

function eatRice(){
    console.log("Eating now")
}
cookRice(eatRice);