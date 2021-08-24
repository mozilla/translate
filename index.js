var worker;
const log = (message) => {
  console.debug(message);
}

if (window.Worker) {
  var worker = new Worker('worker.js');
  worker.postMessage(["load"]);
}

document.querySelector("#load").addEventListener("click", async() => {
  document.querySelector("#load").disabled = true;
  const lang = document.querySelector('input[name="modellang"]:checked').value;
  const from = lang.substring(0, 2);
  const to = lang.substring(2, 4);
  worker.postMessage(["construct", from, to]);
  document.querySelector("#load").disabled = false;
  //log('Model Alignment:', translationService.isAlignmentSupported());
});


document.querySelector("#from").addEventListener('keydown', function(event) {
  translateCall();
});

const translateCall = () => {
  const text = document.querySelector('#from').value;
  const paragraphs = text.split("\n");
  let wordCount = 0;
  paragraphs.forEach(sentence => {
    wordCount += sentence.trim().split(" ").filter(word => word.trim() !== "").length;
  })
  const start = Date.now();
  worker.postMessage(["translate", paragraphs]);
  const secs = (Date.now() - start) / 1000;
  log(`Translation of (${wordCount}) words took ${secs} secs (${Math.round(wordCount / secs)} words per second)`);
}

worker.onmessage = function(e) {
  console.debug(`Message received from worker ${e}`);
  if (e.data[0] === 'para') {
    document.querySelector('#to').value = e.data[1].join("\n");
  }
}