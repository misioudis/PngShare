$(function () {
    $('.pop').on('click', function () {
        $('.imagepreview').attr('src', $(this).find('img').attr('src'));
        var text = $(this).find("#PostName").html();
        $('#PostTitle').html(text);
        $('#imagemodal').modal('show');
    });
});