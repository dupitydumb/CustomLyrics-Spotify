document.addEventListener("DOMContentLoaded", function () {
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
    }
  );

  // Save the new colors to the storage when the "save" button is clicked
  document.getElementById("save").addEventListener("click", function () {
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
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("translate").addEventListener("click", function () {
    var language = document.getElementById("language").value;

    // Send a message to the content script to translate the elements
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "translate",
        language: language,
      });
    });
  });
});
