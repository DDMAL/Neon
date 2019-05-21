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

		this.neonView.view.addUpdateCallback(this.resetTextListeners.bind(this));
		setTextViewControls();
		setTextEdit();
	}

	/**
	 * All ommitted for now
	 * set listeners for the textview 
	 
	textListeners() {
		$('.active-page').find('.syllable').on('syl-select', this.updateTextBox.bind(this));
	}

	
	 * stop listeners for the textview 
	 
	stopListeners() {
		$('.active-page').find('.syllable').off('syl-select', this.updateTextBox.bind(this));
	}

	*/

	/**
	 * restart listeners for the textview 
	*/ 
	resetTextListeners() {
		this.stopListeners();
		this.textListeners();
	}

	/*
	 * highlights correct syl in the textbox when it's syllable is selected
	 * unimplemented for now
	 
	async updateTextBox (event) {

	}
	*/
}

/*
 * update the text for a single syl element
 */
function updateSylText (span) {
	let orig = formatRaw($(span).html());
	let corrected = window.prompt(''. orig);
	if (corrected !== null && corrected !== orig) {
   		let editorAction = {
    		'action': 'setText',
      		'param': {
        		'elementId': $('#' + $(span).attr('class').replace('syl-select', '').trim()).attr('id'),
        		'text': corrected
      		}
    	};
    }
    if (neonView.edit(editorAction)) { neonView.updateForCurrentPage(); }
}

/**
 * get the syllable text of the loaded file
 * @returns {string}
 */
 function getSylText() {
	var lyrics = '';
	let uniToDash = /\ue551/g;
	let syllables = Array.from($('.syllable'));
	syllables.forEach(syllable => {
		if ($(syllable).has('.syl').length) {
   			let syl = $(syllable).children('.syl')[0];
   			lyrics += "<span class='" + syllable.id + "'>";
   			if (syl.textContent.trim() === '') {
     				lyrics += '&#x25CA; ';
     		} else {
       			Array.from(syl.children[0].children[0].children).forEach(text => {
         			lyrics += text.textContent !== '' ? text.textContent : '&#x25CA; ';
       			});
     		}
     		lyrics += ' </span>';
   		} else {
   			lyrics += "<span class='" + syllable.id + "'>&#x25CA; </span>";
    	}
  	});
  	if(!TextView.notificationSent) {
  		Notification.queueNotification('Blank syllables are represented by &#x25CA;!');
  		TextView.notificationSent = true;
  	}
  	return lyrics.replace(uniToDash, '-');
}

/*
 * set text to edit mode
 */
function setTextEdit() {
	let spans = Array.from($('#syl_text').children('p').children('span'));
	spans.forEach(span => {
		$(span).off('click');
    	$(span).on('click', update);
    	function update () {
      		updateSylText(span);
		}
	});
}

/**
 * set listeners on textview visibility checkbox
 */
function setTextViewControls () {
	updateTextViewVisibility();
	$('#displayText').click(updateTextViewVisibility);
}

/*
 * update the visibility of the textview box
 * and add the event listeners to make sure the syl highlights when moused over
 */
function updateTextViewVisibility () {
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
	} else {
		$('syl_text').css('display', 'none');
	}
}


export { TextView as default };