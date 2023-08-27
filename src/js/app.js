

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

    // Открытие модального окна
    if (target.closest('[data-open-modal]')) {
        const parentElement = target.closest('.presintation__slider-block');
        const modalId = target.closest('[data-open-modal]').dataset.openModal;
        let currenModal;
        if (parentElement) {
            currenModal = parentElement.querySelector(`[data-modal="${modalId}"]`)
        } else {
            currenModal = document.querySelector(`[data-modal="${modalId}"]`)
        }
        if (currenModal) currenModal.classList.add('show');
    }

    // Закрытие модального окна
    if (target.closest('[data-close-modal]') ||
        (target.closest('.modal-template') && !target.closest('.modal-template__inner'))) {
        document.querySelector('.modal-template.show')?.classList.remove('show');
    }

    // Закрытие уведомления
    if (target.closest('.notification-template__close')) {
        target.closest('.notification-template').classList.remove('show');
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

    //логика работы списка уведомлений в шапке
    if (document.querySelector('.notifications__dropped-list.show') && !target.closest('.notifications__dropped-list')) {
        document.querySelector('.notifications__dropped-list.show').classList.remove('show')
        return
    }
    if (target.closest('#notification-show')) {
        const notificationsDroppedList = target.closest('#notification-show').querySelector('.notifications__dropped-list');
        if (target.closest('#notification-show') && !target.closest('.notifications__dropped-list')) {
            notificationsDroppedList.classList.toggle('show');
        }
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
            // trigger: 'click',
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


// Инит и настройка плагина видеоплеера
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


const presintationSliderBlock = document.querySelectorAll('.presintation__slider-block');
presintationSliderBlock.forEach(block => {
    const pdfUrl = block.dataset.pdfUrl;
    const sliderElems = block.querySelectorAll('.presintation__slider');
    sliderElems.forEach(sliderItem => {
        //Слайдер для презентаций
        const swiper = new Swiper(sliderItem, {
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
                },
            },
            on: {
                beforeInit(swiper) {
                    pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc => {
                        const numPages = pdfDoc.numPages;
                        const promises = [];
                        const screenWidth = window.innerWidth;
                        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                            const swiperSlide = document.createElement('div');
                            swiperSlide.className = 'swiper-slide';
                            const canvas = document.createElement('canvas');
                            canvas.className = 'canvas-pdf';
                            swiperSlide.appendChild(canvas);
                            swiper.addSlide(pageNum, swiperSlide)

                            const promise = pdfDoc.getPage(pageNum).then(page => {
                                const viewport = page.getViewport({ scale: screenWidth / page.getViewport({ scale: 1 }).width });
                                const canvasWidth = viewport.width;
                                const canvasHeight = viewport.height;

                                canvas.width = canvasWidth;
                                canvas.height = canvasHeight;

                                const context = canvas.getContext('2d');
                                const renderContext = {
                                    canvasContext: context,
                                    viewport: viewport
                                };
                                return page.render(renderContext);
                            });
                            promises.push(promise);
                        }
                        Promise.all(promises).then(() => {
                            swiper.el.classList.remove('not-ready')
                        });
                    });
                }
            }

        });
    })
})



//Логика для работы табов
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




const serchForm = document.querySelector('#searchform');
const formHistoryList = document.querySelector('#form-history-list');
const searchFild = document.querySelector('.search__input');
const formHistoryBlock = document.querySelector('#form-history');
const seachHistory = () => localStorage.getItem('seachHistory');
const searchCleanBtn = document.querySelector('#search-clean');
searchFild.addEventListener('input', (e) => {
    const inputValue = e.target.value.trim();
    inputValue.length > 0 ? searchCleanBtn.classList.add('show') : searchCleanBtn.classList.remove('show');
});

searchCleanBtn.addEventListener('click', (e) => {
    searchFild.value = '';
    formHistoryBlock.classList.remove('show');
    searchCleanBtn.classList.remove('show');
});
searchFild.addEventListener('focus', () => {
    if (seachHistory() && JSON.parse(seachHistory()).length > 0) {
        formHistoryBlock.classList.add('show');
        renderSearchHistory(seachHistory(), formHistoryList);
    }
});

serchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const submitedInputValue = serchForm.querySelector('.search__input').value.trim();

    let newSeachHistory = [];
    console.log(submitedInputValue !== '');
    if (submitedInputValue !== '') {
        const searchHistoryItem = {
            value: submitedInputValue,
            id: `${submitedInputValue}-${Date.now()}`
        };

        if (seachHistory()) {
            newSeachHistory = [...JSON.parse(seachHistory())];
            if (newSeachHistory.length === 5) {
                newSeachHistory.shift();
                newSeachHistory.push(searchHistoryItem);
            } else {
                newSeachHistory.push(searchHistoryItem);
            }
        }
        else {
            newSeachHistory = [searchHistoryItem];
        }
        newSeachHistory = JSON.stringify(newSeachHistory);
        localStorage.setItem('seachHistory', newSeachHistory);
    }
    serchForm.submit();
});

serchForm.addEventListener('click', e => {
    const target = e.target;
    if (target.closest('[data-clear-history]')) {
        formHistoryBlock.classList.remove('show')
        setTimeout(() => {
            localStorage.removeItem('seachHistory');
            formHistoryList.innerHTML = '';
        }, 250);
    }
    if (target.closest('.form-res__remove-item')) {
        const historyItemId = target.closest('[data-history-item-id]').getAttribute('data-history-item-id');
        const filteredHistory = JSON.parse(seachHistory()).filter(item => item.id !== historyItemId);
        localStorage.setItem('seachHistory', JSON.stringify(filteredHistory));
        if (JSON.parse(seachHistory()).length < 1) {
            formHistoryBlock.classList.remove('show')
        } else {
            renderSearchHistory(seachHistory(), formHistoryList);
        }


    }
    if (target.closest('.form-res__value')) {
        const searchedValue = target.closest('.form-res__value').innerHTML;
        searchFild.value = searchedValue;
        serchForm.submit();
    }
});


function renderSearchHistory(dataArr, renderZone) {
    const historyList = JSON.parse(dataArr).reverse();
    const historyHtmlItems = historyList.map(item => {
        const historyHtmlItem = `
        <li class="form-res__item" data-history-item-id="${item.id}">
        <div class="form-res__value">${item.value}</div>
        <div class="form-res__remove-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.2">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M5.06066 2.93934C4.47487 2.35355 3.52513 2.35355 2.93934 2.93934C2.35355 3.52513 2.35355 4.47487 2.93934 5.06066L7.87868 10L2.93934 14.9393C2.35355 15.5251 2.35355 16.4749 2.93934 17.0607C3.52513 17.6464 4.47487 17.6464 5.06066 17.0607L10 12.1213L14.9393 17.0607C15.5251 17.6464 16.4749 17.6464 17.0607 17.0607C17.6464 16.4749 17.6464 15.5251 17.0607 14.9393L12.1213 10L17.0607 5.06066C17.6464 4.47487 17.6464 3.52513 17.0607 2.93934C16.4749 2.35355 15.5251 2.35355 14.9393 2.93934L10 7.87868L5.06066 2.93934Z"
                        fill="#041327" />
                </g>
            </svg>
        </div>
    </li>`;
        return historyHtmlItem;
    }).join('');
    renderZone.innerHTML = '';
    renderZone.insertAdjacentHTML('afterbegin', historyHtmlItems);
}

document.addEventListener('click', e => {
    const target = e.target;
    const openedSearcHistory = document.querySelector('.search__form-res.show')

    if (openedSearcHistory && !target.closest('.search__form-res.show') && !target.closest('.header__search')) {
        openedSearcHistory.classList.remove('show')
    }
})




const imagesSliders = document.querySelectorAll('.images-slider');
imagesSliders.forEach(imagesSlider => {
    const nextElArrow = imagesSlider.querySelector('.swiper-button-next');
    const prevElArrow = imagesSlider.querySelector('.swiper-button-prev');
    const imagesSliderSwiper = new Swiper(imagesSlider, {
        slidesPerView: 1,
        effect: 'fade',
        speed: 800,
        fadeEffect: {
            crossFade: true
        },
        navigation: {
            nextEl: nextElArrow,
            prevEl: prevElArrow,
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        },
    });
})