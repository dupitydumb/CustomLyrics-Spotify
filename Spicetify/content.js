//const defult color
let isRunning = false;
const SpicetifyPlatfrom = Spicetify.Platform;
const data = {
  lyricsColor: "#ffffff",
  inactiveLyricsColor: "#1c1c1c63",
  backgroundColor: "#000",
  glowColor: "#ffffff",
  enableCheckbox: true,
  gradientCheckbox: true,
  shadowCheckbox: true,
  glowCheckbox: true,
};

//Store 3 Gradient color
let gradientColor = [
  "#ee7752",
  "#e73c7e",
  "#23a6d5",
  "#23d5ab",
  "#23d5ab",
  "#23d5ab",
  "#23d5ab",
  "#23d5ab",
  "#23d5ab",
  "#23d5ab",
];

let dominantColor = "#ee7752";

//Store image
var albumImage;

//Add Spicetify module
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}
console.log("content.js is running");
// The async modifier allows for the user of await, which converts a promise into an object, when not using await, async is not necessary.
(async function extension() {
  // The following code segment waits for platform to load before running the code, this is important to avoid errors. When using things such as Player or URI, it is necessary to add those as well.
  const { Platform } = Spicetify;
  if (!Platform) {
    setTimeout(extension, 300);
    return;
  }
  LoadColorGradient();
  ActivateLyrics();

  Spicetify.Player.addEventListener("songchange", function () {
    console.log("Song changed");
    LoadColorGradient();
    ActivateLyrics();
    // Your code here
  });
})();

function LoadColorGradient() {
  if (Spicetify.Platform.Session.accessToken) {
    console.log("Access token:", Spicetify.Platform.Session.accessToken);
    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js",
      function () {
        console.log("Color Thief script loaded");

        // Create a new ColorThief object
        var colorThief = new ColorThief();

        let accesToken = Spicetify.Platform.Session.accessToken;
        // Check if the PlayerAPI object is defined
        if (Spicetify.Platform && Spicetify.Platform.PlayerAPI) {
          // Get the album's Spotify ID
          var albumId =
            Spicetify.Platform.PlayerAPI._state.item.album.uri.split(":")[2];

          // The Spotify Web API URL for the album
          var url = "https://api.spotify.com/v1/albums/" + albumId;

          // Fetch the album data from the Spotify Web API
          fetch(url, {
            headers: {
              Authorization: "Bearer " + accesToken,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              // Get the URL of the album's first image
              var imageUrl = data.images[0].url;
              console.log("Album image URL:", imageUrl);

              var img = new Image();
              img.crossOrigin = "Anonymous"; // This enables CORS
              img.src = imageUrl;
              img.id = "albumImage";

              albumImage = img;

              if (img.complete) {
                console.log("Image loaded");
                //Get color palette from the album image
                var colorPalette = colorThief.getPalette(albumImage, 10);

                // colorPalette to hex

                var colorPaletteHex = colorPalette.map(function (color) {
                  return (
                    "#" +
                    color[0].toString(16) +
                    color[1].toString(16) +
                    color[2].toString(16)
                  );
                });

                var domColor = colorThief.getColor(albumImage);

                var dominantColorToHex =
                  "#" +
                  domColor[0].toString(16) +
                  domColor[1].toString(16) +
                  domColor[2].toString(16);

                //set dominant color to dominantColor
                dominantColor = dominantColorToHex;

                //set gradient color to colorPaletteHex
                gradientColor = colorPaletteHex;

                // Log the color palette
                console.log("Color palette:", colorPaletteHex);
                console.log("Gradient color:", gradientColor);

                DeleteGeneratedImage();
              } else {
                //Try again if image is not loaded

                img.onload = function () {
                  LoadColorGradient();
                };
              }
            })
            .catch((error) => console.error("Error:", error));
        } else {
          console.log("PlayerAPI object not available");
        }
      }
    );
  } else {
    setTimeout(LoadColorGradient, 300);
    return;
  }
}

function DeleteGeneratedImage() {
  //select all generated image
  var element = document.querySelectorAll(".albumImageGenerated");
  //remove all generated image
  element.forEach(function (element) {
    element.remove();
  });
}
// Select the node that will be observed for mutations
var targetNode = document.body;

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      // Run your code here
      ActivateLyrics();
    }
  }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

