/**
 * Created by xiuchengquek on 6/07/15.
 */


angular.module('kingFisherApp').directive('fishplot', function(){
   return {
       restrict : 'E',
       scope : {

           data : '='

       },

       link : function(scope, element, attr){

           console.log('loaded')


           function addGroupMembers(nodes, clusters, data){
               var clusterScore = {};
               angular.forEach(data, function(value, key){
                    angular.forEach(value, function(val, idx){
                        clusterScore[val.cluster]  = clusterScore[val.cluster] || [];
                        clusterScore[val.cluster].push(val.score);
                    });
               });

               angular.forEach(nodes, function(value, idx){
                   var members = clusters[value.mut];
                   value.members = members;
                   value.score = clusterScore[value.mut]
               })
           };

           function fishPlot(source) {

               var data     = source.value;
               var bone     = source.structure;
               var clusters = source.clusters;

               // clear any exisitng plot
               d3.select(element[0]).select("svg").remove();

               // set margins and paramters
               var margin = {top: 40, right: 20, bottom: 20, left: 20},
                   width  = 960 - margin.right - margin.left,
                   height = 400 - margin.top - margin.bottom;

               // create a tree
               var tree = d3.layout.tree().size([height, width]);
               // add node information - this will tell who are the parents and who are the parents
               var nodes = tree.nodes(bone).reverse();

               // convert depth to int f
               nodes = nodes.map(function(d) {d.depth = parseInt(d.depth); return d});
               var depths = nodes.map(function(d) { return d.depth});

               // find the number of layers in the cluster
               var branchingDepth = (_.filter(_.countBy(depths, _.identity), function(v, k) { return v > 1   }));

               // add score and members to each node.



               depths = _.uniq(depths);
               depths.sort(function(a,b){return a-b});
               var timePoints =  Object.keys(data);

               // create a scale in to 2 parts, the first time point will take up half of the width
               // the 2nd part will be divived according to the number of timepoints
               var xScale = d3.scale.ordinal()
                   .domain([1, timePoints.length - 1 ])
                   .rangeRoundBands([width/2, width]);

               var svg = d3.select(element[0]).append("svg")
                   .attr("width", width + margin.right + margin.left)
                   .attr("height", height + margin.top + margin.bottom)
                   .append("g")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

               var main = svg.selectAll("main")
                   .data(timePoints)
                   .enter()
                   .append("g")
                   .classed('timePanel', true)
                   .attr("id", function(d,i) { return i })
                   .attr("transform", function(d, i) { if (i !== 0 ) {return "translate(" + xScale(i) + ")" }})


               main.selectAll("circle")
                   .data(node)
                   .enter()
                   .append("circle")
                   .attr('cx', 10)
                   .attr('cy', 20)
                   .attr('r', 2)
                   .attr('fill', 'red')























                   /**

                var clusters = nodes.map(function(d){ return d.cluster});


                console.log('this is nodes' , nodes, clusters);

                var clusterSize = _.countBy(clusters, function(d) {
                   return d.cluster
               });


                // determine the position of each time point
                var xScale = d3.scale.ordinal()
                .domain(timePoints)
                .rangeBands([0, width]);

                var clusterOrder = nodes.map(function(d) { return d.depth});

                console.log(clusterOrder);
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



                console.log(branchingPoints)
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

                       console.log(sliblingScore);


                       var maxSum = sliblingScore.reduce(function(a,b){ return a + b});


                       // based on the parent adjusted score get the Y value. this will be the maximun range
                       var parentYVar = yScaleTop(x0);






                       // now construct a new scale, that takes in the value of the sum of siblings as the domain
                       // not exceding the rnage of the parent.


                       console.log(maxSum, parentYVar);

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




                       console.log(y0);
                       console.log('this is the y=new yvar', yVar, maxSum, parentYVar);


                       var d2 = d.depth + 1;
                       console.log(d2);


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
                           console.log('this is d in cell', d)
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
                .attr("transform", function(d) { console.log(d);return "translate(" + xScale(d) + ")" })
                .each(plotTimePoint);
                }

                **/
           }

           scope.$watch('data', function(newVal, oldVal){
               if(newVal !== undefined){
                   fishPlot(newVal)

                   console.log(newVal)

                   console.log('called')
               }







           })





       }

   }






});