
let pointsOfInterest=[];

let poiBasic = ()=>{   

    return {
        km: null,
        vkph: 5,
        height: null,
        estimTime: null,
        cutTime: null,
        diffKm:null,
        level: null,
        minkm: null,
        timeDiff:null,
        accumDiff: null,
        marginCut: null,
        food: null
    };
}


function savePoiTable(){
    var theFiles=document.querySelector("#file-input");
    var poiFileName=theFiles.files[0].name.split('.')[0];
    console.log("Guardando en..."+poiFileName);
    localStorage.setItem(poiFileName,JSON.stringify(pointsOfInterest));
    
}

function loadPoiTable(){
    var theFiles=document.querySelector("#file-input");
    var poiFileName=theFiles.files[0].name.split('.')[0];
    console.log("Cargando en..."+poiFileName);
    var testInput=JSON.parse(localStorage.getItem(poiFileName));
    console.log(testInput);
    
    if (testInput!=null){
        testInput.forEach(element => {
            
            if (element['estimTime']!=null)
                element['estimTime']=new Date(element['estimTime']);
             
            if (element['cutTime']!= null) 
                element['cutTime']=new Date(element['cutTime']);

            pointsOfInterest.push(element);
        });
        //Object.assign(pointsOfInterest,testInput);
        //calculatePointTable();

        
    }
    

}


function addPoiBasic(km, height){
    var poi=poiBasic();
    poi.km=km;
    poi.height=Math.floor(height);
    pointsOfInterest.push(poi);
    if (pointsOfInterest.length==1){
        var t = new Date();
        t.setHours(10,0,0);
        pointsOfInterest[0]['estimTime']=t;
        pointsOfInterest[0]['vkph']=null;

    }
    calculatePointTable();
    renderPoints(onInputDataChange);
} 
function removePoi(index){
    pointsOfInterest.splice(index,1);
    calculatePointTable();
    renderPoints(onInputDataChange);
}


let onClickDelete = (element) =>{
    var elementArray = element.currentTarget.id.split('_')[1];
    removePoi(elementArray);
}
let onInputDataChange = (element)=>{
    var elementArray = element.currentTarget.id.split('_');
    let key=elementArray[0];
    let index=elementArray[1];
    pointsOfInterest[index][key]=parseFloat(element.currentTarget.value);
    calculatePointTable();
    renderPoints(onInputDataChange);
}

let onFoodClickElement = (element)=>{
    var elementArray = element.currentTarget.id.split('_')[1];
    console.log("El indice food es: " + elementArray);
    let food = prompt('Avituallamiento: Agua[A], Comida[C]?');
    if (food!=null){
        pointsOfInterest[elementArray]['food']=food.split(' ');
        calculatePointTable();
        renderPoints(onInputDataChange);
    }
}
let onClickGuardar = (element)=>{
    console.log(element.target.id);
    savePoiTable();
}
let onCutTimeClick = (element)=>{
    var elementArray = element.currentTarget.id.split('_')[1];
    let cur= prompt("Tiempo de corte:");
    if (cur!=null){
        arrayTime=cur.split(":");
        let hour = parseInt(arrayTime[0]);
        let min = parseInt(arrayTime[1]);
        if (!isNaN(hour) && !isNaN(min)){
            let newDateCut = new Date(pointsOfInterest[0]['estimTime']);
            newDateCut.setHours(hour,min,0);
            pointsOfInterest[elementArray]['cutTime']=newDateCut;
        }        
        calculatePointTable();
        renderPoints(onInputDataChange);

    }
}

function calculatePointTable(){
    pointsOfInterest.forEach((e,index)=>{
        if (index!=0){
            let tAnt = pointsOfInterest[index-1]['estimTime'];
            let diff = pointsOfInterest[index]['km']-pointsOfInterest[index-1]['km'];
            let diffTime = (diff/pointsOfInterest[index]['vkph'])*60*60*1000;
            let prueba = new Date(tAnt.getTime()+diffTime)
            
            pointsOfInterest[index]['estimTime']=prueba;
            pointsOfInterest[index]['minkm']=60/pointsOfInterest[index]['vkph'];
            pointsOfInterest[index]['diffKm']=pointsOfInterest[index]['km']-pointsOfInterest[index-1]['km'];
            
            pointsOfInterest[index]['level']=pointsOfInterest[index]['height']-pointsOfInterest[index-1]['height'];
            
            let timeTime=(pointsOfInterest[index]['estimTime']-pointsOfInterest[index-1]['estimTime'])/1000;
            pointsOfInterest[index]['timeDiff']=timeTime;

            let timeAccum=(pointsOfInterest[index]['estimTime']-pointsOfInterest[0]['estimTime'])/1000;
            pointsOfInterest[index]['accumDiff']=timeAccum;


            if (pointsOfInterest[index]['cutTime']!=null){
                let marginTime = (pointsOfInterest[index]['cutTime']-pointsOfInterest[index]['estimTime'])/1000;
                pointsOfInterest[index]['marginCut']=marginTime;
            }

            
        }
    })
}



