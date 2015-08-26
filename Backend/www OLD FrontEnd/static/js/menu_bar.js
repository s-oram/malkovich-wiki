//console.log(document.currentScript);

function OnClick_HomeButton(){
    var href = '/doc';
    ChangeLocation(href);
}

function OnClick_BackButton(){
    if (window.history) {
        window.history.back();

    }
}

function OnClick_ForwardButton(){
    if (window.history) {
        window.history.forward();
    }
}

window.onpopstate = function(event) {
    alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};



$(document).ready(function(){
    //$("div#MenuBar-Logo").click(OnClick_HomeButton);
    $("div#MenuBar-HomeButton").click(OnClick_HomeButton);
    $("div#MenuBar-BackButton").click(OnClick_BackButton);
    $("div#MenuBar-ForwardButton").click(OnClick_ForwardButton);
});

