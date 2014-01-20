


window.onerror = function(message, source, lineno) {
		  alert("Error:"+message +"\n" +
		    "File:" + source + "\n" +
		    "Line:" + lineno);
};

datepicker = function(elementId, some, options){
	var self = this,
        bd = document.body,
        monthString = ["January","February","February","April","May","June","July","August","September","October","November","December"],
        inputElement,
        NOOP = function(){},
        bdEvent = function(e){
            var target = e.target,
                parent;

            if (isPickerVisible() && target !== self.inputElemntLast){
                debugger;
                parent = target;
                while (parent !== bd){
                    if (parent === self.mainContainer){
                        return;
                    } else {
                        parent = parent.parentNode;
                    }
                }
                bd.removeEventListener("click",bdEvent);
                //hidePicker();
                trigger("onHidePicker",inputElement);
            }
        },
        getElement = function () {
            if (typeof elementId == "string"){
                inputElement = bd.querySelector("#"+elementId+"[type=text]")
            } else {
                if (typeof element == "array"){
                    inputElement = elementId[0];
                } else if (typeof element === "object"){
                        inputElement = elementId;
                } else{
                    throw new Error("Undefined input element");
                }
            }
            if ( !inputElement){
                throw new Error("Undefined input element");
            }
        },
        createMainContainer = function(){
            self.mainContainer = document.createElement("div");
            self.mainContainer.className = "datepicker_main_container";
            bd.appendChild(self.mainContainer);
        },
        createMonthYearTab = function(){
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
        },
        createScheduler = function(){
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
            self.tableBody.innerHTML = createTableBody();
            self.calendar.appendChild(self.tableBody);
        },
        createTableBody = function(){
            var html = "", i, j;
            for ( i = 0; i < 6; i++){
                html += (i + 1 === 6)? "<tr class=\"datepicker_scheduler_calendar_body_last_row\">" : "<tr>";
                for ( j = 0; j < 7; j++){
                    html += "<td data-day=\"\" data-month=\"\" data-year=\"\"></td>";
                }
                html += "</tr>";
            }
            return html;
        },
        daysInMonth = function(date) {
            return 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
        },
        onButtonClick = function(a, options, c){
            debugger;
            var date = new Date(this["data-year"], this["data-month"], this["data-day"]);
            showType["date"](date);
        },
        dateParser = (function(){
            var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                timezoneClip = /[^-+\dA-Z]/g,
                pad = function (val, len) {
                    val = String(val);
                    len = len || 2;
                    while (val.length < len) val = "0" + val;
                    return val;
                };
            return {
                toStringFormat: function(date, format, utc){
                    if (format.slice(0, 4) == "UTC:") {
                        format = format.slice(4);
                        utc = true;
                    }
                    var	_ = utc ? "getUTC" : "get",
                        d = date[_ + "Date"](),
                        D = date[_ + "Day"](),
                        m = date[_ + "Month"](),
                        y = date[_ + "FullYear"](),
                        H = date[_ + "Hours"](),
                        M = date[_ + "Minutes"](),
                        s = date[_ + "Seconds"](),
                        L = date[_ + "Milliseconds"](),
                        o = utc ? 0 : date.getTimezoneOffset(),
                        flags = {
                            d:    d,
                            dd:   pad(d),
                            ddd:  dayNames[D],
                            dddd: dayNames[D + 7],
                            m:    m + 1,
                            mm:   pad(m + 1),
                            mmm:  monthNames[m],
                            mmmm: monthNames[m + 12],
                            yy:   String(y).slice(2),
                            yyyy: y,
                            h:    H % 12 || 12,
                            hh:   pad(H % 12 || 12),
                            H:    H,
                            HH:   pad(H),
                            M:    M,
                            MM:   pad(M),
                            s:    s,
                            ss:   pad(s),
                            l:    pad(L, 3),
                            L:    pad(L > 99 ? Math.round(L / 10) : L),
                            t:    H < 12 ? "a"  : "p",
                            tt:   H < 12 ? "am" : "pm",
                            T:    H < 12 ? "A"  : "P",
                            TT:   H < 12 ? "AM" : "PM",
                            Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                            o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                            S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                        };
                    return format.replace(token, function ($0) {
                        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                    });
                }
            }
        })(),
        addEvents = NOOP,
        setDate = function(){
            var day = this["data-day"],
                month = this["data-month"],
                year = this["data-year"],
                dateUtc = Date.UTC(year, month, day),
                gmtDate = new Date(dateUtc);
            this.className += " selected_date";
            currentDate = gmtDate;
            inputElement['currentDate'] = currentDate;
            inputElement.value = dateParser.toStringFormat(currentDate, pickerOptions.dateFormat);
            showType.date(currentDate);
            debugger;
        },
        showType = (function(){
            return {
                date: function(date){
                    var today = todayDate,
                        current = inputElement.currentDate,// || currentDate,
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
                    lastDate = daysInMonth(showingDate);
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
                                td.onclick = setDate;
                                td.innerHTML = days;
                                td["data-day"]  = days;
                                td["data-month"] = monthInt ;
                                td["data-year"] = year;
                                td.className = "number";
                                if (!!current && !isNaN(current) && days === current.getDate()){
                                    if (monthInt === current.getMonth() && year === current.getFullYear()){
                                        td.className += " selected_date";
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
        })(),
        setNewDate = function(newDate){
            var d = (typeof newDate === "object")? newDate : (new Date(newDate));
            if (typeof d === "object" && !isNaN(d)){
                currentDate = d;
                showType["date"]();
            } else {
                //todo: throw error "Incorrect date"
            }
        },
        hidePicker = function() {
            self.mainContainer.style.display = "none";
        },
        showPicker = function(input) {
            input = input || inputElement;
            self.mainContainer.style.top = input.offsetTop + input.offsetHeight +"px";
            self.mainContainer.style.left = input.offsetLeft+"px";
            self.mainContainer.style.display = "block";
        },
        isPickerVisible = function() {
            return self.mainContainer.style.display === "block";
        },
        preventDafeult = function(e){
            //fixed bug with showing keyboard for tablets that don't support date type
            e.preventDefault();
        },
        datepicker = function(options){
            var sl = this,
                input = inputElement,
                s = self,
                options = {
                    type:"date",
                    dateFormat: "dd/mm/yy"
                };


        },
        isArray = function(arr){
            return Object.prototype.toString.call(arr).indexOf("Array") !== -1;
        },
        isUsualObject = function(obj){
            return Object.prototype.toString.call(obj).indexOf("Object") !== -1;
        },
        extend = function(){
            var length = arguments.length,
                src, srcKeys, srcAttr,
                fullCopy = false,
                resAttr,
                res = arguments[0], i = 1, j;

            if (typeof res === "boolean"){
                fullCopy = res;
                res = arguments[1];
                i++;
            }
            while (i !== length){
                src = arguments[i];
                srcKeys = Object.keys(src);
                for (j = 0; j < srcKeys.length; j++){
                    srcAttr = src[srcKeys[j]];
                    if (fullCopy && (isUsualObject(srcAttr) || isArray(srcAttr))){
                        resAttr = res[srcKeys[j]] = res[srcKeys[j]] || (isArray(srcAttr) ? [] : {});
                        extend(fullCopy, resAttr, srcAttr);
                    } else {
                        res[srcKeys[j]] = src[srcKeys[j]];
                    }
                }
                i++;
            }
            return res;
        },
        on = function(eventName, handler) {
            if (!this._eventHandlers) this._eventHandlers = [];
            if (!this._eventHandlers[eventName]) {
                this._eventHandlers[eventName] = [];
            }
            this._eventHandlers[eventName].push(handler);
        },
        off = function(eventName, handler) {
            var handlers = this._eventHandlers[eventName];
            if (!handlers) return;
            for(var i=0; i<handlers.length; i++) {
                if (handlers[i] == handler) {
                    handlers.splice(i--, 1);
                }
            }
        },
        trigger = function(eventName) {
            if (!this._eventHandlers[eventName]) {
                return;
            }
            var handlers = this._eventHandlers[eventName];
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].apply(this, [].slice.call(arguments, 1));
            }
        },
        createNodes = function(){
            createMainContainer();
            createMonthYearTab();
            createScheduler();
            addEvents();
        },
        addEventsForInput = function(){
            var a = inputElement;
            on("onHidePicker", function(input){
                input === inputElement && hidePicker();
            });
            on("onShowPicker", function(input){
                input === inputElement
                    && (self.leftButton.onclick = onButtonClick)
                    && (self.rightButton.onclick = onButtonClick)
                    && showPicker();

            });
            if ("ontouchstart" in document.documentElement){
                a.addEventListener("touchstart", preventDafeult);
                a.addEventListener("touchend", preventDafeult);
                a.addEventListener("focus", preventDafeult);
            }
            a.onchange = function(){
                var value = this.value;
            };
            a.onclick = function() {
                if ( self.inputElemntLast !== this || !isPickerVisible() ){
                    self.inputElemntLast = this;
                    //showPicker(this);
                    trigger("onShowPicker",inputElement);
                    showType[pickerOptions.type]();
                    self.mainContainer.style.display = "block";
                }
            };
            a.onblur = function() {
                bd.addEventListener("click", bdEvent);
            }
        },
        dayNames = [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
        currentDate = null,
        todayDate = new Date(),
        pickerOptions = {
            dateFormat: "dd/mm/yy",
            timeFormat: "H:mm:ss",
            type: "date"
        };
    extend(true, pickerOptions,options);
    debugger;
    getElement();
    if (!self.mainContainer){
        createNodes();
    }
    addEventsForInput();

    return {
        attachEvent: function(event, handler){
            on(event,handler);
        },
        hide:function () {
//            hidePicker();
            trigger("onHidePicker",inputElement);
        },
        show:function() {
              //showPicker(input)
            trigger("onShowPicker",inputElement);
        },
        setDate:function(newDate){
            setNewDate(newDate);
        },
        getDate:function(){
            return currentDate;
        }
    }

}

