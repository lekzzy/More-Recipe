export default (sequelize, DataTypes) => {
  const regexEmail = /\S{3,}@\S{2,}\.\S{2,}/;
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])$/;
  const User = sequelize.define('Users', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        is: regexEmail,
        isEmail: {
          args: true,
          msg: 'Please Enter a valid Email Address'
        }
      },
      notNull: true,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      min: {
        arg: 8,
        msg: 'Password must not be less than 8'
      },
      is: regexPassword,
    },
    profilePicture: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: true,
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Recipes, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Reviews, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Favorites, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Upvotes, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Downvotes, {
      foreignKey: 'userId'
    });
  };
  return User;
};

