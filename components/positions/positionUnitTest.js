const _ = require('lodash');
const config = require('config');
const positionService = require('./positionService');
const Position = require('./position');
const positionDal = require('./positionDAL');

let baseSample;

describe('Test Position DAL', () => {
  beforeEach(async () => {
    baseSample = {
      position_id: 223,
      organization_structure_id: '121231',
      name: 'position',
      description: 'deskripsi',
      band: 'tess',
      position_code: '12131',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      const sample2 = new Position(_.set(baseSample, 'name', 'position'));
      const limitMethodResult = jest.fn().mockResolvedValue([sample1, sample2]);
      const limitMethod = { limit: limitMethodResult };
      const skipMethodResult = jest.fn(() => limitMethod);
      const skipMethod = { skip: skipMethodResult };
      const sortMethodResult = jest.fn(() => skipMethod);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Position.aggregate = jest.fn(() => collationMethod);


      // function
      const query = {
        perpage: 2,
        currpage: 0,
      };
      const result = await positionDal.get(query);
      // assert
      expect(result.length).toBe(2);
      expect(result.some((g) => g.name === 'position')).toBeTruthy();
      expect(result.some((g) => g.name === 'position')).toBeTruthy();
    });
  });

  describe('Function getOne()', () => {
    it('should return selected item', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      const sortMethodResult = jest.fn().mockResolvedValue(sample1);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      Position.findOne = jest.fn(() => collationMethod);

      const result = await positionDal.getOne();
      // assert
      expect(result.name === 'position').toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      jest.spyOn(Position.prototype, 'save').mockResolvedValue(sample1);
      // function
      const result = await positionDal.save(baseSample);

      // assert
      expect(result.name === 'position').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      Position.findOne = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await positionDal.findById(id);
      // assert
      expect(result.name === 'position').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      sample1.description = 'edited';
      jest.spyOn(positionDal, 'update').mockResolvedValue(sample1);
      // function
      const result = await positionDal.update(sample1);
      // assert
      expect(result.name === 'position').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      Position.findOneAndDelete = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await positionDal.deleteById(id);
      // assert
      expect(result.name === 'position').toBeTruthy();
      expect(Position.findOneAndDelete).toHaveBeenCalled();
    });
  });

  describe('Function getTotal()', () => {
    it('should return total count of all records', async () => {
      // mock external function
      Position.countDocuments = jest.fn().mockResolvedValue(2);
      // function
      const result = await positionDal.getTotal();

      // assertz
      expect(result == 2).toBeTruthy();
    });
  });

  describe('Function getTotalFiltered()', () => {
    it('should return total filtered records ', async () => {
      Position.aggregate = jest.fn().mockResolvedValue([{
        count: 1,
      }]);
      // function
      const result = await positionDal.getTotalFiltered();
      // assert
      expect(result == 1).toBeTruthy();
    });
    it('should return 0 if empty', async () => {
      Position.aggregate = jest.fn().mockResolvedValue([]);
      // function
      const result = await positionDal.getTotalFiltered();
      // assert
      expect(result == 0).toBeTruthy();
    });
  });
});

describe('Test Position Services', () => {
  beforeEach(async () => {
    baseSample = {
      position_id: 223,
      organization_structure_id: '121231',
      name: 'position',
      description: 'deskripsi',
      band: 'tess',
      position_code: '12131',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      const sample2 = new Position(_.set(baseSample, 'name', 'position'));
      const result = {};
      positionDal.get = jest.fn().mockResolvedValue(
        [sample1, sample2],
      );
      positionDal.getTotal = jest.fn().mockResolvedValue(
        2,
      );
      positionDal.getTotalFiltered = jest.fn().mockResolvedValue(
        1,
      );

      const data = await positionDal.get();
      const total = await positionDal.getTotal();
      const filtered = await positionDal.getTotalFiltered();

      result.data = data;
      result.total = total;
      result.filtered = filtered;
      // assert
      expect(result.data.length).toBe(2);
      expect(result.data.some((g) => g.name === 'position')).toBeTruthy();
      expect(result.data.some((g) => g.name === 'position')).toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      baseSample.created = {
        name: 'position123',
      };
      const sample1 = new Position(baseSample);
      positionDal.save = jest.fn().mockResolvedValue(sample1);
      config.get = jest.fn().mockResolvedValue('asdf');
      // function
      const result = await positionService.save(baseSample);
      // assert
      expect(result.name === 'position').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      positionDal.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await positionService.findById(id);
      // assert
      expect(result.name === 'position').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      sample1.description = 'edited';
      positionDal.update = jest.fn().mockResolvedValue(sample1);
      positionDal.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await positionService.update('test', baseSample);
      // assert
      expect(result.name === 'position').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new Position(baseSample);
      positionDal.deleteById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await positionService.deleteById(id);
      // assert
      expect(result).toBeTruthy();
    });
  });
});
