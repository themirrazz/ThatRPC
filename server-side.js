/*
(C) themirrazz 2023.
*/

var http = require('http');

var Apps = [
    {
        id: 'apple-music',
        name: 'Apple Music',
        active: false,
        variables: {
            songTitle: "Not Playing",
            songArtist: "Not Playing",
            albumTitle: "Not Playing",
            albumArtist: "Not Playing",
            timestamp: 0
        },
        details: function () {
            return {
                name: "Apple Music",
                details: this.variables.songTitle,
                state: this.variables.songArtist + " • " + this.variables.timestamp,
                appId: 1,
                type: 2,
                buttons: [
                    {
                        text: 'Play on Apple Music',
                        url: 'https://music.apple.com/'
                    }
                ]
            }
        }
    }
];

function updS() {
    for(var i = 0; i < Apps.length; i++) {
        if(Apps[i].active) {
            stat = Apps[i].details();
        }
    }
}

var stat = {};

var local = http.createServer(function (req, res) {
    var ur3 = new URL('http://localhost'+req.url);
    if(ur3.pathname == "/" && req.method == "GET") {
        res.writeHead(200,{'content-type':'application/json','access-control-allow-origin':'*'});
        res.write(JSON.stringify(stat));
        res.end();
    } else if(
        ur3.pathname.startsWith("/upd/") &&
        !isNaN(ur3.pathname.split("/")[2]) &&
        Apps[Number(ur3.pathname.split("/")[2])]
        && req.method == 'POST'
    ) {
        var dd = "";
        req.on('data', chunk => dd+=chunk);
        req.on('end', _ => {
            try {
                dd = JSON.parse(dd);
            } catch (error) {
                res.writeHead(400,{'content-type': 'text/plain','access-control-allow-origin':'*'});
                res.write("o_O");
                return res.end()
            }
            res.writeHead(204,{'access-control-allow-origin':'*'});
            res.end();
            var kk = Object.keys(dd);
            kk.forEach(k => {
                if(k == 'active') {
                    if(dd[k]) {
                        Apps[Number(ur3.pathname.split("/")[2])].active = true;
                    } else {
                        Apps[Number(ur3.pathname.split("/")[2])].active = false;
                    }
                } else {
                    Apps[Number(ur3.pathname.split("/")[2])].variables[k] = dd[k];
                }
            });
            updS();
        });
    } else {
        res.writeHead(400,{'content-type': 'text/plain','access-control-allow-origin':'*'});
        res.write("o_O");
        return res.end();
    }
});

local.listen(80);
