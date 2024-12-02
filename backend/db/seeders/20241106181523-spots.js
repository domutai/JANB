//SPOTS SEED DEVELOPMENT
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
//     await queryInterface.bulkInsert('Spots', [
//       {
//         ownerId: 1, // User 1
//         address: '123 Disney Lane',
//         city: 'San Francisco',
//         state: 'California',
//         country: 'United States of America',
//         lat: 37.7645358,
//         lng: -122.4730327,
//         name: 'App Academy',
//         description: 'Place where web developers are created',
//         price: 123,
//         avgRating: 4.5,
//         previewImage:
//         '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         ownerId: 2, // User 2
//         address: '789 Ocean Drive',
//         city: 'Los Angeles',
//         state: 'California',
//         country: 'United States of America',
//         lat: 34.052235,
//         lng: -118.243683,
//         name: 'Los Angeles Beach House',
//         description: 'Sunny beach house with ocean views',
//         price: 250,
//         avgRating: 4.7,
//         previewImage: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         ownerId: 3, // User 3
//         address: '123 Broadway Ave',
//         city: 'New York',
//         state: 'New York',
//         country: 'United States of America',
//         lat: 40.712776,
//         lng: -74.005974,
//         name: 'Times Square Luxury Loft',
//         description: 'Modern loft with a view of Times Square',
//         price: 400,
//         avgRating: 4.8,
//         previewImage: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         ownerId: 3, // User 3
//         address: '123 Broadway Ave',
//         city: 'New York',
//         state: 'New York',
//         country: 'United States of America',
//         lat: 40.712776,
//         lng: -74.005974,
//         name: 'Times Square Luxury Loft',
//         description: 'Modern loft with a view of Times Square',
//         price: 400,
//         avgRating: 4.8,
//         previewImage: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         ownerId: 3, // User 3
//         address: '123 Broadway Ave',
//         city: 'New York',
//         state: 'New York',
//         country: 'United States of America',
//         lat: 40.712776,
//         lng: -74.005974,
//         name: 'Times Square Luxury Loft',
//         description: 'Modern loft with a view of Times Square',
//         price: 400,
//         avgRating: 4.8,
//         previewImage: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
      
      
//     ]);
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     await queryInterface.bulkDelete('Spots', null, {});
//   }
// };

//SPOT SEED PRODUCTION

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
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1, // User 1
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123,
        avgRating: '',
        previewImage: 'https://example.com/images/app-academy.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2, // User 2
        address: '789 Ocean Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 34.052235,
        lng: -118.243683,
        name: 'Los Angeles Beach House',
        description: 'Sunny beach house with ocean views',
        price: 250,
        avgRating: '',
        previewImage: 'https://example.com/images/la-beach-house.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3, // User 3
        address: '123 Broadway Ave',
        city: 'New York',
        state: 'New York',
        country: 'United States of America',
        lat: 40.712776,
        lng: -74.005974,
        name: 'Times Square Luxury Loft',
        description: 'Modern loft with a view of Times Square',
        price: 400,
        avgRating: '',
        previewImage: 'https://example.com/images/tsq-loft.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
{
  ownerId: 3, // User 3
  address: '123 Broadway Ave',
  city: 'New York',
  state: 'New York',
  country: 'United States of America',
  lat: 40.712776,
  lng: -74.005974,
  name: 'Times Square Luxury Loft',
  description: 'Modern loft with a view of Times Square',
  price: 400,
  previewImage: '',
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  ownerId: 3, // User 3
  address: '123 Broadway Ave',
  city: 'New York',
  state: 'New York',
  country: 'United States of America',
  lat: 40.712776,
  lng: -74.005974,
  name: 'Times Square Luxury Loft',
  description: 'Modern loft with a view of Times Square',
  price: 400,
  previewImage: '',
  createdAt: new Date(),
  updatedAt: new Date(),
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
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, null, { schema: options.schema });
  }
};