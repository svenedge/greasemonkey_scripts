// ==UserScript==
// @name         Pingdom clickable links
// @namespace    https://github.com/svenedge/greasemonkey_scripts/
// @version      0.1
// @description  Enable opening a result page in a new tab
// @author       Sven Edge (well, mostly Github Copilot)
// @match        https://my.pingdom.com/newchecks/transactions
// @match        https://my.pingdom.com/newchecks/checks
// @icon         https://my.pingdom.com/images/favicon-32x32.png
// @grant        GM_addStyle
// @run-at       document-idle
// @source       https://raw.githubusercontent.com/svenedge/greasemonkey_scripts/main/Pingdom_clickable.user.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('Trying to inject links into Pingdom results page...');

  GM_addStyle(`
    #tmsTablesContainer a:link { text-decoration: underline dotted; }
    #tmsTablesContainer a:hover { text-decoration: underline; }
    #uptimeTablesContainer a:link { text-decoration: underline dotted; }
    #uptimeTablesContainer a:hover { text-decoration: underline; }
  `);

  // of course the page structures are completely different...
  function add_transaction_links() {
    const tablecontainer = document.querySelector('#tmsTablesContainer');
    if (!tablecontainer) {
      console.log(`Could not find table container tmsTablesContainer`);
      return;
    }
    // console.log(tablecontainer);
  
    // const tablerows = tmsTablesContainer.querySelectorAll('tr');
    const tablerows = document.querySelectorAll('#tmsTablesContainer tr[id]');
    if (!tablerows) {
      console.log('Could not find tablerows');
      return;
    }
    // console.log(tablerows.length);
    // console.log(tablerows);

    if (tablerows.length > 0) {
      tablerows.forEach((arow) => {
        const id = arow.getAttribute("id").split("-")[1];
        const linkcontainer = arow.querySelector('td > strong');
        const newlink = document.createElement('a');
        newlink.href = `/app/reports/transaction#recipe=${id}`;
        newlink.target = '_blank';
        newlink.innerHTML = linkcontainer.innerHTML;
        linkcontainer.innerHTML = '';
        linkcontainer.appendChild(newlink);
      });

      console.log("Finished adding links.");
    } else {
      console.log("Could not find table rows to add links to.");
    }
  }

  function add_uptime_links() {
    const tablecontainer = document.querySelector('#uptimeTablesContainer');
    if (!tablecontainer) {
      console.log(`Could not find table container uptimeTablesContainer`);
      return;
    }
    // console.log(tablecontainer);
  
    const tablerows = document.querySelectorAll('#uptimeTablesContainer tbody tr');
    if (!tablerows) {
      console.log('Could not find tablerows');
      return;
    }
    // console.log(tablerows.length);
    // console.log(tablerows);

    if (tablerows.length > 0) {
      tablerows.forEach((arow) => {
        const idelement = arow.querySelector('td > input[type="checkbox"]');
        const id = idelement.getAttribute("id").split("-")[2];
        const linkcontainer = arow.querySelector('td > strong');
        const newlink = document.createElement('a');
        newlink.href = `/app/reports/uptime#check=${id}`;
        newlink.target = '_blank';
        newlink.innerHTML = linkcontainer.innerHTML;
        linkcontainer.innerHTML = '';
        linkcontainer.appendChild(newlink);
      });

      console.log("Finished adding links.");
    } else {
      console.log("Could not find table rows to add links to.");
    }

  }

  const url = window.location.href;
  // wait some time for the page to render
  setTimeout(() => {
    if (url.includes('/transactions')) {
      add_transaction_links();
    } else if (url.includes('/checks')) {
      add_uptime_links();
    }
  }, 5000);

})();
