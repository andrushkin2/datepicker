module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    newOne: {
      options: 'debug'
    }
  });
  
  var fileName = "datepicker_custom.js",
      fileForLoad = "./datepicker.js",
      fileForWrite = "./" + fileName,
      options = {
        encoding: "utf8"
      },
      readFile = function(pathToFile){
        var text = grunt.file.read(pathToFile);
        if (!text){
          text = "";
        }
        return text;
      }, 
      customBuildRun = function(){
          var text = readFile(fileForLoad),
              toStringFunc = "toStringFunc",
              fromStringFunc = "fromStringFunc",
              addedTextWithProps = ", "+ toStringFunc + ", " + fromStringFunc,
              globalFunc = "window.datepicker = function(elementId, options",
              _datePickFunc = "return new _datepicker(elementId, options",
              init_datePickFunc = "var _datepicker = function(elementId, options";
          if (text !== ""){
            text = text.replace(globalFunc, globalFunc + addedTextWithProps)
                        .replace(_datePickFunc, _datePickFunc + addedTextWithProps)
                        .replace(init_datePickFunc, init_datePickFunc + addedTextWithProps)
                        .replace(/\/\*toString\*\/[^`]*\/\*toStringEnd\*\//gim, toStringFunc)
                        .replace(/\/\*fromString\*\/[^`]*\/\*fromStringEnd\*\//gim, fromStringFunc);

            grunt.file.write(fileForWrite, text, options);
            grunt.log.write("\n\t\tFile " + fileName + " has been created.");
          } else {
            grunt.log.write("\n\t\tFile datepicker.js is empty =(");
          }
      };


  grunt.task.registerTask("customBuild", "Build datepicker without native funcitons for parse date", function(){
      customBuildRun();
  });
  
  grunt.registerTask('default', ["customBuild"]);
};