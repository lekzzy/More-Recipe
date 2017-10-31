export default(sequelize, DataTypes) => {
  const recipes = sequelize.define('recipes', {
    recipeName: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true
    },
    ingredients: {
      type: DataTypes.TEXT,
      require: true
    },
    procedure: {
      type: DataTypes.TEXT,
      require: true
    },
    upvotes: DataTypes.INTEGER,
    downvotes: DataTypes.INTEGER
  });
  recipes.associate = (models) => {
    recipes.belongsTo(models.recipes, {
      foreignKey: 'recipeId',
      as: 'userId'
    });
    recipes.hasMany(models.reviews, {
      foreignKey: 'recipeId',
      as: 'reviewsId'
    });
  };
  return recipes;
};
