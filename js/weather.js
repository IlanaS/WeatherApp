


var cookieName = "IlanaWeatherAppSelectedCity";
// Pre selected cities 
var cities=["San Francisco CA", "Sunnyvale CA", "San Jose CA", "Santa Clara CA"];
// To save city between sessions, it will need to be from the pre selected cities
var nameSelCity=null;// Name of the selected city
var elem10Days=null;
var elemSelCity=null;//HTML Element of the selected city

var elemTopHeader ;// The header element that needs to be sticked
var stickyOffset ; // The int value of the offset

// Retrieve the selected city that was saved by cookie
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
        if (elemSelCity != null){
        	elemSelCity.className="";
        }
       	aCity.className="active";
        elemSelCity=aCity;
        nameSelCity=cityName;
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
    
// This function is being called on page load
var initAll=function(){
    initNames();
    initStickHeader();
}

var stickHeader=function(){
    if (window.pageYOffset >= stickyOffset) {
        elemTopHeader.classList.add("sticky")
      } else {
        elemTopHeader.classList.remove("sticky");
      }
 }

 var initStickHeader=function(){
    elemTopHeader = document.getElementById("topHeader");
    stickyOffset = elemTopHeader.offsetTop;
}

// Initialize Create the list of cities elements from the list
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
           nameSelCity = cities[i];
      }
   }
// To select at least one city if no cookie was saved before
// Or the last cookie was not from the city list above
   if (elemSelCity==undefined){
       elemSelCity=elemFstCity;
       nameSelCity = cities[0];
   }

   if (elemSelCity!=undefined){
    selCityObj(elemSelCity);
   }
};

var selCityObj=function(objCity){
	var arrActive = document.getElementsByClassName("active");
    if (elemSelCity != undefined){
    	elemSelCity.className="";//remove prev active class
    }
    elemSelCity = objCity;
    nameSelCity = objCity.innerHTML;
    objCity.className="active";
    document.cookie = cookieName+"="+objCity.innerHTML+";path=/";
    // Create new script element
    var scriptObj = document.createElement ("script");
    scriptObj.id="id_currWeatherScript";
   var strQuery = "https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+ nameSelCity + "')&format=json&callback=callbackFunction"; 
   scriptObj.setAttribute("src", strQuery);
   var objNav = document.getElementById("idNav");
   // Add new script element to DOM
   try{
    objNav.appendChild(scriptObj); 
   }catch (ex){
       alert (ex.message);
   }
};

var callbackFunction = function(data) {
    try{
        if (data.query.results == null){
            alert ("No weather results for "+nameSelCity);
            return;
        }
        // If we already got some results, then we are safe to remove the days elements,
        // Since we immediatelt create new days for the new selected city
        if (elem10Days != null){
            document.getElementById ("idDay").removeChild(elem10Days);
        }
        var objItem = data.query.results.channel.item;
        document.getElementById("idContentHeader").innerHTML=objItem.title+" Temp:"+objItem.condition.temp+", "+objItem.condition.text;
        var arrWeekForcast = objItem.forecast;
        elem10Days = document.createElement("div");
        for (var i=0; i< arrWeekForcast.length; i++){
        var day = document.createElement("p");
        day.className="weatherDay";

        // For the day date
        var name = document.createElement("p");
        name.className="dayDate";
        name.innerHTML = arrWeekForcast[i].day+","+arrWeekForcast[i].date;      
        day.appendChild (name);
        
        var high = document.createElement("p");
        high.innerHTML = "High: "+arrWeekForcast[i].high;      
        day.appendChild (high);
        
        var low = document.createElement("p");
        low.innerHTML = "Low: "+arrWeekForcast[i].low;      
        day.appendChild (low);
        
        var text = document.createElement("p");
        text.className="weatherDayDesc";
        text.innerHTML = arrWeekForcast[i].text;      
        day.appendChild (text);
        
        elem10Days.appendChild(day);
        }
    
        document.getElementById ("idDay").appendChild(elem10Days);

        // Remove previous script element
        var objScript=document.getElementById("id_currWeatherScript");
        var objScriptParent = document.getElementById("idNav");
        if (objScriptParent != null){
            objScriptParent.removeChild(objScript);
        }
    }catch (ex){
        alert (ex.message);
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
