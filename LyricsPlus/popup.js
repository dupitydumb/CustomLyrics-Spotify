document.addEventListener("DOMContentLoaded", function () {
  //if first install

  // Set the default colors when the popup is opened
  document.getElementById("lyricsColor").value = "#ffffff";
  document.getElementById("lyricsinactiveColor").value = "#ffffff";
  document.getElementById("backgroundColor").value = "#000000";

  // Get the current colors from the storage
  chrome.storage.sync.get(
    {
      lyricsColor: "",
      inactiveLyricsColor: "",
      backgroundColor: "",
      glowColor: "",
      enableCheckbox: "",
      gradientCheckbox: "",
      shadowCheckbox: "",
      glowCheckbox: "",
      lyricsColorOpacity: "",
      inactiveLyricsColorOpacity: "",
      romanizeCheckbox: "",
    },
    function (data) {
      document.getElementById("lyricsColor").value = data.lyricsColor;
      document.getElementById("lyricsinactiveColor").value =
        data.inactiveLyricsColor;
      document.getElementById("backgroundColor").value = data.backgroundColor;
      document.getElementById("glowColor").value = data.glowColor;
      //Set checkbox values
      document.getElementById("enableSwitch").checked = data.enableCheckbox;
      document.getElementById("gradientSwitch").checked = data.gradientCheckbox;
      document.getElementById("shadowSwitch").checked = data.shadowCheckbox;
      document.getElementById("glowSwitch").checked = data.glowCheckbox;
      document.getElementById("lyricsColorOpacity").value =
        data.lyricsColorOpacity;
      document.getElementById("lyricsinactiveColorOpacity").value =
        data.inactiveLyricsColorOpacity;
      document.getElementById("romanizeSwitch").checked = data.romanizeCheckbox;
    }
  );

  // Save the new colors to the storage when the "save" button is clicked
  document.getElementById("save").addEventListener("click", function () {
    try {
      var lyricsInactiveColor = document.getElementById(
        "lyricsinactiveColor"
      ).value;
      var lyricsColor = document.getElementById("lyricsColor").value;
      var backgroundColor = document.getElementById("backgroundColor").value;
      var glowColor = document.getElementById("glowColor").value;
      var enableCheckbox = document.getElementById("enableSwitch").checked;
      var gradientCheckbox = document.getElementById("gradientSwitch").checked;
      var shadowCheckbox = document.getElementById("shadowSwitch").checked;
      var glowCheckbox = document.getElementById("glowSwitch").checked;
      var lyricsColorOpacity =
        document.getElementById("lyricsColorOpacity").value;
      var inactiveLyricsColorOpacity = document.getElementById(
        "lyricsinactiveColorOpacity"
      ).value;
      var romanizeCheckbox = document.getElementById("romanizeSwitch").checked;
      chrome.storage.sync.set(
        {
          lyricsColor: lyricsColor,
          inactiveLyricsColor: lyricsInactiveColor,
          backgroundColor: backgroundColor,
          glowColor: glowColor,
          enableCheckbox: enableCheckbox,
          gradientCheckbox: gradientCheckbox,
          shadowCheckbox: shadowCheckbox,
          glowCheckbox: glowCheckbox,
          lyricsColorOpacity: lyricsColorOpacity,
          inactiveLyricsColorOpacity: inactiveLyricsColorOpacity,
          romanizeCheckbox: romanizeCheckbox,
        },
        function () {
          console.log("Lyrics color is set to " + lyricsColor);
          console.log("Background color is set to " + backgroundColor);

          // Send a message to the content script to refresh the changes
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "refreshColors" });
            }
          );
        }
      );
    } catch (error) {
      //reload the page
      location.reload();
    }
  });
});
