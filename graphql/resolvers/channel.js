import { formatErrors } from '../../lib/formatErrors';

export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (error) {
        console.error(error); // eslint-disable-line
        return {
          ok: false,
          errors: formatErrors(error, models),
        };
      }
    },
  },
};
