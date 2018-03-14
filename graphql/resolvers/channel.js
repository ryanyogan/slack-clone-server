export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        await models.Channel.create(args);
        return true;
      } catch (error) {
        console.error(error); // eslint-disable-line
        return false;
      }
    }
  }
};
