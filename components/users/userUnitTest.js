const _ = require('lodash');
const axios = require('axios');
const pug = require('pug');
const userService = require('./userService');
const User = require('./user');
const fileUpload = require('../../libraries/utils/fileUpload');
const optimus = require('../../libraries/utils/optimus');
const expressGateway = require('../../libraries/utils/expressGateway');

let baseSample;

describe('Test User DAL', () => {
  beforeEach(async () => {
    baseSample = {
      fullname: 'Ronaldo Triandes',
      nik: '1231s',
      email: 'ronaldotriandes@gmail.com',
      password: '123test',
      role: {},
      type: 'telkom',
      job_position: 'Developer',
      mobile_number: '082283123123',
      country: 'indonesia',
      avatar: 'IMG123.jpg',
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      const sample2 = new User(_.set(baseSample, 'email', 'aldo@gmail.com'));
      const limitMethodResult = jest.fn().mockResolvedValue([sample1, sample2]);
      const limitMethod = { limit: limitMethodResult };
      const skipMethodResult = jest.fn(() => limitMethod);
      const skipMethod = { skip: skipMethodResult };
      const sortMethodResult = jest.fn(() => skipMethod);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      User.aggregate = jest.fn(() => collationMethod);


      // function
      const query = {
        perpage: 2,
        currpage: 0,
      };
      const result = await User.get(query);
      // assert
      expect(result.length).toBe(2);
      expect(result.some((g) => g.email === 'ronaldotriandes@gmail.com')).toBeTruthy();
      expect(result.some((g) => g.email === 'aldo@gmail.com')).toBeTruthy();
    });
  });

  describe('Function getOne()', () => {
    it('should return selected item', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      const sortMethodResult = jest.fn().mockResolvedValue(sample1);
      const sortMethod = { sort: sortMethodResult };
      const collationMethodResult = jest.fn(() => sortMethod);
      const collationMethod = { collation: collationMethodResult };
      User.findOne = jest.fn(() => collationMethod);

      const result = await User.getOne();
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      jest.spyOn(User.prototype, 'save').mockResolvedValue(sample1);
      User.syncCredentialOnExpressGateway = jest.fn().mockResolvedValue({});
      User.syncUserOnExpressGateway = jest.fn().mockResolvedValue({});
      User.store = jest.fn().mockResolvedValue(baseSample);
      // function
      const result = await User.store(baseSample);

      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findOne().populate = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await User.findById(id);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
    });
  });

  describe('Function findByEmail()', () => {
    it('should get selected email ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findOne = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test@';
      const result = await User.findByEmail(id);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
    });
  });

  describe('Function findByToken()', () => {
    it('should get selected token ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      sample1.resetPasswordToken = 'q12asdaeq2';
      User.findOne = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'asKS21';
      const result = await User.findByToken(id);
      // assert
      expect(result.resetPasswordToken === 'q12asdaeq2').toBeTruthy();
    });
  });


  describe('Function findByNik()', () => {
    it('should get selected Nik ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findOne = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'asKS21';
      const result = await User.findByNik(id);
      // assert
      expect(result.nik === '1231s').toBeTruthy();
    });
  });
  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      sample1.description = 'edited';
      jest.spyOn(User, 'update').mockResolvedValue(sample1);
      // function
      const id = '12etst';
      const result = await User.update(id, sample1);
      // assert
      expect(result.fullname === 'Ronaldo Triandes').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });
  describe('Function updateProfile()', () => {
    it('should updateProfile selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      sample1.description = 'edited';
      jest.spyOn(User, 'updateProfile').mockResolvedValue(sample1);
      // function
      const id = '12etst';
      const result = await User.updateProfile(id, sample1);
      // assert
      expect(result.fullname === 'Ronaldo Triandes').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });



  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findOneAndDelete = jest.fn().mockResolvedValue(sample1);
      // function
      const id = '1231asad';
      const result = await User.deleteById(id);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
      expect(User.findOneAndDelete).toHaveBeenCalled();
    });
  });

  describe('Function getTotal()', () => {
    it('should return total count of all records', async () => {
      // mock external function
      User.countDocuments = jest.fn().mockResolvedValue(2);
      // function
      const result = await User.getTotal();

      // assertz
      expect(result == 2).toBeTruthy();
    });
  });

  describe('Function getTotalFiltered()', () => {
    it('should return total filtered records ', async () => {
      User.aggregate = jest.fn().mockResolvedValue([{
        count: 1,
      }]);
      // function
      const result = await User.getTotalFiltered();
      // assert
      expect(result == 1).toBeTruthy();
    });
    it('should return 0 if empty', async () => {
      User.aggregate = jest.fn().mockResolvedValue([]);
      // function
      const result = await User.getTotalFiltered();
      // assert
      expect(result == 0).toBeTruthy();
    });
  });
});

