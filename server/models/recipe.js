/** Define the Recipe database model/association
 * @exports Recipe
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Recipe model
 */
export default (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipes', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ingredients: DataTypes.STRING,
    procedure: DataTypes.STRING,
    imageUrl: DataTypes.BLOB,
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    downvotes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    }
  });
  Recipe.associate = (models) => {
    Recipe.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Recipe.hasMany(models.Reviews, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
    Recipe.hasMany(models.Favorites, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
    Recipe.hasMany(models.Upvotes, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
    Recipe.hasMany(models.Downvotes, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
  };
  return Recipe;
};
