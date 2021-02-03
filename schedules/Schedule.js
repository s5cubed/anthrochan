'use strict';

const getConfig = require(__dirname+'/../getconfig.js');

module.exports = class Schedule {

	constructor (func, interval, immediate, condition) {
		this.func = func;
		this.interval = interval;
		this.immediate = immediate;
		this.condition = condition;
		this.intervalId = null;
		this.update();
	}

	//start the schedule
	start () {
		if (!this.intervalId) {
			if (this.immediate) {
				this.func();
			}
			this.intervalId = setInterval(this.func, this.interval);
		}
	}

	//stop the schedule
	stop () {
		clearInterval(this.interval);
		this.intervalId = null;
	}

	//check config and either start or stop
	update () {
		if (!this.condition || getConfig()[this.condition]) {
			this.start();
		} else {
			this.stop();
		}
	}

}
