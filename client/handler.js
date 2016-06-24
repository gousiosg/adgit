/**
 * Created by czarna otchłań on 2016-06-24.
 */

module.exports = {
    getFile: getFile
};

function getFile(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('demo');
}