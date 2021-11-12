'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions


/* list of movements with foreach */
const displaymovements = (movements) => {
  /* resetting html from containerMovements */
  containerMovements.innerHTML = "";

  /* foreach of every move */
  movements.forEach((mov, i) => {
    /* deposit or withdrawal? */
    const typemovement = mov > 0 ? "deposit" : "withdrawal";

    /* layout from containerMovements */
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typemovement}">${
      i + 1
    } ${typemovement}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    /* insert html in containerMovements */
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
/* END */

/* create abbreviated user */
const createusername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
/* END */

/* deposits print in */
const calcPrintDeposits = function (movs) {
  const deposits = movs.filter((mov) => mov > 0);
  let depositall = 0;
  deposits.forEach((mov) => {
    depositall += mov;
  });

  labelSumIn.textContent = depositall.toFixed(2) + "€";
};
/* END */

/* withdrawals print out*/
const calcPrintWithdrawals = function (movs) {
  const withdrawals = movs.filter((mov) => mov < 0);
  let withdrawalall = 0;
  withdrawals.forEach((mov) => {
    withdrawalall += mov;
  });
  labelSumOut.textContent = `${Math.abs(withdrawalall.toFixed(2))}€`;
};
/* END */

/* interent print */
const calcPrintinterest = function (movs) {
  const deposits = movs.filter((mov) => mov >= 100);
  let depositall = 0;
  deposits.forEach((mov) => {
    depositall += (mov / 100) * currentAccount.interestRate;
  });

  depositall = depositall.toFixed(2);

  labelSumInterest.textContent = depositall + "€";
};
/* END */

/* calc balance */
const calcBalance = function (acct) {
  /* Total balance */
  let balance = 0;
  acct.forEach((mov) => {
    balance += mov;
  });
  return balance;
};

/* updateUI */
function updateUI() {
  /* list of movements */
  displaymovements(currentAccount.movements);

  /* print balance fuction */
  calcPrintBalance(currentAccount.movements);

  /* print deposits in */
  calcPrintDeposits(currentAccount.movements);

  /* print withdrawals out */
  calcPrintWithdrawals(currentAccount.movements);

  /* print interest */
  calcPrintinterest(currentAccount.movements);
}


/* calc and print balance */
const calcPrintBalance = function (acct) {
  /* Total balance */
  let printBalance = calcBalance(acct);
  /* print balance */
  labelBalance.textContent = printBalance.toFixed(2) + "€";
};

/* login */
let currentAccount;

const login = (e) => {
  e.preventDefault();
  /* save input user */
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  /* if currentaccount is correct proceed to the pin */
  if (currentAccount) {
    /* if the pin is correct proceed to bank functions */
    if (currentAccount.pin === Number(inputLoginPin.value)) {
      welcome();

      console.log(currentAccount);
    } else {
      /* pin error message */
      console.log("pin incorrecto");
    }
  } else {
    /* user error message */
    console.log("nombre de usuario es incorrecto");
  }
};

/* welcome */
function welcome() {
  /* welcome message */
  labelWelcome.textContent = `welcome Back, ${
    currentAccount.owner.split(" ")[0]
  }`;

  /* visible app */
  containerApp.style.opacity = "100";

  /* input name and pin setting */
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
  /* Print all balance, movement, deposits, interest ... */
  updateUI();
}

/* transfer validate */
// Who is the transfer for?
let currentTranferTo;
const transferValidate = (e) => {
  e.preventDefault();
  currentTranferTo = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  if (
    currentTranferTo &&
    currentTranferTo.userName != currentAccount.userName
  ) {
    if (
      Number(inputTransferAmount.value) > 0 &&
      Number(inputTransferAmount.value) < calcBalance(currentAccount.movements)
    ) {
      transfer();
    } else {
      console.log(`amount invalid`);
    }
  } else {
    console.log("name invalid");
  }
};

/* transfer */
const transfer = () => {
  /* add transfer to current account movements*/
  let currentTranferAmount = Number(inputTransferAmount.value);
  currentAccount.movements.push(currentTranferAmount.toFixed(2) * -1);

  /* add transfer to current transfer to*/
  currentTranferTo.movements.push(Number(currentTranferAmount));

  /* transfer message */

  /* input name and amount setting */
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();

    /* Print all balance, movement, deposits, interest ... */
    updateUI();
};

/* Loan to banck */
const loanToBanck = (e) => {
  // not reset
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value)
  if (loanAmount > 0 ) {
    // Bank rule, there must be at least one deposit with 10% of the requested amount
    const minimumPercentage = (loanAmount/100)*10;
    const verifymount = currentAccount.movements.some(mov => mov > minimumPercentage)
    if (verifymount) {
      currentAccount.movements.push(loanAmount);
      /* Print all balance, movement, deposits, interest ... */
      updateUI();
    }
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
}

/* remove account */
const removeAccount = (e) => {
  // not reset
  e.preventDefault();

  console.log(currentAccount);
  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    accounts.forEach((element, i) => {
      let user = element.userName.indexOf(currentAccount.userName);
      if ( user !== -1 ) {
        accounts.splice( i, 1 );
        containerApp.style.opacity = "0";
        labelWelcome.textContent = `Log in to get started`;
      }
    });
  }

  /* input name and amount setting */
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
}

/* RUN */

/* create abbreviated user */
createusername(accounts);

/* even listener login */
btnLogin.addEventListener("click", login);

/* even listener transfer */
btnTransfer.addEventListener("click", transferValidate);

/* even listener remove account */
btnClose.addEventListener("click", removeAccount)

/* even listener remove account */
btnLoan.addEventListener("click", loanToBanck)

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
