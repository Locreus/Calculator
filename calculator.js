var calcMemory = null;
var clearOnNumberInput = false;
var periodEnabled = true;
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
function updateDisplay(val){
	if(clearOnNumberInput){ clearDisplay(); clearOnNumberInput = false;}
	document.querySelector("#Display").value += val;
}
function checkIfLogical(displayStr){
// prevents contiguous operator inputs
	if(!displayStr.length){ return false; }
	const lastChar = displayStr.charAt(displayStr.length-1);
	switch(lastChar){
		case "+":
		case "-":
		case "*":
		case "/": return false;
	}
	return true;
}
function handleOperatorClick(operator){
	const displayStr = document.querySelector("#Display").value;
	if(checkIfLogical(displayStr)){ periodEnabled = true; updateDisplay(operator); }
}
function evaluatePeriod(){
	const displayStr = document.querySelector("#Display").value;
	if(!periodEnabled){ return; }
	updateDisplay(".");
	periodEnabled = false;
}
function evaluateExpression(){
	const expression = document.querySelector("#Display").value;
	var indexOfOperator = expression.search(/[\+\-\*\/]/);
	if(indexOfOperator < 0){ return; } // no operator in expression
	if(expression.length-1 === indexOfOperator){ return; } // no righthand operand
	var result = solve();
	document.querySelector("#Display").value = result;
}
function solve(){
	const expression = document.querySelector("#Display").value;
	var leftOperand = null;
	var rightOperand = null;
	var result = null;
	var operands = expression.split(/[\+\-\*\/]/);
	operands.forEach( (value, index, operands) => operands[index] = strToNum(value) );
	var operators = expression.split(/[\d.]+/).filter( (index) => index !== "");
	if(operators.length){
		while(operators.includes("*") || operators.includes("/")){
			var opIndex = operators.findIndex( (index) => index === "*" || index === "/" );
			leftOperand = operands[opIndex];
			rightOperand = operands[opIndex + 1];
			result = operate(operators[opIndex], leftOperand, rightOperand);
			if(result === undefined){ clearOnNumberInput = true; return undefined;}
			operators.splice(opIndex, 1);
			operands.splice(opIndex, 2, result);
		}
		while(operators.includes("+") || operators.includes("-")){
			var opIndex = operators.findIndex( (index) => index === "+" || index === "-" );
			leftOperand = operands[opIndex];
			rightOperand = operands[opIndex + 1];
			result = operate(operators[opIndex], leftOperand, rightOperand);
			operators.splice(opIndex, 1);
			operands.splice(opIndex, 2, result);
		}
	}
	return operands[0];
}

function undo(){
	const display = document.querySelector("#Display").value;
	if(!display.length){ return; }
	clearDisplay();
	updateDisplay(display.slice(0, display.length - 1));
}
function memSave(){
	const display = document.querySelector("#Display").value;
	if(!display.length){ return; }
	var operands = display.split(/[\+\-\*\/]/);
	if(!operands.length){ return; }
	calcMemory = strToNum(operands.pop());
}
function memRecall(){
	if(calcMemory === null){ return; }
	clearDisplay();
	updateDisplay(calcMemory);
}
function handleAuxiliaryClick(text){
	switch(text){
		case "C": clearDisplay(); break;
		case "<-": undo(); break;
		case "MS": memSave(); break;
		case "MR": memRecall(); break;
	}
}
