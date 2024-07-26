import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import express, { Request, Response , NextFunction} from 'express';
import session, { MemoryStore } from 'express-session';

const app = express();
const memory = new MemoryStore();

app.use(session({ 
    secret: 'secret', saveUninitialized: false, resave: false, store: memory 
}));

const isAuthenticated = function(req: Request, res: Response, next: NextFunction) {
    //@ts-expect-error - typing match
    if (!req.session.user) {
        return res.redirect('/login');
    }
    return next();
}

app.get('/login', function(req: Request, res: Response) {
    const nonce = crypto.randomBytes(16).toString("base64");
    const state = crypto.randomBytes(16).toString("base64");
    //@ts-expect-error - typing match
    req.session.nonce = nonce;
    //@ts-expect-error - typing match
    req.session.state = state;
    req.session.save();
    const loginParams = new URLSearchParams({
        client_id: 'duck',
        redirect_uri: 'http://localhost:3000/login/callback',
        response_type: 'code',
        scope: 'openid email profile',
        nonce,
        state
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
    if (data.error) {
        return res.json(data);
    }
    const data_token = jwt.decode(data.access_token);
    //@ts-expect-error - typing match
    if (req.session.nonce !== data_token.nonce) {
        return res.json({ 
            error: "invalid_nonce", 
            error_description: "Nonce not valid" 
        });
    }
    //@ts-expect-error - typing match
    req.session.user = data_token;
    //@ts-expect-error - typing match
    req.session.id_token = data.id_token;
    //@ts-expect-error - typing match
    req.session.access_token = data.access_token;
    req.session.save();
    return res.json(data);
});

app.get('/logout', function(req: Request, res: Response) {
    const logoutParams = new URLSearchParams({
        // client_id: 'duck',
        //@ts-expect-error - typing match
        id_token_hint: req.session.id_token,
        post_logout_redirect_uri: 'http://localhost:3000/login',
    });
    req.session.destroy(function (error) {
        console.log(error);
    });
    const url = `http://localhost:8080/realms/master/protocol/openid-connect/logout?${logoutParams.toString()}`;
    return res.redirect(url);
});

app.get('/admin', isAuthenticated, function(req: Request, res: Response) {
    //@ts-expect-error - typing match
    return res.json(req.session.user);
});

app.listen(3000, function() {
    console.log('listem on http://localhost:3000');
});