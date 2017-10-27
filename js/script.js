$(document).ready(function(){
  $('.change-theme').fancybox();
  $('.change-theme').on('click', function(event){
    event.preventDefault();
    $('.change-theme').fancybox();
  });
  $('.list-value').on('click', function(event){
    event.preventDefault();
    console.log('toogleClass');
    $('#list-value').toggleClass('none');
  })
});

$('.themes').on('change', function() {
  var $current_theme = $(this).attr('value');
  $('.link_stylesheet').attr('href', $current_theme);
});
