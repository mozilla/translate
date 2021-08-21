const log = (message) => {
  console.log(message);
};

if (window.Worker) {

  const translationWorker = new Worker("worker.js");
  translationWorker.addEventListener("error", (e) => {
    const error = ['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join('');
    console.log(error);
  });

  // sends the proper msg to the worker in order to construct the obj
  document.querySelector("#load").addEventListener("click", async() => {
    document.querySelector("#load").disabled = true;
    const lang = document.querySelector('input[name="modellang"]:checked').value;
    const from = lang.substring(0, 2);
    const to = lang.substring(2, 4);
    log(`sending msg to construct the service ${from} ${to}`);
    translationWorker.postMessage(["load", from, to]);
    log(`sending msg to construct the service ${from} ${to}`);
  });

  document.querySelector("#from").addEventListener('keydown', function(event) {
    const text = document.querySelector('#from').value;
    translationWorker.postMessage(["translate", text]);
  });

  translationWorker.onmessage = function(e) {
    console.log('Message received from worker');
    if (e.data[0] === 'load') {
      document.querySelector("#load").disabled = false;
      log("load complete");
    } else if (e.data[0] === 'translation') {
      console.log('translation mg recevied back');
      //result.textContent = e.data;
      //document.querySelector('#to').value = translatedParagraphs.join("\n");
      // document.querySelector('#to').value = e;
    }
  }
} else {
  alert("This browser does not support webworkers. Download Firefox.");
}