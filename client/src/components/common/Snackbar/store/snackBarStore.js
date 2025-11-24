import { makeAutoObservable } from "mobx";

class SnackBarStore {
  text = "";
  show = false;
  duration = 3000; // default is 3 seconds
  urgency = "default"; // "default" | "error" | "success"

  constructor() {
    makeAutoObservable(this);
  }

  showSnackBar = (text, urgency) => {
    this.text = text;
    if (urgency) {
      this.urgency = urgency;
    }
    this.showAndHide();
  };

  showAndHide = () => {
    this.show = true;

    setTimeout(() => {
      this.show = false;
      this.urgency = "default";
    }, this.duration);
  };

  hide = () => (this.show = false);
}

const snackBarStore = new SnackBarStore();
export default snackBarStore;
