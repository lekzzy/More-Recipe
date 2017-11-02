import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const regexEmail = /\S{3,}@\S{2,}\.\S{2,}/;
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])$/;
  const User = sequelize.define(
    'User', {
      name:
    {
      type: DataTypes.STRING,
    },
      email: {
        type: DataTypes.STRING,
        validate:
      {
        is: regexEmail,
        isEmail:
        {
          args: true,
          msg: 'Please Enter a valid Email Address'
        }
      },
      },
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        min: {
          arg: 8,
          msg: 'Password must not be less than 8'
        },
        is: regexPassword
      },
      phoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate:
      {
        isInt:
        {
          args: true,
          msg: 'Phone number should be numbers only'
        }
      }
      }
    },
    {
      hooks: {
        afterValidate: (user) => {
          user.password = bcrypt.hashSync(user.password, 10);
        }
      }
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Review, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Favorite, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Upvote, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Downvote, {
      foreignKey: 'userId'
    });
  };
  return User;
};
