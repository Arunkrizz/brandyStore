$(".showInvoice").click(function(){
    $(".invioceModel").show();
  });
  $(".modelClose").click(function(){
    jQuery(this).parent(".invioceModel").hide();
  })
  
  jQuery('.order_tab ul.tabs li').click(function(){
      var tab_id = jQuery(this).attr('data-tab');
  
      jQuery('.order_tab ul.tabs li').removeClass('current');
      jQuery('.tab-content1').removeClass('current');
  
      jQuery(this).addClass('current');
      jQuery("#"+tab_id).addClass('current');
    })
  
  