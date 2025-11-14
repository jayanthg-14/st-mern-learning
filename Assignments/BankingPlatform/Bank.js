function createBankAccount(initialDeposit=0, pin){
    let bankBalance = initialDeposit;
    const transactionHistory = [];
    // {transactionId, dateAndTimeOfTransaction, transactionType, amount}

    if(!pin || pin.length!=4 || !parseInt(pin)){
        console.log("Pin does not match requirements!");
        return
    }

    if(initialDeposit > 0){
        transactionHistory.push({
            transactionId: `${transactionHistory.length + 1}`,
            dateAndTimeOfTransaction: getCurrentDateAndTime(), 
            transactionType: "initial deposit",
            amount: initialDeposit
        })
        console.log(`Initially deposited ${initialDeposit} successfully!`)
    }

    function getCurrentDateAndTime(){
        const now = new Date();
        return now.toISOString();
    }

    function currentBalance(){
        console.log(`Total Bank Balance: ${bankBalance}`)
    }

    function printStatement(){
        if(transactionHistory.length === 0){
            return;
        }

        transactionHistory.map((transaction) => {
            let dateObj = new Date(transaction.dateAndTimeOfTransaction);
            let dateTimeString = `${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()} -${dateObj.getDate()}/${dateObj.getMonth()+1}/${dateObj.getFullYear()}`
            console.log(`${dateTimeString} - ${transaction.transactionType} : ${transaction.amount}`)
        })
            

        currentBalance()
    }

    function depositAmount(amountToBeDeposited, checkPin)
    {
        if(checkPin!=pin){
            console.log("wrong PIn")
            return
        }

        checkTransactionLimit(amountToBeDeposited);
                
        bankBalance = bankBalance + amountToBeDeposited
        transactionHistory.push({
            transactionId: `${transactionHistory.length + 1}`,
            dateAndTimeOfTransaction: getCurrentDateAndTime(),
            transactionType: "deposit",
            amount: amountToBeDeposited
        })

        console.log(`Successfully deposited ${amountToBeDeposited} into you bank account.`);

        // currentBalance();
    }

    function pinChange(oldPin, newPin){
        if(oldPin!=pin){
            console.log("Enter correct Pin")
            return 
        }
        if(newPin.length == 4 && parseInt(pin))
        {
            pin = newPin;
            console.log("pin Changed!")
        }
        else{
            console.log("Pin not matching requirements");
            return
        }
    }

    function withdrawAmount(amountToBeWithdrawn, checkPin){
        if(checkPin!=pin){
            console.log("wrong PIn")
            return
        }
                
        
        if(amountToBeWithdrawn > bankBalance){
            console.log("Insufficient Balance!");
            currentBalance();
            return
        }

        checkTransactionLimit(amountToBeDeposited);



        bankBalance = bankBalance - amountToBeWithdrawn;
        transactionHistory.push({
            transactionId: `${transactionHistory.length + 1}`,
            dateAndTimeOfTransaction: getCurrentDateAndTime(), 
            transactionType: "withdraw",
            amount: amountToBeWithdrawn
        })
        console.log(`Successfully withdrawn ${amountToBeWithdrawn} from you bank account.`)
        currentBalance();
    }

    function checkTransactionLimit(transactionAmount){
        let totalAmt = 0;
        let time = 0
        let presentTransactionDateTime = new Date(getCurrentDateAndTime());
        totalAmt+= transactionAmount;

        for(let i = 0; i< transactionHistory.length; i++)
        {
            let transactionDateTime = new Date(transactionHistory[i].dateAndTimeOfTransaction);
            let difference = (presentTransactionDateTime - transactionDateTime)/1000 ;
            totalAmt+= transactionHistory[i].amount
            console.log(difference);
            console.log(totalAmt); 
            if(difference<30 && totalAmt>10000)
            {
                console.log("Transaction limit exceeded")
                return
            }
            else if(difference>30)
            {
                break;
            }
        }
    }

    return {
        depositAmount,
        printStatement,
        currentBalance,
        withdrawAmount,
        pinChange
    }
}

const sundeeepAccount = createBankAccount(100000,"7612")




sundeeepAccount.pinChange("7612", "9999");

setTimeout(() => {
sundeeepAccount.depositAmount(3000, "9999");    
}, 20000);

setTimeout(() => {
sundeeepAccount.depositAmount(4000, "9999");    
}, 35000);


// sundeeepAccount.printStatement();


