const _ = require('lodash');
const config = require('config');
const permissionService = require('./permissionService');
const Permission = require('./permission');
const permissionDAL = require('./permissionDAL');

let baseSample;

describe('Test Permission DAL', () => {
  beforeEach(async () => {
    baseSample = {
      code: '1234567',
      name: 'test123',
      description: 'test123test123test123test123test123',
      level_access: 1,
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      const sample2 = new Permission(_.set(baseSample, 'name', '123test'));
      const limitMethodResult = jest.fn().mockResolvedValue([sample1, sample2]);
      const limitMethod = { limit: limitMethodResult };
      const skipMethodResult = jest.fn(() => limitMethod);
      const skipMethod = { skip: skipMethodResult };
      const sortMethodResult = jest.fn(() => skipMethod);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Permission.aggregate = jest.fn(() => collationMethod);


      // function
      const query = {
        perpage: 2,
        currpage: 0,
      };
      const result = await permissionDAL.get(query);
      // assert
      expect(result.length).toBe(2);
      expect(result.some((g) => g.name === 'test123')).toBeTruthy();
      expect(result.some((g) => g.name === '123test')).toBeTruthy();
    });
  });

  describe('Function getOne()', () => {
    it('should return selected item', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      const sortMethodResult = jest.fn().mockResolvedValue(sample1);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Permission.findOne = jest.fn(() => collationMethod);

      const result = await permissionDAL.getOne();
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      jest.spyOn(Permission.prototype, 'save').mockResolvedValue(sample1);
      // function
      const result = await permissionDAL.save(baseSample);

      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      Permission.findOne = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await permissionDAL.findById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      sample1.description = 'edited';
      jest.spyOn(permissionDAL, 'update').mockResolvedValue(sample1);
      // function
      const result = await permissionDAL.update(sample1);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      Permission.findOneAndDelete = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await permissionDAL.deleteById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(Permission.findOneAndDelete).toHaveBeenCalled();
    });
  });

  describe('Function getTotal()', () => {
    it('should return total count of all records', async () => {
      // mock external function
      Permission.countDocuments = jest.fn().mockResolvedValue(2);
      // function
      const result = await permissionDAL.getTotal();

      // assertz
      expect(result == 2).toBeTruthy();
    });
  });

  describe('Function getTotalFiltered()', () => {
    it('should return total filtered records ', async () => {
      Permission.aggregate = jest.fn().mockResolvedValue([{
        count: 1,
      }]);
      // function
      const result = await permissionDAL.getTotalFiltered();
      // assert
      expect(result == 1).toBeTruthy();
    });
    it('should return 0 if empty', async () => {
      Permission.aggregate = jest.fn().mockResolvedValue([]);
      // function
      const result = await permissionDAL.getTotalFiltered();
      // assert
      expect(result == 0).toBeTruthy();
    });
  });
});

describe('Test Permission Services', () => {
  beforeEach(async () => {
    baseSample = {
      code: '1234567',
      name: 'test123',
      description: 'test123test123test123test123test123',
      level_access: 1,
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      const sample2 = new Permission(_.set(baseSample, 'name', '123test'));
      const result = {};
      permissionDAL.get = jest.fn().mockResolvedValue(
        [sample1, sample2],
      );
      permissionDAL.getTotal = jest.fn().mockResolvedValue(
        2,
      );
      permissionDAL.getTotalFiltered = jest.fn().mockResolvedValue(
        1,
      );

      const data = await permissionDAL.get();
      const total = await permissionDAL.getTotal();
      const filtered = await permissionDAL.getTotalFiltered();

      result.data = data;
      result.total = total;
      result.filtered = filtered;
      // assert
      expect(result.data.length).toBe(2);
      expect(result.data.some((g) => g.name === 'test123')).toBeTruthy();
      expect(result.data.some((g) => g.name === '123test')).toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      baseSample.created = {
        description: 'testtesttest',
      };
      const sample1 = new Permission(baseSample);
      permissionDAL.save = jest.fn().mockResolvedValue(sample1);
      config.get = jest.fn().mockResolvedValue('asdf');
      // function
      const result = await permissionService.save(baseSample);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      permissionDAL.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await permissionService.findById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      sample1.description = 'edited';
      permissionDAL.update = jest.fn().mockResolvedValue(sample1);
      permissionDAL.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await permissionService.update('test', baseSample);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Permission(baseSample);
      permissionDAL.deleteById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await permissionService.deleteById(id);
      // assert
      expect(result).toBeTruthy();
    });
  });
});
