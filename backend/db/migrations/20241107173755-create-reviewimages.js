//REVIEWIMAGES DEVELOPMENT
// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('ReviewImages', {
//       id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false,
//       },
//       reviewId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'Reviews', 
//           key: 'id',
//         },
//         onDelete: 'CASCADE',
//       },
//       url: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('ReviewImages');
//   },
// };


//REVIEWIMAGES PRODUCTIONS
'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA || 'public';  
 }

module.exports = {
  up: async (queryInterface, Sequelize) => {

    if (process.env.NODE_ENV === 'production') {
    await queryInterface.sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${options.schema};`);}

    await queryInterface.createTable('ReviewImages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reviews', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }, options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages";
    return queryInterface.dropTable(options);
  },
};
