import express from 'express';

const app = express();

app.get('/login', function(_, res) {
    const loginParams = new URLSearchParams({
        client_id: 'duck',
        redirect_uri: 'http://localhost:3000/login/callback',
        response_type: 'code',
        scope: 'openid'
    });
    const url = `http://localhost:8080/realms/master/protocol/openid-connect/auth?${loginParams.toString()}`;
    return res.redirect(url);
});

app.get('/login/callback', async function(req, res) {
    const bodyParams = new URLSearchParams({
        client_id: 'duck',
        grant_type: 'authorization_code',
        code: req.query.code as string,
        redirect_uri: 'http://localhost:3000/login/callback',
    });
    const url = `http://keycloak:8080/realms/master/protocol/openid-connect/token`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
    });
    const data = await response.json();
    return res.json(data);
});

app.listen(3000, function() {
    console.log('listem on http://localhost:3000');
});