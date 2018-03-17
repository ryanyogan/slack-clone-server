import { formatErrors } from '../../lib/formatErrors';

export default {
  Mutation: {
    createTeam: async (parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id });
        return {
          ok: true,
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
