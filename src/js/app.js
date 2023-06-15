

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

    if (target.closest('[data-open-modal]')) {
        const modalId = target.closest('[data-open-modal]').dataset.openModal;
        const currenModal = document.querySelector(`[data-modal="${modalId}"]`)
        if (currenModal) currenModal.classList.add('show');
    }

    if (target.closest('[data-close-modal]') ||
        (target.closest('.presintation__modal-slider') && !target.closest('.presintation__slider-container'))) {
        document.querySelector('.presintation__modal-slider.show')?.classList.remove('show');
    }

    //логика работы табов
    if (target.hasAttribute('data-tab-control')) {
        const tabId = target.getAttribute('data-tab-control');
        const state = {
            page: `?${tabId}`
        }
        history.pushState(state, '', state.page);
        openCurrnTab(target, tabId);
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
if (players && players.length > 0) {
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
}


const swiper = new Swiper('.presintation__slider', {
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: ".swiper-pagination",
        type: "custom",
        renderCustom: function (swiper, current, total) {
            return 'Страница ' + current + ' из ' + total;
        }
    },

});



function openCurrnTab(btn, id) {
    const activeTab = document.querySelector('[data-tab-content].active');
    if (activeTab) { activeTab.classList.remove('active') }
    const activeTabBtn = document.querySelector('[data-tab-control].active');
    if (activeTabBtn) { activeTabBtn.classList.remove('active') }
    btn.classList.add('active');
    const tabContentWhatINeed = document.querySelector(`[data-tab-content="${id}"]`);
    if (tabContentWhatINeed) tabContentWhatINeed.classList.add('active');
}

function tabLoad() {
    var tabId = location.search.split('').splice(1).join('').split('&')[0];
    const firstTab = document.querySelector('[data-tab-control]');
    if (firstTab && !tabId) {
        const firstTab = document.querySelectorAll('[data-tab-control]')[0];
        const firstTabId = firstTab.getAttribute('data-tab-control');
        openCurrnTab(firstTab, firstTabId);
    }
    if (tabId) {
        const btn = document.querySelector(`[data-tab-control="${tabId}"]`);
        if (btn) openCurrnTab(btn, tabId);
    }
}
tabLoad();
window.addEventListener('popstate', () => {
    tabLoad();
});
