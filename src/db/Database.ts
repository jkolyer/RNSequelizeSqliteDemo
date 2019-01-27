/**
 * React Native SQLite Demo
 * Copyright (c) 2018 Bruce Lefebvre <bruce@brucelefebvre.com>
 * https://github.com/blefebvre/react-native-sqlite-demo/blob/master/LICENSE
 */
// import * as reactNativeSqliteStorage from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';
import SchemaBuddy from './migrations/SchemaBuddy';

// const SQLite = reactNativeSqliteStorage.default

const DB_FILE_NAME = 'SequelizeSQLiteDemo.db'

export interface IDatabase {
  open(): Promise<SQLite.SQLiteDatabase>;
  close(): Promise<void>;
}
class DatabaseImpl implements IDatabase {
  private database: SQLite.SQLiteDatabase | undefined;
  private schemaBuddy: SchemaBuddy;

  constructor() {
    this.schemaBuddy = new SchemaBuddy();
  }

  // Open the connection to the database
  public async open(): Promise<SQLite.SQLiteDatabase> {
    // SQLite.DEBUG(true);
    // SQLite.enablePromise(true);
    
    console.log('*** open');

    const db = await SQLite.openDatabase({
     name: DB_FILE_NAME,
      location: 'default'
    }).catch((error) => {
        console.log(error);
    });
    this.schemaBuddy.processMigrations(db)
    
    /*
    SQLite.openDatabase({
      name: DB_FILE_NAME,
      location: 'default'
    })
      .then(db => {
        databaseInstance = db;
        console.log('[db] Database open!');

        return this.schemaBuddy.processMigrations(databaseInstance)
      })
      .then(() => {
        this.database = databaseInstance;
        return databaseInstance;
      });
    */
  }

  // Close the connection to the database
  public close(): Promise<void> {
    if (this.database === undefined) {
      return Promise.reject('[db] Database was not open; unable to close.');
    }
    return this.database.close().then(status => {
      console.log('[db] Database closed.');
      this.database = undefined;
    });
  }

  private getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (this.database !== undefined) {
      return Promise.resolve(this.database);
    }
    // otherwise: open the database first
    return this.open();
  }
}

// Export a single instance of DatabaseImpl
export const database: IDatabase = new DatabaseImpl();
