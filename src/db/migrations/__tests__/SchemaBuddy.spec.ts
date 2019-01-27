import SchemaBuddy from '../SchemaBuddy';
import * as SQLite from 'react-native-sqlite-storage';

// jest.mock('react-native-sqlite-storage');

describe('reads migration json', () => {

  it ('can import file', () => {
    const buddy = new SchemaBuddy()
    const migrations =  buddy.loadMigrations()
    
    expect(migrations[0].length).toBe(3)
    expect(migrations[1]).toBe(undefined)
  });
  
})

// describe('processes migration statements', () => {
//   it ('loads correct db version', async () => {
//     const buddy = new SchemaBuddy()
//     await SQLite.openDatabase({name: '',
//                                location: 'default'})
//       .then((db) => {
//         const dbv = buddy.getDatabaseVersion(db)
//         expect(buddy.dbVersion).toBe(0)
//       })
//   });
// })

