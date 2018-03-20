/* global AutoForm, _, Template */
businessHoursManager = null;

AutoForm.addInputType("businessHours", {
  template: "afBusinessHours",
  valueOut: function() {
    console.log(businessHoursManager.serialize());
    if (businessHoursManager) {
      return businessHoursManager.serialize();
    } else {
      return [
        {
          isActive: false,
          timeFrom: '',
          timeTill: ''
        }
      ];
    }
  },
});

Template.afBusinessHours.helpers({
  atts: function () {
    var data = Template.currentData(); // get data reactively
    var atts = data.atts;
    return atts;
  }
});


Template.afBusinessHours.onRendered(function() {
  var self = this;
  Tracker.autorun(function() {

    var options = {};

    if (self.data.value) {
      options.operationTime = self.data.value;
    }

    businessHoursManager = $("#businessHoursContainer").businessHours(options);

    $('[name=startTime]').mask("00:00",{ "placeholder": "hh:mm" });
    $('[name=endTime]').mask("00:00",{ "placeholder": "hh:mm" });
  });
});

// var calculateOptions = function(data){
//   var schemaMinMax = _.pick(data, 'max', 'min');
//   var autoformOptions = _.pick(data.atts || {}, 'max', 'min', 'step', 'start', 'range');
//   var noUiSliderOptions = (data.atts || {}).noUiSliderOptions;

//   var options = _.extend({}, schemaMinMax, autoformOptions, noUiSliderOptions);

//   // Adjust data initialization based on schema type
//   if( options.start === undefined ){
//     if( data.schemaType.name === "Object" ){
//       if( data.value && data.value.lower ){
//         options.start = [
//           data.value.lower,
//           data.value.upper
//         ];
//       }else{
//         options.start = [
//           typeof data.min === "number" ? data.min : 0,
//           typeof data.max === "number" ? data.max : 100
//         ];
//       }
//       options.connect = true;
//     }else{
//       options.start = data.value || 0;
//     }
//   }

//   if( options.range === undefined ){
//     options.range = {
//       min: typeof options.min === "number" ? options.min : 0,
//       max: typeof options.max === "number" ? options.max : 100
//     };
//   }

//   delete options.min;
//   delete options.max;

//   // default step to 1 if not otherwise defined
//   if( options.step === undefined ){
//     options.step = 1;
//   }

//   options.slide = function() {
//     return false;
//   }

//   return options;
// };

// Template.afNoUiSlider.rendered = function () {
//   var template = this;
//   var $s = template.$('.nouislider');

//   var setup = function(c){
//     var data = Template.currentData(); // get data reactively
//     var options = calculateOptions( data );
//     var sliderElem = $s[0];

//     if(sliderElem.noUiSlider) {
//       sliderElem.noUiSlider.updateOptions(options, true);
//     }
//     else {
//       noUiSlider.create(sliderElem, options);
//     }

//     if (c.firstRun) {
//       sliderElem.noUiSlider.on('slide', function(){
//         // This is a trick to fool some logic in AutoForm that makes
//         // sure values have actually changed on whichever element
//         // emits a change event. Eventually AutoForm will give
//         // input types the control of indicating exactly when
//         // their value changes rather than relying on the change event
//         // console.log(sliderElem.noUiSlider.get());
//         // console.log(template.data);
//         // console.log(sliderElem.noUiSlider.get());
//         // console.log(template.data.min);


//         if(sliderElem.noUiSlider.get()<template.data.min) {
//           sliderElem.noUiSlider.set(template.data.min);
//         } else {
//           $s.parent()[0].value = JSON.stringify(sliderElem.noUiSlider.get());
//           $s.parent().change();
//           $s.data('changed','true');
//         }

//         // if (parseInt(sliderElem.noUiSlider.get()) < parseInt(template.data.min)){
//         //   return false;
//         //   sliderElem.noUiSlider.val("90");
//         // } else {
//         //   $s.parent()[0].value = JSON.stringify(sliderElem.noUiSlider.get());
//         //   $s.parent().change();
//         //   $s.data('changed','true');
//         // }
//       });
//     }

//     if( data.atts.noUiSlider_pipsOptions ){
//       sliderElem.noUiSlider.pips(
//           data.atts.noUiSlider_pipsOptions
//       );
//     }
//   };

//   template.autorun( setup );
// };
