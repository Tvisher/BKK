

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