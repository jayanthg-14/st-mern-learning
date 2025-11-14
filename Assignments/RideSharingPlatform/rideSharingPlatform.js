const DRIVERS = [
  { id: "D001", name: "Arjun", available: true },
  { id: "D002", name: "Meera", available: true },
  { id: "D003", name: "Rahul", available: false }
];

// Array of rider objects
const RIDERS = [
  { id: "R001", name: "Sundeeep", walletBalance: 1000 },
  { id: "R002", name: "Keerthi", walletBalance: 200 }
];

// Empty array to store ride objects
let RIDES = [];


function matchDrivers(drivers){
    let driver = undefined;

    for(let i = 0 ; i<drivers.length; i++){
        if(drivers[i].available == true){
            driver = drivers[i];
            break;
        }
    
    return driver;
}

function calculateFare(distance, ratePerKm){
    return distance * ratePerKm
}

function processPayment(rider, fare){
    if(rider.walletBalance < fare){
        return null;
    }
    else{
        rider.walletBalance -= fare;
        return rider
    }
}

function createRide(rider, driver, distance, fare){
    let ride = {  
        "rideId":String(RIDES.length+1).padStart(3,0),
        "riderId":rider.id,
        "driverId":driver.id,
        "distance": distance,
        "fare": fare,
        "status": "CONFIRMED"
    }
    return ride
}


function saveRide(rides, ride, driver){
    rides.push(ride);
    driver.available = false;
    return {
        rides: rides,
        driver: driver
    }
}


function requestRide(riderId, distance){
    let rider = null;
    for(i = 0 ; i<RIDERS.length; i++){
        if(RIDERS[i].id==riderId){
            rider = RIDERS[i];
        }
    }

    if(rider == null){
        console.log("Rider Not Found");
        return
    }

    let driver = matchDrivers(DRIVERS);
    if(driver == undefined){
        console.log("No drivers available")
        return
    }

    let fare = calculateFare(distance, 20);


    rider = processPayment(rider, fare);
    if(rider == null){
        console.log("Insufficient funds")
        return
    }

    let ride = createRide(rider, driver, distance, fare);

    saveRide(RIDES, ride, driver);
    
    console.log(`Ride Confirmed:` , ride);
    console.log(`Updated Rider:` , rider);
    console.log(`Updated Driver:` ,driver);

}
requestRide("R002",10)
requestRide("R002",10)
requestRide("R001",10)
requestRide("R003",10)
requestRide("R002",10)