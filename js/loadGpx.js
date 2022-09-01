const labels = [];

const data = {    
    labels: labels,
    datasets: [{
        label: 'Elevación',
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.4,
        fill:false,
        pointStyle:'circle',
        pointRadius:0,
        pointHoverRadius: 15,
        data: [],
    }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        animation:{
            onComplete: (animation)=>{
                console.log("Grafica renderizada");
                
                pointsOfInterest.forEach((element,index)=>{
                    

                }); 
            }
        },
        onClick: (e)=>{
            const canvasPosition = Chart.helpers.getRelativePosition(e,myChart);
            const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x)/10;
            const dataY = myChart.scales.y.getValueForPixel(canvasPosition.y);
            console.log("El indice es: " + myChart.config.data.labels.indexOf(dataX));
            console.log("El valor es: " + myChart.config.data.datasets[0].data[myChart.config.data.labels.indexOf(dataX)]);
            console.log("El varlor en labels es: "+myChart.config.data.labels[myChart.config.data.labels.indexOf(dataX)]);
            
            addPoiBasic(myChart.config.data.labels[myChart.config.data.labels.indexOf(dataX)],
                myChart.config.data.datasets[0].data[myChart.config.data.labels.indexOf(dataX)]);
        }
    },  

};

var actualGpxName;

function reduceGpx(labels,data,time,step){
    newLabelData = labels.map((e)=>{
        return Math.round(e/step);
    })

    newIndex=[];

    goodNewData = newLabelData.filter((item,pos)=>{
        if (newLabelData.indexOf(item)===pos){
            newIndex.push(pos);
        }
        return (newLabelData.indexOf(item)===pos);
    });

    returnLabels = goodNewData.map((e)=>{
        return (e*step)/1000;
    })

    returnData = newIndex.map((e)=>{
        return data[e];
    })
    returnTime = newIndex.map((e)=>{
        return time[e];
    })
    return{'labels':returnLabels,'data':returnData,'time':returnTime};
}









var gpx = new gpxParser(); //Create gpxParser Object
var myChart = new Chart(document.getElementById('myChart'),config);

var gpxResult = new gpxParser();    // Object Parser

document.querySelector("#file-input-result").addEventListener('change',(e)=>{
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load',(e)=>{
        let text = e.target.result;
        gpxResult.parse(text);
        var newData = reduceGpx(gpxResult.tracks[0].distance.cumul,
                                gpxResult.tracks[0].points.map((e)=>{return e.ele}),
                                gpxResult.tracks[0].points.map((e)=>{return e.time}),100);

        calculatePoiResult(newData.labels,newData.time);
        renderPoints(null,'tableResult',pointsOfInterestResult);
    });
    reader.readAsText(file);

});


document.querySelector("#file-input").addEventListener('change',(e)=>{
    let file=e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load',(e)=>{
        let text = e.target.result;
        gpx.parse(text);
        
        var newData = reduceGpx(gpx.tracks[0].distance.cumul, 
                                gpx.tracks[0].points.map((e)=>{return e.ele}),
                                gpx.tracks[0].points.map((e)=>{return e.time}),100);
        

        
        myChart.config.data.datasets[0].data=newData.data;
        myChart.config.data.labels = newData.labels;
        myChart.options.plugins.title.display=true;
        myChart.options.plugins.title.text=file.name;

        



        myChart.update();
        document.getElementById('myChart').style.display="block";


    
        
        
        
        
        loadPoiTable();
        
        
        if (pointsOfInterest.length==0){
            addPoiBasic(myChart.config.data.labels[0],myChart.config.data.datasets[0].data[0]);
        }else{
            
            renderPoints(onInputDataChange,'tablePoi',pointsOfInterest);
        }
        
        
    })
    reader.readAsText(file);
   

});

