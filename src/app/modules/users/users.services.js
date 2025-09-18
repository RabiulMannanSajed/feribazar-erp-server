import { User } from "./users.model.js";

export const createUseIntoDB = async (data) => {
  console.log(data);

  const UserData = await User(data);
  return await UserData.save();
};
