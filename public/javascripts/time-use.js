
var USER_SPEED = "fast";

var width = 1080,
    height = 1000,
	padding = 1,
	maxRadius = 3;
	// color = d3.scale.category10();
	
var sched_objs = [],
	curr_minute = 0;

var act_codes = [
	{"index": "-1", "short": "Idle", "desc": "Idle", 
		"src":"",
		"url":""
		//"src":"https://images-cn.ssl-images-amazon.com/images/I/51R-Xi5wS9L._AC_SS150_.jpg", 
		//"url":"https://www.amazon.cn/dp/B01MSACOEI/"
	},
	{"index": "193", "short": "Apparel", "desc": "Apparel", 
		"src":"https://images-cn.ssl-images-amazon.com/images/I/41gwMQg%2BOTL._SL150_.jpg",
		"url":"https://www.amazon.cn/%E5%A5%B3%E8%A3%85/b/ref=sv_sa_1?ie=UTF8&node=2152154051"
	},
	{"index": "325", "short": "Grocery", "desc": "Eating and Drinking", 
		"src":"https://images-cn.ssl-images-amazon.com/images/I/517zMLv3ltL._AC_SR300,300_.jpg",
		"url":"https://www.amazon.cn/%E9%A3%9F%E5%93%81/b/ref=sa_menu_top_grocery_l1?ie=UTF8&node=2127215051"
	},
	{"index": "121", "short": "Health & Personal Care", "desc": "Health", 
		"src":"https://images-cn.ssl-images-amazon.com/images/I/51ruSSf3TOL._AC_SR300,300_.jpg",
		"url":"https://www.amazon.cn/%E4%B8%AA%E6%8A%A4%E5%81%A5%E5%BA%B7/b/ref=sa_menu_top_health_l1?ie=UTF8&node=852803051"
	},
	{"index": "309", "short": "Shoes", "desc": "Shoes", 
		"src":"https://images-cn.ssl-images-amazon.com/images/I/41sxiPVQFBL._SL260_SX200_CR0,0,200,260_.jpg",
		"url":"https://www.amazon.cn/b?ie=UTF8&node=2154234051"
	},
	{"index": "201", "short": "Home", "desc": "Household goods", 
		"src":"https://images-cn.ssl-images-amazon.com/images/I/41CRf-hiP1L._SX165_.jpg",
		"url":"https://www.amazon.cn/%E5%AE%B6%E5%B1%85%E7%94%A8%E5%93%81/b/ref=sa_menu_top_home_l1?ie=UTF8&node=831780051"
	},
	{"index": "75", "short": "Baby", "desc": "Caring for babys", 
		"src":"https://images-cn.ssl-images-amazon.com/images/I/412sk7APb4L._AC_SR300,300_.jpg",
		"url":"https://www.amazon.cn/b/ref=sa_menu_top_baby_l1?ie=UTF8&node=42692071"
	},
	{"index": "194", "short": "Beauty", "desc": "Caring for beauty",
		"src":"https://images-cn.ssl-images-amazon.com/images/G/28/2015/xuefyuan/beauty_500500_meifa._CB521998896_AC_SR300,300_.jpg",
		"url":"https://www.amazon.cn/b/ref=sa_menu_top_beauty_l1?ie=UTF8&node=746776051"
	},
	{"index": "79", "short": "Kitchen", "desc": "Consumer Purchases",
		"src":"https://images-cn.ssl-images-amazon.com/images/I/31EMIgb3eLL._AC_SR300,300_.jpg",
		"url":"https://www.amazon.cn/b/ref=sa_menu_kitchen_l1?ie=UTF8&node=813108051"
	},
	{"index": "21", "short": "Toys", "desc": "Toys",
		"src":"https://images-cn.ssl-images-amazon.com/images/I/51muIiW8ZQL._AA160_.jpg",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	},
	{"index": "147", "short": "PC", "desc": "PC",
		 "src":"https://images-na.ssl-images-amazon.com/images/I/51CvjRu6c8L._AC_US160_.jpg",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	},
	{"index": "228", "short": "Gift Card", "desc": "Gift Card",
		"src":"https://images-cn.ssl-images-amazon.com/images/I/31l2damWwuL._AA160_.jpg",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	},
	{"index": "229", "short": "Office Products", "desc": "Office Products", 
		 "src":"https://images-na.ssl-images-amazon.com/images/I/41lZydNAHuL._AC_US160_.jpg",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	},
	{"index": "200", "short": "Sports", "desc": "Sports", 
		 "src":"https://images-na.ssl-images-amazon.com/images/I/51fsD+L-h5L._AC_US160_.jpg",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	},
	{"index": "107", "short": "Wireless", "desc": "Telephone Calls",
		"src":"https://images-na.ssl-images-amazon.com/images/I/31mKAuDAywL._AC_US160_.jpg",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	},
	{"index": "60", "short": "Home Improvement", "desc": "Home goods",
		"src":"https://images-na.ssl-images-amazon.com/images/I/51W2S-U20DL._AC_US160_.jpg",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	},
	{"index": "263", "short": "Automotive", "desc": "Traveling",
		 "src":"https://images-na.ssl-images-amazon.com/images/I/51+s7QuOU2L._AC_US160_.png",
		"url":"https://www.amazon.cn/dp/B00FWJ8P9C"
	}
];


