import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'username']),
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'username']),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [createToken, createRefreshToken];
};

export const refreshToken = async (token, rToken, models, secret, secret2) => {
  let userId = 0;
  try {
    const { user: { id } } = jwt.decode(rToken);
    userId = id;
  } catch (error) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + secret2;

  try {
    jwt.verify(rToken, refreshSecret);
  } catch (error) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    secret,
    refreshSecret,
  );

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models, secret, secret2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [
        { path: 'email|password', message: 'Invalid credentials provided.' },
      ],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [
        { path: 'password|password', message: 'Invalid credentials provided.' },
      ],
    };
  }

  const refreshTokenSecret = `${user.password}${secret2}`;

  const [token, newRefreshToken] = await createTokens(
    user,
    secret,
    refreshTokenSecret,
  );

  return {
    ok: true,
    token,
    refreshToken: newRefreshToken,
  };
};
