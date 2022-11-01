// ==UserScript==
// @name         AWS_SAML_usability
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make the AWS SAML role selection page actually usable by humans
// @author       Sven Edge
// @match        https://signin.aws.amazon.com/saml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Turn one long list into a shorter list with multiple columns
    GM_addStyle(`
    fieldset { columns: 4; }
    #saml_form { max-width: 90% }
    `);

    const parentElement = document.querySelector('#saml_form > fieldset');

    // loop through accounts finding role names
    const accounts = document.querySelectorAll('#saml_form > fieldset > div.saml-account');
    for (const anAccount of accounts) {
        var anAccountName = anAccount.querySelector('div.saml-account-name').innerText;
        //console.log(anAccountName);
        var aRoleName = anAccount.querySelector('div.saml-role label').innerText;
        //console.log(aRoleName);
        anAccount.dataset.accountName = anAccountName;
        anAccount.dataset.roleName = aRoleName;
    }

    function compareAccounts(a, b) {
        if (a.dataset.roleName < b.dataset.roleName) {
            return -1;
        }
        if (a.dataset.roleName > b.dataset.roleName) {
            return 1;
        }
        return 0;
    }

    // sort account objects by role name
    var accountsAnnotated = document.querySelectorAll('#saml_form > fieldset > div.saml-account');
    var accountsSorted = Array.from(accountsAnnotated).sort(compareAccounts);

    // re-order the page
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
    for (const anAccount of accountsSorted) {
        //console.log(anAccount.dataset.roleName + " --- " + anAccount.dataset.accountName);
        parentElement.appendChild(anAccount);
    }

})();