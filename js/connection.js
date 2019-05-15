let tStart = null;
let tEnd = null;
let image = new Image();
let counter = 0;
let arrTimes = [];
let abortFallBack = false;

export default function checkConnectivity(
  timeToCount = 3,
  threshold = 3000,
  offlineTimeout = 3000
) {
  if (navigator.onLine) {
    changeConnectivity(true);
  } else {
    setTimeout(() => {
      changeConnectivity(false);
    }, offlineTimeout);
  }

  window.addEventListener("online", e => {
    changeConnectivity(true);
  });
  window.addEventListener("offline", e => {
    setTimeout(() => {
      changeConnectivity(false);
    }, offlineTimeout);
  });

  timeoutFallBack(threshold);
  checkLatency(timeToCount, offlineTimeout, avg =>
    handleLatency(avg, threshold)
  );

  setInterval(() => {
    reset();
    timeoutFallBack(threshold);
    checkLatency(timeToCount, offlineTimeout, avg =>
      handleLatency(avg, threshold)
    );
  }, 6000);
}

// Gestion du retour
function handleLatency(avg, threshold) {
  const isConnectedFast = avg <= threshold;
  if (!isConnectedFast) return changeConnectivity(false);
  changeConnectivity(true);
}

// Reset
function reset() {
  arrTimes = [];
  counter = 0;
}

// Change connection
function changeConnectivity(state) {
  const event = new CustomEvent("connection-changed", {
    detail: state
  });
  document.dispatchEvent(event);
}

// FallBack
function timeoutFallBack(threshold) {
  setTimeout(() => {
    if (!abortFallBack) {
      console.log("Connectivity is too slow !");
      changeConnectivity(false);
    }
  }, threshold + 1);
}

// Calcul de la latence
function checkLatency(timeToCount, offlineTimeout, cb) {
  tStart = new Date().getTime();
  if (counter < timeToCount) {
    image.src = "https://www.google.com/images/phd/px.gif?t=" + tStart;
    image.onload = function (e) {
      abortFallBack = true;
      tEnd = new Date().getTime();
      let time = tEnd - tStart;
      arrTimes.push(time);
      checkLatency(timeToCount, offlineTimeout, cb);
      counter++;
    };
    image.offline = function () {
      setTimeout(() => {
        changeConnectivity(false);
      }, offlineTimeout);
    };
  } else {
    const sum = arrTimes.reduce((a, b) => a + b);
    const avg = sum / arrTimes.length;
    cb(avg);
  }
}