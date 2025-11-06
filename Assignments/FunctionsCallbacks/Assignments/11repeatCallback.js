function repeatMessage(message, times){
    let counter = 0
    let interval = setInterval(() => {
        console.log(message);
        counter++;
        if (counter == times){
            clearInterval(interval);
        }
    }, 1000);
}

repeatMessage("Pracice makes man Perfect!", 3)