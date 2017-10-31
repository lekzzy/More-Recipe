
const regexEmail = new RegExp(['\\^(([^<>()\\[\\]\\.,;:\\s@"]',
  '+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]',
  '{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]',
  '{2,}))$/'].join(''));
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])$/;
export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {

    name:
    {
      type: DataTypes.STRING,
      allowNull: false,
      required: true
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
      notNull: true,
      unique: true,
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
      min: 8,
      is: regexPassword
    },

    profilePicture: {
      type: DataTypes.BLOB,
      allowNull: true
    },

    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate:
      {
        isInt:
        {
          args: true,
          msg: 'Phone Number should be numbers only'
        }
      }
    }
  });

    // associations can be defined here
  user.associate = (models) => {
    user.hasMany(
      models.recipes,
      {
        foreignKey: 'recipeId',
      }
    );
    user.hasMany(
      models.reviews,
      {
        foreignKey: 'recipeId',
      }
    );
  };
  hooks: {
    beforeCreate: (user, options) => {
      return new Promise((resolve, reject) => {
        bcrypt.hashSyc(user.password, 8, (err, data) => {
          if (err) 
          {
            reject(err);
          }
          user.password = data;
          resolve();
        })
      });
    }
  }
});
  return user;
};
