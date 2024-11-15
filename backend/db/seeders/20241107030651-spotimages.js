//SPOT IMAGES SEED DEVELOPMENT
'use strict';

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
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'https://example.com/image1.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://example.com/image2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://example.com/image3.jpg',
        preview: false
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};

//SPOT IMAGES SEED PRODUCTION

// 'use strict';

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA || 'public';
//  }

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//     await queryInterface.bulkInsert('SpotImages', [
//       {
//         spotId: 1,
//         url: 'https://example.com/image1.jpg',
//         preview: true
//       },
//       {
//         spotId: 1,
//         url: 'https://example.com/image2.jpg',
//         preview: false
//       },
//       {
//         spotId: 2,
//         url: 'https://example.com/image3.jpg',
//         preview: false
//       }
//     ], { schema: options.schema });
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     options.tableName = 'SpotImages';
//     return queryInterface.bulkDelete(options, null, { schema: options.schema });
//   }
// };