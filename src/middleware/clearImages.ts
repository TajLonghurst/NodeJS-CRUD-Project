import path from "path";
import fs from "fs";

export const clearImage = (filePath: string[]) => {
  filePath.map((filePath) => {
    filePath = path.join(__dirname, "../../", filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};
