//BOOKINGS SEED DEVELOPMENT
// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Bookings', [
//       {
//         spotId: 1,  
//         userId: 1,  
//         startDate: '2024-11-16',
//         endDate: '2024-11-20',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         spotId: 2,  
//         userId: 2,  
//         startDate: '2025-12-01',
//         endDate: '2025-12-05',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         spotId: 3,  
//         userId: 3,  
//         startDate: '2026-01-10',
//         endDate: '2026-01-15',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Bookings', null, {});
//   }
// };

//BOOKINGS SEED PRODUCTION
'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA || 'public';
 }

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,  
        userId: 1,  
        startDate: '2024-11-16',
        endDate: '2024-11-20',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,  
        userId: 2,  
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,  
        userId: 3,  
        startDate: '2026-01-10',
        endDate: '2026-01-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { schema: options.schema });
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options, null, { schema: options.schema });
  }
};
