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
       '<label> <input name="fishPlotScale" type="radio" ng-model="modelType.type" value="noAdjusted" ng-change="changeScale(modelType)"> Make child score a ratio of parent' +

       '<label> <input name="fishPlotScale" type="radio" ng-model="modelType.type" value="ratio" ng-change="changeScale(modelType)"> Make child score a ratio of parent' +

       '<label> <input name="fishPlotScale" type="radio" ng-model="modelType.type" value="ratioParent" ng-change="changeScale(modelType)"> Adjust children score only if sum of children are higher than parent' +
                  '<label> <input name="fishPlotScale" type="radio" ng-model="modelType.type" value="addCutOff" ng-change="changeScale(modelType)"> Adjust children score as percentage of parent' +
                  '<label ng-show="modelType.type === \'addCutOff\'"><input name"cutoffValue" type="text" ng-model="modelType.value" ng-change="changeScale(modelType">' +
       '</form>',

       controller: function($scope){
           $scope.modelType = {}


           $scope.changeScale = function(modelType){
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

               console.log(x0,x1,x2,x3,x4,y1,y2,y3,y4)


               // to maintain reference
               node.linePoints[0].x  = x0, node.linePoints[0].y  = y0;
               node.linePoints[1].x  = x1, node.linePoints[1].y  = y1;
               node.linePoints[2].x  = x2, node.linePoints[2].y  = y2;
               node.linePoints[3].x  = x3, node.linePoints[3].y  = y3;
               node.linePoints[4].x  = x4, node.linePoints[4].y  = y4;






           }



           function childrenRecursion (node){


           }

           function reAdjustBranches(node, tpName) {

               console.log(node)
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


               //console.log(node.children[0], node)
           }


           function reAdjustStart (nodes, centerPoint){
               if (nodes.parent){
                   var parentOffSet = centerPoint - nodes.parent.linePoints[0].y;

                   console.log(parentOffSet)
                   angular.forEach(nodes.linePoints, function(d, i){
                       nodes.linePoints[i].y = d.y - parentOffSet;
                   });
               }




           }
           /**
               var parentOffSet = 0;
               if (node.branching){
                   var parentCenter = node.parent.linePoints[0].y;
                   parentOffSet = parentCenter - metrics.height /2 ;

               }



               if (node.branchingOrder > 0) {


                   node.parent.children = _. sortBy(node.parent.children, 'branchingOrder');

                   var currentOrder = node.branchingOrder;
                   var siblings = node.parent.children.slice(0, currentOrder  )


                   var nodeHeight = y3 - y2;

                   angular.forEach(siblings, function(value, idx){



                       node.parent.children[idx].linePoints[2].y = value.linePoints[2].y - (nodeHeight/2);
                       node.parent.children[idx].linePoints[4].y = value.linePoints[4].y - (nodeHeight/2);
                       node.parent.children[idx].linePoints[1].y = value.linePoints[1].y - (nodeHeight/2);
                       node.parent.children[idx].linePoints[3].y = value.linePoints[3].y - (nodeHeight/2);
                       node.parent.children[idx].linePoints[0].y = value.linePoints[0].y - (nodeHeight/2);




                   });


                   node.linePoints[2].y = node.linePoints[2].y+  (nodeHeight/2);
                   node.linePoints[4].y = node.linePoints[4].y+  (nodeHeight/2);
                   node.linePoints[1].y = node.linePoints[1].y+  (nodeHeight/2);
                   node.linePoints[3].y = node.linePoints[3].y+  (nodeHeight/2);
                   node.linePoints[0].y = node.linePoints[0].y+  (nodeHeight/2);



               }
           }
            s**/



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
                   parseFirstTimePoint(d, timePoint[0], metrics)
               });

               angular.forEach(data, function(d, i ){
                   reAdjustBranches(d, timePoint[0])
               });