var speeds = { "slow": 1000, "medium": 200, "fast": 50 };

// Activity to put in center of circle arrangement
var center_act = "Idle",
	center_pt = { "x": 480, "y": 465 };

var smaller_radius = 280;
// Coordinates for activities
var foci = {};
act_codes.forEach(function(code, i) {
	if (code.desc == center_act) {
		foci[code.index] = {x:center_pt.x + 50, y:center_pt.y + 50};
	} else {
		var theta = 2 * Math.PI / (act_codes.length-1);
		foci[code.index] = {x: smaller_radius * Math.cos(i * theta)+center_pt.x + 50, y: smaller_radius * Math.sin(i * theta)+center_pt.y + 50 };
	}
});


// Start the SVG
var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);


// Load data and let's do it.
d3.tsv("data/dataNoBooksOutCut.tsv", function(error, data) {	
	
	data.forEach(function(d) {
		var day_array = d.day.split(",");
		var activities = [];
		for (var i=0; i < day_array.length; i++) {
			// Duration
			if (i % 2 == 1) {
				activities.push({'act': day_array[i-1], 'duration': +day_array[i]});
			}
		}
		sched_objs.push(activities);
	});
	
	// Used for percentages by minute
	//var act_counts = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0 };
	
	// A node for each person's schedule
	var nodes = sched_objs.map(function(o,i) {
		var act = o[0].act;
		//act_counts[act] += 1;
		var init_x = foci[act].x + Math.random();
		var init_y = foci[act].y + Math.random();
		return {
			act: act,
			radius: 3,
			x: init_x,
			y: init_y,
			color: color(act),
			moves: 0,
			next_move_time: o[0].duration,
			sched: o,
		}
	});

	var force = d3.layout.force()
		.nodes(nodes)
		.size([width, height])
		// .links([])
		.gravity(0)
		.charge(0)
		.friction(.9)
		.on("tick", tick)
		.start();

	var circle = svg.selectAll("circle")
		.data(nodes)
	  .enter().append("circle")
		.attr("r", function(d) { return d.radius; })
		.style("fill", function(d) { return d.color; });
		// .call(force.drag);
	
	var larger_radius = 380;
	// Activity labels
	var image = svg.selectAll("a") 
		.data(act_codes)
		.enter().append("a")
		.attr("xlink:href", function(d){
			return d.url;
		})
		.append("image")
		.attr("xlink:href", function(d){
			return d.src;
		})
		.attr("height", 100)
		.attr("width", 100)
		.attr("x", function(d, i) {
			if (d.desc == center_act) {
				return center_pt.x;
			} else {
				var theta = 2 * Math.PI / (act_codes.length-1);
				return larger_radius * Math.cos(i * theta)+center_pt.x;
			}
			
		})
		.attr("y", function(d, i) {
			if (d.desc == center_act) {
				return center_pt.y;
			} else {
				var theta = 2 * Math.PI / (act_codes.length-1);
				return larger_radius * Math.sin(i * theta)+center_pt.y;
			}
			
		});

/*
	var label = svg.selectAll("text")
		.data(act_codes)
	  	.enter().append("text")
		.attr("class", "actlabel")
		.attr("x", function(d, i) {
			if (d.desc == center_act) {
				return center_pt.x;
			} else {
				var theta = 2 * Math.PI / (act_codes.length-1);
				return 340 * Math.cos(i * theta)+380;
			}
			
		})
		.attr("y", function(d, i) {
			if (d.desc == center_act) {
				return center_pt.y;
			} else {
				var theta = 2 * Math.PI / (act_codes.length-1);
				return 340 * Math.sin(i * theta)+365;
			}
			
		});
		
		
	label.append("tspan")
		.attr("x", function() { return d3.select(this.parentNode).attr("x"); })
		// .attr("dy", "1.3em")
		.attr("text-anchor", "middle")
		.text(function(d) {
			//return d.short;
			return "";
		});
	label.append("tspan")
		.attr("dy", "1.3em")
		.attr("x", function() { return d3.select(this.parentNode).attr("x"); })
		.attr("text-anchor", "middle")
		.attr("class", "actpct")
		.text(function(d) {
			//return act_counts[d.index] + "%";
			return "";
		});
*/
	
	
	// Update nodes based on activity and duration
	function timer() {
		d3.range(nodes.length).map(function(i) {
			var curr_node = nodes[i],
				curr_moves = curr_node.moves; 

			// Time to go to next activity
			if (curr_node.next_move_time == curr_minute) {
				if (curr_node.moves == curr_node.sched.length-1) {
					curr_moves = 0;
				} else {
					curr_moves += 1;
				}
			
				// Subtract from current activity count
				//act_counts[curr_node.act] -= 1;
			
				// Move on to next activity
				curr_node.act = curr_node.sched[ curr_moves ].act;
			
				// Add to new activity count
				//act_counts[curr_node.act] += 1;
			
				curr_node.moves = curr_moves;
				curr_node.cx = foci[curr_node.act].x;
				curr_node.cy = foci[curr_node.act].y;
			
				nodes[i].next_move_time += nodes[i].sched[ curr_node.moves ].duration;
			}

		});

		force.resume();
		curr_minute += 1;

		// Update percentages
		/*label.selectAll("tspan.actpct")
			.text(function(d) {
				return readablePercent(act_counts[d.index]);
			});*/
	
		// Update time
		var true_minute = curr_minute % 1440;
		d3.select("#current_time").text(minutesToTime(true_minute));
		d3.select("#current_day").text(minutesToDate(curr_minute));
		
		setTimeout(timer, speeds[USER_SPEED]);
	}
	setTimeout(timer, speeds[USER_SPEED]);
		
	function tick(e) {
	  var k = 0.04 * e.alpha;
  
	  // Push nodes toward their designated focus.
	  nodes.forEach(function(o, i) {
		var curr_act = o.act;
		
		// Make sleep more sluggish moving.
		if (curr_act == "0") {
			var damper = 0.6;
		} else {
			var damper = 1;
		}
		o.color = color(curr_act);
	    o.y += (foci[curr_act].y - o.y) * k * damper;
	    o.x += (foci[curr_act].x - o.x) * k * damper;
	  });

	  circle
	  	  .each(collide(.5))
	  	  .style("fill", function(d) { return d.color; })
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	// Resolve collisions between nodes.
	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes);
	  return function(d) {
	    var r = d.radius + maxRadius + padding,
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
	        var x = d.x - quad.point.x,
	            y = d.y - quad.point.y,
	            l = Math.sqrt(x * x + y * y),
	            r = d.radius + quad.point.radius + (d.act !== quad.point.act) * padding;
	        if (l < r) {
	          l = (l - r) / l * alpha;
	          d.x -= x *= l;
	          d.y -= y *= l;
	          quad.point.x += x;
	          quad.point.y += y;
	        }
	      }
	      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	    });
	  };
	}
	
	// Speed toggle
	d3.selectAll(".togglebutton")
      .on("click", function() {
        if (d3.select(this).attr("data-val") == "slow") {
            d3.select(".slow").classed("current", true);
			d3.select(".medium").classed("current", false);
            d3.select(".fast").classed("current", false);
        } else if (d3.select(this).attr("data-val") == "medium") {
            d3.select(".slow").classed("current", false);
			d3.select(".medium").classed("current", true);
            d3.select(".fast").classed("current", false);
        } 
		else {
            d3.select(".slow").classed("current", false);
			d3.select(".medium").classed("current", false);
			d3.select(".fast").classed("current", true);
        }
		
		USER_SPEED = d3.select(this).attr("data-val");
    });
}); // @end d3.tsv



