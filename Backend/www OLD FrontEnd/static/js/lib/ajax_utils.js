console.log(document.currentScript);


function RedirectNow(url){
    window.location.replace(url);
    document.stop();
    document.execCommand('Stop');
};

function ChangeLocation(url){
    window.location.href = url;
};

