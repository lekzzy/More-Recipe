'use strict';
module.exports = (sequelize, DataTypes) => {
  var reviews = sequelize.define('reviews', {
    review: DataTypes.TEXT,
    recipeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, 
  
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return reviews;
};