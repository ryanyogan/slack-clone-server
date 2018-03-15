import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [createToken, createRefreshToken];
};

export const refreshToken = async (token, refreshToken, models, SECRET) => {
  let userId = -1;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (error) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  try {
    jwt.verify(refreshToken, user.refreshToken);
  } catch (error) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    user.refreshToken,
  );

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models, SECRET, SECRET_2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'email', message: 'User with email provided found.' }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Invalid credentials provided.' }],
    };
  }

  const refreshTokenSecret = `${user.password}${SECRET_2}`;

  const [token, refreshToken] = await createTokens(
    user,
    SECRET,
    refreshTokenSecret,
  );

  return {
    ok: true,
    token,
    refreshToken,
  };
};
