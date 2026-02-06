var child_process = require("child_process");

var url = "https://www.apevolo.com";
var cmd = "";
switch (process.platform) {
  case "win32":
    cmd = "start";
    child_process.exec(cmd + " " + url);
    break;

  case "darwin":
    cmd = "open";
    child_process.exec(cmd + " " + url);
    break;
}
