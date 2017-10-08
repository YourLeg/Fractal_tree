var cnv, input, button, initLengthSlider, minLengthSlider, lAngleSlider, rAngleSlider; //GUI

var rule, lengthMult, initLength, minLength, lAngle, rAngle; //меняются через GUI

var sentence, computed, len;

function setup() {

  cnv = createCanvas(400, 400);
  cnv.parent('sketch-holder');
  background(200);

  input = createInput("FF + [+F-F-F] - [-F+F+F]");
  var tmp = createElement("b", "Правило грамматики: F->"); 
  tmp.parent('input-holder');
  input.parent(tmp);

  button = createButton('Обновить');
  button.parent('input-holder');
  button.mousePressed(updateRule);
  updateRule();

  initLengthSlider = createSlider(1, 100, 20, 1);
  initLengthSlider.parent('initLengthSlider-holder');
  tmp = createElement("b", "Длина первой ветки");
  tmp.parent('initLengthSlider-holder');
  initLength = initLengthSlider.value();

  minLengthSlider = createSlider(1, 100, 10, 1);
  minLengthSlider.parent('minLengthSlider-holder');
  tmp = createElement("b", "Минимальная длинна ветки");
  tmp.parent('minLengthSlider-holder');
  minLength = minLengthSlider.value();

  lAngleSlider = createSlider(0, 90, 5, 1);
  lAngleSlider.parent('lAngleSlider-holder');
  tmp = createElement("b", "Поворот для +");
  tmp.parent('lAngleSlider-holder');
  lAngle = lAngleSlider.value();

  rAngleSlider = createSlider(0, 90, 5, 1);
  rAngleSlider.parent('rAngleSlider-holder');
  tmp = createElement("b", "Поворот для -");
  tmp.parent('rAngleSlider-holder');
  rAngle = rAngleSlider.value();

updateRule();
  textAlign(CENTER);
}

function draw() {
  checkLengthSliders();
  if (!computed) {
    updateSentence();
    checkAngleSliders();
    background(200);
    printSentence();
  } else if (!checkAngleSliders()) {
    background(200);
    printSentence();
  }
}

function updateRule() {
  console.log("pressed");
  rule = input.value()
  rule = rule.replace(/\s/g, '');
  var branchSubstractions = 0;
  for (var i=0; i<rule.length; ++i) {
    var current = rule.charAt(i);
    if (current == 'F') ++branchSubstractions;
    else break;
  }
  if (branchSubstractions<=1) {
    input.value("Минимум два F в начале");
    rule = "F";
    branchSubstraction = 1;
  }
  lengthMult = 1./branchSubstractions;
  sentence = rule;
  len = initLength;
  computed = false;
  console.log(sentence);
}

function checkLengthSliders() {
  var newInitLength = initLengthSlider.value();
  var newMinLength = minLengthSlider.value();
  if (newMinLength > newInitLength) {
    newMinLength = newInitLength;
    minLengthSlider.value(newMinLength);
  }
  if (newInitLength != initLength || newMinLength != minLength) {
    initLength = newInitLength;
    minLength = newMinLength;
    sentence = rule; 
    computed = false;
    len = initLength;
  }
}

function updateSentence() {
  //text(sentence, 200,100);
  len*=lengthMult;
  if (len <= minLength) {
    computed = true;
    return
  }
  var newSentence = "";
  for (var i=0; i<sentence.length; ++i) {
    var current = sentence.charAt(i);
    if (current == 'F') newSentence += rule;
    else newSentence += current;
  }
  sentence = newSentence;
}

function checkAngleSliders() {
  var newLAngle = lAngleSlider.value();
  var newRAngle = rAngleSlider.value();
  if (newLAngle != lAngle || newRAngle != rAngle) {
    lAngle = newLAngle;
    rAngle = newRAngle;
    return false;
  }
  return true;
}

function printSentence() {
  angleMode(DEGREES);
  resetMatrix();
  translate(width*0.5, height);
  scale(1, -1);
  for (var i=0; i<sentence.length; ++i) {
    var current = sentence.charAt(i);
    switch(current) {
    case 'F':
      line(0, 0, 0, len);
      translate(0, len);
      break;
    case '+':
      rotate(lAngle);
      break;
    case '-':
      rotate(-rAngle);
      break;
    case '[':
      push();
      break;
    case ']':
      pop();
      break;
    }
  }
  resetMatrix();
}