


window.onerror = function(message, source, lineno) {
		  alert("Error:"+message +"\n" +
		    "File:" + source + "\n" +
		    "Line:" + lineno);
};

_datepicker = function(elementId, some, options){
	var self = this,
        bd = document.body,
        monthString = ["January","February","February","April","May","June","July","August","September","October","November","December"],
        inputElement,
        mainContainer,
        myTab,
        leftButton,
        rightButton,
        centralPane,
        subCentralPane,
        monthContainer,
        yearContainer,
        timeContainer,
        subTimeContainer,
        timeText,
        hour,
        minutes,
        seconds,
        tContTable,
        zones,
        scheduler,
        subSchedulerContainer,
        calendar,
        tableHead,
        tableBody,
        inputElemntLast,
        NOOP = function(){},
        bdEvent = function(e){
            var target = e.target,
                parent;

            if (isPickerVisible() && !target.datepicker ){
                parent = target;
                while (parent !== bd){
                    if (parent === mainContainer){
                        return;
                    } else {
                        parent = parent.parentNode;
                    }
                }
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
            if (!mainContainer){
                mainContainer = createElement("div", {class:"datepicker_main_container"});
            }
            bd.appendChild(mainContainer);
        },
        createMonthYearTab = function(){
            myTab = createElement("div", {class:"month_year_tab"});
            mainContainer.appendChild(myTab);

            //left button
            leftButton = createElement("button", {class:"month_year_tab_button l_button"});
            leftButton.innerHTML = "<";
            myTab.appendChild(leftButton);

            //right button
            rightButton = createElement("button", {class:"month_year_tab_button r_button"});
            rightButton.innerHTML = ">";
            myTab.appendChild(rightButton);

            //central pane
            centralPane = document.createElement("div");
            centralPane.className = "central_pane";
            myTab.appendChild(centralPane);

            //sub pane
            subCentralPane = createElement("div", {class:"central_pane_sub"});
            centralPane.appendChild(subCentralPane);

            //month container
            monthContainer = createElement("div", {class:"central_pane_month"});
            subCentralPane.appendChild(monthContainer);

            //year container
            yearContainer = createElement("div", {class:"central_pane_year"});
            subCentralPane.appendChild(yearContainer);
        },
        createTimeContainer = function(){
            var selectsAr, tr ,td, tdName, i;
            timeContainer = createElement("div",{class:"time_container"});
            mainContainer.appendChild(timeContainer);

            //sub
            subTimeContainer = createElement("div",{class:"datepicker_time_container_sub"});
            timeContainer.appendChild(subTimeContainer);

            tContTable = createElement("table", {class:"t_cont_table"});
            subTimeContainer.appendChild(tContTable);
            
            timeText = createElement("span", {class:"t_cont_time_text"});
            hour = createElement("select", {class:"select datepicker_time_hour"});
            minutes = createElement("select", {class:"select datepicker_time_minutes"});
            seconds = createElement("select", {class:"select datepicker_time_seconds"});
            zones = createElement("select", {class:"select datepicker_time_zones"});

            selectsAr = [timeText, hour, minutes, seconds, zones];
            for (i=0; i<5; i++){
                tr = createElement("tr", {class:"t_cont_table_row"});
                switch (i){
                    case 0:
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.timeText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 1:
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.hourText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 2:
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.minutesText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 3:
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.secondsText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 4:
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.zoneText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                }
                tr.appendChild(tdName);
                tr.appendChild(td);
                tContTable.appendChild(tr);
            }
        },
        createScheduler = function(){
            scheduler = createElement("div", {class:"scheduler"});
            mainContainer.appendChild(scheduler);

            //sub container
            subSchedulerContainer = createElement("div", {class:"scheduler_sub"});
            scheduler.appendChild(subSchedulerContainer);

            //table
            calendar = createElement("table", {class:"scheduler_calendar"});
            subSchedulerContainer.appendChild(calendar);

            //table head
            tableHead = createElement("thead", {
                class:"calendar_header",
                align:"center"
            });
            tableHead.innerHTML = "<tr>" +
                                            "<td>Mon</td>" +
                                            "<td>Tue</td>" +
                                            "<td>Wed</td>" +
                                            "<td>Thu</td>" +
                                            "<td>Fri</td>" +
                                            "<td>Sat</td>" +
                                            "<td>Sun</td>" +
                                        "</tr>";
            calendar.appendChild(tableHead);

            //table body
            tableBody = createElement("tbody", {
                class:"calendar_body",
                align:"center"
            });
            tableBody.innerHTML = createTableBody();
            calendar.appendChild(tableBody);
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
                },
                fromStringFormat: function(dateString, format, utc){
                    if (format.slice(0, 4) == "UTC:") {
                        format = format.slice(4);
                        utc = true;
                    }
                    var _ = utc ? "getUTC" : "get",
                        getRegexpText = function(start, end, arr){
                            var res = "(", i;
                            for (var i=start; i<end; i++){
                                res += (i !== (end-1))? arr[i]+"|" : arr[i];
                            }
                            res += ")";
                            return res;
                        },
                        getDateUTC = function(res, dateAr){
                            var date = {
                                    date: null,
                                    month: null,
                                    year: null,
                                    hours: 12,
                                    minutes: 0,
                                    seconds: 0,
                                    milliseconds: 0
                                },
                                a,
                                isNan,
                                res,
                                searchInString = function(value, arr){
                                    var res = null;
                                    (arr || []).forEach(function(val, index){
                                        if (val === value){
                                            res = (index > 11)? index-12 : index;
                                            return;
                                        }
                                    })
                                    return res;
                                };
                            dateAr.forEach(function(elem, index){
                                var curIndex = index+ 1,
                                    value = res[curIndex];
                                switch (elem){
                                    case "date":
                                        date.date = (!isNaN( parseInt(value)))? parseInt(value) : null
                                        break;
                                    case "month":
                                        isNan = isNaN(parseInt(value));
                                        if (isNan){
                                            date.month = searchInString(value, monthNames);
                                            break;
                                        } else {
                                            date.month = parseInt(value);
                                            break;
                                        }
                                    case "year":
                                        isNan = isNaN(parseInt(value));
                                        if (!isNan){
                                            if (value.length === 4){
                                                date.year = parseInt(value);
                                                break;
                                            } else {
                                                date.year = 2000 + parseInt(value);
                                                break
                                            }
                                        }
                                    default:
                                        break;
                                }
                            });
                            isNan = false;
                            for (a in date){
                                if (a === null){
                                    isNan = true;
                                    break
                                }
                            }
                            if (!isNan){
                                res = Date.UTC(date.year,date.month, date.date, date.hours, date.minutes, date.seconds);
                                return (new Date(res));
                            } else {
                                return null;
                            }
                        },
                        dateAr = [],
                        regexpText,
                        regexp,
                        newDate,
                        res,
                        flags = {
                            d:    function(){
                                dateAr.push("date");
                                return "(\\d{1,2})";
                            },
                            dd:   function(){
                                dateAr.push("date");
                                return "(\\d{2})";
                            },
                            ddd:  function(){
                                dateAr.push("date");
                                return getRegexpText(0, 7, dayNames);
                            },
                            dddd: function(){
                                dateAr.push("date");
                                return getRegexpText(7, 14, dayNames);
                            },
                            m:    function(){
                                dateAr.push("month");
                                return "(\\d{1,2})";
                            },
                            mm:   function(){
                                dateAr.push("month");
                                return "(\\d{2})";
                            },
                            mmm:  function(){
                                dateAr.push("month");
                                return getRegexpText(0, 12, monthNames);
                            },
                            mmmm: function(){
                                dateAr.push("month");
                                return getRegexpText(12, 24, monthNames);
                            },
                            yy:   function(){
                                dateAr.push("year");
                                return "(\\d{2})";
                            },
                            yyyy: function(){
                                dateAr.push("year");
                                return "(\\d{4})"
                            }/*,
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
                             S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]*/
                        };

                    regexpText = format.replace(token, function ($0) {
                        return $0 in flags ? flags[$0]() : $0.toString();
                    });
                    regexp = new RegExp(regexpText, "g");
                    res = regexp.exec(dateString);
                    if (!!res && res.length && (res.length-1) === dateAr.length){
                        //todo: function for create date
                        newDate = getDateUTC(res, dateAr);
                        //console.log(newDate.toUTCString());
                        return newDate;
                    } else {
                        //console.log("Error parse date:\r\n"+ JSON.stringify({date:dateString,dateFormat:format},null,"\t"));
                        return null;
                    }
                }
            }
        })(),
        addClass = function(element, className){
            if (false && "classList" in document.documentElement){
                element.classList.add(className);
            } else {
                var reg = new RegExp("\\s?"+className, "gim"),
                    classObj = element.attributes.getNamedItem("class");
                if (!classObj){
                    element.setAttribute("class",className);
                } else {
                    if (!reg.test(classObj.textContent)){
                        classObj.textContent += " "+className;
                    }
                }
            }
        },
        createElement = function(nodeName, options, methods){
            var elem = document.createElement(nodeName), otp;
            for (opt in options){
                elem.setAttribute(opt,options[opt]);
            }
            for (opt in methods){
                elem[opt] = methods[opt];
            }
            return elem;
        },
        removeClass = function(element, className){
            if (false && "classList" in document.documentElement){
                element.classList.remove(className);
            } else {
                var reg = new RegExp("\\s?"+className, "gim"),
                    classObj = element.attributes.getNamedItem("class"),
                    text;
                if (!!classObj){
                    text = classObj.textContent.replace(reg, "");
                    element.setAttribute("class", text);
                }
            }
        },
        isClassInElement = function(element, className){
            if (false && "classList" in document.documentElement){
                return element.classList.contains(className);
            } else {
                var reg = new RegExp("\\s?"+className, "gim"),
                    classObj = element.attributes.getNamedItem("class");
                if (!!classObj){
                    return reg.test(classObj.textContent)
                } else {
                    return false;
                }
            }
        },
        addEvents = function(){
            bd.addEventListener("click", bdEvent);
        },
        setDate = function(){
            var day = this["data-day"],
                month = this["data-month"],
                year = this["data-year"],
                gmtDate = new Date(year, month, day, 12, 0, 0);
            this.className += " selected_date";
            currentDate = gmtDate;
            trigger("onChangeDate", inputElement, inputElement['currentDate'], currentDate);
        },
        showType = (function(){
            return {
                date: function(date){
                   /*if (inputElement.value !== ""){
                       dateParser.fromStringFormat(inputElement.value, pickerOptions.dateFormat);
                   }*/
                    var today = todayDate,
                        current = currentDate,
                        showingDate = date || null,
                        arrTd,
                        lastTr,
                        counter,
                        days = 1,
                        lastDate,
                        month,
                        monthInt,
                        year,
                        i;
                    	timeContainer.style.display = "none";
              		  	myTab.style.display = "block";
              			scheduler.style.display = "block";
                    if (!showingDate){
                        showingDate = (!current)? today : current;
                    }
                    month = monthNames[12+showingDate.getMonth()];
                    monthInt = showingDate.getMonth();
                    year = showingDate.getFullYear();

                    counter  = (new Date(year, monthInt, 1)).getDay();
                    counter = (counter === 0)? 6 : counter - 1;
                    lastDate = daysInMonth(showingDate);
                    arrTd = tableBody.querySelectorAll("td");
                    //set month and year
                    monthContainer.innerHTML = month;
                    yearContainer.innerHTML  = year;
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
                    lastTr = tableBody.querySelector("tr.datepicker_scheduler_calendar_body_last_row");
                    (lastTr.querySelectorAll(".space").length < 7 )? lastTr.style.display = "table-row" : lastTr.style.display = "none";

                    return true;
                },
                time: function(date){
                	timeContainer.style.display = "block";
                	myTab.style.display = "none";
                	scheduler.style.display = "none";
                	return true;
                }
            }
        })(),
        setNewDate = function(newDate){
            var d = (typeof newDate === "object")? newDate : (new Date(newDate));
            if (typeof d === "object" && !isNaN(d)){
                trigger("onChangeDate",inputElement, currentDate, d);
            } else {
                //todo: throw error "Incorrect date"
            }
        },
        hidePicker = function() {
            addClass(mainContainer,"hidden");
            removeClass(mainContainer,"shown");
        },
        showPicker = function(input) {
            var input = input || inputElement;
            mainContainer.style.top = input.offsetTop + input.offsetHeight +"px";
            mainContainer.style.left = input.offsetLeft+"px";
            addClass(mainContainer,"shown");
            //mainContainer.style.display = "block";
            removeClass(mainContainer,"hidden");
        },
        isPickerVisible = function() {
            return isClassInElement(mainContainer, "shown");
        },
        preventDafeult = function(e){
            //fixed bug with showing keyboard for tablets that don't support date type
            e.preventDefault();
            trigger("onShowPicker");
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
        searchNodes = function(){
            mainContainer = document.querySelector(".datepicker_main_container");
            myTab = mainContainer.querySelector(".month_year_tab");
            leftButton = mainContainer.querySelector(".month_year_tab_button.l_button");
            rightButton = mainContainer.querySelector(".month_year_tab_button.r_button");
            centralPane = mainContainer.querySelector(".central_pane");
            subCentralPane = mainContainer.querySelector(".central_pane_sub");
            monthContainer = mainContainer.querySelector(".central_pane_month");
            yearContainer = mainContainer.querySelector(".central_pane_year");
            scheduler = mainContainer.querySelector(".scheduler");
            subSchedulerContainer = mainContainer.querySelector(".scheduler_sub");
            calendar = mainContainer.querySelector(".scheduler_calendar");
            tableHead = mainContainer.querySelector(".calendar_header");
            tableBody = mainContainer.querySelector(".calendar_body");
            timeContainer = mainContainer.querySelector(".time_container");
            subTimeContainer = mainContainer.querySelector(".datepicker_time_container_sub");
            tContTable = mainContainer.querySelector(".t_cont_table");
            timeText = mainContainer.querySelector(".t_cont_time_text");
            zones = mainContainer.querySelector(".datepicker_time_zones");
            hour = mainContainer.querySelector(".select.datepicker_time_hour");
            minutes = mainContainer.querySelector(".select.datepicker_time_minutes");
            seconds = mainContainer.querySelector(".select.datepicker_time_seconds");
        },
        createNodes = function(){
            createMainContainer();
            createMonthYearTab();
            createScheduler();
            createTimeContainer();
            addEvents();
        },
        addEventsForInput = function(){
            var a = inputElement;
            on("onHidePicker", function(input){
                input === inputElement && hidePicker();
            });
            on("onShowPicker", function(input){
                input === inputElement
                    && (leftButton.onclick = onButtonClick)
                    && (rightButton.onclick = onButtonClick)
                    && showType[pickerOptions.type]()
                    && showPicker();

            });
            on("onChangeDate", function(input, oldDate, newDate){
                var stringDate = dateParser.toStringFormat(newDate, pickerOptions.dateFormat);
                if (input !== inputElement){
                    return
                }
                currentDate = newDate;
                if (input.value !== stringDate){
                    input.value = stringDate
                }
                showType[pickerOptions.type](newDate);
            });
            if ("ontouchstart" in document.documentElement){
                /*a.addEventListener("touchstart", preventDafeult);
                a.addEventListener("touchend", preventDafeult);
                a.addEventListener("focus", preventDafeult);*/
            };
            a.oninput = function(e){
                e.preventDefault();
                var value = this.value,
                    date;
                date = dateParser.fromStringFormat(value, pickerOptions.dateFormat);
                if (!isNaN(date) && date !== null){
                    trigger("onChangeDate",inputElement, inputElement['currentDate'], date);
                }
            };
            a.onchange = function(e){
                var value = this.value;
                dateParser.fromStringFormat(value, pickerOptions.dateFormat);
            };
            a.onclick = function() {
                if ( true || !isPickerVisible() ){
                    inputElemntLast = this;
                    trigger("onShowPicker",inputElement);
                }
            };
            a.onblur = function() {
                //bd.addEventListener("click", bdEvent);
            }
        },
        dayNames = [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ],
        currentDate = null,
        todayDate = new Date(),
        pickerOptions = {
            dateFormat: "dd/mm/yy",
            timeFormat: "H:mm:ss",
            dateTimeFormat: "dd/mm/yy H:mm:ss",
            type: "date",
            hourText:"Hours",
            minutesText:"Minutes",
            secondsText:"Seconds",
            zoneText:"Zone",
            timeText:"Time",
            showSeconds:false,
            showZones:false
        };
    extend(true, pickerOptions,options);
    getElement();
    if (!mainContainer){
        if (document.querySelectorAll(".datepicker_main_container").length < 1){
            createNodes();
        } else{
            searchNodes();
        }
    }
    addEventsForInput();

    return inputElement.datepicker = {
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

datepicker = function(elementId, some, options){
    return new _datepicker(elementId, some, options);
}