function ActivateLyrics() {
  var element = document.querySelector(
    ".lyrics-lyricsContainer-LyricsContainer"
  );
  if (element) {
    element.style.setProperty("--lyrics-color-active", data.lyricsColor);
    element.style.setProperty(
      "--lyrics-color-inactive",
      data.inactiveLyricsColor
    );
    element.style.setProperty(
      "--lyrics-color-passed",
      data.inactiveLyricsColor
    );
    element.style.removeProperty("--lyrics-color-background");
    element.style.setProperty("--lyrics-color-messaging", "rgb(0, 0, 0)");
    element.style.setProperty("text-align", "center");
  }

  //if gradient is enabled, create style element and add gradient animation

  if (data.gradientCheckbox) {
    var style = document.createElement("style");

    var color1 = gradientColor[0];
    var color2 = gradientColor[1];
    var color3 = gradientColor[2];
    var color4 = gradientColor[3];
    var color5 = gradientColor[4];
    var color6 = gradientColor[5];
    var color7 = gradientColor[6];
    var color8 = gradientColor[7];
    var color9 = gradientColor[8];
    var color10 = gradientColor[9];
    style.innerHTML = `
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      .lyrics-lyricsContainer-LyricsContainer {
        background: radial-gradient(circle at 10% 5%, ${dominantColor} 0%, ${color3} 25%, ${color5} 50%, ${color7} 100%);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
      .lyrics-lyricsContainer-UnsyncedLyricsPage {
        background: radial-gradient(circle, ${dominantColor} 0%, ${color3} 25%, ${color5} 50%, ${color7} 100%);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
    `;
    document.head.appendChild(style);
  }

  //if glow is enabled, create style element and add glow animation

  if (data.glowCheckbox) {
    var style = document.createElement("style");
    style.innerHTML = `
      @keyframes glow {
        0% {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.2), 0 0 15px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2);
        }
        50% {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5);
        }
        100% {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.2), 0 0 15px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2);
        }
      }

      .lyrics-lyricsContainer-LyricsLine-active{
        --lyrics-color-active: ${data.lyricsColor};
        animation: glow 2s infinite;
        font-weight: 900;
        opacity: 1;
      }
      `;
    document.head.appendChild(style);
  }

  // Create a new style element
  var style = document.createElement("style");
  // Add CSS rules to the style element. You can replace the CSS inside the backticks with your own.
  style.innerHTML = `
    .lyrics-lyricsContainer-LyricsLine {
      opacity: 0.2;
    }
  `;

  // Append the style element to the head of the document
  document.head.appendChild(style);

  if (!isRunning) {
    setInterval(ResetOpacity, 300);
    // Set the active color
    setInterval(SetActiveColor, 320);

    isRunning = true;
  }
}

function SetActiveColor() {
  var element = document.querySelector(
    ".lyrics-lyricsContainer-LyricsLine lyrics-lyricsContainer-LyricsLine-active"
  );
  if (element) {
    element.style.setProperty("opacity", "1");
    //text size
    element.style.setProperty("font-size", "80px");

    //wiggle effect
  }
}

function ResetOpacity() {
  var elements = document.querySelectorAll(
    ".lyrics-lyricsContainer-LyricsLine"
  );
  elements.forEach(function (element) {
    // do something with element
    element.style.removeProperty("opacity");
  });
}

function SetColor() {
  var elemntActive = document.querySelector(
    ".lyrics-lyricsContainer-LyricsContainer.blur-enabled .lyrics-lyricsContainer-SyncedLyrics .lyrics-lyricsContainer-LyricsLine"
  );
  if (elemntActive) {
    //add glow effect
    element.style.setProperty(
      "text-shadow",
      "0 0 5px rgb(255 255 255 / 50%), 0 0 10px rgb(255 255 255 / 50%), 0 0 15px rgb(255 255 255 / 50%), 0 0 20px rgb(255 255 255 / 50%)"
    );
  }
}

Spicetify.Player.addEventListener("songchange", function () {
  console.log("Song changed");
  // Your code here
  LoadColorGradient();
  ActivateLyrics();
});
