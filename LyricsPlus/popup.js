// When the page is loaded
window.onload = function () {
  // Get the stored values
  chrome.storage.sync.get(["lyricsColor", "inactiveLyricsColor", "backgroundColor", "glowColor", "active", "glowactive", "shadowactive", "gradientactive"], function (items) {
    // Set the checkboxes
    document.getElementById("activateCheckbox").checked = items.active;
    document.getElementById("glowCheckbox").checked = items.glowactive;
    document.getElementById("shadowCheckbox").checked = items.shadowactive;
    document.getElementById("gradientCheckbox").checked = items.gradientactive;
    //Set the color pickers
    document.getElementById("lyricsinactiveColor").value = items.inactiveLyricsColor;
    document.getElementById("lyricsColor").value = items.lyricsColor;
    document.getElementById("backgroundColor").value = items.backgroundColor;
    document.getElementById("glowColor").value = items.glowColor;
  });
};


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  // Get the "apply" button by its id
  var applyButton = document.getElementById("apply");

  console.log(applyButton);

  // Add an event listener to the "apply" button
  applyButton.addEventListener("click", function () {
    console.log("Apply button clicked");


    // Get the new values from the input elements
    var lyricsInactiveColor = document.getElementById("lyricsinactiveColor").value;
    var lyricsColor = document.getElementById("lyricsColor").value;
    var backgroundColor = document.getElementById("backgroundColor").value;
    var glowColor = document.getElementById("glowColor").value;

    var activateCheckbox = document.getElementById("activateCheckbox");
    var glowCheckbox = document.getElementById("glowCheckbox");
    var shadowCheckbox = document.getElementById("shadowCheckbox");
    var gradientCheckbox = document.getElementById("gradientCheckbox");

    // Save the new values to Chrome storage
    chrome.storage.sync.set(
      {
        lyricsColor: lyricsColor,
        inactiveLyricsColor: lyricsInactiveColor,
        backgroundColor: backgroundColor,
        glowColor: glowColor,
        active : activateCheckbox,
        glowactive : glowCheckbox,
        shadowactive : shadowCheckbox,
        gradientactive : gradientCheckbox
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