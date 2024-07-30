import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import express, { Request, Response , NextFunction} from 'express';
import session, { MemoryStore } from 'express-session';

const app = express();
const memory = new MemoryStore();

app.use(session({ 
    secret: 'secret', saveUninitialized: false, resave: false, store: memory 
}));
app.use(express.urlencoded({ extended: true }));

const isAuthenticated = function(req: Request, res: Response, next: NextFunction) {
    //@ts-expect-error - typing match
    if (!req.session.user) {
        return res.redirect('/login');
    }
    return next();
}

app.post('/login', async function(req: Request, res: Response) {
    const { username, password } = req.body;
    const response = await fetch('http://keycloak:8080/realms/master/protocol/openid-connect/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: "duck",
            grant_type: "password",
            username,
            password
        }).toString()
    });
    const result = await response.json();
    //@ts-expect-error - typing match
    req.session.user = result;
    req.session.save();
    return res.send();
});

app.get('/logout', async function(req: Request, res: Response) {
   
    const response = await fetch('http://keycloak:8080/realms/master/protocol/openid-connect/revoke', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: "duck",
            //@ts-expect-error - typing match
            token: req.session.user.refresh_token,
        }).toString()
    });
    const result = await response.json();
    req.session.destroy(function (error) {
        console.log(error);
    });
    return res.send();
});

app.get('/admin', isAuthenticated, function(req: Request, res: Response) {
    //@ts-expect-error - typing match
    return res.json(req.session.user);
});

app.listen(3000, function() {
    console.log('listem on http://localhost:3000');
});