/**
               angular.forEach(data, function(d, i){
                   reAdjustStart(d, height /2 )
               });
**/






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













                   /**

                var clusters = nodes.map(function(d){ return d.cluster});



                var clusterSize = _.countBy(clusters, function(d) {
                   return d.cluster
               });


                // determine the position of each time point
                var xScale = d3.scale.ordinal()
                .domain(timePoints)
                .rangeBands([0, width]);

                var clusterOrder = nodes.map(function(d) { return d.depth});

                // add one more depth to work as padding for linear scale
                var depthsScale=  d3.extent(depths);

                depthsScale[1] = depthsScale[1] + 1;



                var xScaleTime = d3.scale.linear()
                .domain(depthsScale)
                .range([0, xScale.rangeBand()]);

                var branchingPoints = _.countBy(nodes, function(n) { return n.depth});

                // find the at which depth branching is required.
                branchingPoints = Object.keys(_.pick(branchingPoints, function(d){ return d > 1}));

                branchingPoints = branchingPoints.map(function(n){return parseInt(n)})



                // finding the yMax, which is detremined by the vaf score
                var yMax = d3.max(nodes, function(n) {
                    return d3.max(n.cluster.score, function(d) { return d.x  })
               });


                // now we need to buy the yScale; this will be a linear scale, but modification will have to be done later
                // we need 2 yscales here a lower one to measure the lower end, and a higher one to measure the higher end ,
                // this can be simply done by flippign the domain.
                var yScaleTop = d3.scale.linear()
                .domain([0, yMax])
                .range([0,height ]);


                var _yScaleTop= yScaleTop.copy();


                var yScaleBottom = d3.scale.linear()
                .domain([0, yMax])
                .range([height,0]);

                // the different between the normal link node and a fishplot is that branching do not happen at the same time,
                // therefore the value of x must change accordingly as well as the y value.
                // The yvalue should change according to the vaf score.


                // there are 5 time point to each. ( polygon )

                function constructPath(d, tp){


                //check if timepoint is part of a branching event
                   var center  = height /2;


                   if (branchingPoints.indexOf(d.depth) === -1) {
                       var y0,x0;

                       if (!d.parent)  {
                           d.cluster.score[tp].y0 = center;
                           x0 = d.cluster.score[tp].x;
                           d.cluster.score[tp].x0 = x0;
                           y0 = center;
                       }
                       else {

                           y0  = d.parent.cluster.score[tp].y0;
                           x0 = d.cluster.score[tp].x;
                           d.cluster.score[tp].y0 = y0;
                           d.cluster.score[tp].x0 = x0;


                       };

                       var d2 = d.depth + 1;
                       var yVar = yScaleTop( x0) / 2;

                       t0 = {x: xScaleTime(d.depth), y: y0};
                       t1 = {x: xScaleTime(d2), y: y0 - yVar};
                       t2 = {x: xScaleTime(depthsScale[1]), y: t1.y};
                       t3 = {x: t2.x, y: yVar + y0}
                       t4 = {x: t1.x, y: t3.y};
                       t5 = t0;


                   } else {
                       var y0;



                       // get the parent vaf score
                       var pScore = d.parent.cluster.score[tp].x;

                       // get the parent adjusted x0 score
                       var x0 = d.parent.cluster.score[tp].x0;

                       // get all children of parent
                       var sibling = d.parent.children;

                       // get all the sibling scores including itself
                       var sliblingScore = sibling.map(function(n){ return n.cluster.score[tp].x});



                       var maxSum = sliblingScore.reduce(function(a,b){ return a + b});


                       // based on the parent adjusted score get the Y value. this will be the maximun range
                       var parentYVar = yScaleTop(x0);






                       // now construct a new scale, that takes in the value of the sum of siblings as the domain
                       // not exceding the rnage of the parent.



                       var yScale = d3.scale.linear().domain([0,maxSum]).range([0, parentYVar]);


                       // find the current value of the node by take a ratio of the total value
                       var yVar = yScale(d.cluster.score[tp].x );


                       // now store the yVar into the current node.

                       // get all of the same of x0 else return 0
                       var sliblingAdjusted = sibling.map(function(n){ return n.cluster.score[tp].x0 || 0})

                       y0 = sliblingAdjusted.reduce(function(a, b){ return a + b});



                       // the same of yVar should there for be the same of the sliblings
                       d.cluster.score[tp].x0 = yVar;

                       y0 = (yVar/2) + y0 ;

                       d.cluster.score[tp].y0 = y0;






                       var d2 = d.depth + 1;


                       t0 = {x: xScaleTime(d.depth), y: y0};
                       t1 = {x: xScaleTime(d2), y: y0 - yVar};
                       t2 = {x: xScaleTime(depthsScale[1]), y: t1.y};
                       t3 = {x: t2.x, y: yVar + y0};
                       t4 = {x: t1.x, y: t3.y};
                       t4 = {x: t1.x, y: t3.y};
                       t5 = t0;


                   }



                   var path = [ t0, t1, t2, t3, t4, t5 ];

                   var pathString = [];

                   angular.forEach(path, function(d, index){

                       if (index === 0){
                           var line = ['M' , d.x, d.y];
                           line = line.join(' ');
                           pathString.push( line );


                       }
                       else {
                           var line = ['L' , d.x, d.y];
                           line = line.join( ' ')
                           pathString.push(line)
                       }


                   }, pathString)



                   return pathString.join(' ')













               }


                function plotTimePoint(p){


                   var cell = d3.select(this);
                   var timePoint = cell.attr('id');


                   cell.selectAll("path")
                       .data(nodes)
                        .enter()
                        .append("path")
                       .attr('d', function(d){ if (timePoint  == 0) {
                           return constructPath(d, timePoint)
                       }

                       })

                       // y should check parent

                       .attr('fill' , function(d) {  return d.cluster.cluster})






               }


                var svg = d3.select("fishPlot").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                var main = svg.selectAll("main")
                .data(timePoints)
                .enter()
                .append("g")
                .attr("id", function(d,i) { return i })
                .attr("transform", function(d) { return "translate(" + xScale(d) + ")" })
                .each(plotTimePoint);
                }

                **/
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