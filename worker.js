
var translationService, responseOptions, input = undefined;

const log = (message) => {
    console.debug(message);
  }

  const start = Date.now();
  let moduleLoadStart;
  var Module = {
    preRun: [function() {
      log(`Time until Module.preRun: ${(Date.now() - start) / 1000} secs`);
      moduleLoadStart = Date.now();
    }],
    onRuntimeInitialized: function() {
      log(`Wasm Runtime initialized (preRun -> onRuntimeInitialized) in ${(Date.now() - moduleLoadStart) / 1000} secs`);
    }
  };

 // This function downloads file from a url and returns the array buffer
 const downloadAsArrayBuffer = async(url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw Error(`Downloading ${url} failed: HTTP ${response.status} - ${response.statusText}`);
    }
    return response.arrayBuffer();
  }

  // This function constructs the AlignedMemory from the array buffer and the alignment size
  function constructAlignedMemoryFromBuffer(buffer, alignmentSize) {
    var byteArray = new Int8Array(buffer);
    console.debug("byteArray size: ", byteArray.byteLength);
    var alignedMemory = new Module.AlignedMemory(byteArray.byteLength, alignmentSize);
    const alignedByteArrayView = alignedMemory.getByteArrayView();
    alignedByteArrayView.set(byteArray);
    return alignedMemory;
  }

  const encoder = new TextEncoder(); // string to utf-8 converter
  const decoder = new TextDecoder(); // utf-8 to string converter
  const constructTranslationService = async (from, to) => {

    const languagePair = `${from}${to}`;

    // Vocab files are re-used in both translation directions
    const vocabLanguagePair = from === "en" ? `${to}${from}` : languagePair;

    // Set the Model Configuration as YAML formatted string.
    // For available configuration options, please check: https://marian-nmt.github.io/docs/cmd/marian-decoder/
    /*const modelConfig = `models:
  - /${languagePair}/model.${languagePair}.intgemm.alphas.bin
vocabs:
  - /${languagePair}/vocab.${vocabLanguagePair}.spm
  - /${languagePair}/vocab.${vocabLanguagePair}.spm
beam-size: 1
normalize: 1.0
word-penalty: 0
max-length-break: 128
mini-batch-words: 1024
workspace: 128
max-length-factor: 2.0
skip-cost: true
cpu-threads: 0
quiet: true
quiet-translation: true
shortlist:
    - /${languagePair}/lex.${languagePair}.s2t
    - 50
    - 50
`;
*/

const modelConfig = `beam-size: 1
normalize: 1.0
word-penalty: 0
max-length-break: 128
mini-batch-words: 1024
workspace: 128
max-length-factor: 2.0
skip-cost: true
cpu-threads: 0
quiet: true
quiet-translation: true
gemm-precision: int8shift
`;

// TODO: Use in model config when wormhole is enabled:
// gemm-precision: int8shift
// TODO: Use in model config when loading of binary models is supported and we use model.intgemm.alphas.bin:
// gemm-precision: int8shiftAlphaAll

    const modelFile = `models/${languagePair}/model.${languagePair}.intgemm.alphas.bin`;
    const shortlistFile = `models/${languagePair}/lex.50.50.${languagePair}.s2t.bin`;
    const vocabFiles = [`models/${languagePair}/vocab.${vocabLanguagePair}.spm`,
                        `models/${languagePair}/vocab.${vocabLanguagePair}.spm`];

    const uniqueVocabFiles = new Set(vocabFiles);
    console.debug("modelFile: ", modelFile);
    console.debug("shortlistFile: ", shortlistFile);
    console.debug("No. of unique vocabs: ", uniqueVocabFiles.size);
    uniqueVocabFiles.forEach(item => console.debug("unique vocabFile: ", item));

    try {
      // Download the files as buffers from the given urls
      let start = Date.now();
      const downloadedBuffers = await Promise.all([downloadAsArrayBuffer(modelFile), downloadAsArrayBuffer(shortlistFile)]);
      const modelBuffer = downloadedBuffers[0];
      const shortListBuffer = downloadedBuffers[1];

      const downloadedVocabBuffers = [];
      for (let item of uniqueVocabFiles.values()) {
        downloadedVocabBuffers.push(await downloadAsArrayBuffer(item));
      }
      log(`${languagePair} file download took ${(Date.now() - start) / 1000} secs`);

      // Construct AlignedMemory objects with downloaded buffers
      var alignedModelMemory = constructAlignedMemoryFromBuffer(modelBuffer, 256);
      var alignedShortlistMemory = constructAlignedMemoryFromBuffer(shortListBuffer, 64);
      var alignedVocabsMemoryList = new Module.AlignedMemoryList;
      downloadedVocabBuffers.forEach(item => alignedVocabsMemoryList.push_back(constructAlignedMemoryFromBuffer(item, 64)));

      // Instantiate the Translation Service
      if (translationService) translationService.delete();
      console.debug("Creating Translation Service with config:", modelConfig);
      translationService = new Module.Service(modelConfig, alignedModelMemory, alignedShortlistMemory, alignedVocabsMemoryList);
    } catch (error) {
      log(`Exception ${error}`);
    }
  }

  const translate = (paragraphs) => {

    // Instantiate the arguments of translate() API i.e. ResponseOptions and input (vector<string>)
    var responseOptions = new Module.ResponseOptions();
    let input = new Module.VectorString;

    // Initialize the input
    paragraphs.forEach(paragraph => {
      // prevent empty paragraph - it breaks the translation
      if (paragraph.trim() === "") {
        return;
      }
      input.push_back(paragraph.trim())
    })
    // Access input (just for debugging)
    console.debug('Input size=', input.size());

    // Translate the input, which is a vector<String>; the result is a vector<Response>
    let result = translationService.translate(input, responseOptions);

    const translatedParagraphs = [];
    const translatedSentencesOfParagraphs = [];
    const sourceSentencesOfParagraphs = [];
    for (let i = 0; i < result.size(); i++) {
      translatedParagraphs.push(result.get(i).getTranslatedText());
      translatedSentencesOfParagraphs.push(getAllTranslatedSentencesOfParagraph(result.get(i)));
      sourceSentencesOfParagraphs.push(getAllSourceSentencesOfParagraph(result.get(i)));
    }
    console.debug({ translatedParagraphs });
    console.debug({ translatedSentencesOfParagraphs });
    console.debug({ sourceSentencesOfParagraphs });

    responseOptions.delete();
    input.delete();
    return translatedParagraphs;
  }

  // This function extracts all the translated sentences from the Response and returns them.
  const getAllTranslatedSentencesOfParagraph = (response) => {
    const sentences = [];
    const text = response.getTranslatedText();
    for (let sentenceIndex = 0; sentenceIndex < response.size(); sentenceIndex++) {
      const utf8SentenceByteRange = response.getTranslatedSentence(sentenceIndex);
      sentences.push(_getSentenceFromByteRange(text, utf8SentenceByteRange));
    }
    return sentences;
  }

  // This function extracts all the source sentences from the Response and returns them.
  const getAllSourceSentencesOfParagraph = (response) => {
    const sentences = [];
    const text = response.getOriginalText();
    for (let sentenceIndex = 0; sentenceIndex < response.size(); sentenceIndex++) {
      const utf8SentenceByteRange = response.getSourceSentence(sentenceIndex);
      sentences.push(_getSentenceFromByteRange(text, utf8SentenceByteRange));
    }
    return sentences;
  }

  // This function returns a substring of text (a string). The substring is represented by
  // byteRange (begin and end endices) within the utf-8 encoded version of the text.
  const _getSentenceFromByteRange = (text, byteRange) => {
    const utf8BytesView = encoder.encode(text);
    const utf8SentenceBytes = utf8BytesView.subarray(byteRange.begin, byteRange.end);
    return decoder.decode(utf8SentenceBytes);
  }

onmessage = async function(e) {
    console.debug('Message received from main script');
    let result = "";
    if (e.data[0] === 'load') {
        importScripts("bergamot-translator-worker.js");
    } else if (e.data[0] === 'construct') {
        let start = Date.now();
        await constructTranslationService(e.data[1], e.data[2]);
        log(`translation service ${e.data[1]}${e.data[2]} construction took ${(Date.now() - start) / 1000} secs`);
        result = "wasm loaded";
    } else if (e.data[0] === 'translate') {
        const translatedParagraphs = translate(e.data[1]);
        postMessage(['para', translatedParagraphs]);
    }
    console.debug('Posting message back to main script');
  }

