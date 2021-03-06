/*Генерируем уникальный id для объекта*/
 const generateId = () => `id${Math.round(Math.random()*1e8).toString(16)}`;

/*Объявляем переменные*/
const totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncom = document.querySelector('.total__money-incom'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.getElementById('form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount');

//localStorage.clear();

/*Созаем массив в котором будут храниться все операции*/
let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];

const renderOperation = (operation) => {

const className = operation.amount < 0 ? 
    'history__item-minus' : 
    'history__item-plus';

const listItem = document.createElement('li');

listItem.classList.add('history__item');
listItem.classList.add(className);

listItem.innerHTML = `${operation.description}
    <span class="history__money">${operation.amount} ₽</span>
    <button class="history__delete" data-id="${operation.id}">x</button>
    `;
historyList.append(listItem);
};

const updateBalance = () => {
const resultIncome = dbOperation
    .filter((item) => item.amount > 0)
    .reduce((result, item) => result + item.amount, 0); /*return item.amount > 0*/

const resultExpenses = dbOperation
    .filter((item) => item.amount < 0)
    .reduce((result, item) => result + item.amount, 0); /*return item.amount < 0*/

totalMoneyIncom.textContent = resultIncome + ' ₽';
totalMoneyExpenses.textContent = resultExpenses + ' ₽';
totalBalance.textContent = (resultIncome + resultExpenses) + ' ₽';
};

const addOperation = (event) => {
    event.preventDefault();

const operationNameValue = operationName.value,
    operationAmountValue = operationAmount.value;

operationName.style.borderColor = ''; /*Очищаем обводку цветом поля ввода*/
operationAmount.style.borderColor = ''; /*Очищаем обводку цветом поля ввода*/

if (operationNameValue !== '' && operationAmountValue !== '') {

    const operation = {
        id: generateId(),
        description: operationNameValue,
        amount: +operationAmountValue
    };

    dbOperation.push(operation);
     init();

    } else {
        if (!operationNameValue) operationName.style.borderColor = 'red'; /*Создаем обводку красным цветом поля ввода*/
        if (!operationAmountValue) operationAmount.style.borderColor = 'red'; /*Создаем обводку красным цветом поля ввода*/
    }

    operationName.value = ''; /*Очищаем поля*/
    operationAmount.value = ''; /*Очищаем поля*/
};

/*Функция deleteOperation удаляет дела*/
const deleteOperation = (event) => {
    const target = event.target;
    if (target.classList.contains('history__delete')) {
        dbOperation = dbOperation
            .filter(operation => operation.id !== target.dataset.id);
        init();
    }
};

const init = () => {
    historyList.textContent = '';
    dbOperation.forEach(renderOperation);
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperation));
    /*
    for (let i = 0; i < dbOperation.length; i++) {
        renderOperation(dbOperation[i]);
    }
    */
};

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation);
init();