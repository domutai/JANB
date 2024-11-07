// 'use strict';
// const { Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class Spot extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // Define associations here, for example:
//       // Spot.hasMany(models.Image, { foreignKey: 'spotId' });
//     }
//   }
//   Spot.init({
//     address: {
//       type: DataTypes.STRING,
//       allowNull: false, 
//     },
//     city: {
//       type: DataTypes.STRING,
//       allowNull: false, 
//     },
//     state: {
//       type: DataTypes.STRING,
//       allowNull: false, 
//     },
//     country: {
//       type: DataTypes.STRING,
//       allowNull: false, 
//     },
//     lat: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//       validate: {
//         min: -90,
//         max: 90,
//       },
//     },
//     lng: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//       validate: {
//         min: -180,
//         max: 180,
//       },
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: [1, 50],
//       },
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.DECIMAL,
//       allowNull: false,
//       validate: {
//         min: 0,
//       },
//     },
//   }, {
//     sequelize,
//     modelName: 'Spot',
//   });

//   return Spot;
// };

// models/Spot.js

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    // You can add custom instance or static methods here if needed
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner',
        onDelete: 'CASCADE',
      });
    }
  }

  Spot.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Name of the referenced table
          key: 'id', // Column in the users table being referenced
        },
        onDelete: 'CASCADE',
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      avgRating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      previewImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Spot',
      tableName: 'Spots', // Explicitly specifying table name
      timestamps: true, // Automatically manage createdAt and updatedAt
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

 Spot.associate = (models) => {
    // Define associations here
    Spot.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
      onDelete: 'CASCADE',
    });
    
    Spot.hasMany(models.Review, {
      foreignKey: 'spotId',
      as: 'reviews',
    });

    Spot.hasMany(models.SpotImage, {
      foreignKey: 'spotId',
      as: 'images',
    });
  }
//     Spot.hasMany(models.Booking, {
//       foreignKey: 'spotId',
//       as: 'bookings',
//     });
//   };

  return Spot;
};
 