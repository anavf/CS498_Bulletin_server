function openModal(modal) {
	$(modal).css("marginLeft", ($(window).width() - $(modal).width())/2);
	$(modal + "-bg").fadeIn();
	$(modal).fadeIn();
}

function closeModal(modal) {
	$(modal + "-bg").fadeOut();
	$(modal).fadeOut();
}