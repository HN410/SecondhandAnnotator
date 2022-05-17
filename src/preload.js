const { contextBridge} = require("electron");
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld(
  "requires", {
    writeData :  (file_name, data) => {
      console.log("test");
      var data_path = path.join(process.cwd(), file_name);
      fs.writeFile(data_path, data, "utf8", () => {});
    }
  }
);