'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sqlite3 = _interopDefault(require('sqlite3'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));

/**
 * SQLite client library for Node.js applications
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

function prepareParams(args) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? 0 : _ref$offset,
      _ref$excludeLastArg = _ref.excludeLastArg,
      excludeLastArg = _ref$excludeLastArg === undefined ? false : _ref$excludeLastArg;

  var hasOneParam = args.length === offset + 1 + (excludeLastArg ? 1 : 0);
  if (hasOneParam) {
    return args[offset];
  }
  return Array.prototype.slice.call(args, offset, args.length - (excludeLastArg ? 1 : 0));
}

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();



























var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * SQLite client library for Node.js applications
 *
 * Copyright © 2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var Statement = function () {
  function Statement(stmt, Promise) {
    classCallCheck(this, Statement);

    this.stmt = stmt;
    this.Promise = Promise;
  }

  createClass(Statement, [{
    key: 'bind',
    value: function bind() {
      var _this = this;

      var params = prepareParams(arguments);
      return new this.Promise(function (resolve, reject) {
        _this.stmt.bind(params, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(_this);
          }
        });
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      var _this2 = this;

      return new this.Promise(function (resolve) {
        _this2.stmt.reset(function () {
          resolve(_this2);
        });
      });
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      var _this3 = this;

      return new this.Promise(function (resolve, reject) {
        _this3.stmt.finalize(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'run',
    value: function run() {
      var _this4 = this;

      var params = prepareParams(arguments);
      return new this.Promise(function (resolve, reject) {
        _this4.stmt.run(params, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(_this4);
          }
        });
      });
    }
  }, {
    key: 'get',
    value: function get$$1() {
      var _this5 = this;

      var params = prepareParams(arguments);
      return new this.Promise(function (resolve, reject) {
        _this5.stmt.get(params, function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    }
  }, {
    key: 'all',
    value: function all() {
      var _this6 = this;

      var params = prepareParams(arguments);
      return new this.Promise(function (resolve, reject) {
        _this6.stmt.all(params, function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  }, {
    key: 'each',
    value: function each() {
      var _this7 = this;

      var params = prepareParams(arguments, { excludeLastArg: true });
      var callback = arguments[arguments.length - 1];
      return new this.Promise(function (resolve, reject) {
        _this7.stmt.each(params, callback, function (err) {
          var rowsCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

          if (err) {
            reject(err);
          } else {
            resolve(rowsCount);
          }
        });
      });
    }
  }, {
    key: 'sql',
    get: function get$$1() {
      return this.stmt.sql;
    }
  }, {
    key: 'lastID',
    get: function get$$1() {
      return this.stmt.lastID;
    }
  }, {
    key: 'changes',
    get: function get$$1() {
      return this.stmt.changes;
    }
  }]);
  return Statement;
}();

/**
 * SQLite client library for Node.js applications
 *
 * Copyright © 2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var Database = function () {

  /**
   * Initializes a new instance of the database client.
   * @param driver An instance of SQLite3 driver library.
   * @param promiseLibrary ES6 Promise library to use.
     */
  function Database(driver, _ref) {
    var Promise = _ref.Promise;
    classCallCheck(this, Database);

    this.driver = driver;
    this.Promise = Promise;
  }

  /**
   * Close the database.
   */


  createClass(Database, [{
    key: 'close',
    value: function close() {
      var _this = this;

      return new this.Promise(function (resolve, reject) {
        _this.driver.close(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'run',
    value: function run(sql) {
      var _this2 = this;

      var params = prepareParams(arguments, { offset: 1 });
      var Promise = this.Promise;
      return new Promise(function (resolve, reject) {
        _this2.driver.run(sql, params, function runExecResult(err) {
          if (err) {
            reject(err);
          } else {
            // Per https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
            // when run() succeeds, the `this' object is a driver statement object. Wrap it as a
            // Statement.
            resolve(new Statement(this, Promise));
          }
        });
      });
    }
  }, {
    key: 'get',
    value: function get$$1(sql) {
      var _this3 = this;

      var params = prepareParams(arguments, { offset: 1 });
      return new this.Promise(function (resolve, reject) {
        _this3.driver.get(sql, params, function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    }
  }, {
    key: 'all',
    value: function all(sql) {
      var _this4 = this;

      var params = prepareParams(arguments, { offset: 1 });
      return new this.Promise(function (resolve, reject) {
        _this4.driver.all(sql, params, function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    /**
     * Runs all the SQL queries in the supplied string. No result rows are retrieved.
     */

  }, {
    key: 'exec',
    value: function exec(sql) {
      var _this5 = this;

      return new this.Promise(function (resolve, reject) {
        _this5.driver.exec(sql, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(_this5);
          }
        });
      });
    }
  }, {
    key: 'each',
    value: function each(sql) {
      var _this6 = this;

      var params = prepareParams(arguments, { offset: 1, excludeLastArg: true });
      var callback = arguments[arguments.length - 1];
      return new this.Promise(function (resolve, reject) {
        _this6.driver.each(sql, params, callback, function (err) {
          var rowsCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

          if (err) {
            reject(err);
          } else {
            resolve(rowsCount);
          }
        });
      });
    }
  }, {
    key: 'prepare',
    value: function prepare(sql) {
      var _this7 = this;

      var params = prepareParams(arguments, { offset: 1 });
      return new this.Promise(function (resolve, reject) {
        var stmt = _this7.driver.prepare(sql, params, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(new Statement(stmt, _this7.Promise));
          }
        });
      });
    }

    /**
     * Migrates database schema to the latest version
     */

  }, {
    key: 'migrate',
    value: function () {
      var _ref2 = asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this8 = this;

        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            force = _ref3.force,
            _ref3$table = _ref3.table,
            table = _ref3$table === undefined ? 'migrations' : _ref3$table,
            _ref3$migrationsPath = _ref3.migrationsPath,
            migrationsPath = _ref3$migrationsPath === undefined ? './migrations' : _ref3$migrationsPath,
            _ref3$output = _ref3.output,
            output = _ref3$output === undefined ? false : _ref3$output;

        var location, migrations, dbMigrations, lastMigration, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret, lastMigrationId, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _migration;

        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                /* eslint-disable no-await-in-loop */
                location = path.resolve(migrationsPath);

                // Get the list of migration files, for example:
                //   { id: 1, name: 'initial', filename: '001-initial.sql' }
                //   { id: 2, name: 'feature', fielname: '002-feature.sql' }

                _context2.next = 3;
                return new this.Promise(function (resolve, reject) {
                  fs.readdir(location, function (err, files) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(files.map(function (x) {
                        return x.match(/^(\d+).(.*?)\.sql$/);
                      }).filter(function (x) {
                        return x !== null;
                      }).map(function (x) {
                        return { id: Number(x[1]), name: x[2], filename: x[0] };
                      }).sort(function (a, b) {
                        return Math.sign(a.id - b.id);
                      }));
                    }
                  });
                });

              case 3:
                migrations = _context2.sent;

                if (migrations.length) {
                  _context2.next = 8;
                  break;
                }

                throw new Error('No migration files found in \'' + location);

              case 8:
                if (output) {
                  console.log('Checking migrations...');
                }

              case 9:
                _context2.next = 11;
                return Promise.all(migrations.map(function (migration) {
                  return new _this8.Promise(function (resolve, reject) {
                    var filename = path.join(location, migration.filename);
                    fs.readFile(filename, 'utf-8', function (err, data) {
                      if (err) {
                        reject(err);
                      } else {
                        var _data$split = data.split(/^--\s+?down/mi),
                            _data$split2 = slicedToArray(_data$split, 2),
                            up = _data$split2[0],
                            down = _data$split2[1];

                        if (!down) {
                          var message = 'The ' + migration.filename + ' file does not contain \'-- Down\' separator.';
                          reject(new Error(message));
                        } else {
                          /* eslint-disable no-param-reassign */
                          migration.up = up.replace(/^--.*?$/gm, '').trim(); // Remove comments
                          migration.down = down.replace(/^--.*?$/gm, '').trim(); // and trim whitespaces
                          /* eslint-enable no-param-reassign */
                          resolve();
                        }
                      }
                    });
                  });
                }));

              case 11:
                _context2.next = 13;
                return this.run('CREATE TABLE IF NOT EXISTS "' + table + '" (\n  id   INTEGER PRIMARY KEY,\n  name TEXT    NOT NULL,\n  up   TEXT    NOT NULL,\n  down TEXT    NOT NULL\n)');

              case 13:
                _context2.next = 15;
                return this.all('SELECT id, name, up, down FROM "' + table + '" ORDER BY id ASC');

              case 15:
                dbMigrations = _context2.sent;


                // Undo migrations that exist only in the database but not in files,
                // also undo the last migration if the `force` option was set to `last`.
                lastMigration = migrations[migrations.length - 1];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 20;
                _loop = regeneratorRuntime.mark(function _loop() {
                  var migration;
                  return regeneratorRuntime.wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          migration = _step.value;

                          if (!(!migrations.some(function (x) {
                            return x.id === migration.id;
                          }) || force === 'last' && migration.id === lastMigration.id)) {
                            _context.next = 22;
                            break;
                          }

                          if (output) console.log('\x1b[36m%s\x1b[0m', '  Rolling back:', migration.name);
                          _context.next = 5;
                          return _this8.run('BEGIN');

                        case 5:
                          _context.prev = 5;
                          _context.next = 8;
                          return _this8.exec(migration.down);

                        case 8:
                          _context.next = 10;
                          return _this8.run('DELETE FROM "' + table + '" WHERE id = ?', migration.id);

                        case 10:
                          _context.next = 12;
                          return _this8.run('COMMIT');

                        case 12:
                          dbMigrations = dbMigrations.filter(function (x) {
                            return x.id !== migration.id;
                          });
                          _context.next = 20;
                          break;

                        case 15:
                          _context.prev = 15;
                          _context.t0 = _context['catch'](5);
                          _context.next = 19;
                          return _this8.run('ROLLBACK');

                        case 19:
                          throw _context.t0;

                        case 20:
                          _context.next = 23;
                          break;

                        case 22:
                          return _context.abrupt('return', 'break');

                        case 23:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _loop, _this8, [[5, 15]]);
                });
                _iterator = dbMigrations.slice().sort(function (a, b) {
                  return Math.sign(b.id - a.id);
                })[Symbol.iterator]();

              case 23:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 31;
                  break;
                }

                return _context2.delegateYield(_loop(), 't0', 25);

              case 25:
                _ret = _context2.t0;

                if (!(_ret === 'break')) {
                  _context2.next = 28;
                  break;
                }

                return _context2.abrupt('break', 31);

              case 28:
                _iteratorNormalCompletion = true;
                _context2.next = 23;
                break;

              case 31:
                _context2.next = 37;
                break;

              case 33:
                _context2.prev = 33;
                _context2.t1 = _context2['catch'](20);
                _didIteratorError = true;
                _iteratorError = _context2.t1;

              case 37:
                _context2.prev = 37;
                _context2.prev = 38;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 40:
                _context2.prev = 40;

                if (!_didIteratorError) {
                  _context2.next = 43;
                  break;
                }

                throw _iteratorError;

              case 43:
                return _context2.finish(40);

              case 44:
                return _context2.finish(37);

              case 45:

                // Apply pending migrations
                lastMigrationId = dbMigrations.length ? dbMigrations[dbMigrations.length - 1].id : 0;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 49;
                _iterator2 = migrations[Symbol.iterator]();

              case 51:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 74;
                  break;
                }

                _migration = _step2.value;

                if (!(_migration.id > lastMigrationId)) {
                  _context2.next = 71;
                  break;
                }

                if (output) console.log('\x1b[36m%s\x1b[0m', '  Applying migration:', _migration.name);
                _context2.next = 57;
                return this.run('BEGIN');

              case 57:
                _context2.prev = 57;
                _context2.next = 60;
                return this.exec(_migration.up);

              case 60:
                _context2.next = 62;
                return this.run('INSERT INTO "' + table + '" (id, name, up, down) VALUES (?, ?, ?, ?)', _migration.id, _migration.name, _migration.up, _migration.down);

              case 62:
                _context2.next = 64;
                return this.run('COMMIT');

              case 64:
                _context2.next = 71;
                break;

              case 66:
                _context2.prev = 66;
                _context2.t2 = _context2['catch'](57);
                _context2.next = 70;
                return this.run('ROLLBACK');

              case 70:
                throw _context2.t2;

              case 71:
                _iteratorNormalCompletion2 = true;
                _context2.next = 51;
                break;

              case 74:
                _context2.next = 80;
                break;

              case 76:
                _context2.prev = 76;
                _context2.t3 = _context2['catch'](49);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t3;

              case 80:
                _context2.prev = 80;
                _context2.prev = 81;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 83:
                _context2.prev = 83;

                if (!_didIteratorError2) {
                  _context2.next = 86;
                  break;
                }

                throw _iteratorError2;

              case 86:
                return _context2.finish(83);

              case 87:
                return _context2.finish(80);

              case 88:
                if (output) console.log('  Migrations are up-to-date');

                /* eslint-enable no-await-in-loop */
                return _context2.abrupt('return', this);

              case 90:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee, this, [[20, 33, 37, 45], [38,, 40, 44], [49, 76, 80, 88], [57, 66], [81,, 83, 87]]);
      }));

      function migrate() {
        return _ref2.apply(this, arguments);
      }

      return migrate;
    }()
  }]);
  return Database;
}();

/**
 * SQLite client library for Node.js applications
 *
 * Copyright © 2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var promise = global.Promise;
var db = new Database(null, { Promise: promise });

/**
 * Opens SQLite database.
 *
 * @returns Promise<Database> A promise that resolves to an instance of SQLite database client.
 */
db.open = function (filename) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$mode = _ref.mode,
      mode = _ref$mode === undefined ? null : _ref$mode,
      _ref$verbose = _ref.verbose,
      verbose = _ref$verbose === undefined ? false : _ref$verbose,
      _ref$Promise = _ref.Promise,
      Promise = _ref$Promise === undefined ? promise : _ref$Promise;

  var driver = void 0;

  if (verbose) {
    sqlite3.verbose();
  }

  return new Promise(function (resolve, reject) {
    if (mode !== null) {
      driver = new sqlite3.Database(filename, mode, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      driver = new sqlite3.Database(filename, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  }).then(function () {
    db.driver = driver;
    db.Promise = Promise;
    return new Database(driver, { Promise: Promise });
  });
};

module.exports = db;
//# sourceMappingURL=legacy.js.map
