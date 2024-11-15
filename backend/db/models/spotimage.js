// models/SpotImage.js
//DEVELOPMENT

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SpotImage extends Model {}

  SpotImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'SpotImage',
      tableName: 'SpotImages',
      //schema: 'public',
      timestamps: false,
    }
  );

  SpotImage.associate = (models) => {
    SpotImage.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      as: 'spot',
      onDelete: 'CASCADE',
    });
  };

  return SpotImage;
};