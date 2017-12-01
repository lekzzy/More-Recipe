/** Define the Review database model/association
 * @exports Review
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Review model
 */
export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Reviews', {
    review: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    recipeId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Recipes',
        key: 'id',
        as: 'recipeId'
      }
    }
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Recipes, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
    Review.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Review;
};
