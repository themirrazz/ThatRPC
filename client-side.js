(() => {
    var old = "";
    setInterval(function () {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(this.readyState == 4) {
                if(this.responseText != old) {
                    old = this.responseText;
                    UpdateCustomRPC(JSON.parse(this.responseText));
                }
            }
        };
        xhr.open("GET", 'http://localhost/');
        xhr.send();
    },1000);
})();
