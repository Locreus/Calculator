window.addEventListener("load", () => document.querySelector("#Display").textContent = "");
window.addEventListener("keydown", function(event){ handleKeyDown(event); });
const operators = ["+", "-", "*", "/"];
const numpad = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];
const auxiliary = ["C", "<-", "MS", "MR"];
const numberButtons = 10;
const numpadDiv = document.querySelector("#NumpadDiv");
for(var i = 0 ; i < numberButtons ; i++){
	const button = document.createElement("button");
	button.textContent = numpad[i];
	button.addEventListener("click", function(){ handleNumberClick(button.textContent); });
	numpadDiv.appendChild(button);
}
const operatorButtons = 4;
const operationsDiv = document.querySelector("#OperationsDiv");
for(var i = 0 ; i < operatorButtons ; i++){
	const button = document.createElement("button");
	button.textContent = operators[i];
	button.addEventListener("click", function(){ handleOperatorClick(button.textContent); });
	operationsDiv.appendChild(button);
}
const auxiliaryButtons = 4;
const auxiliaryDiv = document.querySelector("#AuxiliaryDiv");
for(var i = 0 ; i < auxiliaryButtons ; i++){
	const button = document.createElement("button");
	button.textContent = auxiliary[i];
	button.addEventListener("click", function(){ handleAuxiliaryClick(button.textContent); });
	auxiliaryDiv.appendChild(button);
}
const period = document.createElement("button");
period.textContent = ".";
period.addEventListener("click", function(){ handleDecimal(); });
const equals = document.createElement("button");
equals.textContent = "=";
equals.addEventListener("click", function(){ evaluateExpression(); });
numpadDiv.appendChild(period);
numpadDiv.appendChild(equals);

