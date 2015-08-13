/**
 * Created by xiuchengquek on 6/07/15.
 */


angular.module('kingFisherApp').directive('fishplot', function(){
   return {
       restrict : 'E',
       scope : {

           data : '=',
           modelType : '='

       },
       template : '<form name="fishPlotConfiguration"> ' +

           '<h3> X Axis Configuration </h3>' +

                '<label> <input name="fishPlotXScale" type="radio" ng-model="modelType.xScale" value="fishBoneOrder" ng-change="changeXScale(modelType)"> Use Order in FishBone as determinant </label>' +
                '<label ng-show="modelType.xScale === \'fishBoneOrder\'"><input name"cutoffValue" type="text" ng-model="modelType.value" ng-change="changeScale(modelType"> </label>' +
                '<label> <input name="fishPlotXScale" type="radio" ng-model="modelType.xScale" value="vafScore" ng-change="changeXScale(modelType)"> Use VAF score as determinant </label>' +
                '<label ng-show="modelType.xScale === \'vafScore\'"><input name"cutoffValue" type="text" ng-model="modelType.value" ng-change="changeScale(modelType"> </label>' +

       '</form>',

       controller: function($scope){
           $scope.modelType = {}


           $scope.changeXScale = function(modelType){
               $scope.$broadcast('scaleChanged', $scope.modelType)
           }
      },




       link : function(scope, element, attr, ctrl){

           // parental xScale
           var pScale;

           function adjustByRatio(node, tpName){
               if (node.parent) {
                   var parentAdjustedScore    = node.parent.adjustedScore[tpName];
                   var nodeScore              = node.score[tpName];
                   node.adjustedScore[tpName] = parentAdjustedScore * nodeScore;
               }
           }



           function adjustByCutOff(node, tpName, cutOff){
               if (node.parent) {
                   var parentAdjustedScore    = node.parent.adjustedScore[tpName];

                   var parentalFactor = parentAdjustedScore / node.parent.score[tpName];
                   var nodeScore              = node.score[tpName];
                   node.adjustedScore[tpName] = nodeScore * parentalFactor * cutOff  ;
               }
           }


           function adjustBranching(node) {








           }




           function parseFirstTimePoint(node, tpName, metrics  ) {

               /**
                *
                *     x1_ _ _x2
                *    /
                * x0/
                *   \
                *    \x4_ _ _x3
                *
                */

               // this function should return 6 points
               var x0, x1, x2, x3, x4;
               var y0, y1, y2, y3, y4;

               var nodeDepth = Number(node.depth);

               var xScale0 = metrics['xScale0'];

               var endPoint = metrics.width / 2;
               // first time point scale, the first x value is based o

               // add a pseudo depth to add some spacing
               var xScale1 = d3.scale.linear()
                   .domain(d3.extent(metrics.depth))
                   .range([100, endPoint]);





               var yTopScale = d3.scale.linear()
                   .domain([0, metrics.xMax0])

               var yBottomScale = d3.scale.linear()
                   .domain([0, metrics.xMax0])

               x0 = xScale1(nodeDepth), y0 = metrics.height / 2;
               var yTopScale = d3.scale.linear()
                   .domain([0, metrics.xMax0])
                   .range([metrics.height / 2, 0]);

               var yBottomScale = d3.scale.linear()
                   .domain([0, metrics.xMax0])
                   .range([metrics.height / 2, metrics.height]);


               // adjusted score for parents
               node.adjustedScore         = node.adjustedScore || {};
               node.adjustedScore[tpName] = node.score[tpName];


               //adjustByRatio(node, tpName);;
               adjustByCutOff(node, tpName, 1)


               // Get current score
               var currentScore = node.adjustedScore[tpName];

               if (node.children) {

                   var children = node.children;
                   // find the next children (ordered by score )
                   var nearestChildScore = d3.max(children, function (d) {
                       return d.score[tpName]
                   });
                   x1 = xScale1(nodeDepth + 1), y1 = yTopScale(currentScore);
               }
               else {
                   x1 = xScale1(nodeDepth + 1), y1 = yTopScale(currentScore)
               }


               x2 = endPoint , y2 = y1;
               x3 = x2, y3 = yBottomScale(currentScore);
               x4 = x1, y4 = y3;

               // to maintain reference
               node.linePoints[0].x  = x0, node.linePoints[0].y  = y0;
               node.linePoints[1].x  = x1, node.linePoints[1].y  = y1;
               node.linePoints[2].x  = x2, node.linePoints[2].y  = y2;
               node.linePoints[3].x  = x3, node.linePoints[3].y  = y3;
               node.linePoints[4].x  = x4, node.linePoints[4].y  = y4;






           }


           function parseByScore(node, tpName, metrics  ) {

               /**
                *
                *     x1_ _ _x2
                *    /
                * x0/
                *   \
                *    \x4_ _ _x3
                *
                */

               // this function should return 6 points
               var x0, x1, x2, x3, x4;
               var y0, y1, y2, y3, y4;

               var nodeDepth = Number(node.depth);

               var xScale0 = metrics['xScale0'];

               var endPoint = metrics.width / 2;
               // first time point scale, the first x value is based o

               // add a pseudo depth to add some spacing
               var xScale1 = d3.scale.linear()
                   .domain([metrics.xMax0, 0])
                   .range([100, endPoint]);

               var yTopScale = d3.scale.linear()
                   .domain([0, metrics.xMax0])
                   .range([metrics.height / 2, 0]);

               var yBottomScale = d3.scale.linear()
                   .domain([0, metrics.xMax0])
                   .range([metrics.height / 2, metrics.height]);




               node.adjustedScore         = node.adjustedScore || {};
               node.adjustedScore[tpName] = node.score[tpName];


               //adjustByRatio(node, tpName);;
               adjustByCutOff(node, tpName, 1)



               // Get current score
               var currentScore =  node.score[tpName]


               x0 = xScale1(currentScore), y0 = metrics.height / 2;

               if (node.children) {
                   node.score[tpName]
                   var children = node.children;
                   // find the next children (ordered by score )
                   var nearestChildScore = d3.max(children, function (d) {
                       return d.score[tpName]
                   });

                                       x1 = xScale1(currentScore * 0.8), y1 = yTopScale(currentScore);
               }
               else {
                   x1 = xScale1(currentScore * 0.8 ), y1 = yTopScale(currentScore)
               }


               x2 = endPoint , y2 = y1;
               x3 = x2, y3 = yBottomScale(currentScore);
               x4 = x1, y4 = y3;



               // to maintain reference
               node.linePoints[0].x  = x0, node.linePoints[0].y  = y0;
               node.linePoints[1].x  = x1, node.linePoints[1].y  = y1;
               node.linePoints[2].x  = x2, node.linePoints[2].y  = y2;
               node.linePoints[3].x  = x3, node.linePoints[3].y  = y3;
               node.linePoints[4].x  = x4, node.linePoints[4].y  = y4;
           }


           function reAdjustBranches(node, tpName) {

                              if (node.children) {

                   if (node.children) {


                       var siblingSum = _.sum(node.children.map(function (d) {
                           return d.score[tpName]
                       }));
                       var nodePoints = node.linePoints;
                       var nodeHeight = nodePoints[3].y - nodePoints[2].y;

                       var scaleYParent = d3.scale.linear()
                           .domain([0, siblingSum])
                           .range([10, nodeHeight - 10]);

                       var childrenHeight = node.children.map(function (d) {
                           return scaleYParent(d.score[tpName])
                       });


                       var offset = nodePoints[1].y;


                       angular.forEach(node.children, function (value, idx) {

                           var childHeight = childrenHeight[idx];
                           if (idx === 0) {
                               node.children[idx].linePoints[0].y = offset + childHeight / 2;
                               node.children[idx].linePoints[1].y = offset + 10 ;
                               node.children[idx].linePoints[2].y = offset + 10 ;
                               node.children[idx].linePoints[3].y = offset + childHeight ;
                               node.children[idx].linePoints[4].y = offset + childHeight ;

                           }

                           else {
                               var accumulatedSum = _.sum(childrenHeight.slice(0,idx));
                               var childHeight = childrenHeight[idx];

                               node.children[idx].linePoints[0].y = offset + accumulatedSum + childHeight / 2;
                               node.children[idx].linePoints[1].y = offset + 10 + accumulatedSum;
                               node.children[idx].linePoints[2].y = offset + 10 + accumulatedSum;
                               node.children[idx].linePoints[3].y = offset + accumulatedSum + childHeight -10 ;
                               node.children[idx].linePoints[4].y = offset + accumulatedSum + childHeight -10 ;

                           }


                       })




                   }




               }


           }


           function reAdjustStart (nodes, centerPoint){
               if (nodes.parent){
                   var parentOffSet = centerPoint - nodes.parent.linePoints[0].y;

                                      angular.forEach(nodes.linePoints, function(d, i){
                       nodes.linePoints[i].y = d.y - parentOffSet;
                   });
               }




           }

           function adjustScore(data) {
               angular.forEach(data, function(value, index){
                   if (value.parent){
                       angular.forEach(value.score, function(val, timePoint){
                           // readjust score according to parent score
                           value.score[timePoint] = value.score[timePoint] / value.parent.score[timePoint]
                       });
                   }
               })
           };

           function constructPath(d, tp, tpName, metrics){
                if (tp == 0){
                    parseFirstTimePoint(d, tpName, metrics);
                    reAdjustBranches(d, tpName)
                }
           };


           function joinPath(node){


               var pathString = [];

               angular.forEach(node.linePoints, function (d, index) {
                   if (index === 0) {
                       var line = ['M', d.x, d.y];
                       line     = line.join(' ');
                       pathString.push(line);
                   }
                   else {
                       var line = ['L', d.x, d.y];
                       line     = line.join(' ');
                       pathString.push(line)
                   }
               }, pathString);
               return pathString.join(' ')

           }

           function plotPanel(p, data, metrics){
               //var maxScore = d3.max(data, function(d) {return d.score[tpName]});
               //var minScore = d3.min(data, function(d){ return d.score[tpName]});

               var panel = d3.select(p);
               var tp = panel.attr('id');
               var tpName = panel.attr('name');

               panel.selectAll("path")
                   .data(data)
                   .enter()
                   .append('path')
                   .attr('d', function(d, i, arr) {
                    return joinPath(d)

                   })
                   .attr('fill', function(d){
                       return d.mut
                   })
                   .attr('name', function(d){return d.mut})
           }



           function fishPlot(source) {
               var data = source.value;
               var timePoint = source.timePoint;


               data = _.sortBy(data, ['depth', 'branchingOrder']);


               angular.forEach(data, function(d, idx){

                   d.linePoints = [
                       {'x': 0, 'y': 0 },
                       {'x': 0, 'y': 0 },
                       {'x': 0, 'y': 0 },
                       {'x': 0, 'y': 0 },
                       {'x': 0, 'y': 0 }]


               });


               //adjust data to fit make children fit into parents

               // clear any exisitng plot
               d3.select(element[0]).select("svg").remove();

               // set margins and paramters
               var margin = {top: 0, right: 20, bottom: 20, left: 20},
                   width  = 960 - margin.right - margin.left,
                   height = 400 - margin.top - margin.bottom;

               var center = height / 2;
               // find the y max
               //var yMax = d3.max(data, function(d){ return d3.max(_.values(d.score)) });
               // get the root node




               var depth = _.uniq(data.map(function(d){ return Number(d.depth)}));
               var addDepth = d3.max(depth) + 1;
               depth.push(addDepth);







               var root =  data.map(function(d){ return d.depth == 0});

               // The ymax is dependent on the max of the root mutation (parent)
               var yMax = d3.max(_.values(root.score));

               // this is the yScale, the range will depend on the location of the child
               var yScale0 = d3.scale.linear()
                                .domain([0.0, yMax]);

               // get the max value for the first time point
               var xMax0 = d3.max(data.map(function(d) { return d.score[timePoint[0]] }));
               // create a scale in to 2 parts, the first time point will take up half of the width
               // the 2nd part will be divived according to the number of timepoints

               var xScale0 = d3.scale.ordinal()
                   .domain(timePoint.slice(-(timePoint.length - 1)))
                   .rangeRoundBands([width/2, width]);

               // store yMax, center, yScale0 and xScale0 into a single object for passing around
               var metrics = {
                   'yMax': yMax,
                   'height' : height,
                   'width' : width,
                   'yScale0': yScale0,
                   'xScale0': xScale0,
                   'xMax0'  : xMax0,
                   'depth' : depth
               };



               angular.forEach(data, function(d, i){
                   parseByScore(d, timePoint[0], metrics)
               });

               angular.forEach(data, function(d, i ){
                   reAdjustBranches(d, timePoint[0])
               });

               var svg = d3.select(element[0]).append("svg")
                   .attr("width", width + margin.right + margin.left)
                   .attr("height", height + margin.top + margin.bottom)
                   .append("g")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

               var main = svg.selectAll("g.timePanel")
                   .data(timePoint)
                   .enter()
                   .append("g")
                   .classed('timePanel', true)
                   .attr("id", function(d,i) { return i })
                   .attr('name', function(d, i) {return d})
                   .attr("transform", function(d, i) { if (i !== 0 ) {return "translate(" + xScale0(d) + ")" }})
                   .each(function(d, i) { plotPanel(this, data, metrics)});












           }

           scope.$watchCollection('data', function(newVal, oldVal){
               if(newVal !== undefined){
                   fishPlot(newVal);
               }
           })

           scope.$on('scaleChange', function(event, val){


           })









       }

   }






});