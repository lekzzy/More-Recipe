/** Define the Favorite database model/association
 * @exports Favorite
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Favorite model
 */
export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorites', {
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
  Favorite.associate = (models) => {
    Favorite.belongsTo(models.Recipes, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
    Favorite.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Favorite;
};
