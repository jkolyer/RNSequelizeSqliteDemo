import SchemaBuddy from '../SchemaBuddy';
import * as SQLite from 'react-native-sqlite-storage';

// jest.mock('react-native-sqlite-storage');

jest.mock('react-native-sqlite-storage', () => ({
  SQLite: {
    openDatabase: function(params: SQLite.DatabaseParams): Promise<SQLite.SQLiteDatabase> {
        return new Promise((resolve, reject) => {
          resolve(new this.SQLiteDatabase())
        });
    },
    SQLiteDatabase: {
      readTransaction(scope: (tx: SQLite.Transaction) => void):
      Promise<SQLite.TransactionCallback> {
        return new Promise((resolve, reject) => {
          resolve()
        });
      },
      close(): Promise<void> {
        return new Promise((resolve, reject) => {
          resolve()
        });
      },
      executeSql(statement: string, params?: any[]): Promise<[SQLite.ResultSet]> {
        return new Promise((resolve, reject) => {
          resolve()
        });
      },
      transaction(scope: (tx: SQLite.Transaction) => void): Promise<SQLite.Transaction> {      
        return new Promise((resolve, reject) => {
          resolve()
        });
      }
    },
    Transaction: {
      executeSql: function(statement: string) {
      }
    }
  }
}));


describe('reads migration json', () => {

  it ('can import file', () => {
    const buddy = new SchemaBuddy()
    const migrations =  buddy.loadMigrations()
    
    expect(migrations[0].length).toBe(3)
    expect(migrations[1]).toBe(undefined)
  });
  
})

describe('processes migration statements', () => {

  it ('loads correct db version', () => {
    const buddy = new SchemaBuddy()
    const db = SQLite.openDatabase({name: '',
                                    location: 'default'})

    const dbv = buddy.getDatabaseVersion(db)
    expect(buddy.dbVersion).toBe(0)
  });
  
})

