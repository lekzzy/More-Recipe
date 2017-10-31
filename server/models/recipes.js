'use strict';
module.exports = (sequelize, DataTypes) => {
  var recipes = sequelize.define('recipes', {
    recipeName: {type: DataTypes.STRING,
                 allowNull: false,
                 required:true
                },
    ingredients: {type:DataTypes.TEXT,
                  require: true
                 },
    procedure: {type:DataTypes.TEXT,
                require: true
               },
    userid: DataTypes.INTEGER,
    upvotes: DataTypes.INTEGER,
    downvotes: DataTypes.INTEGER
  }, 
  
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return recipes;
};