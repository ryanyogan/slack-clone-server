import { pick } from 'lodash';

export const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => pick(x, ['path', 'message']));
  }

  return [{ path: 'name', message: 'Uh Oh: Something went wrong.' }];
};
