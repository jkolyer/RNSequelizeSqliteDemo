import reactNativeSqliteStorage from 'react-native-sqlite-storage';
import SchemaBuddy from './migrations/SchemaBuddy';

const DB_FILE_NAME = 'SequelizeSQLiteDemo.db'

export interface IDatabase {
  open(): void;
  close(): Promise<void>;
}
class DatabaseImpl implements IDatabase {
  private database: reactNativeSqliteStorage.SQLiteDatabase | undefined;
  private schemaBuddy: SchemaBuddy;

  constructor() {
    this.schemaBuddy = new SchemaBuddy();
  }

  // Open the connection to the database
  public async open() {
    // reactNativeSqliteStorage.DEBUG(true);
    // reactNativeSqliteStorage.enablePromise(true);
    
    console.log('*** open');

    await reactNativeSqliteStorage.openDatabase({
     name: DB_FILE_NAME,
      location: 'default'
    }).then(db => {
      this.schemaBuddy.processMigrations(db)
    }).catch(error => {
        console.log(error);
    });
    
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
}

// Export a single instance of DatabaseImpl
export const database: IDatabase = new DatabaseImpl();
