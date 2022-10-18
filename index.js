const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const db_urls = require('./db/urls.json');
const db_clicks = require('./db/clicks.json');
const port = process.env.PORT || 5990;
const now = new Date();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    var thisyear = now.getFullYear();
    var url = req.query.url;
    var n = req.query.length;
    if (url === !url) {
        if (n === !n) {
            res.render('index', {thisyear: thisyear, url: "", n: 8});
        } else if (typeof n === 'number') {
            res.render('index', {thisyear: thisyear, url: "", n: n});
        } else {
            res.render('index', {thisyear: thisyear, url: "", n: 8});
        }
    } else {
        if (n === !n) {
            res.render('index', {thisyear: thisyear, url: url, n: 8});
        } else if (typeof n === 'number') {
            res.render('index', {thisyear: thisyear, url: url, n: n});
        } else {
            res.render('index', {thisyear: thisyear, url: url, n: 8});
        }
    };
});

app.get('/re', (req, res) => {
    var thisyear = now.getFullYear();
    var url = req.query.url;
    var n = req.query.length;
    if (url === !url) {
        if (n === !n) {
            res.render(req, {thisyear: thisyear, url: "", n: 8});
        } else if (typeof n === 'number') {
            res.render('checking', {thisyear: thisyear, url: "", n: n});
        } else {
            res.render('checking', {thisyear: thisyear, url: "", n: 8});
        }
    } else {
        if (n === !n) {
            res.render('checking', {thisyear: thisyear, url: url, n: 8});
        } else if (typeof n === 'number') {
            res.render('checking', {thisyear: thisyear, url: url, n: n});
        } else {
            res.render('checking', {thisyear: thisyear, url: url, n: 8});
        }
    };
});

app.get('/generate', (req, res) => {
    var thisyear = now.getFullYear();
    var url = req.query.url;
    var n = req.query.length;
    if (url === !url) {
        if (n === !n) {
            res.render('generate', {thisyear: thisyear, url: "", n: 8});
        } else if (typeof n === 'number') {
            res.render('generate', {thisyear: thisyear, url: "", n: n});
        } else {
            res.render('generate', {thisyear: thisyear, url: "", n: 8});
        }
    } else {
        if (n === !n) {
            res.render('generate', {thisyear: thisyear, url: url, n: 8});
        } else if (typeof n === 'number') {
            res.render('generate', {thisyear: thisyear, url: url, n: n});
        } else {
            res.render('generate', {thisyear: thisyear, url: url, n: 8});
        }
    };
});

