

$(document).ready(function () {
    $('.styled_select').each(function () {
        const placeholder = $(this).attr("data-placeholder");
        //name селекта
        const selectName = $(this).attr("name");

        $(this).select2({
            minimumResultsForSearch: -1,
            placeholder: placeholder,
        })
    });
});


const dataVisualTemplate = document.querySelector('[data-visual-template]');
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('[data-visual]')) {
        const currentBtn = target.closest('[data-visual]');
        const activeBtn = document.querySelector('[data-visual].active');
        const dataVisualId = currentBtn.dataset.visual;
        activeBtn.classList.remove('active');
        currentBtn.classList.add('active');
        dataVisualTemplate && dataVisualTemplate.setAttribute('data-visual-template', dataVisualId);
    }

    if (target.closest('[data-close-banner]')) {
        const closedBanner = target.closest('.closed-banner');
        closedBanner.classList.add('hide');
    }
})