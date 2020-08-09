const _ = require('lodash');
const config = require('config');
const menuService = require('./menuService');
const Menu = require('./menu');


let baseSample;

describe('Test Menu DAL', () => {
  beforeEach(async () => {
    baseSample = {
      name: 'test123',
      level: 2,
      fa: 'test123',
      order: 123,
      url: 'telkomindonesia.com',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      const sample2 = new Menu(_.set(baseSample, 'name', '123test'));
      const limitMethodResult = jest.fn().mockResolvedValue([sample1, sample2]);
      const limitMethod = { limit: limitMethodResult };
      const skipMethodResult = jest.fn(() => limitMethod);
      const skipMethod = { skip: skipMethodResult };
      const sortMethodResult = jest.fn(() => skipMethod);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Menu.aggregate = jest.fn(() => collationMethod);


      // function
      const query = {
        perpage: 2,
        currpage: 0,
      };
      const result = await Menu.get(query);
      // assert
      expect(result.length).toBe(2);
      expect(result.some((g) => g.name === 'test123')).toBeTruthy();
      expect(result.some((g) => g.name === '123test')).toBeTruthy();
    });
  });

  describe('Function getOne()', () => {
    it('should return selected item', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      const sortMethodResult = jest.fn().mockResolvedValue(sample1);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Menu.findOne = jest.fn(() => collationMethod);

      const result = await Menu.getOne();
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      Menu.store = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await Menu.store(baseSample);

      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      Menu.findOne = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await Menu.findById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      sample1.description = 'edited';
      jest.spyOn(Menu, 'update').mockResolvedValue(sample1);
      // function
      const result = await Menu.update(sample1);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      Menu.findOneAndDelete = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await Menu.deleteById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(Menu.findOneAndDelete).toHaveBeenCalled();
    });
  });

  describe('Function getTotal()', () => {
    it('should return total count of all records', async () => {
      // mock external function
      Menu.countDocuments = jest.fn().mockResolvedValue(2);
      // function
      const result = await Menu.getTotal();

      // assertz
      expect(result == 2).toBeTruthy();
    });
  });

  describe('Function getTotalFiltered()', () => {
    it('should return total filtered records ', async () => {
      Menu.aggregate = jest.fn().mockResolvedValue([{
        count: 1,
      }]);
      // function
      const result = await Menu.getTotalFiltered();
      // assert
      expect(result == 1).toBeTruthy();
    });
    it('should return 0 if empty', async () => {
      Menu.aggregate = jest.fn().mockResolvedValue([]);
      // function
      const result = await Menu.getTotalFiltered();
      // assert
      expect(result == 0).toBeTruthy();
    });
  });
});

describe('Test Menu Services', () => {
  beforeEach(async () => {
    baseSample = {
      name: 'test123',
      level: 2,
      fa: 'test123',
      order: 123,
      url: 'telkomindonesia.com',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      const sample2 = new Menu(_.set(baseSample, 'name', '123test'));
      const result = {};
      Menu.get = jest.fn().mockResolvedValue(
        [sample1, sample2],
      );
      Menu.getTotal = jest.fn().mockResolvedValue(
        2,
      );
      Menu.getTotalFiltered = jest.fn().mockResolvedValue(
        1,
      );

      const data = await Menu.get();
      const total = await Menu.getTotal();
      const filtered = await Menu.getTotalFiltered();

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
        by: 'aldo',
      };
      const sample1 = new Menu(baseSample);
      Menu.store = jest.fn().mockResolvedValue(sample1);
      // config.get = jest.fn().mockResolvedValue('asdf');
      // function
      const result = await menuService.save(baseSample);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      Menu.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await menuService.findById(id);
      // assert
      expect(result.name === 'test123').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      sample1.description = 'edited';
      Menu.update = jest.fn().mockResolvedValue(sample1);
      Menu.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await menuService.update('test', baseSample);
      // assert
      expect(result.name === 'test123').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Menu(baseSample);
      Menu.deleteById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await menuService.deleteById(id);
      // assert
      expect(result).toBeTruthy();
    });
  });
});
