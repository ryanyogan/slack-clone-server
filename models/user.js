import { hash } from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'The username may only contain letters and/or numbers.',
          },
          len: {
            args: [3, 25],
            msg:
              'The username may only be within 3 to 25 characters in length.',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid E-Mail address.',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 100],
            msg: 'The password must be within 5 - 100 characters.',
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async user => {
          user.password = await hash(user.password, 12); // eslint-disable-line
        },
      },
    },
  );

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
    // N:M
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return User;
};
