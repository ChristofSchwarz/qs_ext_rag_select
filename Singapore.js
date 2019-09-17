define( ["qlik","jquery", "text!./style.css", "text!./template.html"], function (qlik, $, cssContent, template ) {'use strict';
    $("<style>").html(cssContent).appendTo("head");
	return {
       template: template,
       initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 2,
					qHeight : 500
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
					min : 1,
					max : 1
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
									ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
									label : "Initial fetch rows",
									type : "number",
									defaultValue : 500
								},
								{
									ref : "boxCss",
									label : "CSS style for item",
									type : "string",
									defaultValue : "width:19%;"						
								},
								{
									ref : "gotoSheet",
									label : "Go to Sheet id",
									type : "string",
									defaultValue: "next"
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
