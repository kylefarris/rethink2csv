# Rethink2CSV
This module allows for an easy way to create a clean, properly-escaped CSV document stream from any RethinkDB query. In order for this to work correctly, you must be using the [rethinkdbdash](//www.npmjs.com/package/rethinkdbdash) module--it will not work using the "official" driver since the official driver does not support streaming results.

# How to install

```
npm install rethink2csv
```

# License Info
Licensed under MIT: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

# Quick Example
This quick example shows how to create a CSV file from a RethinkDB query.

```javascript
var fs = require('fs');
var file = fs.createWriteStream('/some/location/db_dump.csv');
var rdb = require('rethinkdbdash')();
var r2c = require('rethink2csv')();
var query = rdb.table('data').order_by({index: 'created_on'}).filter({{active: true}});
r2c.generate_csv(query, file);
```

# Options
The module uses the [csv-write-stream](//www.npmjs.com/package/csv-write-stream) module to create clean escaped CSV streams. You can pass any option supported by this module using the `csv` property:

## Example:

```javascript
var r2c = require('rethink2csv')({
    csv: {
        separator: ',',
        newline: '\n',
        headers: false,
        sendHeaders: false
    }
});
```

--------------------------------------------------------------------------------

# Contribute
Got a missing feature you'd like to use? Found a bug? Go ahead and fork this repo, build the feature and issue a pull request.