describe('Test User Services', () => {
  beforeEach(async () => {
    baseSample = {
      fullname: 'Ronaldo Triandes',
      nik: '1231s',
      email: 'ronaldotriandes@gmail.com',
      password: '123test',
      role: {},
      type: 'telkom',
      job_position: 'Developer',
      mobile_number: '082283123123',
      country: 'indonesia',
      avatar: 'IMG123.jpg',
      updated_at: undefined,
      created_at: undefined,
    };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Function get()', () => {
    it('should return all item', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      const sample2 = new User(_.set(baseSample, 'email', 'aldo@gmail.com'));
      const result = {};
      User.get = jest.fn().mockResolvedValue(
        [sample1, sample2],
      );
      User.getTotal = jest.fn().mockResolvedValue(
        2,
      );
      User.getTotalFiltered = jest.fn().mockResolvedValue(
        1,
      );

      const data = await User.get();
      const total = await User.getTotal();
      const filtered = await User.getTotalFiltered();

      result.data = data;
      result.total = total;
      result.filtered = filtered;
      // assert
      expect(result.data.length).toBe(2);
      expect(result.data.some((g) => g.email === 'ronaldotriandes@gmail.com')).toBeTruthy();
      expect(result.data.some((g) => g.email === 'aldo@gmail.com')).toBeTruthy();
    });
  });

  describe('Function save()', () => {
    it('should save the item', async () => {
      // mock external function
      baseSample.created = {
        by: 'aldo',
      };
      const sample1 = new User(baseSample);
      User.store = jest.fn().mockResolvedValue(sample1);
      User.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const result = await userService.save(baseSample);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
    });
  });

  describe('Function findById()', () => {
    it('should get selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      const result = await userService.findById(id);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
    });
  });

  describe('Function update()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      sample1.description = 'edited';
      User.update = jest.fn().mockResolvedValue(sample1);
      User.findById = jest.fn().mockResolvedValue(sample1);

      const result = await userService.update('test1', sample1);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function updateProfile()', () => {
    it('should updateProfile selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      sample1.description = 'edited';
      User.updateProfile = jest.fn().mockResolvedValue(sample1);
      User.findById = jest.fn().mockResolvedValue(sample1);

      const result = await userService.updateProfile('test1', sample1);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
      expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function deleteById()', () => {
    it('should delete selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.update = jest.fn().mockResolvedValue(sample1);
      User.deleteById = jest.fn().mockResolvedValue(sample1);
      // function
      const id = 'test';
      expressGateway.deleteUser = jest.fn().mockResolvedValue(sample1);
      const result = await userService.deleteById(id);
      // assert
      expect(result).toBeTruthy();
    });
  });
  describe('Function resetpassword()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findByToken = jest.fn().mockResolvedValue(sample1);
      const updateresetToken = {
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        password: 'ganti',
      };
      User.update = jest.fn().mockResolvedValue(updateresetToken);
      sample1.password = 'ganti123';
      User.update = jest.fn().mockResolvedValue(sample1);
      User.findById = jest.fn().mockResolvedValue(sample1);
      User.syncCredentialOnExpressGateway = jest.fn().mockResolvedValue({});

      const result = await userService.resetPassword('token', 'ganti123', { password: 'ganti321' });
      // assert
      expect(result.password === 'ganti123').toBeTruthy();

      // expect(result.description === 'edited').toBeTruthy();
    });
  });

  describe('Function forgotpassword()', () => {
    it('should update selected id ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findByEmail = jest.fn().mockResolvedValue(sample1);
      sample1.resetPasswordToken = 'testtOken123s';
      sample1.resetPasswordExpires = Date.now() + 3600000;
      User.update = jest.fn().mockResolvedValue(sample1);
      const template = pug.renderFile = jest.fn().mockResolvedValue('tet123');
      const body = {
        notification: [
          {
            driver: 'email',
            content: template,
            recipient: {
              name: sample1.fullname,
              email: sample1.email,
              subject: 'Reset Password',
            },
          },
        ],
      };
      axios.post = jest.fn().mockResolvedValue(body);
      const email = 'test@gmail.com';
      const result = await userService.forgotPassword(email);
      // assert
      expect(result === body).toBeTruthy();
    });
  });
  describe('Function changePassword()', () => {
    it('should change password  ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      sample1.password = 'ganti123';
      User.update = jest.fn().mockResolvedValue(sample1);
      const template = pug.renderFile = jest.fn().mockResolvedValue('tet123');
      const body = {
        notification: [
          {
            driver: 'email',
            content: template,
            recipient: {
              name: sample1.fullname,
              email: sample1.email,
              subject: 'Change Password',
            },
          },
        ],
      };
      axios.post = jest.fn().mockResolvedValue(body);
      const email = 'test@gmail.com';
      const result = await userService.changePassword('jwt', email);
      // assert
      expect(result === body).toBeTruthy();
    });
  });

  describe('Function Upload Ava()', () => {
    it('should Avatar upload   ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      jest.spyOn(fileUpload, 'uploadMinioImage').mockResolvedValue({
        url: 'asdf',
      });
      const file = {
        url: 'ss',
      };
      const result = await userService.uploadAva('testid', file);
      // assert
      expect(result.url === 'asdf').toBeTruthy();
    });
  });
  describe('Function Activation User()', () => {
    it('should Activation user  ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      User.findEmailToken = jest.fn().mockResolvedValue(sample1);
      sample1.emailVerStatus = true;
      User.update = jest.fn().mockResolvedValue(sample1);
      User.findEmailToken = jest.fn().mockResolvedValue(sample1);
      const result = await userService.activationUser(sample1);
      // assert
      expect(result.emailVerStatus === true).toBeTruthy();
    });
  });

  describe('Function Register()', () => {
    it('should Register User  ', async () => {
      // mock external function
      const sample1 = new User(baseSample);
      optimus.findByEmail = jest.fn().mockResolvedValue(sample1);
      User.store = jest.fn().mockResolvedValue(sample1);
      const template = pug.renderFile = jest.fn().mockResolvedValue('tet123');
      const body = {
        notification: [
          {
            driver: 'email',
            content: template,
            recipient: {
              name: sample1.fullname,
              email: sample1.email,
              subject: 'Change Password',
            },
          },
        ],
      };
      axios.post = jest.fn().mockResolvedValue(body);
      User.syncUserOnExpressGateway = jest.fn().mockResolvedValue({
        id: '123ss',
        email: 'ronaldotriandes@gmail.com',
        fullname: 'ronaldo triandes',
        username: 'ronaldotriandes',
      });
      User.syncCredentialOnExpressGateway = jest.fn().mockResolvedValue({
        username: 'ronaldotriandes',
        password: 'qwerty123',
      });
      const result = await userService.register(sample1);
      // assert
      expect(result.email === 'ronaldotriandes@gmail.com').toBeTruthy();
    });
  });
});
