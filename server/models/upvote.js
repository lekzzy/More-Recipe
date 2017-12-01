/** Define the Upvote database model/association
 * @exports Upvote
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Upvote model
 */
export default (sequelize, DataTypes) => {
  const Upvote = sequelize.define('Upvotes', {
    recipeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Recipes',
        key: 'id',
        as: 'recipeId'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    }
  });
  Upvote.associate = (models) => {
    Upvote.belongsTo(models.Recipes, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
    Upvote.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Upvote;
};
