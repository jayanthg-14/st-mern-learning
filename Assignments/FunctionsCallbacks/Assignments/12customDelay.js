function waitAndSay(message, delay){
    setTimeout(() => {
        console.log(message);
    }, delay);
}

waitAndSay("Good morning", 1000)
waitAndSay("Good afternoon", 2000)
waitAndSay("Good night", 3000)