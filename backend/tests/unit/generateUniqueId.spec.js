const generateUniqueId = require('../../src/utils/generateUniqueId');

describe('Generate Unique ID', () => {
  it('shoul generate an unique ID', () => {
    const id = generateUniqueId()
    expect(id).toHaveLength(8);
  });
});