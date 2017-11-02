import bcrypt from 'bcrypt';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      hooks: {
        afterValidate: (user) => {
          user.password = bcrypt.hashSync(user.password, 10);
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('User')
};

