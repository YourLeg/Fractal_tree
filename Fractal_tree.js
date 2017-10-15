var cnv, input, submit, lenInput, lAngleInput, rAngleInput, udpate; //GUI

var rule, len, lAngle, rAngle; //меняются через GUI

var sentence;

var actions = [];

function setup() {

  cnv = createCanvas(400, 400);
  cnv.parent('sketch-holder');
  background(200);

  input = select("#input");

  submit = select("#submit");
  submit.mousePressed(updateRule);

  lenInput = select("#len");

  lAngleInput = select("#lAngle");

  rAngleInput = select("#rAngle");

  update = select("#nextStep");
  update.mousePressed(updateSentence);

  actions['F'] = function longBranch(){ line(0, 0, 0, len); translate(0, len);};
  actions['+'] = function lRotate() { rotate(lAngle);};
  actions['-'] = function rRotate() { rotate(-rAngle);};
  actions['['] = function saveProps() { push();};
  actions[']'] = function loadProps() { pop();};
  updatePar();
  updateRule();
  printSentence();
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
  rule = input.value().replace(/\s/g, '');
  var counter = 0;
  for (var i=0; i<rule.length; ++i) {
    var current = rule.charAt(i);
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
    input.value("Дисбаланс скобок");
    rule = "F";
  }
  sentence = rule;
  printSentence();
}

function updateSentence() {
  var newSentence = "";
  for(var i=0; i<sentence.length; ++i){
    var current = sentence.charAt(i);
    if(current == "F") newSentence +=rule;
    else newSentence += current;
  }
  sentence = newSentence;
  printSentence();
}

function printSentence() {
  background(200);
  angleMode(DEGREES);
  resetMatrix();
  translate(width*0.5, height);
  scale(1, -1);
  for (var i=0; i<sentence.length; ++i) {
    var current = sentence.charAt(i);
    actions[current]();
  }
  resetMatrix();
}
