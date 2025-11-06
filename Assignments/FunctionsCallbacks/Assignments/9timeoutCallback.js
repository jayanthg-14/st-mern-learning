function washClothes(callback){
    console.log("Washing Clothes..");
    setTimeout(() => {
        console.log("Done washing!")
        callback();
    }, 3000);
}

function dryClothes(){
    console.log("Drying clothes...")
}

washClothes(dryClothes);