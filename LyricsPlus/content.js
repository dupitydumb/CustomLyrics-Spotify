//const defult color
const isRunning = false;
const koreanRomaji = require("@romanize/korean");
function romanizeLyrics() {
  console.log("Romanizing");
  var lyrics = document.querySelectorAll(".BXlQFspJp_jq9SKhUSP3");
  //Loop through all the elements
  lyrics.forEach((element) => {
    //Get the text from the element
    var text = element.textContent;
    //Romanize the text
    var romanizedText = koreanRomaji.romanize(text);
    //Set the romanized text to the element
    element.textContent = romanizedText;
    console.log(romanizedText);
  });
}
if (window.location.href.includes("open.spotify.com/lyrics")) {
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
}

function ActivateLyrics() {
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
      inactiveLyricsColor = data.inactiveLyricsColor;
      lyricsColor = data.lyricsColor;
      if (data.enableCheckbox) {
        // If the current URL is spotify.com
        if (window.location.href.includes("open.spotify.com/lyrics")) {
          if (data.romanizeCheckbox) {
            romanizeLyrics();
          }
          let lyricsColorRgb = hexToRgb(data.lyricsColor);
          let inactiveLyricsColorRgb = hexToRgb(data.inactiveLyricsColor);

          let lyricsColorRgba = `rgba(${lyricsColorRgb.r}, ${lyricsColorRgb.g}, ${lyricsColorRgb.b}, ${data.lyricsColorOpacity})`;
          let inactiveLyricsColorRgba = `rgba(${inactiveLyricsColorRgb.r}, ${inactiveLyricsColorRgb.g}, ${inactiveLyricsColorRgb.b}, ${data.inactiveLyricsColorOpacity})`;

          var element = document.querySelector(".FUYNhisXTCmbzt9IDxnT");
          if (element) {
            var style = document.createElement("style");
            style.innerHTML = `
              .FUYNhisXTCmbzt9IDxnT {
                color: ${data.lyricsColor};
                --lyrics-color-active: ${lyricsColorRgba};
                --lyrics-color-inactive: ${inactiveLyricsColorRgba};
                --lyrics-color-passed: ${inactiveLyricsColorRgba};
                --lyrics-color-background: ${data.backgroundColor};
                --lyrics-color-messaging: rgb(0, 0, 0);
              }
            `;
            document.head.appendChild(style);
            // element.style.setProperty("--lyrics-color-active", lyricsColorRgba);
            // element.style.setProperty(
            //   "--lyrics-color-inactive",
            //   inactiveLyricsColorRgba
            // );
            // element.style.setProperty(
            //   "--lyrics-color-passed",
            //   inactiveLyricsColorRgba
            // );
            // element.style.setProperty(
            //   "--lyrics-color-background",
            //   data.backgroundColor
            // );
            // element.style.setProperty(
            //   "--lyrics-color-messaging",
            //   "rgb(0, 0, 0)"
            // );
            // element.style.setProperty("text-align", "center");
          }

          //if gradient is enabled, create style element and add gradient animation

          if (data.gradientCheckbox) {
            var style = document.createElement("style");
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
              .o4GE4jG5_QICak2JK_bn {
                background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                background-size: 400% 400%;
                animation: gradient 15s ease infinite;
                height: 100vh;
              }
            `;
            document.head.appendChild(style);
          }
          if (data.gradientCheckbox == false) {
            var style = document.createElement("style");
            style.innerHTML = `
              .o4GE4jG5_QICak2JK_bn {
                background: ${data.backgroundColor};
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

              .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw{
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
            .nw6rbs8R08fpPn7RWW2w.aeO5D7ulxy19q4qNBrkk {
              opacity: 0.2;
            }
            .nw6rbs8R08fpPn7RWW2w {
              margin-top: 80px !important;
              font-size: 60px !important;
            }

            .gqaWFmQeKNYnYD5gRv3x {
              grid-area: 1 / 1 / -1 / -1;
              width: 100%;
              -webkit-box-align: center;
              -ms-flex-align: center;
              background-size: contain;
              overflow: hidden;
              backdrop-filter: blur(22px);
              height: -webkit-fill-available;
            }
            .gqaWFmQeKNYnYD5gRv3x ._Wna90no0o0dta47Heiw {
              font-size: 2rem;
              font-weight: 300;
              align-self: center;
              overflow: hidden;
              height: 55vh;
              margin-top: 10vh;
            }

            .nw6rbs8R08fpPn7RWW2w.vapgYYF2HMEeLJuOWGq5 {
              opacity: 0.2; !important;
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
      }
    }
  );
}

function SetActiveColor() {
  var element = document.querySelector(
    ".nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw"
  );
  if (element) {
    element.style.setProperty("opacity", "1");
    //text size
    element.style.setProperty("font-size", "80px");

    //wiggle effect
  }
}
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function ResetOpacity() {
  var elements = document.querySelectorAll(
    ".nw6rbs8R08fpPn7RWW2w.vapgYYF2HMEeLJuOWGq5.aeO5D7ulxy19q4qNBrkk"
  );

  elements.forEach(function (element) {
    // do something with element
    element.style.removeProperty("opacity");
  });
}

let inactiveLyricsColor;
let lyricsColor;
function SetColor() {
  var elemntActive = document.querySelector(
    ".nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw"
  );
  if (elemntActive) {
    //add glow effect
    element.style.setProperty(
      "text-shadow",
      `0 0 5px rgba(182, 139, 139, 0.5), 0 0 10px rgba(182, 139, 139, 0.5), 0 0 15px rgba(182, 139, 139, 0.5), 0 0 20px rgba(182, 139, 139, 0.5)`
    );

    //Bigger font size
    elemntActive.style.setProperty("font-size", "60px");
  }
  var elementPass = document.querySelector(
    "nw6rbs8R08fpPn7RWW2w.aeO5D7ulxy19q4qNBrkk"
  );
  if (elementPass) {
    elementPass.style.removeProperty("opacity");
    elementPass.style.setProperty("color", inactiveLyricsColor);
  }

  var elementLyrics = document.querySelector(".nw6rbs8R08fpPn7RWW2w");
  if (elementLyrics) {
    elementLyrics.style.setProperty("margin-top", "50px");
    elementLyrics.style.setProperty("font-size", "50px");
  }
}

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // This is a first install!
    chrome.storage.sync.set(
      {
        lyricsColor: "ffffff",
        inactiveLyricsColor: "ffffff",
        backgroundColor: "000000",
        glowColor: "ffffff",
        enableCheckbox: true,
        gradientCheckbox: true,
        shadowCheckbox: true,
        glowCheckbox: true,
        lyricsColorOpacity: 1,
        inactiveLyricsColorOpacity: 0.5,
        romanizeCheckbox: false,
      },
      function () {
        console.log("Default values set on first install.");
      }
    );
  }
});

window.onload = function () {
  ActivateLyrics();
};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "refreshColors") {
    // Refresh the PAGE
    location.reload();
  }
});
