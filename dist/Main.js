;
var Main = /** @class */ (function () {
    function Main() {
        this.areaWidth = 60;
        this.areaHeight = 40;
        this.offsetX = 0;
        this.offsetY = 0;
        this.cellEnviroment = 1;
        this.selectedCells = [];
        this.deleteList = [];
        this.addList = [];
        this.visibleArea = { left_bottom: [0, 0], left_top: [0, 0], right_top: [0, 0], right_bottom: [0, 0] };
        this.RenderArea();
        this.initCellSelecting();
        this.initNavigation();
        this.initActions();
    }
    /**
     * Displays the map
     * @constructor
     */
    Main.prototype.RenderArea = function () {
        var html = "";
        for (var y = 0; y < this.areaHeight; y++) {
            html = "<tr>";
            for (var x = 0; x < this.areaWidth; x++) {
                html += '<td class="cell" data-x="' + x + '" data-y="' + y + '"></td>';
            }
            html += "</tr>";
            $("#world tbody").append(html);
        }
        this.setVisibleArea([0, this.areaWidth - 1], [0, this.areaHeight - 1]);
        this.DisplayCurrentArea();
    };
    Main.prototype.setVisibleArea = function (rangeX, rangeY) {
        this.visibleArea.left_bottom = [rangeX[0], rangeY[1]];
        this.visibleArea.left_top = [rangeX[0], rangeY[0]];
        this.visibleArea.right_top = [rangeX[1], rangeY[0]];
        this.visibleArea.right_bottom = [rangeX[1], rangeY[1]];
    };
    /**
     * Shows current visible area rang (Just for debug & develop)
     * @param {number[]} areaX
     * @param {number[]} areaY
     * @constructor
     */
    Main.prototype.DisplayCurrentArea = function () {
        var _this_1 = this;
        //Update the range scale above table
        $(document).find("span.current-view").html("ViewArea: X("
            + (this.visibleArea.left_top[0] + this.offsetX) + ":" + (this.visibleArea.right_top[0] + this.offsetX) +
            ");Y(" +
            (this.visibleArea.left_top[1] + this.offsetY) + ":" + (this.visibleArea.right_bottom[1] + this.offsetY) +
            ")");
        //Reset the active selections
        $(".cell").removeClass("selected");
        if (this.selectedCells.length && this.selectedCells !== undefined) {
            //Collect only those cells,that are visible
            var result = this.selectedCells.filter(function (i) { return ((i.x) >= (_this_1.visibleArea.left_top[0]) &&
                (i.x) <= (_this_1.visibleArea.right_top[0]) &&
                (i.y) >= (_this_1.visibleArea.left_top[1]) &&
                (i.y) <= (_this_1.visibleArea.right_bottom[1])); });
            //If there is any cell,
            if (result.length) {
                var offsetX_1 = this.offsetX;
                var offsetY_1 = this.offsetY;
                this.selectedCells.forEach(function (val) {
                    $(document).find('.cell[data-x="' + (val.x - offsetX_1) + '"][data-y="' + (val.y - offsetY_1) + '"]').addClass("selected");
                });
            }
        }
        else {
            this.stopAutoPlay();
        }
    };
    /**
     * Add selected Cells to selected cell list
     * @param {Cell} cell
     */
    Main.prototype.addSelectedCell = function (cell) {
        var result = this.cellIsAdded(cell);
        if (this.selectedCells === undefined || !this.selectedCells.length) {
            this.selectedCells.push(cell);
        }
        else {
            if (!result) {
                this.selectedCells.push(cell);
            }
        }
    };
    /**
     * Removes selected Cell from selected cell list
     * @param {Cell} cell
     */
    Main.prototype.removeSelectedCell = function (cell) {
        var result = this.cellIsAdded(cell);
        if (result && this.selectedCells !== undefined && this.selectedCells.length) {
            //Find the object's index in the array, if index is valid, remove the object from selected array
            var index = this.selectedCells.findIndex(function (i) { return i.x === cell.x && i.y == cell.y; });
            if (index > -1) {
                this.selectedCells.splice(index, 1);
            }
        }
    };
    /**
     * Checks the cell is in list, or not
     * @param {Cell} tmp
     * @returns {boolean}
     */
    Main.prototype.cellIsAdded = function (tmp) {
        return this.selectedCells.some(function (i) {
            if (i.x === tmp.x && i.y === tmp.y) {
                return true;
            }
            return false;
        });
    };
    Main.prototype.getNeighbours = function (cell) {
        var _this_1 = this;
        var result = this.selectedCells.filter(function (i) { return ((((i.x - _this_1.cellEnviroment) <= cell.x &&
            (i.x + _this_1.cellEnviroment) >= cell.x &&
            (i.y - _this_1.cellEnviroment) <= cell.y &&
            (i.y + _this_1.cellEnviroment) >= cell.y &&
            (i.x !== cell.x && i.y !== cell.y)) || ((i.x - _this_1.cellEnviroment) <= cell.x &&
            (i.x + _this_1.cellEnviroment) >= cell.x &&
            i.y == cell.y && i.x != cell.x) || ((i.y - _this_1.cellEnviroment) <= cell.y &&
            (i.y + _this_1.cellEnviroment) >= cell.y &&
            i.x == cell.x && i.y != cell.y))); });
        return result;
    };
    /**
     * Get cells, what is in the examinted cell's enviroment
     * Enviroment size stored in "cellEnviroment" property (number)
     * @param {Cell} cell
     */
    Main.prototype.getEnviroment = function (cell) {
        var enviroment = [];
        for (var x = cell.x - this.cellEnviroment; x <= cell.x + this.cellEnviroment; x++) {
            for (var y = cell.y - this.cellEnviroment; y <= cell.y + this.cellEnviroment; y++) {
                if ((x != cell.x && y != cell.x ||
                    (x == cell.x && y != cell.y) ||
                    (x != cell.x && y == cell.y)) &&
                    this.cellIsAdded({ x: x, y: y }) === false) {
                    enviroment.push({ x: x, y: y });
                }
            }
        }
        return enviroment;
    };
    /**
     * Init the cell select event (user click)
     */
    Main.prototype.initCellSelecting = function () {
        var _this = this;
        $(".cell").on("click", function () {
            var current_cell = { x: ($(this).data("x") + _this.offsetX), y: ($(this).data("y") + _this.offsetY) };
            $(this).toggleClass("selected");
            if ($(this).hasClass("selected")) {
                _this.addSelectedCell(current_cell);
            }
            else {
                _this.removeSelectedCell(current_cell);
            }
            $(document).find("span.current").html("Last selected: (" + current_cell.x + ";" + current_cell.y + ")");
        });
    };
    /**
     * Init navigation keybindings
     */
    Main.prototype.initNavigation = function () {
        var _this = this;
        $(document).on("keydown", function (e) {
            if (e.keyCode > 36 && e.keyCode < 41) {
                e.preventDefault();
            }
            switch (e.keyCode) {
                case 37:
                    {
                        //navigate left
                        _this.offsetX++;
                    }
                    break;
                case 38:
                    {
                        //navigate up
                        _this.offsetY++;
                    }
                    break;
                case 39:
                    {
                        //navigate right
                        _this.offsetX--;
                    }
                    break;
                case 40:
                    {
                        //navigate down
                        _this.offsetY--;
                    }
                    break;
            }
            //Updating the visible area
            _this.DisplayCurrentArea();
        });
    };
    /**
     * Binding to start and stop events
     */
    Main.prototype.initActions = function () {
        var _this = this;
        $(".btn-start").on("click", function () {
            _this.handleButtonStatuses($("#autoplay").prop("checked"));
            if ($("#autoplay").prop("checked") && !$(".btn-start").hasClass("btn-warning")) {
                _this.setAutoPlay();
            }
            else {
                _this.playRound();
            }
        });
        $(".btn-stop").on("click", function () {
            if ($("#autoplay").prop("checked")) {
                _this.stopAutoPlay();
            }
            _this.resetStartButton();
        });
        $("#autoplay").on("change", function () {
            if ($(this).prop("checked") === false) {
                _this.stopAutoPlay();
            }
        });
    };
    /**
     * Playing the round depend on the rules
     */
    Main.prototype.playRound = function () {
        console.log("run");
        /*
         Births and deaths do not affect each other in a given circle, so we need collect and process the relevant cells
         separately
         */
        this.buildDeleteList();
        this.buildAddList();
        this.deleteDyingCells();
        this.addBirthingCells();
        //refresh the screen
        this.DisplayCurrentArea();
    };
    /**
     * Scheduling playRound()
     */
    Main.prototype.setAutoPlay = function () {
        var _this_1 = this;
        this.autoPlayContainer = setInterval(function () { return _this_1.playRound(); }, 1500);
    };
    /**
     * Stops autoplay
     */
    Main.prototype.stopAutoPlay = function () {
        clearInterval(this.autoPlayContainer);
    };
    /**
     * Collect cells, which will be become alive in current round
     * Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
     */
    Main.prototype.buildAddList = function () {
        var _this = this;
        this.addList = [];
        this.selectedCells.forEach(function (living_cell) {
            var enviroment = _this.getEnviroment(living_cell);
            enviroment.forEach(function (env_cell) {
                var neighbours = _this.getNeighbours(env_cell);
                if (neighbours.length === 3) {
                    _this.addList.push(env_cell);
                }
            });
        });
    };
    /**
     * Adds the selected cells
     */
    Main.prototype.addBirthingCells = function () {
        var _this = this;
        this.addList.forEach(function (birthing_cell) {
            _this.addSelectedCell(birthing_cell);
        });
    };
    /**
     * Collect cells which will be removed in current round
     * Any live cell with fewer than two live neighbors dies, as if caused by under population.
     * Any live cell with more than three live neighbors dies, as if by overcrowding.
     */
    Main.prototype.buildDeleteList = function () {
        var _this = this;
        this.deleteList = [];
        this.selectedCells.forEach(function (dying_cell) {
            var neighbours = _this.getNeighbours(dying_cell);
            if (neighbours.length < 2 || neighbours.length > 3) {
                _this.deleteList.push(dying_cell);
            }
        });
    };
    /**
     * Removing the selected cells
     */
    Main.prototype.deleteDyingCells = function () {
        var _this = this;
        this.deleteList.forEach(function (dying_cell) {
            _this.removeSelectedCell(dying_cell);
        });
    };
    /**
     * When starting simulation, modify the start button text, classes,etc. depending on the autoplay feature
     * @param {boolean} autoplay
     */
    Main.prototype.handleButtonStatuses = function (autoplay) {
        if (!autoplay) {
            $(".btn-start").text("Next")
                .removeClass("btn-primary")
                .addClass("btn-warning");
        }
        else {
            $(".btn-start")
                .removeClass("btn-warning")
                .addClass("btn-primary")
                .attr("disabled", "true")
                .text("Simulation in progress..");
        }
    };
    /**
     * Resets start button's state
     */
    Main.prototype.resetStartButton = function () {
        $(".btn-start").text("Start")
            .removeClass("btn-warning")
            .addClass("btn-primary")
            .removeAttr("disabled");
    };
    return Main;
}());
//# sourceMappingURL=Main.js.map