function showTime(){
    let counter =0;
    let interval = setInterval(() => {
        let d = new Date();
        let seconds = String(d.getSeconds()).padStart(2,0);
        let minutes = String(d.getMinutes()).padStart(2,0);
        let hours = String(d.getHours()).padStart(2,0);
        console.log(hours, minutes, seconds);
        counter++;
        if(counter == 10){
            clearInterval(interval);
            console.log("Clock stopped")
        }

    }, 1000);

}

showTime();