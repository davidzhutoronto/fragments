const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../src/model/data/memory/index');

describe('Memory test', () => {
  // Each test will get its own, empty database instance

  test('read Fragment expects string keys', async () => {
    expect(async () => await readFragment(1, 1)).rejects.toThrow();
  });

  test('write Fragment expects string keys', async () => {
    expect(async () => await writeFragment(1, 1)).rejects.toThrow();
  });

  test('read Fragment with incorrect secondaryKey returns nothing', async () => {
    await writeFragment('a', 'b', 123);
    const result = await readFragment('a', 'c');
    expect(result).toBe(undefined);
  });

  test('read fragment data returns what we write into the db', async () => {
    const data = { value: 123 };
    await writeFragmentData('a', 'b', data);
    const result = await readFragmentData('a', 'b');
    expect(result).toEqual(data);
  });

  test('write fragment data returns nothing', async () => {
    const result = await writeFragmentData('a', 'b', {});
    expect(result).toBe(undefined);
  });

  test('read fragment data and write fragment data work with Buffers', async () => {
    const data = Buffer.from([1, 2, 3]);
    await writeFragmentData('a', 'b', data);
    const result = await readFragmentData('a', 'b');
    expect(result).toEqual(data);
  });
});
