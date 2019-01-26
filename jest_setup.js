jest.mock('react-native-sqlite-storage', () => ({
  SQLite: {
    SQLiteDatabase: {}
  }
}));
