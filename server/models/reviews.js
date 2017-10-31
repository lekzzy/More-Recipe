export default(sequelize, DataTypes) => {
  const reviews = sequelize.define('reviews', {
    review: DataTypes.TEXT,
  });
  reviews.associate = (models) => {
    reviews.belongsTo(models.userId, {
      foreignKey: 'userId',
    });
    reviews.belongsTo(models.recipes, {
      foreignKey: 'recipeId',
    });
  };
  return reviews;
};
