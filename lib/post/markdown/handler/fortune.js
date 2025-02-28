'use strict';

const fortunes = ['Fluffy encounter!', 'Scalie encounter!', 'Featheary encounter!'];

module.exports = {

	fortunes,

	regex: /##fortune/gmi,

	markdown: () => {
		const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
		return `<span class='title'>Your fortune: ${randomFortune}</span>`;
	},

};
