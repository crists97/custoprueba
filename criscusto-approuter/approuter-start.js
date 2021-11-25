const approuter = require('@sap/approuter');
const jwtDecode = require('jwt-decode');
var ar = approuter();
ar.beforeRequestHandler.use('/getuserinfo', function (req, res, next) {
    if (!req.user) {
        res.statusCode = 403;
        res.end(`Missing JWT Token`);
    } else {
        res.statusCode = 200;
        var decodedJWTToken = jwtDecode(req.user.token.accessToken);
        res.end(JSON.stringify(decodedJWTToken));
    }
});
ar.start();