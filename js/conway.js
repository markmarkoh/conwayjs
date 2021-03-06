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
        targetStep: 0,
        drawThreshold: 15,

        //store parallel grid with references to d3 objects
        grid: Life.copyGrid(Life.grid),

        // add a cell given it's column <col> and row <row>
        // make the X/Y slightly smaller. this is a hack, but a super
        // easy way to do rounded corners with adjacent elements
        addCell: function(row, col, increment) {

            var cell;

            if (typeof increment === "undefined") {
                increment = 0.1;
            }

           //if there is no cell there, add it
           if ( this.grid[row][col] === 0 ) {
                cell = board.append("rect")
                    .attr("fill", "#05182F")
                    .attr("x", col * this.cell.width * 0.8)
                    .attr("y", row * this.cell.width * 0.8)
                    .attr("rx", 3)
                    .attr("id", 'c_' + row + "_" + col)
                    .attr("height", this.cell.height)
                    .attr("width", this.cell.width)
                    .style('opacity', increment);

                cell.increment = increment;

                this.grid[row][col] = cell;
            } else {
                cell = this.grid[row][col];

                cell.increment += increment;
                cell.transition()
                    .duration(150)
                       .style("opacity", cell.increment);
            }

        },

        //remove a cell given it's column <col> and row <row>
        //reset the grid to 0
        removeCell: function(row, col) {
            if( ! this.grid[row][col] ) return;
            this.grid[row][col]
                .transition()
                .duration(150)
                    .style("opacity", 0)
                    .delay(10).remove();

            this.grid[row][col] = 0;
        },

        update: function(grid, increment) {

            switch (typeof grid) {
                case "number":
                    increment = grid;
                case "undefined":
                    grid = Life.grid;
                    break;
                default:
                    break;
            }

            //keep track of the history

            for( var i = 0; i < Life.WIDTH; i++) {
                for ( var j = 0; j < Life.HEIGHT; j++) {
                    if ( grid[i][j] === 1 ) {
                        this.addCell(i, j, increment);
                    } else {
                        this.removeCell(i, j, increment);
                    }
                }
            }
        },

        /*
            I love how *this* is my refactor from previously
            unmanagable.

            reasonable options for now:
            conway.go(5);     -> move to step 5
            conway.go(1);    -> move back to step 1
        */
        isUpdating: false,
        init: function() {
                this.history.push ( Life.copyGrid ( Life.grid ));
                this.update(1);
        },

        go: function(step) {
            
            this.isUpdating = true;

            if ( step > this.step ) {

                while ( step > this.step ) {

                    this.step++;

                    //if we've already hit this level, don't recalc
                    if ( this.history[ this.step ]) {
                        //only draw if it's within 15 steps
                        if ( this.step - step < this.drawThreshold ) {
                            this.update( this.history[ Math.floor(this.step) ], 1);
                        }
                    } else {
                        Life.updateState();
                        this.history.push( Life.copyGrid ( Life.grid ));

                        if (this.step - step < this.drawThreshold ) {
                            this.update(step);
                        }
                    }
                }
            //moving backward
            } else if (step < this.step) {
                while ( step < this.step ) {
                    this.step--;
                    this.update ( this.history[ this.step ], 1);
                }
            }

            this.isUpdating = false;
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
        [3, 11, 13, 18, 21, 23],
        [0,1,2,3, 10, 13, 14, 15, 17, 19, 21, 22],
        [1, 10, 13, 15, 18, 21, 23]
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
    conway.init();


    //leak
    window.conway = conway;

})();