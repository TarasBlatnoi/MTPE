
function commandValidation (args){
    const path = args[0];
    let outputFlag = false;
    let outputFile = null;
    if (args[1] === "--out" && args[2]) {
      if (args[2].endsWith(".html")) {
        outputFlag = true;
        outputFile = args[2];
      } else {
        console.log("No output flag or bad filename");
      }
    } else {
      console.log("No output flag or no file after it");
    }
    return {path,  outputFile}
}

module.exports = {commandValidation}