function greet(name, callback){
    console.log(`Hello ${name}`)
    callback();
}

greet("Jayanth", function(){
    console.log("Have a nice day!");
})