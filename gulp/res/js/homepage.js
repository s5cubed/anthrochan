window.addEventListener('DOMContentLoaded', () => {
		if (document.getElementsByClassName('home-image-widget').length > 0) {
			document.getElementById("random-tegaki-widget").onclick = function() {
				this.src = "/randomtegaki" + '?t=' + new Date().getTime();
			};
			document.getElementById("random-image-widget").onclick = function() {
				this.src = "/randomimage" + '?t=' + new Date().getTime();
			};
		}
	}
);
