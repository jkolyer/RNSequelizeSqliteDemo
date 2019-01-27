import * as SQLite from 'react-native-sqlite-storage';

class MockSQLiteDatabase implements SQLiteDatabase {
  constructor() {
    this.transaction = jest.fn()
    this.readTransaction = jest.fn()
    this.close = jest.fn()
    this.executeSql = jest.fn()
    this.attach = jest.fn()
    this.dettach = jest.fn()
  }
  transaction = () => {
    return jest.fn()
  }
}

class MockTransaction implements Transaction {
  executeSql = jest.fn()
}
//jest.fn().mockReturnValueOnce(Promise.resolve(new MockSQLiteDatabase())),

jest.mock('react-native-sqlite-storage', () => ({
    openDatabase: () => { return Promise.resolve(new MockSQLiteDatabase()) },
    SQLiteDatabase: new MockSQLiteDatabase(),
    close: jest.fn(),
    executeSql: jest.fn() 
        .mockReturnValueOnce(Promise.resolve({})),
    transaction: jest.fn() 
        .mockReturnValueOnce(Promise.resolve({})),
    Transaction: {
      executeSql: function(statement: string) {
      }
    }
}));


