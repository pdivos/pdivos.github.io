// A wrapper around datatables that loads it dynamically
 // https://jqueryui.com/widget/
 // http://code.tutsplus.com/tutorials/coding-your-first-jquery-ui-plugin--net-9460
 (function($) {
 
 $.widget( "ui.myhandsontable", {
   options: {
     handsontableOptions: undefined, // options to pass to handsontable on initialization
     validationFunction: undefined,  // function that takes data as input and returns a string that starts with OK if the data is valid and Error if it is not, folloed by some message
     onSubmit: undefined             // function that will be called when data is valid and user presses OK button, takes data as input
   },
 
   // the constructor
   _create: function() {
     if (undefined == this.options.handsontableOptions) throw "Please specify options.handsontableOptions when initializing mydatatable.";
     if (undefined == this.options.validationFunction) throw "Please specify options.validationFunction when initializing mydatatable.";
     if (undefined == this.options.onSubmit) throw "Please specify options.onSubmit when initializing mydatatable.";
     if (undefined == this.options.buttonLabel) this.options.buttonLabel = "OK";
     if (undefined == this.options.buttonCssLeft) this.options.buttonCssLeft = "0px";
     if (undefined == this.options.buttonCssTop) this.options.buttonCssTop = "0px";
     this.element.html("\
       <div id='"+this.element.attr('id')+"-hot'></div>\
       <div id='"+this.element.attr('id')+"-status'></div>\
       <button type='button' class='btn btn-primary' id='"+this.element.attr('id')+"-button'>"+this.options.buttonLabel+"</button>\
     ");
     this.button = $("button#"+this.element.attr('id')+"-button");
     this.button.css({
        position: "relative",
        top: this.options.buttonCssTop,
        left: this.options.buttonCssLeft
    });
     this.button.hide();
     container = $("div#"+this.element.attr('id')+"-hot")[0];
     this.hot = new Handsontable(container, this.options.handsontableOptions);
     var This = this;
     var validate = function() {
       data = This.hot.getData();
       msg = This.options.validationFunction(data);
       $("div#"+This.element.attr('id')+"-status").text(msg);
       if(msg.indexOf('OK')===0) This.button.show();
       else This.button.hide();
     }
     this.button.click(function(){
       This.options.onSubmit(This.hot.getData());
     });
     this.hot.addHook('afterChange', function(changes, source) {
       validate();
     });
     validate();
   },
 
   // called when created, and later when changing options
   _refresh: function() {
   },
 
   // events bound via _on are removed automatically
   // revert other modifications here
   _destroy: function() {
     this.element.html("");
   },
 
   // _setOptions is called with a hash of all options that are changing
   // always refresh when changing options
   _setOptions: function() {
     // _super and _superApply handle keeping the right this-context
     this._superApply( arguments );
     this._refresh();
   },
 
   // _setOption is called for each individual option that is changing
   _setOption: function( key, value ) {
     this._super( key, value );
   }
 });
 
 })(jQuery);