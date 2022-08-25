
var pointsOfInterest=[];

let poiBasic={
    km: null,
    vkph: null,
    height: null,
    estimTime: null,
    cutTime: null,
    calc:{
        diffKm:null,
        level: null,
        minkm: null,
        marginCut: null
    }
}
function addPoiBasic(km, height){
    var poi=poiBasic;
    poi.km=km;
    poi.height=height;
    pointsOfInterest.push(poi);
    console.log(pointsOfInterest);
} 