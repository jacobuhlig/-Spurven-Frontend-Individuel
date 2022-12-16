//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_spurven.js"; //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink,
  adjustForMissingHash,
  renderTemplate,
  loadHtml,
} from "./utils.js";


//import {initHome} from "./pages/home/home.js";
import {initContacts} from "./pages/contact/contact.js";
import {initCalendar} from "./pages/calendar/calendar.js"
import { initExpenses } from "./pages/expense/expense.js";

//window.location.href = "spurven-boating.dk/index.html#/login";
//window.location.href = "http://127.0.0.1:5501/index.html#/login";

window.addEventListener("load", async () => {
  const templateHome= await loadHtml("./pages/home/home.html");
  const templateContact= await loadHtml("./pages/contact/contact.html");
  const templateCalendar= await loadHtml("./pages/calendar/calendar.html");
  const templateExpense= await loadHtml("./pages/expense/expense.html");

  adjustForMissingHash();

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => {
        renderTemplate(templateHome, "content");
        //initHome();
      
      },
      "/login": () => {

      },
      "/contact": () => {
        renderTemplate(templateContact, "content");
        initContacts();
      },
      "/calendar": () => {
        renderTemplate(templateCalendar, "content")
        initCalendar();
      },
      "/expense": () => {
        renderTemplate(templateExpense, "content")
        initExpenses();
      }
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content");
    })
    .resolve();
});

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert(
    "Error: " +
      errorMsg +
      " Script: " +
      url +
      " Line: " +
      lineNumber +
      " Column: " +
      column +
      " StackTrace: " +
      errorObj
  );
};
