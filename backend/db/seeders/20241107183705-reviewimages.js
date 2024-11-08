//REVIEW IMAGES SEED DEVELOPMENT
// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('ReviewImages', [
//       {
//         reviewId: 1,  
//         url: 'https://example.com/images/review1_image1.jpg',
//       },
//       {
//         reviewId: 1,  
//         url: 'https://example.com/images/review1_image2.jpg',
//       },
//       {
//         reviewId: 2,  
//         url: 'https://example.com/images/review2_image1.jpg',
//       },
//       {
//         reviewId: 3,  
//         url: 'https://example.com/images/review3_image1.jpg',
//       },
//       {
//         reviewId: 3,  
//         url: 'https://example.com/images/review3_image2.jpg',
//       }
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('ReviewImages', null, {});
//   }
// };

//REVIEW IMAGES SEED PRODUCTIONS
'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA || 'public';
 }

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1,  
        url: 'https://example.com/images/review1_image1.jpg',
      },
      {
        reviewId: 1,  
        url: 'https://example.com/images/review1_image2.jpg',
      },
      {
        reviewId: 2,  
        url: 'https://example.com/images/review2_image1.jpg',
      },
      {
        reviewId: 3,  
        url: 'https://example.com/images/review3_image1.jpg',
      },
      {
        reviewId: 3,  
        url: 'https://example.com/images/review3_image2.jpg',
      }
    ], { schema: options.schema });
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, null, { schema: options.schema });
  }
};

