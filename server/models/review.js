/** Define the Review database model/association
 * @exports Review
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Review model
 */
export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    content: DataTypes.TEXT,
    recipeId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Recipe',
        key: 'id',
        as: 'recipeId',
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'User',
        key: 'id',
        as: 'userId',
      }
    }
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
    });
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Review;
};
