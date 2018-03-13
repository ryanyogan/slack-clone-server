export default (seq, DataTypes) => {
  const Team = seq.define(
    'team',
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      }
    },
    { underscored: true }
  );

  Team.associte = models => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    });

    Team.belongsTo(models.User, {
      foreignKey: 'owner'
    });
  };

  return Team;
};
