function countDown(counter){
    let count = setInterval(() => {
        console.log(counter);
        counter--;
        if(counter == 0){
            console.log("Happy New year!")
            clearInterval(count)
        }
    }, 1000);
    
}

countDown(7)