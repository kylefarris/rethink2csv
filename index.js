var Stringify = require('streaming-json-stringify');
var JSONStream = require('JSONStream');
var csv_write_stream = require('csv-write-stream');
var through = require('through2');
var lo_functions = require('lodash.functionsin');

var split = function() {
    return through.obj(function (array, enc, cb) {
        array.forEach(this.push.bind(this));
        cb(null);
    });
};

// ****************************************************************************
// Class definition and contructor
// ****************************************************************************
function Rethink2Csv(opts) {
    var defaults = {
        csv: {
            separator: ',',
            newline: '\n',
            headers: false,
            sendHeaders: false
        }
    };
    this.csv_opts = Object.assign({}, defaults, opts);
}

// ****************************************************************************
// Stream a query result as CSV to an writeable stream (say, ExpressJS result
// object or file stream)
// ----
// @param   Object      query       An RethinkDB Dash query object
// @param   Object      out         The writeable stream
// @param   Function`   cb          What to do on error and/or when done streaming
// ****************************************************************************
Rethink2Csv.prototype.generate_csv = function (query, out, cb) {
    if (typeof query !== 'function' || lo_functions(query).indexOf('toStream') === -1)
        return cb(Error('Invalid rethinkdb query object supplied'), null);

    var csv_writer = csv_write_stream(this.csv_opts);

    query.toStream()
        .pipe(Stringify())
        .pipe(JSONStream.parse())
        .pipe(split())
        .pipe(csv_writer)
        .pipe(out)
        .on('finish', function() {
            return cb(null, {msg: 'Done writing query result to output stream!'});
        });
};

module.exports = function(opts) {
    return new Rethink2Csv(opts);
};
