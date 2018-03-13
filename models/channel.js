export default (seq, DataTypes) => {
  const Channel = seq.define(
    'channel',
    {
      name: DataTypes.STRING,
      public: DataTypes.BOOLEAN
    },
    {
      underscored: true
    }
  );

  Channel.associte = models => {
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    });

    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
  };

  return Channel;
};
