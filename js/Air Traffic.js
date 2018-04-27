var lat, lng, access = false, km, AirlineList = [], logo;
var Aimg = '\u2708';


var x = document.getElementById("GeoLocation");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    access = true;
    ShowData();


}


function ShowData() {
    if (access) {
        km = document.getElementById("JS-Range").value;
        var eee="://";
        console.log(eee);
        $.getJSON('https'+eee+'public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=' + lat + '&lng=' + lng + '&fDstL=0&fDstU=' + km, function (data) {
            data.acList.sort(function (a, b) {
                return -(a.GAlt - b.GAlt);
            });
            $.each(data.acList, function (i, item) {



                var avion = {"Company": item.Op,
                    "RegBroj": item.Icao,
                    "PolazakIz": item.From,
                    "Destinacija": item.To,
                    "Proizvodjac": item.Man,
                    "Model": item.Mdl,
                    "Logo": ""};
                AirlineList.push(avion);

                var Visina_Letenja = item.GAlt / 3.2808;
                Visina_Letenja = roundToTwo(Visina_Letenja);
                if (item.Trak <= 180) {
                    x.innerHTML += '<div class="Select" data-toggle="modal" data-target="#myModal" data-Icao=' + item.Icao + '><p class="col-sm-4">' + Aimg + '</p> <p class="col-sm-4">Visina: ' + Visina_Letenja + ' m</p><p class="col-sm-4">Kod leta:' + item.Icao + '</p></div>';
                } else {
                    x.innerHTML += '<div class="Select" data-toggle="modal" data-target="#myModal" data-Icao=' + item.Icao + '><p class="col-sm-4 avion">' + Aimg + '</p> <p class="col-sm-4">Visina: ' + Visina_Letenja + ' m</p><p class="col-sm-4">Kod leta:' + item.Icao + '</p></div>';
                }
            });
        });
    }
}

function  GetLogo(company) {
    $.getJSON('https://autocomplete.clearbit.com/v1/companies/suggest?query=:' + company, function (data) {
        var i = 0;
        setTimeout(function () {
            for (t = 0; t < data.length; t++) {
                if (data.length > 0) {
                    if (data[i].logo == "undefined") {
                        i++;
                    } else {
                        logo = data[i].logo;
                        break;
                    }
                }


            }
        });
    }, 800);

}
;





function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "<h1>User denied the request for Geolocation.</h1>"
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "<h1>Location information is unavailable.</h1>"
            break;
        case error.TIMEOUT:
            x.innerHTML = "<h1>The request to get user location timed out.</h1>"
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "<h1>An unknown error occurred.</h1>"
            break;
    }
}

function Osvezi() {
    AirlineList = [];
    x.innerHTML = "<p>Air Traffic List</p><hr>";
    ShowData();
}


getLocation();


$(document).on("click", ".Select", function () {
    var j = 0, i;
    var elem = $(this);
    var code = elem[0].dataset.icao;
    for (i = 0; i < AirlineList.length; i++) {
        if (code == AirlineList[i].RegBroj) {
            j = i;
        }
    }
    GetLogo(AirlineList[j].Company);

    $("#Logo").html("");
    var ImeKompanije = AirlineList[j].Company;
    var Polazak = AirlineList[j].PolazakIz;
    var Destinacija = AirlineList[j].Destinacija;
    var Proizvodjac = AirlineList[j].Proizvodjac;
    var Model = AirlineList[j].Model;
    if (ImeKompanije == null) {
        ImeKompanije = "Nedostupan podatak;"
    }
        if (Polazak == null) {
        Polazak = "Nedostupan podatak;"
    }
        if (Destinacija == null) {
       Destinacija = "Nedostupan podatak;"
    }
        if (Proizvodjac == null) {
        Proizvodjac = "Nedostupan podatak;"
    }
        if (Model == null) {
       Model = "Nedostupan podatak;"
    }
    (document).getElementById("Naslov").innerHTML = "Company: " + ImeKompanije;
    (document).getElementById("MestoPolaska").innerHTML = "Mesto polaska: " + Polazak;
    (document).getElementById("Odrediste").innerHTML = "Odrediste: " + Destinacija;
    (document).getElementById("ProizvodjacAviona").innerHTML = "Proizvodjac: " + Proizvodjac;
    (document).getElementById("ModelAviona").innerHTML = "Model: " + Model;

    setTimeout(function () {
        (document).getElementById("Logo").innerHTML = "<img src='" + logo + "' alt='logo'>";
        logo = "LOGO";
    }, 900);





});

$(document).ready(function () {
    $(document).on('shown.bs.modal', '#myModal', function () {




    });
});

setInterval(function () {
    Osvezi();
}, 60 * 1000);

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
