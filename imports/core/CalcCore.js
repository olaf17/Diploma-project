if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

const regex = /sin|cos|tan|sqrt|exp|log|in|out|\d+(\.\d+)?|[\+\-\*\/\^\(\)]/g;

const operators = new Map([
  ["+",1],
  ["-",1],
  ["*",2],
  ["/",2],
  ["^",4]
]);

const left_assoc = "+-*/".split("");
const right_assoc = "+*^".split("");

const functionsGenerator = (inputManager, output) => new Map([
  ["sin", Math.sin],
  ["cos", Math.cos],
  ["tan", Math.tan],
  ["sqrt", Math.sqrt],
  ["exp", Math.exp],
  ["log", Math.log],
  ["in", inputManager.get],
  ["out", x=>{output.push(x); return x;}]
]);

const nop = ()=>{};
const dummyFunctions = functionsGenerator({get: nop}, {push: nop});

const operatorFunctions = new Map([
  ["+",{ argc: 2, f: (a,b)=>a+b }],
  ["-",{ argc: 2, f: (a,b)=>a-b }],
  ["/",{ argc: 2, f: (a,b)=>a/b }],
  ["*",{ argc: 2, f: (a,b)=>a*b }],
  ["^",{ argc: 2, f: (a,b)=>Math.pow(a,b) }],
  ["UNARY_MINUS",{ argc: 1, f: (a)=>-a }],
]);

const error = txt => ({type: "error", value: `We have fucked up. ${txt}`});

const smartTokenize = functions => algorithm => {
  try {
    const tokens = algorithm.match(regex);

    if (tokens.join("")!=algorithm) throw error("Can't tokenize.");

    const smartify = token => {
      if (/^\d+(\.\d+)?$/.test(token)) return {type: "number", value: token};
      else if (/^[\+\-\*\/\^]$/.test(token)) return {type: "operator", value: token, precedence: operators.get(token)};
      else if (functions.has(token)) return {type: "function", value: functions.get(token)}
      else if (/^[\(\)]$/.test(token)) return {type: "paren", value: token};
      else throw error("Cannot smartify token.");
    }

    const smartTokens = tokens.map(smartify).map((x,i,arr) => {
      if(x.type=="operator" && x.value == "-" && (i==0 || arr[i-1].type=="operator" || arr[i-1].value=="("))
        return {type: "operator", value: "UNARY_MINUS", precedence: 3};
      else return x;
    });

    // console.log("Parsed output:");
    // console.log(smartTokens);

    var OQ = [];
    var OS = [];

    // console.log("Calculation results:");

    //Shunting-yard algorithm
    smartTokens.forEach((x,i) => {
      if (x.type == "number") OQ.push(x);
      else if (x.type == "function") OS.push(x);
      else if (x.type == "operator") {
        while(OS.length > 0 && 
              OS.last().type == "operator" && 
              ((left_assoc.includes(x.value) && OS.last().precedence >= x.precedence)||
                (right_assoc.includes(x.value) && OS.last().precedence > x.precedence))) {
          OQ.push(OS.pop());
        }
        OS.push(x);
      } else if (x.type == "paren") {
        if(x.value == "(") OS.push(x);
        else {
          if(OS.length == 0) {
            throw error("Unmatched parenthesis. (1)", i, x.value);
            return;
          }
          while(OS.last().value != "(") {
            OQ.push(OS.pop());
            if(OS.length == 0) {
              throw error("Unmatched parenthesis. (2)", i, x.value);
              return;
            }
            // console.log(OS.map(x=>x.value).join(", "));
          }
          OS.pop();
          if(OS.length > 0 && OS.last().type == "function") OQ.push(OS.pop());
        }
      } else {
        throw error("Unrecognized token.");
      }
    });

    while(OS.length > 0) OQ.push(OS.pop());

    return OQ;
  } catch (e) {
    if(e.type=="error")
      return e;
    else return error("Unexpected token ILLEGAL.")
  }
}

const TestTokenizer = smartTokenize(dummyFunctions);

const CalcCore = (algorithm, input, progressCallback) => {
  try{
    var output = [];

    var inputManager = {
      currentRow: 0,
      get: i => {
        if(i<0 || i>= input[inputManager.currentRow].length)
          throw error("Input index out of bounds.");
        else return input[inputManager.currentRow][i]}
    };

    var outputManager = {
      currentRow: -1,
      next: () => {
        outputManager.currentRow++;
        output.push([]);
      },
      push: x=>output[outputManager.currentRow].push(x)
    }

    const functions = functionsGenerator(inputManager, outputManager);
    
    var OQ = smartTokenize(functions)(algorithm);
    var OS = [];

    // console.log(OQ.map(x=>x.value).join(", "));
    // console.log(OS);


    input.forEach(()=>{
      outputManager.next();
      // Reverse polish evaluation
      OQ.forEach(x => {
        if(x.type == "number") {
          OS.push(+x.value);
        } else if(x.type == "function") {
          if(OS.length == 0) {
            throw error("Not enough operator params.");
          }
          OS.push(x.value(OS.pop()));
        } else if(x.type == "operator") {
          var OF = operatorFunctions.get(x.value);
          if(OS.length < OF.argc) {
            throw error("Not enough operator params.");
          }
          var args = [];
          var argc = OF.argc;
          while(argc > 0) {
            args.push(OS.pop());
            argc--;
          }
          OS.push(OF.f(...args.reverse()));
        } else {
          throw error("Unrecognized token in polish queue. Possible cause: unmatched parenthesis.")
        }
        // console.log(OS.join(" "), "<-", x);
      });

      // console.log(OS.pop());
      inputManager.currentRow++;
      if(progressCallback) progressCallback();
      
    });
    return {type: "result", value: output};
  } catch (e) {
    return e;
  }
}

// var out = CalcCore(algorithm, input);
// console.log(out);

module.exports = { CalcCore, TestTokenizer };