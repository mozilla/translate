var worker;
let lngFrom, lngTo;
let modelRegistry;

const log = (message) => {
  console.debug(message);
}

if (window.Worker) {
  var worker = new Worker('js/worker.js');
  worker.postMessage(["load"]);
}

const status = (msg) => {
  document.getElementById('statustd').innerText = msg;
}

const loadModel = () => {
  if (lngFrom && lngTo) {
    if (modelRegistry[`${lngFrom}${lngTo}`]) {
      status(`Installing model...`);
      console.log("loading model", lngFrom, lngTo);
      worker.postMessage(["construct", lngFrom, lngTo]);
    } else {
      status(`Combination not supported.`);
    }
  }
}

document.getElementsByName("langFrom").forEach(function(item){
  item.addEventListener('click', () => {
    document.getElementById("fromDropdown").classList.toggle("show");
    document.getElementById('frombtn').innerHTML = item.innerHTML;
    lngFrom = item.getAttribute("code");
    loadModel();
  })
})

document.getElementsByName("langTo").forEach(function(item){
  item.addEventListener('click', () => {
    document.getElementById("toDropdown").classList.toggle("show");
    document.getElementById('tobtn').innerHTML = item.innerHTML;
    lngTo = item.getAttribute("code");
    loadModel();
  })
})

document.getElementById("frombtn").addEventListener('click', function(event) {
  document.getElementById("fromDropdown").classList.toggle("show");
});

document.getElementById("tobtn").addEventListener('click', function(event) {
  document.getElementById("toDropdown").classList.toggle("show");
});

document.querySelector("#from").addEventListener('keyup', function(event) {
  translateCall();
});

const translateCall = () => {
  const text = document.querySelector('#from').value + '  ';
  const paragraphs = text.split("\n");
  worker.postMessage(["translate", paragraphs]);
}

worker.onmessage = function(e) {
  if (e.data[0] === 'para' && e.data[1]) {
    document.querySelector('#to').value = e.data[1].join("\n");
  } else if (e.data[0] === 'log' && e.data[1]) {
    status(e.data[1]);
  } else if (e.data[0] === 'modelRegistry' && e.data[1]) {
    modelRegistry = e.data[1];
  }
}