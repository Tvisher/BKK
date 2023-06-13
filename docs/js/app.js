

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
    // Переключение отображения списка материалов
    if (target.closest('[data-visual]')) {
        const currentBtn = target.closest('[data-visual]');
        const activeBtn = document.querySelector('[data-visual].active');
        const dataVisualId = currentBtn.dataset.visual;
        activeBtn.classList.remove('active');
        currentBtn.classList.add('active');
        dataVisualTemplate && dataVisualTemplate.setAttribute('data-visual-template', dataVisualId);
    }
    // Зактырие баннера 
    if (target.closest('[data-close-banner]')) {
        const closedBanner = target.closest('.closed-banner');
        closedBanner.classList.add('hide');
    }
});




(function () {
    const toltipElements = document.querySelectorAll('[data-toltip]');
    if (toltipElements.length < 1) return;
    toltipElements.forEach(item => {
        // Собираем данные из элемента с тултипом(заголовок,иконка,текст )
        const tooltipTitleData = item.getAttribute('data-toltip-title');
        const tooltipIcoSrc = item.getAttribute('data-toltip-ico');
        const tooltipTextData = item.getAttribute('data-toltip-text');
        // Формируем вёрстку для кастомного тела тутлтипа
        const toltipImage = tooltipIcoSrc ? `<div class="custom-tippy__ico"><img src="${tooltipIcoSrc.trim()}" alt=""></div>` : '';
        const toltipTitle = tooltipTitleData ? ` <div class="custom-tippy__title">${tooltipTitleData.trim()}</div>` : '';
        const toltipHead = (tooltipTitleData || tooltipIcoSrc) ? `<div class="custom-tippy__head">${toltipImage} ${toltipTitle}</div>` : '';
        const tooltipContent = `
        <div class="custom-tippy">
            ${toltipHead}
            <div class="custom-tippy__body">${tooltipTextData.trim()}</div>
        </div>`;
        // Инитим тултип 
        tippy(item, {
            arrow: false,
            allowHTML: true,
            content: tooltipContent,
            maxWidth: 450,
            // hideOnClick: "toggle",
            // trigger: "click"
        });
    })
})()
