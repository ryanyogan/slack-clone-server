import { hash } from 'bcrypt';
import { pick } from 'lodash';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'Uh Oh: Something went wrong.' }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...args }, { models }) => {
      try {
        if (password.length < 5) {
          return {
            ok: false,
            errors: [
              {
                path: 'password',
                message: 'The password must contain a minimum of 5 characters.',
              },
            ],
          };
        }

        const hashedPassword = await hash(password, 12);
        const user = await models.User.create({
          ...args,
          password: hashedPassword,
        });
        return {
          ok: true,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models),
        };
      }
    },
  },
};
