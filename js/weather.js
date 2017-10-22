
var cookieName = "IlanaWeatherAppSelectedCity"; 
var cities=["San Francisco CA", "Sunnyvale CA", "San Jose CA", "Santa Clara CA"];
var selectedCity=null;
var arrDays=null;
var elemSelCity;


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    var contentCookie = document.cookie;
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Add one city element
var addOneCity=function(cityName, active){
    var txtCity = document.createTextNode (cityName);
    var aCity = document.createElement("a");
    aCity.setAttribute ("href","#");
    aCity.setAttribute ("onclick","selCityObj(this);");
    aCity.appendChild(txtCity);
    if (active){
        if (selectedCity != null){
        	selectedCity.className="";
        }
       	aCity.className="active";
        selectedCity=aCity;
    }
    var btnClose = document.createElement ("span");
    btnClose.className="closebtn";
    btnClose.innerHTML="X";

    var liCity = document.createElement ("li");
    liCity.appendChild(btnClose);
    liCity.appendChild(aCity);
    document.getElementById("id_ulCities").appendChild (liCity);
    
    btnClose.onclick=function(){
    	liCity.removeChild(aCity);
        liCity.removeChild(btnClose);
        document.getElementById("id_ulCities").removeChild (liCity);
    };
    return aCity;
}
    
var initNames=function(){  
   var cookieCity = getCookie(cookieName);
   var ulObj=document.getElementById("id_ulCities");
   var elemFstCity;
   for (var i=0; i<cities.length; i++){
       var elemCurrCity = addOneCity (cities[i], (cookieCity == cities[i]));
       if (i==0){
           elemFstCity = elemCurrCity;
       }
       if (cookieCity == cities[i]){
           elemSelCity  = elemCurrCity;
           selectedCity = cities[i];
      }
   }
// To select at least one...
   if (elemSelCity==undefined){
       elemSelCity=elemFstCity;
       selectedCity = cities[0];
   }

   if (elemSelCity!=undefined){
    selCityObj(elemSelCity);
   }
 };

var selCityObj=function(objCity){
	if (arrDays != null){
    	document.getElementById ("idDay").removeChild(arrDays);
    }
	var arrActive = document.getElementsByClassName("active");
    if (elemSelCity != undefined){
    	elemSelCity.className="";//remove prev active class
    }
    elemSelCity = objCity;
    selectedCity = objCity.innerHTML;
    objCity.className="active";
    document.cookie = cookieName+"="+objCity.innerHTML+";path=/";
    // Create new script element
    var scriptObj = document.createElement ("script");
    scriptObj.id="id_currWeatherScript";
   var strQuery = "https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+ selectedCity + "')&format=json&callback=callbackFunction"; 
   scriptObj.setAttribute("src", strQuery);
   var objNav = document.getElementById("idNav");
   // Add new script element to DOM
   objNav.appendChild(scriptObj); 
};

var callbackFunction = function(data) {
    var objItem = data.query.results.channel.item;
    document.getElementById("idContentHeader").innerHTML=objItem.title+" Temp:"+objItem.condition.temp+", "+objItem.condition.text;
    var arrWeekForcast = objItem.forecast;
    arrDays = document.createElement("div");
    for (var i=0; i< arrWeekForcast.length; i++){
      var day = document.createElement("p");
      day.style.backgroundColor="lightgrey";
      day.className="weatherDay";

      // For the day date
      var name = document.createElement("p");
      name.style.backgroundColor="lightblue";
      name.style.padding="12px";
      name.style.borderTop="1px solid blue";
      name.style.borderBottom="1px solid blue";
      name.innerHTML = arrWeekForcast[i].day+","+arrWeekForcast[i].date;      
      day.appendChild (name);
      
      var high = document.createElement("p");
      high.innerHTML = "High: "+arrWeekForcast[i].high;      
      day.appendChild (high);
      
      var low = document.createElement("p");
      low.innerHTML = "Low: "+arrWeekForcast[i].low;      
      day.appendChild (low);
      
      var text = document.createElement("p");
      text.innerHTML = arrWeekForcast[i].text;      
      day.appendChild (text);
      
      arrDays.appendChild(day);
    }
    document.getElementById ("idDay").appendChild(arrDays);

    // Remove previous script element
    var objScript=document.getElementById("id_currWeatherScript");
    var objScriptParent = document.getElementById("idNav");
    if (objScriptParent != null){
        objScriptParent.removeChild(objScript);
    }
  };

	var addCity=function(){
    	var newCity = document.getElementById("idNewCity");
        var newCityName = newCity.value;
        if (newCityName != ""){
    		cities.push (newCityName);  
	        var elemNewCity = addOneCity (newCityName, true);
            selCityObj(elemNewCity);
        }
	}
