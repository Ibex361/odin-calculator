// the number displayed on screen,computed or with operators
let currentNum = '';
let operators = ['+','-','/','x']
let lastOpIndex = -1; // no operator at start
let dPointAllowed = true; // allow decimal point for now

let screen = document.querySelector('#screen');
const buttons = document.querySelector('#btns');

buttons.addEventListener('click',(event) => {
    const element = event.target;

    // prevent treating the message 'Invalid Operation' as valid expression
    if(currentNum === 'Invalid Operation') {
      currentNum = '';
    }
    if(element.classList.value === 'number') {
        //one decimal point allowed after the last operator(if any)
        dPointAllowed = !currentNum.includes('.',lastOpIndex);

        if((element.value != '.') || dPointAllowed) {
            currentNum += element.value;
        }
    }
    else if(element.classList.value === 'operator') {
        lastOpIndex = currentNum.length;
        // operator is not displayed/allowed if no preceding expression before it
        if(lastOpIndex != 0) {
          // if user presses operator twice,replace the former with the latest
	  if(operators.includes(currentNum.slice(-1))) {
              currentNum = currentNum.slice(0,-1) + element.value;
          }
          else {
              currentNum += element.value;
          }
        }
    }
    else if (element.value === 'DEL') {
        currentNum = currentNum.slice(0,-1);
    }
    else if (element.value === 'AC') {
	currentNum = '';
    }
    else if(element.value === '=') {
	// this is a way to compute currentNum with operators embeded in it
        let arr = currentNum.split('+')

        arr.forEach((addend,i) => {
            arr[i] = arr[i].split('-');
            arr[i].forEach((subbed,j) => {
                arr[i][j] = arr[i][j].split('x');
                arr[i][j].forEach((multiplied,k) => {
                    arr[i][j][k] = divideArr(multiplied.split('/'));
                });
                arr[i][j] = multiplyArr(arr[i][j]);
            });
            arr[i] = subArr(arr[i]);
        });

        currentNum = String(Math.round(sumArr(arr)*1000)/1000);
        // after currentNum computed there is no operator in currentNum so,
        lastOpIndex = -1;
    }

    if(currentNum === 'Infinity') {
      currentNum = 'Invalid Operation';
    }

    // prevent text overflow from the screen
    let excess = currentNum.length - 26;
    if(!(excess > 0)) {
      screen.textContent = currentNum;
    }
    else {
      screen.textContent = currentNum.slice(excess);
    }
});

// calc funcs
function multiplyArr(arr) {
    return arr.reduce((accumulator,val) => {
             return accumulator*val;
           });
}
// if arr=[a,b,c] returns a/(b*c)
function divideArr(arr) {
    if(arr.length === 1) {
      return arr[0];
    }
    return arr[0]/(multiplyArr(arr.slice(1)));
}
// to prevent concatenation turn the addends to number,also set accumulator to zero
function sumArr(arr) {
    return arr.reduce((accumulator,val) => {
             return accumulator+Number(val);
           },0);
}

function subArr(arr) {
    return arr.reduce((accumulator,val) => {
             return accumulator-val;
           });
}

