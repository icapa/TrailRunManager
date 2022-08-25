
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
        marginCut: null
        
    };
}

function addPoiBasic(km, height){
    var poi=poiBasic();
    poi.km=km;
    poi.height=height;
    pointsOfInterest.push(poi);
    if (pointsOfInterest.length==1){
        var t = new Date();
        t.setHours(10,0,0);
        pointsOfInterest[0]['estimTime']=t;
        pointsOfInterest[0]['vkph']=null;

    }
} 


let onInputDataChange = (element)=>{
    var elementArray = element.currentTarget.id.split('_');
    let key=elementArray[0];
    let index=elementArray[1];
    pointsOfInterest[index][key]=parseFloat(element.currentTarget.value);
    calculatePointTable();
    renderPoints(onInputDataChange);
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

    pointsOfInterest.forEach(element => {
        var row = myTable.insertRow();
        Object.keys(element).forEach(key=>{
            var cell = row.insertCell();
            if(key==='vkph'){
                let theValue = element[key]==null?'':element[key];
                let theId = key+"_"+pointsOfInterest.indexOf(element).toString();
                cell.innerHTML="<input type='number' value='"+theValue+"' id='"+theId+"'>"
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
            }

            else{
                cell.innerHTML=element[key];
            }
            
        })
    
    });
}


// Test


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