function renderPoints(onInputDataChange){
    let myTable= document.getElementById('myTable');
    myTable.textContent='';
    var row = myTable.insertRow();
    Object.keys(poiBasic()).forEach(key=>{
        var cell = row.insertCell();
        cell.innerHTML=key;
    })

    pointsOfInterest.forEach((element,index) => {
        var row = myTable.insertRow();
        Object.keys(element).forEach(key=>{
            var cell = row.insertCell();
            if(key==='vkph'){
                let theValue = element[key]==null?'':element[key];
                let theId = key+"_"+pointsOfInterest.indexOf(element).toString();
                cell.innerHTML="<input type='number' style='width: 50px' maxlength='5' value='"+theValue+"' id='"+theId+"'>"
                document.getElementById(theId).addEventListener('change',onInputDataChange.bind(element));
                        
            }else if (key==='estimTime'){
                let timeString = element[key]==null?'':element[key].toTimeString().split(' ')[0];
                cell.innerHTML=timeString;
            
            }else if (key==='timeDiff'){
                let hours= element[key]/60/60;
                let floorHours=Math.floor(hours);
                let min=(hours-floorHours)*60;
                let floorMin = Math.floor(min);
                let seg=Math.round((min-floorMin)*60);
                let timeString = element[key]==null?'':floorHours.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})+
                    ":"+floorMin.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})+
                    ":"+seg.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})

                cell.innerHTML=timeString;
            }else if (key==='accumDiff'){
                let hours= element[key]/60/60;
                let floorHours=Math.floor(hours);
                let min=(hours-floorHours)*60;
                let floorMin = Math.floor(min);
                let seg=Math.round((min-floorMin)*60);
                let timeString = element[key]==null?'':floorHours.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})+
                    ":"+floorMin.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})+
                    ":"+seg.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})

                cell.innerHTML=timeString;
            }
            
            else if (key==='minkm'){
                
                let min=Math.floor(element['minkm']);
                let seg = Math.round((element['minkm']-min)*60);
                let minKmString = element[key]==null?'':min.toString()+":"+seg.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false});
                 
                cell.innerHTML=minKmString;
            }else if (key==='diffKm'){
                var diffKmString = element[key]==null?'':element[key].toLocaleString('es-EU',{maximumFractionDigits:2,useGrouping:false});
                cell.innerHTML=diffKmString;
           
            }else if(key==='level'){
                var diffLevel=element[key]==null?'':element[key].toLocaleString('es-EU',{maximumFractionDigits:2,useGrouping:false});
                cell.innerHTML=diffLevel;
                
            }else if (key==='food'){
                cell.id='food_'+index.toString();
                cell.addEventListener('click',onFoodClickElement.bind(element));
                cell.innerHTML=element[key];
            }
            else if (key==='cutTime'){
                cell.id='cuttime_'+index.toString();
                cell.addEventListener('click',onCutTimeClick.bind(element));
                let timeString = element[key]==null?'':element[key].toTimeString().split(' ')[0];
                cell.innerHTML=timeString;
            }else if (key==='marginCut'){
                let theSign= element[key]<0?'-':'';
                
                let absTime=Math.abs(element[key]);
                
                let hours= absTime/60/60;
                let floorHours=Math.floor(hours);
                let min=(hours-floorHours)*60;
                let floorMin = Math.floor(min);
                let seg=Math.round((min-floorMin)*60);
                let timeString = element[key]==null?'':theSign+floorHours.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})+
                    ":"+floorMin.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})+
                    ":"+seg.toLocaleString('es-EU',{minimumIntegerDigits:2,useGrouping:false})
                cell.innerHTML=timeString;
                
                if (element[key]!=null){
                    if (element[key]==0){
                        cell.classList.add('exacttime');
                    }else if (element[key]<0){
                        cell.classList.add('outtime');
                    }else{
                        cell.classList.add('intime');
                    }
                }
            }
            else{
                cell.innerHTML=element[key];
            }
            
        })
        if (index!==0){
            var buttonCell = row.insertCell();
            let buttonId = "delete_"+index.toString();
            buttonCell.innerHTML="<button id='"+buttonId+"'>Delete</button>"
            document.getElementById(buttonId).addEventListener('click',onClickDelete.bind(element));
        }
        

    });
    var saveButton= myTable.insertRow();
    var buttonCell = saveButton.insertCell();
    buttonCell.colSpan="11";
    buttonCell.align='center';
    buttonCell.innerHTML="<button id='save_table'>Guardar</button><button id='load_table'>Cargar</button>"
    //buttonCell.addEventListener('click',onClickGuardar.bind(element));
    document.getElementById('save_table').addEventListener('click',onClickGuardar.bind(this));

}


// Test

/*
addPoiBasic(0,918);
addPoiBasic(2.75,1169);
addPoiBasic(5,812);
addPoiBasic(10,2000);
addPoiBasic(12.3,2181);
addPoiBasic(17.6,1735);
addPoiBasic(21,1154);
addPoiBasic(27,1040);
addPoiBasic(28,918);


renderPoints(onInputDataChange);
renderPoints(onInputDataChange);
*/


