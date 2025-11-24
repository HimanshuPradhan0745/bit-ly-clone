const { generate: generateUrlcode } = require("generate-password");
const Url = require("../models/UrlModel");

const isValidHttpUrl = (str) => {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const createUrl = async (payload) => {
  if (!payload.originalLink) throw Error("Missing required paramaters");
  if (!isValidHttpUrl(payload.originalLink)) throw Error("Invalid URL");
  try {
    let urlCode =
      payload.urlCode && typeof payload.urlCode === "string"
        ? payload.urlCode.trim()
        : "";

    if (urlCode) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(urlCode)) {
        throw Error("Invalid urlCode");
      }
      const existing = await Url.findOne({ urlCode }).exec();
      if (existing) {
        throw Error("URL code already in use");
      }
    } else {
      urlCode = generateUrlcode({ length: 8, numbers: true, lowercase: true, uppercase: true, excludeSimilarCharacters: true, strict: true });
      let attempts = 0;
      while (attempts < 5 && (await Url.findOne({ urlCode }).exec())) {
        urlCode = generateUrlcode({ length: 8, numbers: true, lowercase: true, uppercase: true, excludeSimilarCharacters: true, strict: true });
        attempts++;
      }
      if (await Url.findOne({ urlCode }).exec()) {
        throw Error("Failed to generate unique code");
      }
    }

    let url = new Url({ ...payload, urlCode });
    url = await url.save();

    return url;
  } catch (error) {
    throw error;
  }
};

const getUrlByUrlCode = async (urlCode) => {
  try {
    let data = await Url.findOne({ urlCode }).exec();
    if (!data) {
      throw new Error("Not found");
    }
    const nextCount = (data.visitCount || 0) + 1;
    await Url.updateOne(
      { urlCode },
      { visitCount: nextCount, updatedAt: Date.now(), lastClickedAt: Date.now() }
    ).exec();
    return data;
  } catch (error) {
    throw error;
  }
};

const updateUrlCode = async (payload) => {
  if (!payload.urlCode) throw Error("Invalid urlCode");
  try {
    const existing = await Url.findOne({ urlCode: payload.urlCode }).exec();
    if (!existing) throw Error("Not found");

    const update = {};
    const editableColumn = ["name", "originalLink"];

    Object.keys(payload).forEach((key) => {
      if (editableColumn.includes(key)) {
        if (key === "originalLink") {
          if (!isValidHttpUrl(payload[key])) throw Error("Invalid URL");
          update[key] = payload[key];
        } else {
          update[key] = payload[key];
        }
      }
    });

    update.updatedAt = Date.now();

    const updated = await Url.findOneAndUpdate(
      { urlCode: payload.urlCode },
      { $set: update },
      { new: true }
    ).exec();
    return updated;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUrlByUrlCode = async (urlCode) => {
  try {
    await Url.deleteOne({ urlCode });
    return "Deleted successfully";
  } catch (error) {
    console.log(error);
    Error(error);
  }
};

const getUrlsForUser = async (userId) => {
  try {
    const urls = await Url.find({ userId: userId }).exec();
    console.log("urls", urls);
    return urls;
  } catch (error) {
    throw new Error("Interal server error");
  }
};

module.exports = {
  createUrl,
  getUrlByUrlCode,
  updateUrlCode,
  deleteUrlByUrlCode,
  getUrlsForUser,
};
