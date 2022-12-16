import { API_URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";
import { sanitizeStringWithTableRows } from "../../utils.js";
import { getAuthenticatorForGet} from "../../utils.js";
import { getAuthenticatorForEdit} from "../../utils.js";
import { getAuthenticatorForDelete } from "../../utils.js";
const URL = API_URL + "expenses/";

const optionsGet = getAuthenticatorForGet();

export function initExpenses(){
    fetchAllExpenses();
    document.getElementById("bnt-submit-expense").onclick = makeNewExpense
    document.getElementById("tbl-body").onclick = editTarget


}


async function fetchAllExpenses(){
    const expensesFromServer = await fetch(URL, optionsGet).then((res) => res.json());
    showAllExpenses(expensesFromServer)
}

function showAllExpenses(data){
    const tableRows = data.map(expense =>`
    <tr>
    <td>${expense.description}</td>
    <td>${expense.category}</td>
    <td>${expense.amount}</td>
    <td>${expense.invoiceStart}</td>
    <td>${expense.invoiceEnd}</td>
    <td>
    <button id="${expense.id}-column-id-edit" type="button"  class="btn btn-primary" style="width: 100% !important;" data-bs-toggle="modal" data-bs-target="#modal-edit-expense">Edit</button>
    </td>
    </tr>`)
    
    
    const tableRowsString = tableRows.join("\n")
    document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
}


async function makeNewExpense(){
    try{
    const newExpense = {}

    newExpense.description = document.getElementById("add-description").value
    newExpense.category = document.getElementById("add-category").value
    newExpense.amount = document.getElementById("add-amount").value
    newExpense.invoiceStart = document.getElementById("add-start").value
    newExpense.invoiceEnd = document.getElementById("add-end").value

    var expenseToJson = JSON.stringify(newExpense)
    var options = getAuthenticatorForEdit("POST", expenseToJson)

    await fetch(URL, options)
    .then(r => r.json())
    .then(handleHttpErrors)
    }catch(err){
        console.log(err)
    }

    fetchAllExpenses();

}

function editTarget(evt) {
    const target = evt.target
        const id = target.id.replace("-column-id-edit", "")
        console.log(id)
        document.getElementById("id-edit-expense").value = id
        renderExpenses(id)
        document.getElementById("bnt-edit-expense").onclick = submitEditedExpenses
        document.getElementById("bnt-delete-expense").onclick= deleteExpense
        
  
  }

  async function submitEditedExpenses() {
    try {
        const newExpense = {}

        newExpense.description = document.getElementById("edit-description").value
        newExpense.category = document.getElementById("edit-category").value
        newExpense.amount = document.getElementById("edit-amount").value
        newExpense.invoiceStart = document.getElementById("edit-start").value
        newExpense.invoiceEnd = document.getElementById("edit-end").value
  
    let idToEdit = document.getElementById("id-edit-expense").value
    let editExpenseToJson = JSON.stringify(newExpense)
    let options = getAuthenticatorForEdit("PUT", editExpenseToJson);
  
    await fetch(URL + idToEdit, options)
    .then(handleHttpErrors)
  } catch (err) {
    console.log(err.message + " (Is the API online?)")
  }

  fetchAllExpenses();

  }

  async function deleteExpense(){
    let id = document.getElementById("id-edit-expense").value
    const options = getAuthenticatorForDelete();
    await fetch(URL + id, options)
    fetchAllExpenses();
  }

  async function renderExpenses(id) {
    try {
        const expense = await fetch(URL + id, optionsGet).then(res => res.json())
        document.getElementById("edit-description").value = expense.description
        document.getElementById("edit-category").value = expense.category
        document.getElementById("edit-amount").value = expense.amount
        document.getElementById("edit-start").value = expense.invoiceStart
        document.getElementById("edit-end").value = expense.invoiceEnd
  
    } catch (err) {
      console.log(err)
  
    }
  }

 


