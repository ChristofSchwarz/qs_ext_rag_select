define( ["qlik","jquery", "text!./style.css", "text!./template.html"], function (qlik, $, cssContent, template ) {
  'use strict';
  $("<style>").html(cssContent).appendTo("head");
  return {
		template: template,
		initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 3,
					qHeight : 3333
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1,
					max : 1
				},
				measures : {
					uses : "measures",
					min : 0,
					max : 2
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						i1: {
							label: 'Extension Settings',
							type: 'items',
							items: [
								{
									label: "The dimension defines the labels of the buttons ...",
									component: "text"
								},{
									label: "The 1st measure is a text defines the background-color e.g. =If(Sum(Sales)>10000, 'rgb(70,191,109)', If(Sum(Sales)>5000, 'rgb(253,196,4)', 'rgb(249,109,108)'))",
									component: "text"
								},{
									label: "The 2nd measure is a text that defines the text-color e.g. ='#eee' ...",
									component: "text"
								},{
									ref : "boxCss",
									label : "Add more css styling for each element here",
									type : "string",
									defaultValue : "width:19%;"						
								},{
									ref : "gotoSheet",
									label : "On click, go to Sheet id (leave empty for no sheet navigation)",
									type : "string",
									defaultValue: "next"
								},{
									label: "Open on Github",
									component: "button", 
									action: function(arg) {
										window.open('https://github.com/ChristofSchwarz/qs_ext_rag_select','_blank');
									}
								}
							]
						}
					}
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		paint: function ($element, layout) {
			//setup scope.table
			var app = qlik.currApp(this);
			var dim1 = layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0];
			console.log('Selecting in field: ' + dim1);
			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
				this.$scope.myFunc = function(context) {
					//console.log('myFunc:', context);
					if(layout.gotoSheet.length > 0) {
					    if(layout.gotoSheet=="next") {
							qlik.navigation.nextSheet();
						} else {
							qlik.navigation.gotoSheet(layout.gotoSheet);
						}
					}
					app.field(dim1).selectValues([{qText: context}]);
				}
			}
			return qlik.Promise.resolve();
		},
		controller: ['$scope', function (context) {
			// console.log(context);
		}]
	};

} );
