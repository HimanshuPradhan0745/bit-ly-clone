import { makeAutoObservable } from "mobx";
import { createUrl, deleteUrlByUrlCode, getLinks } from "../Services/urlServices.js";
import snackBarStore from "../components/common/Snackbar/store/snackBarStore.js";

class UrlStore {
  urlData = [];
  urlDataLoading = false;
  showUrlAddView = false;
  newUrlPayload = {
    originalLink: "",
    name: "",
    urlCode: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  init = () => {
    this.fetchLinks();
  };

  fetchLinks = async () => {
    try {
      this.urlDataLoading = true;
      const data = await getLinks();
      this.setUrlData(data || []);
      this.urlDataLoading = false;
    } catch (error) {
      console.log(error);
      this.urlDataLoading = false;
    }
  };
  // backward-compat alias for existing callers
  fetchUrlsForUser = async () => this.fetchLinks();

  createNewUrl = async () => {
    try {
      if (!this.newUrlPayload.originalLink) {
        alert("Original link is required");
        return;
      }
      const res = await createUrl(this.newUrlPayload);
      if (res && res.id) {
        this.fetchLinks();
        this.showUrlAddView = false;
        this.newUrlPayload = { originalLink: "", name: "", urlCode: "" };
        snackBarStore.showSnackBar("Short link created", "success");
      } else if (res && res.response) {
        const status = res.response.status;
        const msg = res.response.data || "Something went wrong";
        if (status === 400) {
          snackBarStore.showSnackBar("Invalid URL", "error");
        } else if (status === 409) {
          snackBarStore.showSnackBar("Custom code already in use", "error");
        } else {
          snackBarStore.showSnackBar(typeof msg === "string" ? msg : "Failed to create link", "error");
        }
      } else {
        snackBarStore.showSnackBar("Failed to create link", "error");
      }
    } catch (error) {
      snackBarStore.showSnackBar("Failed to create link", "error");
    }
  };

  deleteUrl = async (urlCode) => {
    await deleteUrlByUrlCode(urlCode);
    this.fetchLinks();
    snackBarStore.showSnackBar("Deleted Successfully", "success");
  };

  setUrlData = (data) => (this.urlData = data);
  setShowUrlAddView = (val) => (this.showUrlAddView = val);
}

const urlStore = new UrlStore();
export default urlStore;
