import { User } from '../models/user.js';

export const seedUsers = async () => {
  const users = [
    { username: 'JollyGuru', password: 'password' },
    { username: 'SunnyScribe', password: 'password' },
    { username: 'RadiantComet', password: 'password' },
  ];

  for (const userData of users) {
    await User.findOrCreate({
      where: { username: userData.username },
      defaults: userData
    });
  }
};
