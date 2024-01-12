import fs from "fs";
export default function delteLocalImages(paths: string[]) {
  paths.forEach((path) => {
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}
