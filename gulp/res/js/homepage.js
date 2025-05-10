window.addEventListener('DOMContentLoaded', () => {
	if (document.getElementsByClassName('home-image-widget').length > 0) {
		var imgclickwidget = document.getElementsByClassName('home-image-widget');
		for (i = 0;i < imgclickwidget.length;i++) {
			imgclickwidget[i].onclick = function() {
				this.src = this.src + '?t=' + new Date().getTime();
			};
		}
	}
});
