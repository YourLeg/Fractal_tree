var cnv, sentenceInput, RulesInput, submit, lenInput, lAngleInput, rAngleInput, udpate; //GUI

var sentence, rules = [], len, lAngle, rAngle, reps = 0; //меняются через GUI и url

var actions = [], prev_wiki="L-система";

var searchUrl = 'https://ru.wikipedia.org/w/api.php?action=opensearch&format=json&search=';

function setup() { //запускается один раз при зашрузке страницы

  cnv = createCanvas(400, 400);
  cnv.parent('sketch-holder');
  background(127, 255, 212);

  sentenceInput = select("#sentence");

  RulesInput = select("#rules");

  submit = select("#submit");
  submit.mousePressed(updateRule);

  lenInput = select("#len");
  //lenInput.changed(function lenChanged(){len=lenInput.value(); printSentence();});

  lAngleInput = select("#lAngle");
  //lAngleInput.сhanged(function lAngleChanged(){lAngle=lAngleInput.value(); printSentence();});

  rAngleInput = select("#rAngle");
  //rAngleInput.changed(function rAngleChanged(){rAngle=rAngleInput.value(); printSentence();});

  update = select("#nextStep");
  update.mousePressed(updateSentence);

  var undo = select("#undoStep");
  undo.mousePressed(function undoStep(){--reps; initValues(generateURL());})

  select("#getURLButton").mousePressed(function outputURL(){ select("#url").value(generateURL())}); //привязка события по щелчку мыши

  var examples = selectAll(".examples__tags");
  for(var i=0; i<examples.length; ++i){
    examples[i].mousePressed(function examplePressed(){initValues(this.elt.dataset.url); goWiki(this.elt.innerHTML)});
  }

  actions['A'] = function Branch(hits){ line(0, 0, 0, hits*len); translate(0, hits*len);};
  actions['a'] = function Nothing(hits){};
  actions['+'] = function lRotate(hits) { rotate(hits*lAngle);};
  actions['-'] = function rRotate(hits) { rotate(-hits*rAngle);};
  actions['['] = function saveProps(hits) { for(var i=0; i<hits; ++i){push();}};
  actions[']'] = function loadProps(hits) { for(var i=0; i<hits; ++i){pop();}};
  initValues(window.location.href);

  goWiki(searchUrl + prev_wiki);
}

function getUrlArgs(url) {
  var vars = {};
  var dataUrl = $('#current_tree').value;
  //  console.log(dataUrl);
  var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
    //console.log(vars);
  });
  //console.log(parts);
  return vars;
}


function initValues(url) {
  var args = getUrlArgs(url);

  if(args["len"]) {
    lenInput.value(args["len"]);
  } else {
    lenInput.value(40);
  }

  if(args["lAngle"]) {
    lAngleInput.value(args["lAngle"]);
  } else {
    lAngleInput.value(5);
  }

  if(args["rAngle"]) {
    rAngleInput.value(args["rAngle"]);
  } else {
    rAngleInput.value(5);
  }

  updatePar();

  if(args["sentence"]) {
    sentenceInput.value(args["sentence"]);
  } else {
    sentenceInput.value("A");
  }

  if(args["rules"]) {
    RulesInput.value(args["rules"].replace(/%3E/g, '>').replace(/%86/g, "\n"));
  } else {
    RulesInput.value("A->AA+[+A-A-A]-[-A+A+A]");
  }

  updateRule();

  var tmp
  if(args["reps"]) {
    tmp = args["reps"];
  } else {
    tmp=0;
  }

  for(var i=0; i<tmp; ++i) {
    updateSentence();
  }

  printSentence();
}

function generateURL() {
  var url = window.location.href.split("?")[0] + "?" +
  "sentence=" + sentenceInput.value() + "&" +
  "rules=" + RulesInput.value().replace(/\r\n|\r|\n/g,"%86").replace(/\s/g,'') + "&" +
  "len=" + len + "&" +
  "lAngle=" + lAngle + "&" +
  "rAngle=" + rAngle + "&" +
  "reps=" + reps;
  return url;
  //select("#url").value(url);
}

function updatePar() {
  var updated = false;
  var newLen = lenInput.value();
  var newLAngle = lAngleInput.value();
  var newRAngle = rAngleInput.value();
  if(len != newLen){
    updated = true;
    len = newLen;
  }
  if(lAngle != newLAngle){
    updated = true;
    lAngle = newLAngle;
  }
  if(rAngle != newRAngle){
    updated = true;
    rAngle = newRAngle;
  }
  return updated;
}

function draw() {
  if(updatePar()){
    printSentence();
  }
}

function updateRule() {
  reps=0;
  rules = [];
  var lines = RulesInput.value().split(/\r\n|\r|\n/g);
  for(var i=0; i<lines.length; ++i){
    var rule = lines[i].replace(/\s/g,'');
    if(rule != ""){
    var counter = 0;
    for (var j=0; j<rule.length; ++j) {
      var current = rule.charAt(j);
      switch(current) {
        case '[':
        ++counter;
        break;
        case ']':
        --counter;
        break;
      }
      if (counter<0) {
        break;
      }
    }
    if (counter!=0) {
      lines[i] = "Дисбаланс скобок в " + rule;
      rule = "A->A";
      continue;
    }
    switch(rule.search("->")){
      case -1:
      lines[i] = "Некорректное правило " + rule;
      break;
      case 0:
      lines[i] = "Слева стоит пустота в правиле " + rule;
      break;
      case 1:
      rules[rule.charAt(0)] = rule.substr(3, rule.length);
      break;
      default:
      lines[i] = "слишком большая левая часть в правиле " + rule;
      break;
      }
    }
  }
  var message = "";
  for(var i=0; i<lines.length; ++i){
    message +=lines[i];
    if(i!=lines.length-1){
      message += "\n";
    }
  }
  RulesInput.value(message);
  sentence = sentenceInput.value();
  printSentence();
}

function updateSentence() {
  var newSentence = "";
  for(var i=0; i<sentence.length; ++i){
    var current = sentence.charAt(i);
    if(rules[current] != undefined) {
      newSentence +=rules[current];
    } else {
      newSentence += current;
    }
  }
  sentence = newSentence;
  printSentence();
  ++reps;
}

function printSentence() {
  var withoutBig = sentence.replace(/[A-Z]/g,'A');
  var withoutSmall = withoutBig.replace(/[a-z]/g,'a');
  var simpliSentence = withoutSmall;
  //console.log(simpliSentence);
  background(240, 255, 240);
  stroke(0,255,127);
  angleMode(DEGREES);
  resetMatrix();
  translate(width*0.5, height);
  scale(1, -1);
  var prevChar, hits;
  for (var i=0; i<simpliSentence.length; ++i) {
    var current = simpliSentence.charAt(i);
    if(prevChar == current){
      ++hits;
    }else{
      if(actions[prevChar] != undefined){
        actions[prevChar](hits);
      }
      prevChar=current;
      hits = 1;
    }
  }
  if(actions[prevChar] != undefined){
    actions[prevChar](hits);
  }
  resetMatrix();
}

function goWiki(term) {
  if(term!=prev_wiki){
    prev_wiki = term;
   var url = searchUrl + term;
   loadJSON(url, gotSearch, 'jsonp');
  }
}

function gotSearch(data) {
  console.log(data);
  var def = data[2][0];
  if(def==""||def==undefined){
    def="Информация не найдена.";
  }
  def = "Информация с википедии:<br>"+def;
  select("#wiki_info").html(def);

  console.log(def);
}
