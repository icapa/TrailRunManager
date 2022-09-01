/*
Food requiremens
Hay que revisar esto con el pdf
*/

let macroBase = {
    w:0,
    h:0,
    s:0
}

let foodRequirements={
    w: {
        min: 400,
        max: 700
    },
    h:{
        min: 50,
        max: 100
    },
    s:{
        min: 500,
        max: 800
    }  
};


let foodComponents=[
    {
        id:1,
        name: 'Agua',
        description: 'Poco que decir',
        unit: 'ml',
        macros: {w:500, h:0, s:0}
    },
    {
        id:2,
        name: 'Sales 226',
        description: 'Unidad de pastilla de 226',
        unit: 'mg',
        macros: {w:0, h:0, s:141}
    },
    {
        id:3,
        name: 'Barrita Keepgoing',
        description: 'Barrita de sabores de keepgoging',
        unit: 'u',
        macros:{w:0,h:40,s:10}
    }
]

let addfoodComponent = (name,description,unit,w,h,s)=>{
    let newId=foodComponents.length+1;
    let newComponent={
        id:newId,
        name:name,
        description:description,
        unit:unit,
        w:w,
        h:h,
        s:s
    }
    foodComponents.push(newComponent);
}



let food=[];

/* Take food and calculate all macros */
let calculateTotalMacros=()=>{
    var totalMacros;
    Object.apply(totalMacros,macroBase);
    food.forEach(element => {
        totalMacros.w = totalMacros.w + element.w;
        totalMacros.h = totalMacros.h + element.h;
        totalMacros.s = totalMacros.s + element.s;
    });
    return totalMacros;
}


// Requerimientos según los poi
let createFoodList = (poi)=>{


}

let calculateMacrosByTime = (timeObject)=>{
    let hours = (timeObject)/1000/60/60;
    return({
        w:{
            min: foodRequirements.w.min*hours,
            max: foodRequirements.w.max*hours
        },
        h:{
            min:
            max:foodRequirements.h.max*hours
        },
        s:{
            min:
            max:foodRequirements.h.max*hours
        }
    })
}