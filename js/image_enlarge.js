$(function() {
    $('.pop').on('click', function() {
        $('.imagepreview').attr('src', $(this).find('img').attr('src'));
       // $('#PostTitle').html(find('#PostName'));
       var text = $('#PostName').text();
        $('#PostTitle').html(text);
        console.log(text);
        $('#imagemodal').modal('show');  
        
    });		
});


