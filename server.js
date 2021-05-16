const https = require('https');
const fs = require('fs');
const config = require('config');
const util = require('util');
const app = require('./app');

https.createServer({
   cert: fs.readFileSync('certs/cert.pem'),
   key: fs.readFileSync('certs/privkey.pem')
 }, app).listen(process.env.PORT_HTTPS || config.port_https || 443, function(){
        util.log('Server started: https://%s:%s/', this.address().address, this.address().port);
});

module.exports = app.listen(process.env.PORT || config.port || 80, function() {
	util.log('Server started: http://%s:%s/', this.address().address, this.address().port);
});
