// ==UserScript==
// @name         JIRA Change Management Copy Text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add example values to copy to JIRA fields
// @author       Sven & GitHub Copilot
// @match        https://n-able.atlassian.net/*
// @grant        GM_addStyle
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @source       https://raw.githubusercontent.com/svenedge/greasemonkey_scripts/main/jira_change_management_text.user.js
// ==/UserScript==

/*
Hacky. Only works on the issue page, as it runs on load. No idea how to hook into other pages loading an issue in a popup/sidebar.
*/

(function() {
	'use strict';

	const verbose = 0;

	GM_addStyle(`
		ul.svenlist { list-style-type: none; margin-top: 0; }
		ul.svenlist:before { content: "Click to copy: "; }
		ul.svenlist li { display: inline; }
		ul.svenlist li a { margin-right: 10px; }
		button.svenbutton { margin-left: 10px; }
		a.svenbutton { text-decoration: underline dotted; }
	`);
	
	function add_buttons(parent_element, values) {
		if (verbose) {
			console.log('Adding buttons for values:', values, 'to parent element:', parent_element);
		}
		const ulist = document.createElement('ul');
		ulist.classList.add('svenlist');

		values.forEach(value => {
			const button = document.createElement('a');
			button.classList.add('svenbutton');
			button.textContent = value;
			
			button.addEventListener('click', () => {
				console.log('Writing to clipboard:', value);
				writeClipboardText(value);
			});

			const list_element = document.createElement('li');
			list_element.appendChild(button);
			ulist.appendChild(list_element);
		});
		
		parent_element.append(ulist); // jquery version because parent_element is a jquery object

		async function writeClipboardText(text) {
			try {
				await navigator.clipboard.writeText(text);
			} catch (error) {
				console.error(error.message);
			}
		}

	}

	// wait 3 seconds before running the script
	console.log('User script waiting for JIRA to load...');
	setTimeout(() => {
		wait_for_jira_to_load();
	}, 1000);

	function wait_for_jira_to_load() {
		// check every 0.25 seconds for 5 seconds for this element to exist
		//<h2 data-testid="issue-activity-feed.heading" class="_11c8nbxd _syaz1fxt _1i4q1hna _1ul9idpf">Activity</h2>
		const maxTries = 20;
		const interval = 250;
		var tries = 0;
		var element = null;
		const intervalId = setInterval(() => {
			tries++;
			element = document.querySelector('h2[data-testid="issue-activity-feed.heading"]');
			if (element) {
				clearInterval(intervalId);
				console.log('Found Activity element:', element, 'after', tries, 'tries');
				populate_fields();
			} else if (tries >= maxTries) {
				clearInterval(intervalId);
				console.log('Activity element not found after', tries, 'tries');
			}
		}, interval);
	}

	function populate_fields() {

		// Define the field names and values
		const fields = [
			{
				name: 'Change Release Plan',
				values: [
					'N/A',
					'See Github',
					'Run ansible',
					'Apply terraform',
				],
			},
			{
				name: 'Change Remediation Plan',
				values: [
					'N/A',
					'See Github',
					'Revert code and re-run ansible',
					'Revert code and re-apply terraform',
				],
			},
			{
				name: 'Change Test Plan',
				values: [
					'N/A',
					'See Github',

				],
			},
		];

		// Loop through the fields
		fields.forEach(field => {
			// Get the parent element for the field name
			try {
				// var parent_element = $('h2:contains("Change Remediation Plan")').parent();
				var parent_element = $('h2:contains(' + field.name + ')').parent();
				if (verbose) {
					console.log('Parent element for field:', field.name, parent_element);
				}
				if (parent_element) {
					add_buttons(parent_element, field.values);
				}
			}
			catch (e) {
				console.log('Exception on field:', field, e);
			}
		});

	}

})();