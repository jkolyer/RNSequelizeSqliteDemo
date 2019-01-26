import { SchemaBuddy } from '../SchemaBuddy';

describe('reads migration json', () => {

  it ('can import file', async () => {
    const buddy = new SchemaBuddy()
    await buddy.loadMigrations().
      then((migrations) => {
        expect(migrations.length).toBe(1)
        expect(migrations[0].length).toBe(0)
      })
  });
  
})
