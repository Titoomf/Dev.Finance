//variavel,nao preciso muda ao longo prazo
const Modal = {
  open() {
    // abrir modal
    // adicionar a class active ao modal
    // para conseguir pegar o modal eu preciso declarar um objeto active (DOM)docuemnto objeto model

    //------------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    // selector é o seletor css eo query o termo é fazer uma pesquisar,
    // dentro do HTML, procure o seletor "modal-overlay",
    //quando achar ele vai me devolver um objeto a referencia vai ser a minha div
    // eu sabendo o que vai me retornor eu posso colocar um outra funcao que é a classList.add que vai adicionar uma classe

    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    //novo escopo, fechar o modal, como fecho o modal
    // tenho que remover a class active do modal
    document
      .querySelector(".modal-overlay") // vai me devolver um objeto do tipo overlay é uma clase e esta dentro da div
      .classList.remove("active");
  },
}

const Storage = { // salver os dados no cookies do browser, aplicacap,storage
  get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []// transformando de string para arrays ou devolve um array vazio
  },
  set(transactions){
    localStorage.setItem("dev.finances:transactions",transactions,JSON.stringify(transactions))// TRANSFORMANDO STRING EM ARRAYS
  },
}


// Eu preciso somar as entradas
// depois eu preciso somar as saidas e remover das entradas o valor das saidas assim, eu terei o total 
const Transaction = {
  all:Storage.get(),
  /**all: [
    {
      
      description: "Luz",
      amount: -50000,
      date: "23/01/2021",
    },
    {
      
      description: "Website",
      amount: 50000,
      date: "23/01/2021",
    },
    {
      
      description: "Internet",
      amount: -20000,
      date: "23/01/2021",
    },
    {
     
      description: "Jogo",
      amount: 50000,
      date: "23/01/2021",
    },
  ],// refatorar deixando o codigo mais claro e melhor estruturado, atalho para todas as transação**/
  
  add(transaction) {
    Transaction.all.push(transaction)// vai adicionar uma transação

    App.reload()
  },

    remove(index) {
        Transaction.all.splice(index, 1)// splice o metodo vai esperar o numero do array a posicao é so usado em arrays

        App.reload()
    },

  incomes() {
    let income = 0;
    //somar as entradas
    //pegar todas as transacao
    Transaction.all.forEach(transaction => {
      // para cada transacao,  se ela for  maior que zero
      if (transaction.amount > 0) {
        // somar a uma variavel e retornar a variavel

        income = income + transaction.amount;
      }
    });
      return income;
  },
  expenses() {
    let expense = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense = expense + transaction.amount;
      }
    });

    return expense;
  },
  total() {
    // entradas - saidas
    return Transaction.incomes() + Transaction.expenses()
  },
}

// eu preciso pegar as minhas transação do meu objeto aqui no javascript e colocar no html
// substituir os dados do html com os dados do js

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    // quando eu chmar o metodo ele criar um tr e dentro do html eu to colocando o tr dentro e o return me retorna para o fluxo
    const tr = document.createElement("tr"); // criando o tr
    tr.innerHTML = DOM.innerHTMlTransaction(transaction);
    tr.dataset.index = index;// index é a posicao do array que ele vai esta guardado no objeto

    DOM.transactionsContainer.appendChild(tr); //appendChild adicionar tr é o elmento html
  },
  innerHTMlTransaction(transaction, index) {
    // ára cada um entra que eu quero vai ser essa funcao que eu vou usar
    // quando eu tenho a crase eu posso ter variavel dentro delas e fazer a interpolação
    const CSSclass = transaction.amount > 0 ? "income" : "expense"; // metodo ternario curso da discovery

    const amount = Utils.formatCurrency(transaction.amount);
    const html = ` 
    <tr>
       <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
           <img onclick="Transaction.remove(${index})"src="./assets/minus.svg" alt="Remover Transações" />
        </td>
    </tr>
    `;
    return html;
  },

  updateBalance() {
    // atualizar os valores de entrada e saida
    document
    .getElementById("incomeDisplay")
    .innerHTML = Utils.formatCurrency(Transaction.incomes());
    document
    .getElementById("expenseDisplay")
    .innerHTML =Utils.formatCurrency(Transaction.expenses());
    document
    .getElementById("totalDisplay")
    .innerHTML =Utils.formatCurrency(Transaction.total());
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  },
}

// formatacao de numero para o real brasileiro e os sinais tambem arrumado
const Utils = {
  formatAmount(value){
      value = Number(value) * 100

      return value
  },

  formatDate(date){
      const splittedDate =date.split("-") // fazer uma separacao 

      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}` // usando o template `` invertendo o array de acordo que eu quero
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""; // eu vou garantir que vai ser um numero eu to forcando

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100; // aqui ele dividir por 100

    value = value.toLocaleString("pt-BR", {
      // localização
      style: "currency", // MOEDA
      currency: "BRL",
    });

    return signal + value;
  },
}

const Form = {
    description:document.querySelector('input#description'), // ccrinado propriedade para pegar depois
    amount:document.querySelector('input#amount'),
    date:document.querySelector('input#date'),

    getValue(){ // to recebendo os objetos com o valores 
      return {
        description:Form.description.value,        
        amount:Form.amount.value,
        date:Form.date.value,
      }
    },
  validateFields() {
    const {description, amount, date}= Form.getValue() // aqui eu uma destruturacao , eu tiro de dentro do objeto , descricao,valor,data

    if(description.trim() === "" ||// trim faz uma limpeza de espacos vazio
      amount.trim() ===""||
      date.trim() === ""){
        throw new Error("Por favor, preencha todos os campos")// dispara o error
    }
  },

    formatValues() {
        let {description, amount, date} = Form.getValue()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
       
        return { // forma formatado com a chave do mesmo nome, ficariu description:description e assim por diante , como eu fiz foi formatar
          description,
          amount,
          date
        }

    },

    saveTransaction(transaction) {
      Transaction.add(transaction)
    },

    clearFields() {
      Form.description.value = ""
      Form.amount.value = ""
      Form.date.value = ""
    },

  submit(event) {
    event.preventDefault() // nao faca o comportamento padrao , interrompa

      try {
        //formatar os dados para salvar        
        Form.validateFields()
        //verificar se todas as informacao foram preenchidas
         const transaction = Form.formatValues()       
        // salvar os dados 
        Form.saveTransaction(transaction)
        // limpar os dados do formulario
        Form.clearFields()
        // fechar mordal 
        Modal.close()
        

      } catch (error) {// vai capturar o erro ocorrido
        alert(error.message)
        
      }
 
  },
}




// quando registrar tudo aqui que vai entra na aplicacao, ele iniciar vai popular O DOM  com todos os dados(luz,agua....) depois ele adc uma nova dados e depoois ele faz um reload e inica a aplicacao de novo com dados atualizados
const App = {
  init() {
    
//forma mais eficiente forech no english é para cada elemento....
Transaction.all.forEach((transaction, index) => {
  DOM.addTransaction(transaction, index)

}) // objeto de tipo array(colecao) para cada elemnto ele vai exexutar uma funcionalidde

DOM.updateBalance()// atualizando O Dom
Storage.set(Transaction.all) // atualizando localStorage

  
},

reload() {
    DOM.clearTransactions() // limpar tudo
    App.init() // inicia aplicacao
  },
}
App.init()


// chamar o DOM. Transaction, forma manual
//DOM.addTransaction(transactions[0])
//DOM.addTransaction(transactions[1])
//DOM.addTransaction(transactions[2])


