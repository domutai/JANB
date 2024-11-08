//BOOKINGS DEVELOPENT
// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('Bookings', {
//       id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false,
//       },
//       userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'Users', 
//           key: 'id',
//         },
//         onDelete: 'CASCADE',
//       },
//       spotId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'Spots', 
//           key: 'id',
//         },
//         onDelete: 'CASCADE',
//       },
//       startDate: {
//         type: Sequelize.DATEONLY,
//         allowNull: false,
//       },
//       endDate: {
//         type: Sequelize.DATEONLY,
//         allowNull: false,
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('Bookings');
//   },
// };


//BOOKINGS PRODUCTIONS
'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA || 'public';  
 }

module.exports = {
  up: async (queryInterface, Sequelize) => {

    if (process.env.NODE_ENV === 'production') {
    await queryInterface.sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${options.schema};`);}

    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.dropTable(options);
  },
};