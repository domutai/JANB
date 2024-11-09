//PRODUCTION
'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA || 'public';
 }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'User'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Fake',
        lastName: 'Userone'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Faketwo',
        lastName: 'Usertwo'
      }
    ], { schema: options.schema, validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(/*options,*/ { tableName: 'Users', schema: options.schema }, 
      {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] } 
    }, { schema: options.schema });
  }
};

//USERS SEED DEVELOPMENT
// 'use strict';
// const { User } = require('../models');
// const bcrypt = require("bcryptjs");


// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.bulkInsert('Users', [
//       {
//                 email: 'demo@user.io',
//                 username: 'Demo-lition',
//                 hashedPassword: bcrypt.hashSync('password'),
//                 firstName: 'Demo',
//                 lastName: 'User'
//               },
//               {
//                 email: 'user1@user.io',
//                 username: 'FakeUser1',
//                 hashedPassword: bcrypt.hashSync('password2'),
//                 firstName: 'Fake',
//                 lastName: 'Userone'
//               },
//               {
//                 email: 'user2@user.io',
//                 username: 'FakeUser2',
//                 hashedPassword: bcrypt.hashSync('password3'),
//                 firstName: 'Faketwo',
//                 lastName: 'Usertwo'
//               }
//     ]);
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete('Users', null, {});
//   }
// };
