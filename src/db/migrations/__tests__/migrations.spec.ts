import { SchemaBuddy } from '../SchemaBuddy';

describe('reads migration json', () => {

  it ('can import file', () => {
    const buddy = new SchemaBuddy()
    const migrations =  buddy.loadMigrations()
    
    expect(migrations[0].length).toBe(3)
    expect(migrations[1]).toBe(undefined)
  });
  
})

