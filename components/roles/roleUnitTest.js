const _ = require('lodash');
const config = require('config');
const roleService = require('./roleService');
const Role = require('./role');
const roleDal = require('./roleDAL');

let baseSample;

describe('Test Role DAL', () => {
  beforeEach(async () => {
    baseSample = {
      name: 'test123',
      created_by: 'test123',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      const sample2 = new Role(_.set(baseSample, 'name', '123test'));
      const limitMethodResult = jest.fn().mockResolvedValue([sample1, sample2]);
      const limitMethod = { limit: limitMethodResult };
      const skipMethodResult = jest.fn(() => limitMethod);
      const skipMethod = { skip: skipMethodResult };
      const sortMethodResult = jest.fn(() => skipMethod);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Role.aggregate = jest.fn(() => collationMethod);


      // function
      const query = {
        perpage: 2,
        currpage: 0,
      };
      const result = await roleDal.get(query);
      // assert
      expect(result.length).toBe(2);
      expect(result.some((g) => g.name === 'test123')).toBeTruthy();
      expect(result.some((g) => g.name === '123test')).toBeTruthy();
    });
  });

  describe('Function getOne()', () => {
    it('should return selected item', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      const sortMethodResult = jest.fn().mockResolvedValue(sample1);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Role.findOne = jest.fn(() => collationMethod);

      const result = await roleDal.getOne();
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      jest.spyOn(Role.prototype, 'save').mockResolvedValue(sample1);
      // function
      const result = await roleDal.save(baseSample);

      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      Role.findOne().populate = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await roleDal.findById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      sample1.description = 'edited';
      jest.spyOn(roleDal, 'update').mockResolvedValue(sample1);
      // function
      const result = await roleDal.update(sample1);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      Role.findOneAndDelete = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await roleDal.deleteById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(Role.findOneAndDelete).toHaveBeenCalled();
    });
  });

  describe('Function getTotal()', () => {
    it('should return total count of all records', async () => {
      // mock external function
      Role.countDocuments = jest.fn().mockResolvedValue(2);
      // function
      const result = await roleDal.getTotal();

      // assertz
      expect(result == 2).toBeTruthy();
    });
  });

  describe('Function getTotalFiltered()', () => {
    it('should return total filtered records ', async () => {
      Role.aggregate = jest.fn().mockResolvedValue([{
        count: 1,
      }]);
      // function
      const result = await roleDal.getTotalFiltered();
      // assert
      expect(result == 1).toBeTruthy();
    });
    it('should return 0 if empty', async () => {
      Role.aggregate = jest.fn().mockResolvedValue([]);
      // function
      const result = await roleDal.getTotalFiltered();
      // assert
      expect(result == 0).toBeTruthy();
    });
  });
});

describe('Test Role Services', () => {
  beforeEach(async () => {
    baseSample = {
      name: 'test123',
      created_by: 'test123',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      const sample2 = new Role(_.set(baseSample, 'name', '123test'));
      const result = {};
      roleDal.get = jest.fn().mockResolvedValue(
        [sample1, sample2],
      );
      roleDal.getTotal = jest.fn().mockResolvedValue(
        2,
      );
      roleDal.getTotalFiltered = jest.fn().mockResolvedValue(
        1,
      );

      const data = await roleDal.get();
      const total = await roleDal.getTotal();
      const filtered = await roleDal.getTotalFiltered();

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
        created_by: 'abror',
      };
      const sample1 = new Role(baseSample);
      roleDal.save = jest.fn().mockResolvedValue(sample1);
      roleDal.findById = jest.fn().mockResolvedValue(sample1);
      config.get = jest.fn().mockResolvedValue('asdf');
      // function
      const result = await roleService.save(baseSample);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      roleDal.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await roleService.findById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      sample1.description = 'edited';
      roleDal.update = jest.fn().mockResolvedValue(sample1);
      roleDal.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await roleService.update('test', baseSample);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(result.created_by === 'test123').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Role(baseSample);
      roleDal.deleteById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await roleService.deleteById(id);
      // assert
      expect(result).toBeTruthy();
    });
  });
});
