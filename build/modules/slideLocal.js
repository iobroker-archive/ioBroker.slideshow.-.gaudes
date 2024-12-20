"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var slideLocal_exports = {};
__export(slideLocal_exports, {
  getPicture: () => getPicture,
  updatePictureList: () => updatePictureList
});
module.exports = __toCommonJS(slideLocal_exports);
var import_exif = require("./exif");
let CurrentImages;
let CurrentImage;
async function getPicture(Helper) {
  try {
    if (CurrentImages.length === 0) {
      await updatePictureList(Helper);
    }
    if (CurrentImages.length !== 0) {
      if (!CurrentImage) {
        CurrentImage = CurrentImages[0];
      } else {
        if (CurrentImages.indexOf(CurrentImage) === CurrentImages.length - 1) {
          CurrentImage = CurrentImages[0];
        } else {
          CurrentImage = CurrentImages[CurrentImages.indexOf(CurrentImage) + 1];
        }
      }
      return CurrentImage;
    }
    return null;
  } catch (err) {
    Helper.ReportingError(err, "Unknown Error", "Local", "getPicture");
    return null;
  }
}
async function updatePictureList(Helper) {
  try {
    CurrentImages = [];
    const CurrentImageFiles = await Helper.Adapter.readDirAsync("vis.0", "/slideshow");
    if (!(CurrentImageFiles.length > 0)) {
      Helper.ReportingError(null, "No pictures found in folder", "Local", "updatePictureList/List", "", false);
      return { success: false, picturecount: 0 };
    } else {
      await Promise.all(CurrentImageFiles.map(async (file) => {
        const CurrentImageFile = await Helper.Adapter.readFileAsync("vis.0", `/slideshow/${file.file}`);
        const fileInfo = await (0, import_exif.getPictureInformation)(Helper, CurrentImageFile.file);
        let info1, info2, info3 = "";
        let date = null;
        (fileInfo == null ? void 0 : fileInfo.info1) ? info1 = fileInfo == null ? void 0 : fileInfo.info1 : info1 = "";
        (fileInfo == null ? void 0 : fileInfo.info2) ? info2 = fileInfo == null ? void 0 : fileInfo.info2 : info2 = "";
        (fileInfo == null ? void 0 : fileInfo.info3) ? info3 = fileInfo == null ? void 0 : fileInfo.info3 : info3 = "";
        (fileInfo == null ? void 0 : fileInfo.date) ? date = fileInfo == null ? void 0 : fileInfo.date : date = null;
        if (Array.isArray(CurrentImages)) {
          CurrentImages.push({ url: `/vis.0/slideshow/${file.file}`, path: file.file, info1, info2, info3, date });
        } else {
          CurrentImages = [{ url: `/vis.0/slideshow/${file.file}`, path: file.file, info1, info2, info3, date }];
        }
      }));
    }
    Helper.ReportingInfo("Info", "Local", `${CurrentImages.length} pictures found`, { JSON: JSON.stringify(CurrentImages.slice(0, 10)) });
    return { success: true, picturecount: CurrentImages.length };
  } catch (err) {
    Helper.ReportingError(err, "Unknown Error", "Local", "updatePictureList/List");
    return { success: false, picturecount: 0 };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPicture,
  updatePictureList
});
//# sourceMappingURL=slideLocal.js.map
