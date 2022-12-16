import { API_URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";
import { sanitizeStringWithTableRows } from "../../utils.js";
import { getAuthenticatorForGet} from "../../utils.js";
import { getAuthenticatorForEdit} from "../../utils.js";
import { getAuthenticatorForDelete } from "../../utils.js";

const URL = API_URL + "contacts";
const methodPost = "POST";
const methodPut = "PUT";
const generalOptions = getAuthenticatorForGet();


export function initContacts() {
  fetchAllContacts();

  document.getElementById("add-button").onclick = addContact

  // An attempt at cycling through the various table bodies
  const arrayOfIds = [1, 2, 3, 4, 5, 6];
  for (let i = 0; i < arrayOfIds.length; i++) {
    document.getElementById("tbl-body-"+arrayOfIds[i]).onclick = editTarget
  }
  
}


export async function fetchAllContacts() {

    let options = getAuthenticatorForGet();
    console.log(options);

    const contactsFromServer = await fetch(URL, options).then((res) => res.json());
    //currently the best solution is to hardcode the ids of the contactTypes
    const arrayOfIds = [1, 2, 3, 4, 5, 6];
    for (let i = 0; i < arrayOfIds.length; i++) {
        let currentId = arrayOfIds[i];
        var contactsCategorized = showAllContacts(contactsFromServer, currentId);
        document.getElementById("tbl-body-" + currentId).innerHTML =
            sanitizeStringWithTableRows(contactsCategorized);
    }
}

function showAllContacts(data, id) {
  var newArray = data.filter(function (contact) {
    return contact.contactType.id === id;
  });
  const tableRows = newArray.map(
    (contact) =>
      `
    <tr>
        <td>${contact.name}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td class="text-center">
        <button id="${contact.id}-column-id-edit" type="button"  class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal-edit-contact">Edit</button>  
        </td>
    </tr>
    `
  );

  const tableRowStrings = tableRows.join("\n");

  return tableRowStrings;
}

function addContact() {

    // Add contact
    document.getElementById("bnt-submit-contact").onclick = makeNewContact
    
    // Refresh page
    fetchAllContacts();
}


async function makeNewContact() {
    

    const newContact = {}
    
    newContact.name = document.getElementById("modal-input-contact-name").value
    newContact.phone = document.getElementById("modal-input-contact-phone").value
    newContact.email = document.getElementById("modal-input-contact-email").value
    newContact.contactTypeId = document.getElementById("modal-select-contact-type").value
    console.log(document.getElementById("modal-select-contact-type").value)

    console.log(newContact)

    let contactToJson = JSON.stringify(newContact)
    
    let options = getAuthenticatorForEdit(methodPost, contactToJson);

    console.log(contactToJson)
    console.log(options)

    await fetch(URL + "/", options)
        .then(r => r.json())
  
        fetchAllContacts();
      
        
}



function editTarget(evt) {
  const target = evt.target
      const id = target.id.replace("-column-id-edit", "")
      document.getElementById("id-edit-contact").value = id
      renderContacts(id)
      document.getElementById("bnt-edit-contact").onclick = submitEditedContact
      document.getElementById("bnt-delete-contact").onclick= deleteContact

}

async function renderContacts(id) {
  try {
      const contact = await fetch(URL + '/' + id, generalOptions).then(res => res.json())
      
      contact.contactType.id
      document.getElementById("modal-input-contact-name-edit").placeholder = contact.name;
      document.getElementById("modal-input-contact-phone-edit").placeholder = contact.phone;
      document.getElementById("modal-input-contact-email-edit").placeholder = contact.email;

      
      var selectType = document.querySelector('#modal-select-contact-type-edit');

      // Returns the selected value
      
      selectType.value = contact.contactType.id

  } catch (err) {
    console.log(err)

  }
}


async function submitEditedContact(evt) {
  evt.preventDefault
  try {
  const editedContact = {}

  editedContact.name = document.getElementById("modal-input-contact-name-edit").value
  editedContact.phone = document.getElementById("modal-input-contact-phone-edit").value
  editedContact.email = document.getElementById("modal-input-contact-email-edit").value
  editedContact.contactTypeId = document.getElementById("modal-select-contact-type-edit").value

  let idToEdit = document.getElementById("id-edit-contact").value
  let editContactToJson = JSON.stringify(editedContact)
  let options = getAuthenticatorForEdit(methodPut, editContactToJson);

  await fetch(URL + '/' + idToEdit, options)
  .then(handleHttpErrors)
} catch (err) {
  console.log(err.message + " (Is the API online?)")
}

fetchAllContacts();

}

async function deleteContact(){
  let idToDelete = document.getElementById("id-edit-contact").value
  const options = getAuthenticatorForDelete();
  await fetch(URL + "/" + idToDelete, options)
  fetchAllContacts();
}