import * as Notification from './utils/Notification.js';

/** @module TextView */

const $ = require('jquery');

/*
 * Class that manages getting the text for syllables in Neon from the mei file
 */
class TextView {
	/**
	 * A constructor for a TextView.
	 * @param {NeonView} neonView = The NeonView parent.
	 */
	constructor(neonView) {
		this.neonView = neonView;
		let notificationSent = false;
		// add checkbox to enable/disable the view
		let block = document.getElementById('extensible-block');
		let label = document.createElement('label');
		let input = document.createElement('input');
		label.classList.add('checkbox');
		label.textContent = 'Display Text: ';
		input.classList.add('checkbox');
		input.id = 'displayText';
		input.type = 'checkbox';
		input.checked = false;
		label.appendChild(input);
		block.prepend(label);

		$('#edit_mode').on('click', () => {
			this.setTextEdit();
		});
		this.setTextViewControls();
		this.neonView.view.addUpdateCallback(this.updateTextViewVisibility.bind(this));
	}

	/**
 	* set listeners on textview visibility checkbox
 	*/
	setTextViewControls () {
		this.updateTextViewVisibility();
		$('#displayText').on('click', () => {
			this.updateTextViewVisibility();
		});
	}

	/*
 	 * set text to edit mode
	 */
	setTextEdit() {
		let spans = Array.from($('#syl_text').children('p').children('span'));
		spans.forEach(span => {
			$(span).off('click');
   			$(span).on('click', () => {
   				this.updateSylText(span);
   			});
		});
	}

	/*
 	* update the text for a single syl element
 	*/
	updateSylText (span) {
		let orig = formatRaw($(span).html());
		let corrected = window.prompt('', orig);
		if (corrected !== null && corrected !== orig) {
   			let editorAction = {
    			'action': 'setText',
      			'param': {
        			'elementId': $('#' + $(span).attr('class').replace('syl-select', '').trim()).attr('id'),
        			'text': corrected
      			}
    		};
    		this.neonView.edit(editorAction, this.neonView.view.getCurrentPage()).then((response) => {
    			if (response) {
    				this.neonView.updateForCurrentPage();
    			}
    		});
    	}
	}

	/*
 	* update the visibility of the textview box
 	* and add the event listeners to make sure the syl highlights when moused over
 	*/
	updateTextViewVisibility () {
		if ($('#displayText').is(':checked')) {
			$('#syl_text').css('display', '');
			$('#syl_text').html('<p>' + getSylText() + '</p>');
			let spans = Array.from($('#syl_text').children('p').children('span'));
			spans.forEach(span => {
      			$(span).on('mouseenter', () => {
        			let syllable = $('#' + $(span).attr('class'));
        			syllable.addClass('syl-select');
        			syllable.attr('fill', '#d00');
        		});
        		$(span).on('mouseleave', () => {
        			$('#' + $(span).attr('class')).removeClass('syl-select').attr('fill', null);
				});
      		});
      		if (this.neonView.getUserMode() !== 'viewer') {
      			this.setTextEdit();
      		}
		} else {
			$('#syl_text').css('display', 'none');
		}
	}
}

/**
 * get the syllable text of the loaded file
 * @returns {string}
 */
 function getSylText() {
	var lyrics = '';
	let uniToDash = /\ue551/g;
	let syllables = Array.from($('.active-page .syllable'));
	console.log(syllables.length);
	syllables.forEach(syllable => {
		if ($(syllable).has('.syl').length) {
   			let syl = $(syllable).children('.syl')[0];
   			lyrics += "<span class='" + syllable.id + "'>";
   			if (syl.textContent.trim() === '') {
     				lyrics += '🐧 ';
     		} else {
       			Array.from(syl.children[0].children[0].children).forEach(text => {
         			lyrics += text.textContent !== '' ? text.textContent : '🐧 ';
       			});
     		}
     		lyrics += ' </span>';
   		} else {
   			lyrics += "<span class='" + syllable.id + "'>🐧 </span>";
    	}
  	});
  	if(!TextView.notificationSent) {
  		Notification.queueNotification('Blank syllables are represented by &#x25CA;!');
  		TextView.notificationSent = true;
  	}
  	return lyrics.replace(uniToDash, '-');
}

/**
 * Format a string for prompting the user.
 * @param {string} rawString
 * @returns {string}
 */
function formatRaw (rawString) {
	let removeSymbol = /\u{25CA}/u;
	return rawString.replace(removeSymbol, '').trim();
}


export { TextView as default };