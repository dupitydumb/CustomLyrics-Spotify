document.addEventListener("DOMContentLoaded", function () {
  // Get the current colors from the storage
  chrome.storage.sync.get(
    {
      lyricsColor: "#000000",
      inactiveLyricsColor: "#000000",
      backgroundColor: "#ffffff",
      glowColor: "#000000",
    },
    function (data) {
      document.getElementById("lyricsColor").value = data.lyricsColor;
      document.getElementById("lyricsinactiveColor").value =
        data.inactiveLyricsColor;
      document.getElementById("backgroundColor").value = data.backgroundColor;
      document.getElementById("glowColor").value = data.glowColor;
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
    chrome.storage.sync.set(
      {
        lyricsColor: lyricsColor,
        inactiveLyricsColor: lyricsInactiveColor,
        backgroundColor: backgroundColor,
        glowColor: glowColor,
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
