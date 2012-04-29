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
            width: 20,
            height: 20
        },

        history: [],
        step: 0,

        //store parallel grid with references to d3 objects
        grid: Life.copyGrid(Life.grid),

        // add a cell given it's column <col> and row <row>
        // make the X/Y slightly smaller. this is a hack, but a super
        // easy way to do rounded corners with adjacent elements
        addCell: function(row, col) {

            if (d3.select('#c_' + row + '_' + col)[0][0] !== null) {
                return;
            }
            var cell = board.append("rect")
                .attr("fill", "#05182F")
                .attr("x", col * this.cell.width * 0.8)
                .attr("y", row * this.cell.width * 0.8)
                .attr("rx", 3)
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
            if( ! this.grid[row][col] ) return;
            this.grid[row][col]
                .transition()
                .duration(400)
                    .style("opacity", 0)
                    .delay(10).remove();

            this.grid[row][col] = 0;
        },

        update: function(grid) {

            if (typeof grid === "undefined") {
                console.log(grid, 'man');
                grid = Life.grid;
            }

            //keep track of the history

            for( var i = 0; i < Life.WIDTH; i++) {
                for ( var j = 0; j < Life.HEIGHT; j++) {
                    if ( grid[i][j] === 1 ) {
                        this.addCell(i, j);
                    } else {
                        this.removeCell(i, j);
                    }
                }
            }
        },

        /*
            reasonable options for now:
            conway.go(0);     -> initialize
            conway.go(1);     -> move up one step
            conway.go(-1);    -> move back one step
        */
        go: function(step) {
            if (typeof step === "undefined" || step > 0) {

                //if the current step isn't the most recent
                if (this.step < this.history.length) {
                    this.update( this.history[this.step + 1]);
                } else {
                    Life.updateState();
                    this.history.push( Life.copyGrid ( Life.grid ));
                    this.update();
                }

                this.step += 1;
            } else if (step === -1) {
                if ( this.step > 1 ) {
                    this.step -= 1;
                    this.update( this.history[ this.step - 1 ]);
                }
            } else if (step === 0) {
                this.step += 1;
                this.history.push( Life.copyGrid ( Life.grid ));
                this.update();
            }
        }

    };


    //rhok austin starting logo
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

    //starting = [[],[],[],[],[],[13,14,15]];

    //starting = [[],[],[],[],[],[12,13],[12,13],[14,15],[14,15]];

    //starting = [[],[],[],[10],[8, 10],[9, 10],[]];

    for (var i = 0; i < starting.length; i++) {
        for( var j = 0; j < starting[i].length; j++) {
            Life.grid[i][20 + starting[i][j]] = 1;
        }
    }

    //initial update, draw everything
    conway.go(0);


    //leak
    window.conway = conway;

})();