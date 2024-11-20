import userRepository from "../repositories/user.repository.js";

const getUsers = async () => {
  return await userRepository.getUsers();
};

const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

export default {
  getUsers,
  getUserById,
};
