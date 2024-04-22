//const defult color

const isRunning = false;

window.onload = function () {
  ActivateLyrics();
};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "refreshColors") {
    // Refresh the colors
    ActivateLyrics();
  }
});
function ActivateLyrics() {
  chrome.storage.sync.get(
    {
      lyricsColor: "#FFF000",
      inactiveLyricsColor: "",
      backgroundColor: "",
      glowColor: "",
      enableCheckbox: "",
      gradientCheckbox: "",
      shadowCheckbox: "",
      glowCheckbox: "",
    },
    function (data) {
      console.log("Lyrics color is set to " + data.lyricsColor);
      console.log("Background color is set to " + data.backgroundColor);

      if (window.location.href.includes("spotify.com")) {
        var element = document.querySelector(".FUYNhisXTCmbzt9IDxnT");
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
          element.style.setProperty(
            "--lyrics-color-background",
            data.backgroundColor
          );
          element.style.setProperty("--lyrics-color-messaging", "rgb(0, 0, 0)");
          element.style.setProperty("text-align", "center");
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
  );
}

function SetActiveColor() {
  console.log("Setting active color");

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

function ResetOpacity() {
  var elements = document.querySelectorAll(
    ".nw6rbs8R08fpPn7RWW2w.vapgYYF2HMEeLJuOWGq5.aeO5D7ulxy19q4qNBrkk"
  );
  elements.forEach(function (element) {
    // do something with element
    element.style.removeProperty("opacity");
  });
}

function SetColor() {
  console.log("Setting color");
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
  }

  var elementLyrics = document.querySelector(".nw6rbs8R08fpPn7RWW2w");
  if (elementLyrics) {
    elementLyrics.style.setProperty("margin-top", "50px");
    elementLyrics.style.setProperty("font-size", "50px");
  }
}
