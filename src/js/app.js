

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
})();



// Функция для форматирования времени в формат "0:30"
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

const players = Plyr.setup('[data-id="player"]');
players.forEach(player => {
    const durationElement = player.elements.wrapper.closest('.video-segment').querySelector('.video-segment__time')
    // Ожидание события "loadedmetadata", которое срабатывает после загрузки метаданных видео
    player.on('loadedmetadata', event => {
        // Получение продолжительности видео в секундах
        const duration = Math.floor(event.detail.plyr.duration);
        // Преобразование продолжительности в формат "0:30"
        const formattedDuration = formatTime(duration);
        // Вывод значения продолжительности в отдельное место на странице
        if (durationElement) {
            durationElement.textContent = formattedDuration;
        }
    });

    player.on('play', event => {
        const pausedPlayers = players.filter(item => item != event.detail.plyr);
        pausedPlayers.forEach(item => item.pause());
        if (durationElement) {
            durationElement.classList.add('hide');
        }
    });
});

