angular.module(['kingFisherApp'])
    .directive('boxplot', function () {
        return {
            scope: {
                data: "="
            },
            templateUrl  : 'js/kingfisherApp/directives/templates/boxplot.html',
            link: function (scope, elem, attr) {

                d3.box = function () {
                    var width = 1,
                        height = 1,
                        domain = null,
                        xDomain = null,
                        value = Number,
                        whiskers = boxWhiskers,
                        quartiles = boxQuartiles;


                    // For each small multiple…
                    function box(g) {
                        g.each(function (data, i) {
                            // data looks like this {x : 'mutation' , y : [] }
                            data.y = data.y.sort(d3.ascending);
                            var d = data;
                            var color = data.groupCol

                            var g = d3.select(this),
                                n = d.y.length,
                                min = d.y[0],
                                max = d.y[n - 1];
                            // Compute quartiles. Must return exactly 3 elements.
                            var quartileData = d.quartiles = quartiles(d);

                            g.attr('id', data.x)

                            // Compute whiskers. Must return exactly 2 elements, or null.
                            var whiskerIndices = whiskers && whiskers.call(this, d, i),
                                whiskerData = whiskerIndices && whiskerIndices.map(function (i) {
                                        return d.y[i]
                                    });

                            // Compute outliers. If no whiskers are specified, all data are "outliers".
                            // We compute the outliers as indices, so that we can join across transitions!
                            var outlierIndices = whiskerIndices
                                ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
                                : d3.range(n);

                            // Compute the new x-scale.
                            var x1 = d3.scale.linear()
                                .domain(domain && domain.call(this, d.y, i) || [0, max *1.1])
                                .range([height, 0])
                                .nice();

                            // Update center line: the vertical line spanning the whiskers.
                            var center = g.selectAll("line.center")
                                .data(whiskerData ? [whiskerData] : []);

                            //vertical line
                            center.enter().insert("line", "rect")
                                .attr("class", "center column")
                                .attr("x1", xDomain(d.x) + width / 2)
                                .attr("x2", xDomain(d.x) + width / 2)
                                .style("opacity", 1e-6)

                                .style("opacity", 1)
                                .attr("y1", function (d) {
                                    return x1(d[0]);
                                })
                                .attr("y2", function (d) {
                                    return x1(d[1]);
                                });

                            // Update innerquartile box.
                            var box = g.selectAll("rect.box")
                                .data([quartileData]);

                            box.enter().append("rect")
                                .attr("class", "box column")
                                .attr("x", function () {
                                    return xDomain(d.x)
                                })
                                .attr("width", width)
                                .attr('fill', color)
                                .attr("y", function (d) {
                                    return x1(d[2])
                                })
                                .attr("height", function (d) {
                                    return x1(d[0]) - x1(d[2])
                                })
                            ;
                            // Update median line.
                            var medianLine = g.selectAll("line.median")
                                .data([quartileData[1]]);

                            medianLine.enter().append("line")
                                .attr("class", "median column")
                                .attr("x1", function () {
                                    return xDomain(d.x)
                                })

                                .attr("x2", function () {
                                    return xDomain(d.x) + width
                                })

                                .attr("y1", x1)
                                .attr("y2", x1);

                            // Update whiskers.
                            var whisker = g.selectAll("line.whisker")
                                .data(whiskerData || []);

                            whisker.enter().append("line", "circle, text")
                                .attr("class", "whisker column")
                                .attr("x1", function () {
                                    return xDomain(d.x)
                                })
                                .attr("x2", function () {
                                    return xDomain(d.x) + width
                                })
                                .style("opacity", 1e-6)
                                .attr("y1", x1)
                                .attr("y2", x1)
                                .style("opacity", 1);

                            // Update outliers.
                            var outlier = g.selectAll("circle.outlier")
                                .data(outlierIndices, Number);

                            outlier.enter().insert("circle", "text")
                                .attr("class", "outlier column")
                                .attr("r", 5)
                                .attr("cx", function () {
                                    return xDomain(d.x) + width / 2
                                })
                                .style("opacity", 1e-6)
                                .attr("cy", function (i) {
                                    return x1(d.y[i])
                                })
                                .style("opacity", 1);
                        });
                    }

                    box.width = function (x) {
                        if (!arguments.length) return width;
                        width = x;
                        return box;
                    };

                    box.height = function (x) {
                        if (!arguments.length) return height;
                        height = x;
                        return box;
                    };

                    box.tickFormat = function (x) {
                        if (!arguments.length) return tickFormat;
                        tickFormat = x;
                        return box;
                    };

                    box.duration = function (x) {
                        if (!arguments.length) return duration;
                        duration = x;
                        return box;
                    };

                    box.domain = function (x) {
                        if (!arguments.length) return domain;
                        domain = x == null ? x : d3.functor(x);
                        return box;
                    };

                    box.xDomain = function (x) {
                        if (!arguments.length) return domain;
                        xDomain = x == null ? x : d3.functor(x);
                        return box;
                    };

                    box.value = function (x) {
                        if (!arguments.length) return value;
                        value = x;
                        return box;
                    };

                    box.whiskers = function (x) {
                        if (!arguments.length) return whiskers;
                        whiskers = x;
                        return box;
                    };

                    box.quartiles = function (x) {
                        if (!arguments.length) return quartiles;
                        quartiles = x;
                        return box;
                    };

                    return box;
                };

                function boxWhiskers(d) {
                    return [0, d.y.length];
                }

                function boxQuartiles(d) {
                    return [
                        d3.quantile(d.y, .25),
                        d3.quantile(d.y, .5),
                        d3.quantile(d.y, .75)
                    ];
                }

                function plotBoxPlot(data, order) {

                    d3.select("boxplotPlot").select("svg").remove();

                    var margin = {top: 10, right: 20, bottom: 190, left: 100},
                        height = 500 - margin.top - margin.bottom,
                        width = 480 - margin.left - margin.right;

                    var maxVaf = d3.max(data, function (d) {
                        return d3.max(d.y)
                    });
                    var minVaf = d3.min(data, function (d) {
                        return d3.min(d.y)
                    });

                    var xValues = [];
                    //** implement order if not defined order by median vaf //
                    if (!order) {
                        var findMean = function (arr) {
                            var sum = arr.reduce(function (a, b) {
                                return a + parseFloat(b)
                            });
                            var ave = sum / arr.length;
                            return ave
                        };

                        var mutMeans = [];
                        angular.forEach(data, function (value, key) {
                            var mean = findMean(value.y);
                            mutMeans.push({x: value.x, mean: mean});
                        });
                        mutMeans = mutMeans.sort(function (x, y) {
                            return d3.descending(x.mean, y.mean)
                        });

                        xValues = mutMeans.map(function (x) {
                            return x.x
                        })
                    }
                    else {
                        xValues = order;
                    }

                    var x = d3.scale.ordinal()
                        .domain(xValues)
                        .rangeRoundBands([0, width], 0.7, 0.3);

                    var xMap = x.domain().map(function (d) {
                        return {
                            'item': d,
                            'start': x(d)
                        }

                    });

                    var chart = d3.box()
                        .whiskers(iqr(1.5))
                        .height(height)
                        .domain([0, maxVaf* 1.1])
                        .xDomain(x);

                    var svg = d3.select("boxplotPlot").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("class", "box")
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    // x axis
                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    // the y scale
                    var y = d3.scale.linear()
                        .domain([0, maxVaf * 1.1])
                        .range([height + margin.top, 0 + margin.top])





                    // y axis
                    var yAxis = d3.svg.axis()
                        .scale(y.nice())
                        .tickSize(width)
                        .ticks(3)
                        .orient("right")

                    // draw y axis
                    var gy = svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);

                        gy.selectAll("text")
                            .attr("x", -30)
                            .style("font-size", "18px")
                            .style('stroke-width', '1px');

                        gy.selectAll("line").filter(function(d){ return d;})
                            .style("stroke", "#cccccc");



                    var yAxisLabel = svg
                        .append("g") // and text1
                            .attr("transform", "translate(-50," + height/2 + ")")



                    yAxisLabel.append("text")
                        .style("text-anchor", "middle")
                        .style("font-size", "16px")
                        .text("Variant Allelic Frequency")
                        .style("font-style" , "italic")
                        .style("font-family", "Arial")
                        .style("font-size", "18px")

                        .attr("transform" , "rotate(-90)")
                        //");







                    ;


                    // draw the boxplots
                    svg.selectAll(".box")
                        .data(data)
                        .enter().append("g")
                        .attr('transform', 'translate(0,' + margin.top + ')')
                        .call(chart.width(x.rangeBand()));

                    // add a title
                    /**
                    svg.append("text")
                        .attr("x", (width / 2))
                        .attr("y", 0 + (margin.top / 2))
                        .attr("text-anchor", "middle")
                        .style("font-size", "18px")
                        //.style("text-decoration", "underline")
                        .text("Mutation Profile");

                     **/


                    // draw x axis
                    var gx = svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height + margin.top ) + ")")
                        .call(xAxis)





                        gx.selectAll("text")
                        // text label for the x axis
                        .attr("dy", "0.5em")
                        .attr("dx", "-1em")
                        .attr('id', function (d, i) {
                            return xValues[i];
                        })

                        .style("text-anchor", "end")
                        .attr("transform", "rotate(-65)")
                        .style("font-size", "18px");


                    gx.selectAll('line').filter(function(d) { return (d)}).
                        style('stroke', 'none')


                    function iqr(k) {
                        return function (d, i) {
                            var q1 = d.quartiles[0],
                                q3 = d.quartiles[2],
                                iqr = (q3 - q1) * k,
                                i = -1,
                                j = d.y.length;
                            while (d.y[++i] < q1 - iqr);
                            while (d.y[--j] > q3 + iqr);
                            return [i, j];
                        };
                    }
                }

                scope.$watch('data', function (newVal, oldVal) {
                    if (newVal !== undefined) {
                        console.log('this is the newval' , newVal)
                        plotBoxPlot(newVal);

                    }
                })


            }
        }
    })
