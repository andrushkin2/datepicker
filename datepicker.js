


window.onerror = function(message, source, lineno) {
		  alert("Error:"+message +"\n" +
		    "File:" + source + "\n" +
		    "Line:" + lineno);
};

datepicker = function(elementId, some, options){
	var self = this,
        monthString = ["January","February","February","April","May","June","July","August","September","October","November","December"],
        inputElement,
		    getElement = function () {
		        if (typeof elementId == "string"){
		            self.inputElemnt = inputElement = document.body.querySelector("#"+elementId+"[type=text]")
		        } else {
		            if (typeof element == "array"){
		                self.inputElemtn = inputElement = elementId[0];
		            } else if (typeof element === "object"){
		            		self.inputElemtn = inputElement = elementId;
		            } else{
		                throw new Error("Undefined input element");
		            }
		        }
		        if ( !self.inputElemnt || !inputElement){
		            throw new Error("Undefined input");
		        }
		    };
    self.createMainContainer =function(){
        var a;
        self.mainContainer = document.createElement("div");
        self.mainContainer.className = "datepicker_main_container";
        document.body.appendChild(self.mainContainer);
    };
    self.createMonthYearTab =function(){
        self.myTab = document.createElement("div");
        self.myTab.className = "datepicker_month_year_tab";
        self.mainContainer.appendChild(self.myTab);

        //left button
        self.leftButton = document.createElement("button");
        self.leftButton.className = "datepicker_month_year_tab_button datepicker_month_year_tab_l_button";
        lButton = self.leftButton.style;
        self.leftButton.innerHTML = "<";
        self.myTab.appendChild(self.leftButton);

        //right button
        self.rightButton = document.createElement("button");
        self.rightButton.className = "datepicker_month_year_tab_button datepicker_month_year_tab_r_button";
        rButton = self.rightButton.style;
        self.rightButton.innerHTML = ">";
        self.myTab.appendChild(self.rightButton);

        //central pane
        self.centralPane = document.createElement("div");
        self.centralPane.className = "datepicker_month_year_tab_central_pane";
        self.myTab.appendChild(self.centralPane);

        //sub pane
        self.subCentralPane = document.createElement("div");
        self.subCentralPane.className = "datepicker_month_year_tab_central_pane_sub";
        self.centralPane.appendChild(self.subCentralPane);

        //month container
        self.monthContainer = document.createElement("div");
        self.monthContainer.className = "datepicker_month_year_tab_central_pane_month";
        self.monthContainer.innerHTML = "November";
        self.subCentralPane.appendChild(self.monthContainer);

        //year container
        self.yearContainer = document.createElement("div");
        self.yearContainer.className = "datepicker_month_year_tab_central_pane_year";
        self.yearContainer.innerHTML = "2013";
        self.subCentralPane.appendChild(self.yearContainer);
    };
    self.createScheduler = function(){
        var a;
        self.scheduler = document.createElement("div");
        self.scheduler.className = "datepicker_scheduler";
        self.mainContainer.appendChild(self.scheduler);

        //sub container
        self.subSchedulerContainer = document.createElement("div");
        self.subSchedulerContainer.className = "datepicker_scheduler_sub";
        self.scheduler.appendChild(self.subSchedulerContainer);

        //table
        self.calendar = document.createElement("table");
        self.calendar.className = "datepicker_scheduler_calendar";
        self.subSchedulerContainer.appendChild(self.calendar);

        //table head
        self.tableHead = document.createElement("thead");
        self.tableHead.align = "center";
        self.tableHead.className = "datepicker_scheduler_calendar_header";
        self.tableHead.innerHTML = "<tr>" +
                                        "<td>Mon</td>" +
                                        "<td>Tue</td>" +
                                        "<td>Wed</td>" +
                                        "<td>Thu</td>" +
                                        "<td>Fri</td>" +
                                        "<td>Sat</td>" +
                                        "<td>Sun</td>" +
                                    "</tr>";
        self.calendar.appendChild(self.tableHead);

        //table body
        self.tableBody = document.createElement("tbody");
        self.tableBody.align = "center";
        self.tableBody.className = "datepicker_scheduler_calendar_body";
        self.tableBody.innerHTML = self.createTableBody();
        self.calendar.appendChild(self.tableBody);
    };
    self.createTableBody = function(){
        var html = "", i, j;
        for ( i = 0; i < 6; i++){
            html += (i + 1 === 6)? "<tr class=\"datepicker_scheduler_calendar_body_last_row\">" : "<tr>";
            for ( j = 0; j < 7; j++){
                html += "<td data-day=\"\" data-month=\"\" data-year=\"\"></td>";
            }
            html += "</tr>";
        }
        return html;
    };
    self.daysInMonth = function(date) {
        return 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
    };
    self.onButtonClick = function(a, options, c){
        debugger;
        var date = new Date(this["data-year"], this["data-month"], this["data-day"]);
        self.showType["date"](date);
    };
    self.addEvents = function() {
        self.mainContainer.onclick = function(){
            self.mainContainer.focused = true;
            self.blur = false;
        };
        self.mainContainer.onblur = function(){
            alert("blur");
        };
        document.body.addEventListener("click", function(e){
        		alert(e.target);
            if ( !self.inputElemnt.focused /*&& !self.mainContainer.focused*/ && self.isPickerVisible() ){
                setTimeout(function(){
                    if (self.blur){
                        self.hidePicker();
                    } else {
                        self.blur = true;
                    }
                },300);
            }
        });

    };
    self.showType = (function(){
        //self.type = type;
        //self.showType_date();
        return {
            date: function(date){
                var today = self.todayDate,
                    current = self.currentDate,
                    showingDate = date || null,
                    leftButton = self.leftButton,
                    rightButton = self.rightButton,
                    arrTd,
                    lastTr,
                    counter,
                    days = 1,
                    lastDate,
                    month,
                    monthInt,
                    year,
                    i;
                if (!showingDate){
                    showingDate = (!current)? today : current;
                }
                month = monthString[showingDate.getMonth()];
                monthInt = showingDate.getMonth();
                year = showingDate.getFullYear();

                counter  = (new Date(year, monthInt, 1)).getDay();
                counter = (counter === 0)? 6 : counter - 1;
                lastDate = self.daysInMonth(showingDate);
                arrTd = self.tableBody.querySelectorAll("td");
                //set month and year
                self.monthContainer.innerHTML = month;
                self.yearContainer.innerHTML  = year;
                //set buttons title
                leftButton.title = (monthInt === 0)? monthString[11]+" "+(year-1) : monthString[monthInt-1]+" "+year;
                leftButton["data-day"] = rightButton["data-day"] = 1;
                leftButton["data-month"] = (monthInt === 0)? 11 : monthInt-1;
                leftButton["data-year"] = (monthInt === 0)? year-1 : year;
                rightButton.title = (monthInt === 11)? monthString[0]+" "+(year+1) : monthString[monthInt+1]+" "+year;
                rightButton["data-month"] = (monthInt === 11)? 0 : monthInt+1;
                rightButton["data-year"] = (monthInt === 11)? year+1 : year;
                //set calendar
                for (i=0; i<arrTd.length; i++){
                    var td = arrTd[i];
                    if (i < counter){
                        td.innerHTML = "";
                        td.className = "space"
                    } else {
                        if (days <= lastDate){
                            td.innerHTML = days;
                            td["data-day"]  = days;
                            td["data-month"] = monthInt ;
                            td["data-year"] = year;
                            td.className = "number";
                            if (!!current && !isNaN(current) && days === current.getDate()){
                                if (monthInt === current.getMonth() && year === current.getFullYear()){
                                    td.className += " current_date";
                                }
                            } else if (!isNaN(today) && days === today.getDate()){
                                if (monthInt === today.getMonth() && year === today.getFullYear()){
                                    td.className += " today_date";
                                }
                            }
                            days++;
                        } else {
                            td.innerHTML = "";
                            td["data-day"]  = "";
                            td["data-month"] = "" ;
                            td["data-year"] = "";
                            td.className = "space"
                        }
                    }
                }
                lastTr = self.tableBody.querySelector("tr.datepicker_scheduler_calendar_body_last_row");
                (lastTr.querySelectorAll(".space").length < 7 )? lastTr.style.display = "table-row" : lastTr.style.display = "none";
            }
        }
    })();
    self.setNewDate = function(newDate){
        var d = (typeof newDate === "object")? newDate : (new Date(newDate));
        if (typeof d === "object" && !isNaN(d)){
            self.currentDate = d;
            self.showType["date"]();
        } else {
            //todo: throw error "Incorrect date"
        }
    };
    self.hidePicker = function() {
        self.mainContainer.style.display = "none";
    };
    self.showPicker = function(input) {
        self.mainContainer.style.top = input.offsetTop + input.offsetHeight +"px";
        self.mainContainer.style.left = input.offsetLeft+"px";
        self.mainContainer.style.display = "block";
    };
    self.isPickerVisible = function() {
        return self.mainContainer.style.display === "block";
    };
    var datepicker = function(options){
        var sl = this,
            input = self.inputElemnt,
            s = self,
            options = {
                type:"date",
                dateFormat: "dd/mm/yy"
            },
            addEventsForInput = function(){
                var a = input;
                self.leftButton.addEventListener("click", self.onButtonClick);
                self.rightButton.addEventListener("click", self.onButtonClick);
                a.onchange = function(){
                    var value = this.value;
                };
                a.onclick = function() {
                    debugger;
                    alert(inputElement.id);
                    a.focused = true;
                    self.blur = false;
                    if ( self.inputElemntLast !== this || !self.isPickerVisible() ){
                        self.inputElemntLast = this;
                        self.showPicker(this);
                        self.showType[options.type]();
                        self.mainContainer.style.display = "block";
                    }
                };
                a.onblur = function() {
                    a.focused = false;
                    if ( self.isPickerVisible() ){
                        self.blur = true;
                        setTimeout(function(){
                            if (self.blur){
                                self.hidePicker();
                            }
                        },300);
                    }
                }
            };
        addEventsForInput();
        return {
            hide:function () {
                self.hidePicker();
            },
            show:function() {
                debugger;
                self.showPicker(input)
            },
            setDate:function(newDate){
                self.setNewDate(newDate);
            }
        }
    };
    self.currentDate = null;
    self.todayDate = new Date();
    self.type = "date";
    self.options = {
        dateFormat: "dd/mm/yy"
    };
    for(var a in options){
        self.options[a] = options[a];
    }
    getElement();
    debugger;
    if (!self.mainContainer){
        self.createMainContainer();
        self.createMonthYearTab();
        self.createScheduler();
        self.on = function(eventName, handler) {
            if (!this._eventHandlers) this._eventHandlers = [];
            if (!this._eventHandlers[eventName]) {
                this._eventHandlers[eventName] = [];
            }
            this._eventHandlers[eventName].push(handler);
        };
        self.off = function(eventName, handler) {
            var handlers = this._eventHandlers[eventName];
            if (!handlers) return;
            for(var i=0; i<handlers.length; i++) {
                if (handlers[i] == handler) {
                    handlers.splice(i--, 1);
                }
            }
        };
        self.trigger = function(eventName) {
            if (!this._eventHandlers[eventName]) {
                return;
            }
            var handlers = this._eventHandlers[eventName];
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].apply(this, [].slice.call(arguments, 1));
            }
        }
        self.addEvents();
    }
    self.inst = new datepicker(options);

    return self.inst;
	
}
/*
datepicker = function(elementId, some, options){
	return new datepickerObj(elementId, some, options);
}*/
