export default (seq, DataTypes) => {
  const Message = seq.define('message', {
    text: DataTypes.STRING
  });

  Message.associte = models => {
    Message.belongsTo(models.Channel, {
      foreignKey: 'channelId'
    });

    Message.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  return Message;
};
