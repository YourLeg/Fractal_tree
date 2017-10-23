var cnv, sentenceInput, RulesInput, submit, lenInput, lAngleInput, rAngleInput, udpate; //GUI

var sentence, rules = [], len, lAngle, rAngle, reps = 0; //меняются через GUI и url

var actions = [];

function setup() {

  cnv = createCanvas(400, 400);
  cnv.parent('sketch-holder');
  background(200);

  sentenceInput = select("#sentence");

  RulesInput = select("#rules");

  submit = select("#submit");
  submit.mousePressed(updateRule);

  lenInput = select("#len");

  lAngleInput = select("#lAngle");

  rAngleInput = select("#rAngle");

  update = select("#nextStep");
  update.mousePressed(updateSentence);

  select("#getURLButton").mousePressed(generateURL);

  actions['A'] = function Branch(){ line(0, 0, 0, len); translate(0, len);};
  actions['a'] = function Nothing(){};
  actions['+'] = function lRotate() { rotate(lAngle);};
  actions['-'] = function rRotate() { rotate(-rAngle);};
  actions['['] = function saveProps() { push();};
  actions[']'] = function loadProps() { pop();};
  initValues();
}

function getUrlArgs() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}


function initValues() {
  var args = getUrlArgs();

  if(args["len"]) lenInput.value(args["len"]);
  else lenInput.value(40);

  if(args["lAngle"]) lAngleInput.value(args["lAngle"]);
  else lAngleInput.value(5);

  if(args["rAngle"]) rAngleInput.value(args["rAngle"]);
  else rAngleInput.value(5);

  updatePar();

  if(args["sentence"]) sentenceInput.value(args["sentence"]);
  else sentenceInput.value("A");

  if(args["rules"]) RulesInput.value(args["rules"].replace(/%3E/g, '>').replace(/%86/g, "\n"));
  else RulesInput.value("A->AA+[+A-A-A]-[-A+A+A]");

  updateRule();

  var tmp
  if(args["reps"]) tmp = args["reps"];
  else tmp=0;

  for(var i=0; i<tmp; ++i) updateSentence();

  printSentence();
}

function generateURL() {
  var url = window.location.href + "?" +
  "sentence=" + sentenceInput.value() + "&" +
  "rules=" + RulesInput.value().replace(/\r\n|\r|\n/g,"%86").replace(/\s/g,'') + "&" +
  "len=" + len + "&" +
  "lAngle=" + lAngle + "&" +
  "rAngle=" + rAngle + "&" +
  "reps=" + reps;
  select("#url").value(url);
}

function updatePar() {
  var updated = false;
  var newLen = lenInput.value();
  var newLAngle = lAngleInput.value();
  var newRAngle = rAngleInput.value();
  if(len != newLen || lAngle != newLAngle || rAngle != newRAngle){
    updated = true;
    len = newLen;
    lAngle = newLAngle;
    rAngle = newRAngle;
  }
  return updated;
}

function draw() {
  if(updatePar()) printSentence();
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
      if (counter<0) break;
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
    if(rules[current] != undefined) newSentence +=rules[current];
    else newSentence += current;
  }
  sentence = newSentence;
  printSentence();
  ++reps;
}

function printSentence() {
  var simpliSentence = sentence.replace(/[A-Z]/g,'A').replace(/[a-z]/g,'a');
  background(240,255,240);
  stroke(0,255,127);
  angleMode(DEGREES);
  resetMatrix();
  translate(width*0.5, height);
  scale(1, -1);
  for (var i=0; i<simpliSentence.length; ++i) {
    var current = simpliSentence.charAt(i);
    if(actions[current] != undefined) actions[current]();
  }
  resetMatrix();
}
