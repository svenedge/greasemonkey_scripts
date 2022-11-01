// ==UserScript==
// @name         AWS_SAML_usability
// @namespace    https://github.com/svenedge/greasemonkey_scripts/
// @version      0.3
// @description  Make the AWS SAML role selection page actually usable by humans
// @author       Sven Edge
// @match        https://signin.aws.amazon.com/saml
// @icon         https://signin.aws.amazon.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-idle
// @source       https://raw.githubusercontent.com/svenedge/greasemonkey_scripts/main/AWS_SAML_usability.js
// ==/UserScript==

(function() {
    'use strict';

    // Turn one long list into a shorter list with multiple columns
    GM_addStyle(`
    fieldset { columns: 4; }
    #saml_form { max-width: 95% }
    #saml_form > fieldset > div.saml-account { break-inside: avoid-column; }
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