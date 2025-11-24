import { makeAutoObservable } from "mobx";
import { getUserById, updateUser as updateUserService } from "../Services/userServices.js";

class UserStore {
  user = {
    id: "",
    email: "",
    avatar: "https://via.placeholder.com/600/92c952",
    fullName: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  init = () => {
    this.fetchUser();
  };

  fetchUser = async () => {
    try {
      const userData = await getUserById();
      this.user = userData || this.user;
    } catch (error) {
      console.log(error);
    }
  };

  updateUser = async () => {
    try {
      await updateUserService(this.user);
      this.fetchUser();
    } catch (error) {
      console.log(error);
    }
  };
}

const userStore = new UserStore();
export default userStore;
