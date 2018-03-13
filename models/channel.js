export default (seq, DataTypes) => {
  const Channel = seq.define('channel', {
    name: DataTypes.STRING,
    public: DataTypes.BOOLEAN
  });

  Channel.associte = models => {
    Channel.belongsTo(models.Team, {
      foreignKey: 'teamId'
    });
  };

  return Channel;
};
