export default (seq, DataTypes) => {
  const User = seq.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  });

  User.associte = models => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: 'userId'
    });
  };

  return User;
};