app.post('/create', async (req, res) => {
    var urls_loc = './db/urls.json';
    let urls = JSON.parse(fs.readFileSync(urls_loc));
    var clicks_loc = './db/clicks.json';
    let clicks = JSON.parse(fs.readFileSync(clicks_loc));
    let fullUrl = req.protocol+'://'+req.get('host');
    let d=[];
    var a = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var request = req.body;
    for(var i = 0; i<request.length; i++) {
        d.push(a[Math.round(Math.random()*a.length)]);
    };
    let id=d.join("").toString();
    urls[id]=request.url;
    clicks[id]=0;
    fs.writeFileSync(urls_loc,JSON.stringify(urls));
    fs.writeFileSync(clicks_loc,JSON.stringify(clicks));
    res.render('result', {
        base: 'https://sflinku.eu.org/r?u='+id,
        thisyear: now.getFullYear()
    });
    let data = {
        operation: "create",
        shortId: id,
        baseUrl: "https://sflinku.eu.org/r?u="+id,
        longUrl: request.url,
        clicks: 0
    };
    console.log(data);
});
app.get('/create', async (req, res) => {
    res.redirect("/");
});
app.get('/r', async (req, res) => {
    var u = req.query.u;
    var urls = JSON.parse(fs.readFileSync('./db/urls.json'));
    var clicks = JSON.parse(fs.readFileSync('./db/clicks.json'));
    if (u === !u) {
        res.json({
            code: 400,
            title: "Bad Request",
            hint: "Add ?u parameter"
        });
    } else {
        clicks[u]++;
        let data = {
            operation: "query_redirect",
            shortId: u,
            baseUrl: "https://sflinku.eu.org/r?u="+u,
            longUrl: urls[u],
            clicks: clicks[u]
        };
        fs.writeFileSync('./db/clicks.json',JSON.stringify(clicks));
        res.redirect(urls[u]);
        console.log(data);
    };
});
app.get('/r/:u', async (req, res) => {
    var u = req.params.u;
    var urls = JSON.parse(fs.readFileSync('./db/urls.json'));
    var clicks = JSON.parse(fs.readFileSync('./db/clicks.json'));

    clicks[u]++;
        let data = {
            operation: "params_redirect",
            shortId: u,
            baseUrl: "https://sflinku.eu.org/r/"+u,
            longUrl: urls[u],
            clicks: clicks[u]
        };
        fs.writeFileSync('./db/clicks.json',JSON.stringify(clicks));
        res.redirect(urls[u]);
        console.log(data);
});
app.get('/db/:key/:name', async (req, res) => {
    var key = req.params.key;
    var name = req.params.name;
    var dbclicks = JSON.parse(fs.readFileSync('./db/clicks.json'));
    var dburls = JSON.parse(fs.readFileSync('./db/urls.json'));
    var keys = {"Hxnry1234++": true, "guest": true};

    if (Reflect.has(keys, key) === true) {
        if (key === 'guest') {
            res.json(dbclicks);
        } else {
            if (name === 'clicks') {
                res.json(dbclicks);
            } else if (name === 'urls') {
                res.json(dburls);
            } else {
                res.json({
                    code: 404,
                    title: "Not Found"
                });
            };
        };
    } else {
        res.json({
            code: 401,
            title: "Unauthorized"
        });
    };
});
app.get('/u', async (req, res) => {
    var key = req.query.key;
    var urls = JSON.parse(fs.readFileSync('./db/urls.json'));
    var clicks = JSON.parse(fs.readFileSync('./db/clicks.json'));
    var data_urls = JSON.stringify(urls);
    var data_clicks = JSON.stringify(clicks);
    res.send("<link rel='stylesheet' type='text/css' href='/assets/style?type=css'><body><br><br><br><br><br><br><br><br><br><br><center><fieldset><legend><h1>URLs:</h1></legend>"+data_urls+"<br><br><hr><br>"+data_clicks+"<br><br></fieldset></center></body>");
});
app.get('/a', async (req, res) => {
    var u = req.query.u;
    var urls = JSON.parse(fs.readFileSync('./db/urls.json'));
    var clicks = JSON.parse(fs.readFileSync('./db/clicks.json'));
    var longU = urls.u;
    var uClicks = clicks.u;
    var json = {
        name: u,
        urls: [
            "https://sflinku.eu.org/r?u="+u,
            "https://sflinku.eu.org/r/"+u,
            urls[u]
        ],
        clicks: clicks[u]
    };
    if (u === !u) {
        res.json({
            code: 400,
            title: "Bad Request",
            hint: "Add ?u parameter"
        });
    } else {
        res.json(json);
    }
});
//assets
app.get('/assets/style', async (req, res) => {
    var name = req.query.type;
    if (name === !name) {
        res.json({
            code: 404,
            title: "Not Found"
        });
    } else if (name === 'css') {
        res.sendFile(__dirname+"/public/style.css");
    } else if (name === 'img_icon') {
        res.sendFile(__dirname+"/icon.png");
    } else {
        res.json({
            code: 404,
            title: "Not Found"
        });
    };
});

app.get('/index.json', async (req, res) => {
    res.sendFile(__dirname+"/db/index.json");
});
app.get('*', async (req, res) => {
   var url = req.url;
   res.render('404', {thisurl: url, thisyear: now.getFullYear()})
});

app.listen(port, () => {
    console.log("Web Started : "+port);
    var urls = JSON.parse(fs.readFileSync('./db/urls.json'));
    var clicks = JSON.parse(fs.readFileSync('./db/clicks.json'));
    console.log("=========================");
    console.log(urls);
    console.log(clicks);
});
