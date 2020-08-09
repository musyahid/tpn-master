const _ = require('lodash');
const config = require('config');
const organizationStructureService = require('./organizationStructureService');
const organizationStructure = require('./organizationStructure');
const organizationStructureDAL = require('./organizationStructureDAL');

let baseSample;

describe('Test organizationStructure DAL', () => {
  beforeEach(async () => {
    baseSample = {
      _id: 'psds',
      name: 'psds parnership',
      parent: 'pas',
    };
    sampleNode = {
      _id: 'telkom',
      name: 'TLKM',
      level: '1',
      code: null,
      parent: 'companies'
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      jest.spyOn(organizationStructure.prototype, 'save').mockResolvedValue(sample1);
      // function
      const result = await organizationStructureDAL.save(baseSample);

      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      organizationStructure.findOne = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await organizationStructureDAL.findById(id);
      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      sample1.description = 'edited';
      jest.spyOn(organizationStructureDAL, 'update').mockResolvedValue(sample1);
      // function
      const result = await organizationStructureDAL.update(sample1);
      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function findDescendants()', () => {
    it('should Descendants', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      const sample2 = new organizationStructure(_.set(baseSample, '_id', '123test'));

      organizationStructure.collection.findOne = jest.fn().mockResolvedValue('asd');
      organizationStructure.collection.find = jest.fn().mockResolvedValue(sample1);
      jest.spyOn(organizationStructureDAL, 'findDescendants').mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await organizationStructureDAL.findDescendants(id);
      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
    });
  });
  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      organizationStructure.collection.findOne = jest.fn().mockResolvedValue('asd');
      organizationStructure.collection.find = jest.fn().mockResolvedValue(sample1);
      organizationStructure.findByIdAndDelete = jest.fn().mockResolvedValue('asd');
      jest.spyOn(organizationStructureDAL, 'deleteById').mockResolvedValue(sample1);

      // function
      const id = 'test';
      const result = await organizationStructureDAL.deleteById(id);
      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
    });
  });
});

describe('Test organizationStructure Services', () => {
  beforeEach(async () => {
    baseSample = {
      _id: 'psds',
      name: 'psds parnership',
      parent: 'pas',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function findDescendants()', () => {
    it('should findDescendants the item', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      organizationStructureDAL.findDescendants = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await organizationStructureService.findDescendants(baseSample);
      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      baseSample.created = {
        description: 'testtesttest',
      };
      const sample1 = new organizationStructure(baseSample);
      organizationStructureDAL.save = jest.fn().mockResolvedValue(sample1);
      config.get = jest.fn().mockResolvedValue('asdf');
      // function
      const result = await organizationStructureService.save(baseSample);
      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
    });
  });


  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      sample1.description = 'edited';
      organizationStructureDAL.update = jest.fn().mockResolvedValue(sample1);
      organizationStructureDAL.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await organizationStructureService.update('test', baseSample);
      // assert
      expect(result.name === 'psds parnership').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new organizationStructure(baseSample);
      organizationStructureDAL.deleteById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await organizationStructureService.deleteById(id);
      // assert
      expect(result).toBeTruthy();
    });
  });

  describe('Function findNodeByLevel()', () => {
    it('should find Node by level', async () => {
      // mock external function
      const factory = new organizationStructure(sampleNode);
      
      organizationStructureDAL.findNodeByLevel = jest.fn().mockResolvedValue(factory);
      // function
      const result = await organizationStructureService.findNodeByLevel(sampleNode);
      // assert
      expect(result.name === 'TLKM').toBeTruthy();
    });
  });
});