function color(activity) {
	
	var colorByActivity = {
		"-1": "#FFFFFF",
		"193": "#1c8af9",
		"325": "#51BC05",
		"121": "#FF7F00",
		"309": "#DB32A4",
		"201": "#00CDF8",
		"75": "#E63B60",
		"194": "#8E5649",
		"79": "#68c99e",
		"21": "#a477c8",
		"147": "#5C76EC",
		"228": "#E773C3",
		"229": "#799fd2",
		"200": "#038a6c",
		"107": "#cc87fa",
		"60": "#ee8e76",
		"263": "#bbbbbb",
	}
	
	return colorByActivity[activity];
	
}

// Output readable percent based on count.
function readablePercent(n) {
	
	/*var pct = 100 * n / 1000;
	if (pct < 1 && pct > 0) {
		pct = "<1%";
	} else {
		pct = Math.round(pct) + "%";
	}*/

	pct = n;
	
	//return pct;
	return "";
}


// Minutes to time of day. Data is minutes from 12am.
function minutesToTime(m) {
	var minutes = (m + 0*60) % 1440;
	var hh = Math.floor(minutes / 60);
	var ampm;
	if (hh > 12) {
		hh = hh - 12;
		ampm = "pm";
	} else if (hh == 12) {
		ampm = "pm";
	} else if (hh == 0) {
		hh = 12;
		ampm = "am";
	} else {
		ampm = "am";
	}
	var mm = minutes % 60;
	if (mm < 10) {
		mm = "0" + mm;
	}
	
	return hh + ":" + mm + ampm;
}

function minutesToDate(m) {
	var init_date = new Date('2016-11-26 00:00:00');
	var curr_date = new Date(init_date);
	curr_date.setMinutes(init_date.getMinutes() + m);
	return curr_date.toDateString();
}


