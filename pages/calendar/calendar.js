import { API_URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";
import { sanitizeStringWithTableRows } from "../../utils.js";
import { getAuthenticatorForGet} from "../../utils.js";
import { getAuthenticatorForEdit} from "../../utils.js";
import { getAuthenticatorForDelete } from "../../utils.js";
const URL = API_URL + "events/";
const methodPost = "POST";
const options = getAuthenticatorForGet();
const opitonsDelete = getAuthenticatorForDelete();

export function initCalendar() {
  showCalender();
}




function showCalender(events) {

  const calendarEl = document.getElementById("calendar");
 
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: fetchAllEvents,

   

  selectable: true, 
  selectHelper: true,
  select: function(start, end, allDays){
    const myModal = new bootstrap.Modal(document.getElementById('eventModal')); 
    myModal.show();
    document.getElementById('bnt-submit-event').onclick = makeNewEvent


    function makeNewEvent(){
      var startdate = document.getElementById("startDate").value
      var enddate = document.getElementById("endDate").value

      const newEvent ={}
      newEvent.title  = document.getElementById("title").value
      newEvent.description = document.getElementById("description").value
      newEvent.start = moment(startdate).format('YYYY-MM-DD hh:mm');
      newEvent.end = moment(enddate).format('YYYY-MM-DD hh:mm');
      console.log(newEvent.start)
    
      const eventToJson = JSON.stringify(newEvent)
      let options = getAuthenticatorForEdit(methodPost, eventToJson)
      console.log(eventToJson)
    
      fetch(URL, options)
      .then(r => r.json())

      calendar.addEvent({
        title: newEvent.title,
        description: newEvent.description,
        start: newEvent.start,
        end: newEvent.end
      });
     }

  },
  editable: true, 
  eventClick: function(info){
    const editmodal = new bootstrap.Modal(document.getElementById('edit-eventModal')); 
    var id = info.event.id;
    editmodal.show();
    fetchEvent(id)
    document.getElementById('bnt-edit-event').onclick = editEvent
    document.getElementById("bnt-delete-event").onclick = deleteshow

    async function editEvent(){
      console.log("kommer der noget" + id)
      var startdate = document.getElementById("edit-start").value
      var enddate = document.getElementById("edit-end").value

      const editedEvent = {}
      editedEvent.title = document.getElementById("edit-title").value 
      editedEvent.description = document.getElementById("edit-description").value
      editedEvent.start = moment(startdate).format('YYYY-MM-DD hh:mm');
      editedEvent.end = moment(enddate).format('YYYY-MM-DD hh:mm');
  
    let editedEvenetToJson = JSON.stringify(editedEvent)
    let options = getAuthenticatorForEdit("PUT", editedEvenetToJson);

    await fetch(URL + id, options);

    info.event.setExtendedProp( info.event.title,  editedEvent.title)
    info.event.setStart(info.event.start, editedEvent.start)
    info.event.setEnd(info.event.start, editedEvent.end)
    }

    async function deleteshow(){
      const options = getAuthenticatorForDelete();
      await fetch(URL + id, options)

    info.event.remove();
    }


    
  }


  }); 
  calendar.render();
} 


export async function fetchAllEvents() {
  const options = getAuthenticatorForGet();
  const eventsFromServer = await fetch(URL, options).then((res) => res.json());
  console.log(eventsFromServer)
  
  return eventsFromServer;
}


async function renderShow(event) {
      document.getElementById("edit-title").value = event.title;
      document.getElementById("edit-description").value = event.description;
      document.getElementById("edit-start").value = event.start;
      document.getElementById("edit-end").value = event.end;
}

async function fetchEvent(id){
  const event = await fetch(URL + id, options).then(res => res.json())
  renderShow(event)

}