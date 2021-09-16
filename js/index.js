let worker;
let modelRegistry;

const $ = selector => document.querySelector(selector);
const status = message => ($("#status").innerText = message);

const langFrom = $("#lang-from");
const langTo = $("#lang-to");

const langs = [
  ["en", "English"],
  ["it", "Italian"],
  ["pt", "Portuguese"],
  ["ru", "Russian"],
  ["cs", "Czech"],
  ["de", "German"],
  ["es", "Spanish"],
  ["et", "Estonian"],
];

if (window.Worker) {
  worker = new Worker("js/worker.js");
  worker.postMessage(["load"]);
}

document.querySelector("#input").addEventListener("keyup", function (event) {
  translateCall();
});

const translateCall = () => {
  const text = document.querySelector("#input").value + "  ";
  if (!text.trim().length) return;
  const paragraphs = text.split("\n");
  $("#output").setAttribute("disabled", true);
  worker.postMessage(["translate", paragraphs]);
};

worker.onmessage = function (e) {
  if (e.data[0] === "para" && e.data[1]) {
    document.querySelector("#output").value = e.data[1].join("\n\n");
    $("#output").removeAttribute("disabled");
  } else if (e.data[0] === "log" && e.data[1]) {
    status(e.data[1]);
    translateCall();
  } else if (e.data[0] === "modelRegistry" && e.data[1]) {
    modelRegistry = e.data[1];
    init();
  }
};

langs.forEach(([code, name]) => {
  langFrom.innerHTML += `<option value="${code}">${name}</option>`;
  langTo.innerHTML += `<option value="${code}">${name}</option>`;
});

const loadModel = () => {
  const lngFrom = langFrom.value;
  const lngTo = langTo.value;
  if (modelRegistry[`${lngFrom}${lngTo}`]) {
    status(`Installing model...`);
    console.log("loading model", lngFrom, lngTo);
    worker.postMessage(["construct", lngFrom, lngTo]);
  } else {
    status(`Combination not supported.`);
  }
};

langFrom.addEventListener("change", e => {
  loadModel();
});

langTo.addEventListener("change", e => {
  loadModel();
});

$(".swap").addEventListener("click", e => {
  [langFrom.value, langTo.value] = [langTo.value, langFrom.value];
  $("#input").value = $("#output").value;
  loadModel();
});

function init() {
  // try to guess input language from user agent
  let myLang = navigator.language;
  if (myLang) {
    myLang = myLang.split("-")[0];
    let langIndex = langs.findIndex(([code]) => code === myLang);
    if (langIndex > -1) {
      console.log("guessing input language is", myLang);
      langFrom.value = myLang;
    }
  }

  // find first output lang that *isn't* input language
  langTo.value = langs.find(([code]) => code !== langFrom.value)[0];
  // load this model
  loadModel();
}
