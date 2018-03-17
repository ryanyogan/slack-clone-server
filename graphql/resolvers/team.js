import { formatErrors } from '../../lib/formatErrors';
import { requiresAuth } from '../../lib/permissions';

export default {
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          await models.Team.create({ ...args, owner: user.id });
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models),
          };
        }
      },
    ),
  },
};
