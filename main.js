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

function prepareParams(args, { offset = 0, excludeLastArg = false } = {}) {
  const hasOneParam = args.length === offset + 1 + (excludeLastArg ? 1 : 0);
  if (hasOneParam) {
    return args[offset];
  }
  return Array.prototype.slice.call(args, offset, args.length - (excludeLastArg ? 1 : 0));
}

/**
 * SQLite client library for Node.js applications
 *
 * Copyright © 2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

class Statement {

  constructor(stmt, Promise) {
    this.stmt = stmt;
    this.Promise = Promise;
  }

  get sql() {
    return this.stmt.sql;
  }

  get lastID() {
    return this.stmt.lastID;
  }

  get changes() {
    return this.stmt.changes;
  }

  bind() {
    const params = prepareParams(arguments);
    return new this.Promise((resolve, reject) => {
      this.stmt.bind(params, err => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  reset() {
    return new this.Promise(resolve => {
      this.stmt.reset(() => {
        resolve(this);
      });
    });
  }

  finalize() {
    return new this.Promise((resolve, reject) => {
      this.stmt.finalize(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  run() {
    const params = prepareParams(arguments);
    return new this.Promise((resolve, reject) => {
      this.stmt.run(params, err => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  get() {
    const params = prepareParams(arguments);
    return new this.Promise((resolve, reject) => {
      this.stmt.get(params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all() {
    const params = prepareParams(arguments);
    return new this.Promise((resolve, reject) => {
      this.stmt.all(params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  each() {
    const params = prepareParams(arguments, { excludeLastArg: true });
    const callback = arguments[arguments.length - 1];
    return new this.Promise((resolve, reject) => {
      this.stmt.each(params, callback, (err, rowsCount = 0) => {
        if (err) {
          reject(err);
        } else {
          resolve(rowsCount);
        }
      });
    });
  }

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

/**
 * SQLite client library for Node.js applications
 *
 * Copyright © 2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

class Database {

  /**
   * Initializes a new instance of the database client.
   * @param driver An instance of SQLite3 driver library.
   * @param promiseLibrary ES6 Promise library to use.
     */
  constructor(driver, { Promise }) {
    this.driver = driver;
    this.Promise = Promise;
  }

  /**
   * Close the database.
   */
  close() {
    return new this.Promise((resolve, reject) => {
      this.driver.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  run(sql) {
    const params = prepareParams(arguments, { offset: 1 });
    const Promise = this.Promise;
    return new Promise((resolve, reject) => {
      this.driver.run(sql, params, function runExecResult(err) {
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

  get(sql) {
    const params = prepareParams(arguments, { offset: 1 });
    return new this.Promise((resolve, reject) => {
      this.driver.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql) {
    const params = prepareParams(arguments, { offset: 1 });
    return new this.Promise((resolve, reject) => {
      this.driver.all(sql, params, (err, rows) => {
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
  exec(sql) {
    return new this.Promise((resolve, reject) => {
      this.driver.exec(sql, err => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  each(sql) {
    const params = prepareParams(arguments, { offset: 1, excludeLastArg: true });
    const callback = arguments[arguments.length - 1];
    return new this.Promise((resolve, reject) => {
      this.driver.each(sql, params, callback, (err, rowsCount = 0) => {
        if (err) {
          reject(err);
        } else {
          resolve(rowsCount);
        }
      });
    });
  }

  prepare(sql) {
    const params = prepareParams(arguments, { offset: 1 });
    return new this.Promise((resolve, reject) => {
      const stmt = this.driver.prepare(sql, params, err => {
        if (err) {
          reject(err);
        } else {
          resolve(new Statement(stmt, this.Promise));
        }
      });
    });
  }

  /**
   * Migrates database schema to the latest version
   */
  migrate({ force, table = 'migrations', migrationsPath = './migrations', output = false } = {}) {
    var _this = this;

    return asyncToGenerator(function* () {
      /* eslint-disable no-await-in-loop */
      const location = path.resolve(migrationsPath);

      // Get the list of migration files, for example:
      //   { id: 1, name: 'initial', filename: '001-initial.sql' }
      //   { id: 2, name: 'feature', fielname: '002-feature.sql' }
      const migrations = yield new _this.Promise(function (resolve, reject) {
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

      if (!migrations.length) {
        throw new Error(`No migration files found in '${location}`);
      } else if (output) {
        console.log('Checking migrations...');
      }

      // Ge the list of migrations, for example:
      //   { id: 1, name: 'initial', filename: '001-initial.sql', up: ..., down: ... }
      //   { id: 2, name: 'feature', fielname: '002-feature.sql', up: ..., down: ... }
      yield Promise.all(migrations.map(function (migration) {
        return new _this.Promise(function (resolve, reject) {
          const filename = path.join(location, migration.filename);
          fs.readFile(filename, 'utf-8', function (err, data) {
            if (err) {
              reject(err);
            } else {
              const [up, down] = data.split(/^--\s+?down/mi);
              if (!down) {
                const message = `The ${migration.filename} file does not contain '-- Down' separator.`;
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

      // Create a database table for migrations meta data if it doesn't exist
      yield _this.run(`CREATE TABLE IF NOT EXISTS "${table}" (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL,
  up   TEXT    NOT NULL,
  down TEXT    NOT NULL
)`);

      // Get the list of already applied migrations
      let dbMigrations = yield _this.all(`SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`);

      // Undo migrations that exist only in the database but not in files,
      // also undo the last migration if the `force` option was set to `last`.
      const lastMigration = migrations[migrations.length - 1];
      for (const migration of dbMigrations.slice().sort(function (a, b) {
        return Math.sign(b.id - a.id);
      })) {
        if (!migrations.some(function (x) {
          return x.id === migration.id;
        }) || force === 'last' && migration.id === lastMigration.id) {
          if (output) console.log('\x1b[36m%s\x1b[0m', '  Rolling back:', migration.name);
          yield _this.run('BEGIN');
          try {
            yield _this.exec(migration.down);
            yield _this.run(`DELETE FROM "${table}" WHERE id = ?`, migration.id);
            yield _this.run('COMMIT');
            dbMigrations = dbMigrations.filter(function (x) {
              return x.id !== migration.id;
            });
          } catch (err) {
            yield _this.run('ROLLBACK');
            throw err;
          }
        } else {
          break;
        }
      }

      // Apply pending migrations
      const lastMigrationId = dbMigrations.length ? dbMigrations[dbMigrations.length - 1].id : 0;
      for (const migration of migrations) {
        if (migration.id > lastMigrationId) {
          if (output) console.log('\x1b[36m%s\x1b[0m', '  Applying migration:', migration.name);
          yield _this.run('BEGIN');
          try {
            yield _this.exec(migration.up);
            yield _this.run(`INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`, migration.id, migration.name, migration.up, migration.down);
            yield _this.run('COMMIT');
          } catch (err) {
            yield _this.run('ROLLBACK');
            throw err;
          }
        }
      }
      if (output) console.log('  Migrations are up-to-date');

      /* eslint-enable no-await-in-loop */
      return _this;
    })();
  }
}

/**
 * SQLite client library for Node.js applications
 *
 * Copyright © 2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const promise = global.Promise;
const db = new Database(null, { Promise: promise });

/**
 * Opens SQLite database.
 *
 * @returns Promise<Database> A promise that resolves to an instance of SQLite database client.
 */
db.open = (filename, { mode = null, verbose = false, Promise = promise } = {}) => {
  let driver;

  if (verbose) {
    sqlite3.verbose();
  }

  return new Promise((resolve, reject) => {
    if (mode !== null) {
      driver = new sqlite3.Database(filename, mode, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      driver = new sqlite3.Database(filename, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  }).then(() => {
    db.driver = driver;
    db.Promise = Promise;
    return new Database(driver, { Promise });
  });
};

module.exports = db;
//# sourceMappingURL=main.js.map
