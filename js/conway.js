/*
    Conway's Game of Life in D3.js
    Author: Mark DiMarco @markmarkoh

    build for RHoK Austin 2012
*/

(function() {
    Life.init(50, 50);

    var width = 700,
        height = width,
        board = d3.select("#board").append("svg")
                    .attr("width", width).attr("height", height);

    var conway = {

        cell: {
            width: 10,
            height: 10
        },

        //store parallel grid with references to d3 objects
        grid: Life.copyGrid(Life.grid),

        // add a cell given it's column <col> and row <row>
        // make the X/Y slightly smaller. this is a hack, but a super
        // easy way to do rounded corners with adjacent elements
        addCell: function(row, col) {
            var cell = board.append("rect")
                .attr("fill", "#05182F")
                .attr("x", col * this.cell.width * 0.8)
                .attr("y", row * this.cell.width * 0.8)
                .attr("rx", 2)
                .attr("id", 'c_' + row + "_" + col)
                .attr("height", this.cell.height)
                .attr("width", this.cell.width)
                .style('opacity', 0);

            cell.transition()
                .duration(600)
                    .style("opacity", 1);

            this.grid[row][col] = cell;
        },

        //remove a cell given it's column <col> and row <row>
        //reset the grid to 0
        removeCell: function(row, col) {
            try {
                d3.select('#c_' + row + '_' + col).remove();
                /*.transition()
                .duration(400)
                    .style("opacity", 0)
                    .delay(10).remove();*/

            this.grid[row][col] = 0;
            } catch(e) { ; }
        },

        update: function() {
            for( var i = 0; i < Life.WIDTH; i++) {
                for ( var j = 0; j < Life.HEIGHT; j++) {
                    if ( Life.grid[i][j] === 1 ) {
                        console.log('adding', i, j);
                        this.addCell(i, j);
                    } else {
                        this.removeCell(i, j);
                    }
                }
            }
        }

    };



    var starting = [
        [11, 12],
        [4, 6, 8, 9, 12, 14, 15, 16],
        [3,  9, 12, 13, 14],
        [2, 4, 6, 9, 10, 12, 14],
        [2, 3, 4, 7, 10, 16],
        [0, 1, 2, 3, 4, 5],
        [3],
        [0,1,2,3],
        [1]
    ];

    starting = [[],[],[],[],[],[13,14,15]];

    //starting = [[],[],[],[],[],[12,13],[12,13],[14,15],[14,15]];

    //starting = [[],[],[],[10],[8, 10],[9, 10],[]];

    for (var i = 0; i < starting.length; i++) {
        for( var j = 0; j < starting[i].length; j++) {
            Life.grid[i][20 + starting[i][j]] = 1;
        }
    }
    conway.update();
    window.conway = conway;

})();