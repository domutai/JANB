//SPOT IMAGES SEED DEVELOPMENT
// 'use strict';

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
//         url: 'https://computersciencehero.com/wp-content/uploads/2019/10/51573033_2076486832438827_2048960555678433280_n.jpg',
//         preview: true
//       },
//       {
//         spotId: 1,
//         url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
//         preview: false
//       },
//       {
//         spotId: 1,
//         url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
//         preview: false
//       },
//       {
//         spotId: 1,
//         url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
//         preview: false
//       },
//       {
//         spotId: 1,
//         url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
//         preview: false
//       },
//       {
//         spotId: 2,
//         url: 'https://i.pinimg.com/originals/fb/44/7b/fb447bb6547ef7928e50b2167483970f.jpg',
//         preview: true
//       },
//       {
//         spotId: 2,
//         url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
//         preview: false
//       },
//       {
//         spotId: 2,
//         url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
//         preview: false
//       },
//       {
//         spotId: 2,
//         url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
//         preview: false
//       },
//       {
//         spotId: 2,
//         url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
//         preview: false
//       },
//       {
//         spotId: 3,
//         url: 'https://www.fortuny.shop/wp-content/uploads/2019/09/Fortuny-Lamps-in-Tribeca.jpg',
//         preview: true
//       },
//       {
//         spotId: 3,
//         url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
//         preview: false
//       },
//       {
//         spotId: 3,
//         url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
//         preview: false
//       },
//       {
//         spotId: 3,
//         url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
//         preview: false
//       },
//       {
//         spotId: 3,
//         url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
//         preview: false
//       },
//       {
//         spotId: 4,
//         url: 'https://www.fortuny.shop/wp-content/uploads/2019/09/Fortuny-Lamps-in-Tribeca.jpg',
//         preview: true
//       },
//       {
//         spotId: 5,
//         url: 'https://www.fortuny.shop/wp-content/uploads/2019/09/Fortuny-Lamps-in-Tribeca.jpg',
//         preview: true
//       },
//     ], {});
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     await queryInterface.bulkDelete('SpotImages', null, {});
//   }
// };

//SPOT IMAGES SEED PRODUCTION

'use strict';

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
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'https://computersciencehero.com/wp-content/uploads/2019/10/51573033_2076486832438827_2048960555678433280_n.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/computersciencehero.com/wp-content/uploads/2019/10/37585917_1786972501390263_5834834735154593792_n.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.pinimg.com/originals/fb/44/7b/fb447bb6547ef7928e50b2167483970f.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://st.hzcdn.com/simgs/pictures/patios/zen-beach-house-allen-construction-img~3051770206bb7479_4-3401-1-d80c868.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://www.fortuny.shop/wp-content/uploads/2019/09/Fortuny-Lamps-in-Tribeca.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://www.fortuny.shop/wp-content/uploads/2019/09/Fortuny-Lamps-in-Tribeca.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.fortuny.shop/wp-content/uploads/2019/09/Fortuny-Lamps-in-Tribeca.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiYMyMBqFyYLiJz1-MAWhsZ87hqG-f3ZXsw&s',
        preview: false
      },
    ], { schema: options.schema });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, null, { schema: options.schema });
  }
};