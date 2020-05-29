var calcMemory = null;
var decimalEnabled = true;
var operandStart = 0;
var undefinedState = false;
var undoEnabled = false;
var numpadEnabled = true;
const operatorsArray = [];
const operandsArray = [];
function add(left, right){
	return left + right;
}
function subtract(left, right){
	return left - right;
}
function multiply(left, right){
	return left * right;
}
function divide(numerator, denominator){
	if(denominator === 0){
		return undefined;
	}
	return numerator / denominator;
}
function operate(operator, left, right){
	switch(`${operator}`){
		case "+": return add(left, right);
		case "-": return subtract(left, right);
		case "*": return multiply(left, right);
		case "/": return divide(left, right);
	}
}
function strToNum(str){
	return str.includes(".") === true ? parseFloat(str) : parseInt(str);
}
function clearDisplay(){
	document.querySelector("#Display").value = "";
}
function clearArray(arr){
	arr.splice(0, arr.length);
}
function resetInternals(){
	clearArray(operatorsArray);
	clearArray(operandsArray);
	operandStart = 0;
	undoEnabled = false;
	decimalEnabled = true;
	undefinedState = false;
	numpadEnabled = true;
}
function resetAfterSolve(){
	clearArray(operandsArray);
	operandStart = 0;
	undoEnabled = false;
	numpadEnabled = false;
}
function updateDisplay(val){
	document.querySelector("#Display").value += val;
}
function handleNumberClick(num){
	if(!numpadEnabled){ return; }
	if(undefinedState){ clearDisplay(); undefinedState = false; }
	updateDisplay(num);
	undoEnabled = true;
}
function getLastInput(){
	const input = document.querySelector("#Display").value;
	return input.charAt(input.length-1);
}
function checkIfLogical(){
// prevents contiguous operator inputs
	const input = document.querySelector("#Display").value;
	if(!input.length){ return false; }
	const lastInput = input.charAt(input.length-1);
	switch(lastInput){
		case "+":
		case "-":
		case "*":
		case "/": return false;
	}
	return true;
}
function pushOperand(){
	const input = document.querySelector("#Display").value;
	const len = input.length;
	operandsArray.push( strToNum(input.slice(operandStart, len)) );
	operandStart = len+1;
}
function handleOperatorClick(operator){
	if(checkIfLogical() && !undefinedState){
		pushOperand();
		numpadEnabled = true;
		operatorsArray.push(operator);
		updateDisplay(operator);
		undoEnabled = true;
		decimalEnabled = true;
	}
}
function handleDecimal(){
	if(!decimalEnabled || undefinedState || !numpadEnabled){ return; }
	getLastInput().match(/[0-9]/) === null ? updateDisplay("0.") : updateDisplay(".");
	decimalEnabled = false;
	undoEnabled = true;
}
function evaluateExpression(){
	const input = document.querySelector("#Display").value;
	if(!operatorsArray.length || undefinedState){ return; } // no operator in expression
	if(input.charAt(input.length - 1) === operatorsArray[operatorsArray.length - 1]){ return; } // no right operand
	pushOperand();
	var result = solveExpression();
	document.querySelector("#Display").value = result;
	if(result.includes(".")){ decimalEnabled = false; }
	resetAfterSolve();
}
function solveExpression(){
	var leftOperand = null;
	var rightOperand = null;
	var result = null;
	if(operatorsArray.length){
		while(operatorsArray.includes("*") || operatorsArray.includes("/")){
			var opIndex = operatorsArray.findIndex( (index) => index === "*" || index === "/" );
			leftOperand = operandsArray[opIndex];
			rightOperand = operandsArray[opIndex + 1];
			result = operate(operatorsArray[opIndex], leftOperand, rightOperand);
			if(result === undefined){ undefinedState = true; return "undefined";}
			operatorsArray.splice(opIndex, 1);
			operandsArray.splice(opIndex, 2, result);
		}
		while(operatorsArray.includes("+") || operatorsArray.includes("-")){
			var opIndex = operatorsArray.findIndex( (index) => index === "+" || index === "-" );
			leftOperand = operandsArray[opIndex];
			rightOperand = operandsArray[opIndex + 1];
			result = operate(operatorsArray[opIndex], leftOperand, rightOperand);
			operatorsArray.splice(opIndex, 1);
			operandsArray.splice(opIndex, 2, result);
		}
	}
	return (operandsArray[0]).toString(10);
}
function repositionOperandStart(){
	const input = document.querySelector("#Display").value;
	const len = operatorsArray.length;
	if(!len){ operandStart = 0; return; }
	const index = input.lastIndexOf(operatorsArray[len - 1], input.length);
	operandStart = index + 1;
}
function undo(){
	const input = document.querySelector("#Display").value;
	const len = input.length;
	const lastInput = getLastInput();
	if(!undoEnabled || undefinedState){ return; }
	if(lastInput.match(/[\*\-\+\/]/)){ operandsArray.pop(); operatorsArray.pop(); repositionOperandStart(); }
	if(lastInput === "."){ decimalEnabled = true; }
	const newInput = input.slice(0, len - 1);
	clearDisplay();
	updateDisplay(newInput);
	undoEnabled = false;
}
function memSave(){
	const input = document.querySelector("#Display").value;
	if(!input.length || undefinedState){ return; }
	clearDisplay();
	numpadEnabled = true;
	calcMemory = input.slice(operandStart, input.length);
}
function memRecall(){
	if(calcMemory === null || calcMemory === ""){ return; }
	updateDisplay(calcMemory);
	undoEnabled = false;
}
function handleAuxiliaryClick(text){
	switch(text){
		case "C": { 
			clearDisplay();
			resetInternals();
			break;
		}
		case "<-": undo(); break;
		case "MS": memSave(); break;
		case "MR": memRecall(); break;
	}
}
