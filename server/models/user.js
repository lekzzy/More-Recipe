import bigcrypt from 'bigcrypt';
'use strict';
const regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regex_password =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])$/;
module.exports = (sequelize, DataTypes) => {
  
  const user = sequelize.define('user', {
    name: {type: DataTypes.STRING,
           allowNull: false,
           required: true
          },

    email: {type:DataTypes.STRING, 
           validate:{is: regex_email,
                    isEmail:
                    {args: true, 
                     msg:'Please Enter a valid Email Address'},
                     notNull: true}},
           unique: true,
              
    username: {type: DataTypes.STRING,
               required: true,
               allowNull: false,
               unique: true
              },

    password: {type: DataTypes.STRING,
               allowNull: false,
               required: true,
               min: 8,
               is: regex_password
              },
    profilePicture: {type:DataTypes.BLOB,
                     allowNull: true
                    },
    phoneNumber: {type:DataTypes.INTEGER,
                  allowNull: true,
                  validate:{
                            isInt:{
                                  args:true,
                                  msg:"Phone Number should be numbers only"
                                  }
                           }
                  },
  
});
  
    // associations can be defined here
    user.associate = (models) => {
      user.hasMany(models.recipes, {
         foreignKey: 'userId',
         as: 'recipesId',
        
    }
    }
  });
     return user;
};