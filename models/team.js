export default (seq, DataTypes) => {
  const Team = seq.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  Team.associte = models => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: 'teamId'
    });

    Team.belongsTo(models.User, {
      foreignKey: 'owner'
    });
  };

  return Team;
};
