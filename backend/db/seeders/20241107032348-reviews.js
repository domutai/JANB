//REVIEWS SEED DEVELOPMENT
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
    await queryInterface.bulkInsert('Reviews', [
      {
        id: 1,
        userId: 1,  
        spotId: 1,  
        review: 'This was an awesome spot!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 2,  
        spotId: 1,  
        review: 'Had a great time here, highly recommend!',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 3,  
        spotId: 2,  
        review: 'Not bad, but could be better. Needs improvements.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date()
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
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};


//REVIEWS SEED PRODUCTION
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
//     await queryInterface.bulkInsert('Reviews', [
//       {
//         id: 1,
//         userId: 1,  
//         spotId: 1,  
//         review: 'This was an awesome spot!',
//         stars: 5,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       },
//       {
//         id: 2,
//         userId: 2,  
//         spotId: 1,  
//         review: 'Had a great time here, highly recommend!',
//         stars: 4,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       },
//       {
//         id: 3,
//         userId: 3,  
//         spotId: 2,  
//         review: 'Not bad, but could be better. Needs improvements.',
//         stars: 3,
//         createdAt: new Date(),
//         updatedAt: new Date()
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
//     options.tableName = 'Reviews';
//     return queryInterface.bulkDelete(options, null, { schema: options.schema });
//   }
// };
