// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require handlebars.runtime
//= require_tree ./templates
//= require turbolinks
//= require_tree .



var Callbacks = (function() {

 var createSite = function(user_url, data) {
      // Make .ajax request here -- doing http request
        var authParam = $('meta[name=csrf-param]').attr('content');
        var authToken = $('meta[name=csrf-token]').attr('content');
        data[authParam]= authToken;
        $.ajax({
          type: "POST",
          url: user_url,
          data: data}).then(postSuccessHandler, postFailureHandler);
  };

var addNewUrlToTable = function(url, httpResponse) {
   // var source = "<tr> <td><a href={{url}} >{{url}}</a></td> <td> {{httpResponse}} </td> </tr>";
   // handlebars.compile is a js function which takes a template as a string and returns it as a template function
   // var template = Handlebars.compile(source);
   var data = {url: url, httpResponse: httpResponse};
   $('#siteTable').append(HandlebarsTemplates.sites(data));
   $("#siteInput").val("");
 };

 var postSuccessHandler = function(response) {
     // Call addNewUrlToTable and insert the results
     Callbacks.addNewUrlToTable(response.url,response.http_response);

 };

 var postFailureHandler  = function(jqXHR) {
     alert("EPIC FAIL!");
     // The request failed.
 };

 var onSubmitSiteClickHandler =  function() {
     // grabs value from input field
     var site = $('#siteInput').val();

     // give me attribute of meta content
     var authParam = $('meta[name=csrf-param]').attr('content');
     var authToken = $('meta[name=csrf-token]').attr('content');


     var data = {};
     data[authParam] = authToken;
     data.site = {url: site};

     Callbacks.createSite("/sites.json", data);
     // We have the site, now call create site
     // to make the request
 };
 return {
  postSuccessHandler: postSuccessHandler,
  postFailureHandler: postFailureHandler,
  onSubmitSiteClickHandler: onSubmitSiteClickHandler,
  createSite: createSite,
  addNewUrlToTable: addNewUrlToTable
 };  
})();

$(window).load(function() {
  $("<label>New Site</label><br /><input type=\"text\" id=\"siteInput\"></input><button id=\"checkSite\">Check Site</button>").insertBefore("#siteTable"); 
  $('#checkSite').click(Callbacks.onSubmitSiteClickHandler);
});