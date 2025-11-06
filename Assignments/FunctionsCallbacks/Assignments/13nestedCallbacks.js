function makeTea(callback){
    setTimeout(() => {
        console.log("Tea ready!"); //this waits for 2s
        callback();
    }, 2000);
}

function serveTea(callback){
    setTimeout(() => {
        console.log("Serving Tea...") //this waits for 1s
        callback()
    }, 1000);
}

function drinkTea(){
    console.log("Drinking Tea");// this prints immediately
}


makeTea(function() {
  serveTea(function() {
    drinkTea();
  });
});