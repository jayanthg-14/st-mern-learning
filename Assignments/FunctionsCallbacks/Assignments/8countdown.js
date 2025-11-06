function startCountdown(){
    let counter = 5;
    let count = setInterval(() => {
        console.log(counter--);
        if(counter == -1){
            console.log("Time's up!")
        clearInterval(count)
    }
    }, 1000);
    
}

startCountdown()