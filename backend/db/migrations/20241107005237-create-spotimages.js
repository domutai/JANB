// migrations/create-spotimages.js
//DEVELOPMENT

// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('SpotImages', {
//       id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false,
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
//       url: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       preview: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//       },
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('SpotImages');
//   },
// };

//SPOTIMAGES PRODUCTION
'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA || 'public';  
 }

module.exports = {
  up: async (queryInterface, Sequelize) => {

    if (process.env.NODE_ENV === 'production') {
      await queryInterface.sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${options.schema};`);}

    await queryInterface.createTable('SpotImages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages";
    return queryInterface.dropTable(options);
  },
};

