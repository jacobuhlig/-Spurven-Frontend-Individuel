import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "users/"

export function initHome(){
    fetchALl();
}

export async function fetchALl (){
    const userFromServer = await fetch(URL).then(res => res.json())
    showAllUsers(userFromServer)

}

function showAllUsers(data) {
    const tableRows = data.map(users => `
          <tr>
          <td>${users.firstName}</td>
          <td>${users.lastName}</td>
          </tr>`)
  
    const tableRowsString = tableRows.join("\n")
    document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
  }