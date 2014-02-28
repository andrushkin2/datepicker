


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
        entitySelect,
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
                self.trigger("onHidePicker");
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
        createElementsForSelect= function(entitiesAr){
            if (!entitySelect){
                return;
            }
            clearChild(entitySelect);
            var length = entitiesAr.length,
                selectValue = entitySelect.value,
                onclick = function(){
                    var val = this.value,
                        tempVal,
                        int = parseInt(val),
                        isNan = isNaN(int),
                        newDate;
                    if (val === entitySelect.value){
                        return;
                    }
                    switch (entitySelect.entity){
                        case "month":
                            if (isNan){
                                tempVal = searchInString(val, monthNames);
                                if (tempVal !== null){
                                    entitySelect.value = tempVal;
                                } else {
                                    return;
                                }
                            } else {
                                entitySelect.value  = int;
                            }
                            newDate = new Date(currentDate.getFullYear(), entitySelect.value, currentDate.getDate(), hour.value, minutes.value, seconds.value);
                            break;
                        case "year":
                            if (!isNan){
                                entitySelect.value = int;
                            } else {
                                return;
                            }
                            newDate = new Date(entitySelect.value, currentDate.getMonth(), currentDate.getDate(), hour.value, minutes.value, seconds.value);
                            break;
                        default:
                            return;
                            break;
                    }
                    showOrHideElement(entitySelect, false);
                    if (!isNaN(newDate)){
                        setNewDate(newDate);
                    }
                },
                value,
                i,
                child,
                isSelected,
                res;
            for (i = 0; i < length; i++){
                value = entitiesAr[i];
                isSelected = value.toString() === selectValue.toString();
                child = createElement("div",{
                        class: "entity_child" + ((isSelected)? " selected" : "")
                    },
                    {
                        value: value,
                        onclick: onclick
                    })
                child.appendChild(createElement("span",{},{ innerHTML:value}));
                entitySelect.appendChild(child);
                if (isSelected){
                    res = child;
                }
            }
            return res;
        },
        createSelect = function(className){
            entitySelect = createElement("div", {class:"entity_select hidden"});
            mainContainer.appendChild(entitySelect);
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
                        addClass(tr, "time");
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.timeText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 1:
                        addClass(tr, "hours");
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.hourText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 2:
                        addClass(tr, "minutes");
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.minutesText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 3:
                        addClass(tr, "seconds");
                        tdName = createElement("td", {class:"descr"}, {innerHTML:pickerOptions.secondsText});
                        td = createElement("td", {class:"controls"});
                        td.appendChild(selectsAr[i]);
                        break;
                    case 4:
                        addClass(tr, "zones");
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
            var date = new Date(this["data-year"], this["data-month"], this["data-day"], hour.value, minutes.value, seconds.value);
            showType[pickerOptions.type](date);
        },
        onChangeSelect = function(e){
            var date = currentDate || todayDate,
                utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(hour.value), parseInt(minutes.value), parseInt(seconds.value));
            if (!isNaN(utcDate)){
                setNewDate(utcDate);
            }
        },
        searchInString = function(value, arr){
            var res = null;
            (arr || []).forEach(function(val, index){
                if (val.toLowerCase() === value.toLowerCase()){
                    res = (index > 11)? index-12 : index;
                }
            })
            return res;
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
                                t = 0,
                                H = false;
                            dateAr.forEach(function(elem, index){
                                var curIndex = index+ 1,
                                    value = res[curIndex],
                                    intValue =  parseInt(value);
                                isNan = isNaN(intValue);
                                switch (elem){
                                    case "month":
                                        date.month = (isNan)? searchInString(value, monthNames) : intValue - 1;
                                        break;
                                    case "year":
                                        if (!isNan){
                                            date.year = (value.length > 2)? intValue : 2000 + intValue;
                                        }
                                        break;
                                    case "yearShort":
                                        if (!isNan){
                                            var centery = (intValue <= pickerOptions.shortYearCutoff)? 2000 : 1900;
                                            date.year = centery + intValue;
                                        }
                                        break;
                                    case "Hours":
                                        H = true;
                                        date.hours = (!isNan)? intValue : null;
                                        break;
                                    case "date":
                                    case "hours":
                                    case "minutes":
                                    case "seconds":
                                    case "milliseconds":
                                        date[elem] = (!isNan)? intValue : null;
                                        break;
                                    case "t":
                                        if (!H && date.hours !== null){
                                            intValue = value.toLowerCase();
                                            if (/(a|am)/.test(intValue) && date.hours >= 12){
                                                if (date.hours === 12){
                                                    date.hours = 0;
                                                } else {
                                                    date.hours = date.hours - 12;
                                                }
                                            } else if (/(p|pm)/.test(intValue) && date.hours < 12){
                                                date.hours = date.hours + 12;
                                            }
                                        }
                                    default:
                                        break;
                                }
                            });
                            switch (pickerOptions.type){
                                case "date":
                                    date.hours = (date.hours !== null)? date.hours : hour.value;
                                    date.minutes = date.minutes || minutes.value;
                                    date.seconds = date.seconds || seconds.value;
                                    date.milliseconds = date.milliseconds || 0;
                                    break;
                                case "time":
                                    date.date = (date.date !== null)? date.date : currentDate.getDate();
                                    date.month = (date.month !== null)? date.month : currentDate.getMonth();
                                    date.year = date.year || currentDate.getFullYear();
                                    date.seconds = date.seconds || seconds.value;
                                    date.milliseconds = date.milliseconds || 0;
                                    break;
                                case "datetime":
                                    date.seconds = date.seconds || seconds.value;
                                    date.milliseconds = date.milliseconds || 0;
                            }
                            isNan = false;
                            for (a in date){
                                if (a === null){
                                    isNan = true;
                                    break
                                }
                            }
                            if (!isNan){
                                res = new Date(date.year,date.month, date.date, date.hours, date.minutes, date.seconds, date.milliseconds);
                                return res;
                            } else {
                                return null;
                            }
                        },
                        dateAr = [],
                        regexpText,
                        regexp,
                        newDate,
                        res,
                        d1_2 = "(\\d{1,2})",
                        d2 = "(\\d{2})",
                        flagFunc = function(name, returnVal){
                            return function(){
                                dateAr.push(name);
                                return returnVal;
                            };
                        },
                        flags = {
                            d:      flagFunc("date", d1_2),
                            dd:     flagFunc("date", d2),
                            ddd:    flagFunc("dateStr", getRegexpText(0, 7, dayNames)),
                            dddd:   flagFunc("dateStr", getRegexpText(7, 14, dayNames)),
                            m:      flagFunc("month", d1_2),
                            mm:     flagFunc("month", d2),
                            mmm:    flagFunc("month", getRegexpText(0, 12, monthNames)),
                            mmmm:   flagFunc("month", getRegexpText(12, 24, monthNames)),
                            yy:     flagFunc("yearShort", d2),
                            yyyy:   flagFunc("year", "(\\d{3,4})"),
                            h:      flagFunc("hours", d1_2),
                            hh:     flagFunc("hours", d2),
                            H:      flagFunc("Hour", d1_2),
                            HH:     flagFunc("Hours", d2),
                            M:      flagFunc("minutes", d1_2),
                            MM:     flagFunc("minutes", d2),
                            s:      flagFunc("seconds", d1_2),
                            ss:     flagFunc("seconds", d2),
                            l:      flagFunc("milliseconds", d1_2),
                            L:      flagFunc("milliseconds", d2),
                            t:      flagFunc("t", "(a|p)"),
                            tt:     flagFunc("t", "(am|pm)"),
                            T:      flagFunc("t", "(A|P)"),
                            TT:     flagFunc("t", "(AM|PM)")
                            /*,
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
                        newDate = getDateUTC(res, dateAr);
                        return newDate;
                    } else {
                        return null;
                    }
                }
            }
        })(),
        addClass = function(element, className){
            if ("classList" in document.documentElement){
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
        css = function(element, options){
            var style = element.style, opt;
            for (opt in options){
                style[opt] = options[opt];
            }
        },
        addOptionsToSelect = function(select, data, extraText){
            var length = data.length, i, opt,
                withTime = function(hour, text){
                    var int = parseInt(hour),
                        hours = hour + ((int < 12)? " AM" : " PM");

                    if (int === 0){
                        hours += " (12 AM)";
                    }
                    return hours;
                };
            for (i=0; i< length; i++){
                opt = createElement("option", {
                    class:"select_option",
                    value:data[i]
                }, {innerHTML:((!!extraText)? withTime(data[i], extraText) : data[i])});
                select.appendChild(opt);
            }
        },
        clearChild = function(element){
            var ch;
            while(ch = element.firstChild){
                element.removeChild(ch);
            }
        },
        getRange = function(range, step){
            var k = 1, res = [], i;
            if (isArray(range)){
                var length = range.length;
                if(step){
                    k= step;
                }
                for (i=0; i< length; i+=k){
                    res.push(range[i]);
                }
            }
            return res;
        },
        showOrHideElement = function(element, isShow){
            if (!element){
                return;
            }
            isShow = isShow === undefined? true : isShow;
            if (isShow){
                addClass(element, "shown");
                removeClass(element, "hidden");
            } else {
                addClass(element, "hidden");
                removeClass(element, "shown");
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
            if ("classList" in document.documentElement){
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
            if ("classList" in document.documentElement){
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
                gmtDate = new Date(year, month, day, hour.value, minutes.value, seconds.value);
            setNewDate(gmtDate, function(){
                //addClass(this, "selected_date");
            })
        },
        showType = (function(){
            return {
                date: function(date){
                    var today = todayDate,
                        current = currentDate,
                        showingDate = date || null,
                        funcForSelect = function(node, type, value, array){
                            return function(){
                                var length,
                                    childsHeight,
                                    heightCont = mainContainer.getBoundingClientRect().height,
                                    selected;
                                entitySelect.value = value;
                                entitySelect.entity = type;
                                selected = createElementsForSelect(array);
                                length = entitySelect.childElementCount;
                                showOrHideElement(entitySelect);
                                childsHeight = entitySelect.firstChild.offsetHeight * length;
                                css(entitySelect, {
                                    top: 0 +"px",
                                    left: this.offsetLeft + this.offsetParent.offsetLeft + "px"
                                });
                                if (childsHeight > heightCont){
                                    addClass(entitySelect, "overflow_y");
                                    if (selected){
                                        selected.scrollIntoView(false);
                                    }
                                } else {
                                    removeClass(entitySelect, "overflow_y");
                                }
                                entitySelect.onmouseenter = function(){
                                    entitySelect.onmouseleave = function(){
                                        showOrHideElement(this, false);
                                    }
                                }
                            }
                        },
                        arrTd,
                        lastTr,
                        counter,
                        days = 1,
                        lastDate,
                        month,
                        monthInt,
                        year,
                        i;
                    showOrHideElement(timeContainer, false);
                    showOrHideElement(myTab);
                    showOrHideElement(scheduler);
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
                    //attache entity selector if need it
                    if (!!pickerOptions.selectingMonth){
                        monthContainer.onclick = funcForSelect(monthContainer, "month", month, monthNames.slice(12));
                        addClass(monthContainer, "hover");
                    } else {
                        monthContainer.onclick = NOOP;
                        removeClass(monthContainer, "hover");
                    }
                    if (!!pickerOptions.selectingYear){
                        yearContainer.onclick = funcForSelect(yearContainer, "year", year.toString(), [2000, 2005,2013,2014,2015,2016,2017,2018,2019,2020]);
                        addClass(yearContainer, "hover");
                    } else {
                        yearContainer.onclick = NOOP;
                        removeClass(yearContainer, "hover");
                    }
                    //set buttons title
                    leftButton.title = (monthInt === 0)? monthString[11]+" "+(year-1) : monthString[monthInt-1]+" "+year;
                    leftButton["data-day"] = rightButton["data-day"] = 1;
                    leftButton["data-month"] = (monthInt === 0)? 11 : monthInt-1;
                    leftButton["data-year"] = (monthInt === 0)? year-1 : year;
                    leftButton.onclick = onButtonClick;
                    rightButton.onclick = onButtonClick;
                    rightButton.title = (monthInt === 11)? monthString[0]+" "+(year+1) : monthString[monthInt+1]+" "+year;
                    rightButton["data-month"] = (monthInt === 11)? 0 : monthInt+1;
                    rightButton["data-year"] = (monthInt === 11)? year+1 : year;
                    //set calendar
                    for (i=0; i<arrTd.length; i++){
                        var td = arrTd[i];
                        td.setAttribute("class", "");
                        if (i < counter){
                            td.onclick = NOOP;
                            td.innerHTML = "";
                            addClass(td, "space");
                        } else {
                            if (days <= lastDate){
                                td.onclick = setDate;
                                td.innerHTML = days;
                                td["data-day"]  = days;
                                td["data-month"] = monthInt ;
                                td["data-year"] = year;
                                addClass(td, "number");
                                if (!!current && !isNaN(current) && days === current.getDate()){
                                    if (monthInt === current.getMonth() && year === current.getFullYear()){
                                        addClass(td, "selected_date");
                                    }
                                } else if (!isNaN(today) && days === today.getDate()){
                                    if (monthInt === today.getMonth() && year === today.getFullYear()){
                                        addClass(td, "today_date");
                                    }
                                }
                                days++;
                            } else {
                                td.onclick = NOOP;
                                td.innerHTML = "";
                                td["data-day"]  = "";
                                td["data-month"] = "" ;
                                td["data-year"] = "";
                                addClass(td, "space");
                            }
                        }
                    }
                    lastTr = tableBody.querySelector("tr.datepicker_scheduler_calendar_body_last_row");
                    (lastTr.querySelectorAll(".space").length < 7 )? lastTr.style.display = "table-row" : lastTr.style.display = "none";

                    return true;
                },
                time: function(date){
                    var today = todayDate,
                        current = currentDate,
                        showingDate = current || null,
                        h,
                        min,
                        sec,
                        isTime = /\s?(tt|t|TT|T)\s?/.exec(pickerOptions.timeFormat);

                    showOrHideElement(timeContainer);
                    showOrHideElement(myTab, false);
                    showOrHideElement(scheduler, false);
                    showOrHideElement(tContTable.querySelector(".t_cont_table_row.seconds"), pickerOptions.showSeconds);
                    showOrHideElement(tContTable.querySelector(".t_cont_table_row.zones"), pickerOptions.showZones);
                    if (!showingDate){
                        showingDate = (!current)? today : current;
                    }
                    clearChild(hour);
                    clearChild(minutes);
                    clearChild(seconds);
                    addOptionsToSelect(hour, rangeHours, ((isTime && isTime.length === 2)? isTime[1] : false));
                    addOptionsToSelect(minutes, rangeMinutes);
                    addOptionsToSelect(seconds, rangeSeconds);

                    if (currentDate){
                        h = (currentDate.getHours()<10)? "0"+currentDate.getHours().toString() : currentDate.getHours().toString();
                        min = (currentDate.getMinutes()<10)? "0"+currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
                        sec = (currentDate.getSeconds()<10)? "0"+currentDate.getSeconds().toString() : currentDate.getSeconds().toString();
                        timeText.innerHTML = dateParser.toStringFormat(currentDate, pickerOptions.timeFormat);
                        hour.value = h;
                        minutes.value = min;
                        seconds.value = sec;
                    }

                    hour.onchange = onChangeSelect;
                    minutes.onchange = onChangeSelect;
                    seconds.onchange = onChangeSelect;

                	return true;
                },
                datetime: function(date){
                    showType.date(date);
                    showType.time();
                    showOrHideElement(timeContainer);
                    showOrHideElement(myTab);
                    showOrHideElement(scheduler);

                    return true;
                }
            }
        })(),
        setNewDate = function(newDate, callback){
            var d = (typeof newDate === "object")? newDate : (new Date(newDate));
            if (typeof d === "object" && !isNaN(d)){
                self.trigger("onChangeDate", currentDate, d);
                callback && callback();
            } else {
                //todo: throw error "Incorrect date"
            }
        },
        hidePicker = function() {
            showOrHideElement(mainContainer, false);
        },
        showPicker = function(input) {
            var input = input || inputElement,
                top,
                left,
                rectContainer = mainContainer.getBoundingClientRect(),
                inputRect = input.getBoundingClientRect(),
                offsetParent = mainContainer.offsetParent,
                isOffsetParentBody = !!offsetParent && offsetParent !== bd,
                offsetParentRect = (isOffsetParentBody)? offsetParent.getBoundingClientRect() : null;


            offsetParentRect = {
                top:(offsetParentRect)? offsetParentRect.top : 0,
                left:(offsetParentRect)? offsetParentRect.left : 0
            }
            if (!!isOffsetParentBody){
                offsetParentRect.top = offsetParentRect.top - offsetParent.scrollTop;
                offsetParentRect.left = offsetParentRect.left - offsetParent.scrollLeft;
            }
            top = inputRect.top - offsetParentRect.top + inputRect.height;
            left = inputRect.left - offsetParentRect.left;
            /*if ( (top + rectContainer.height) > offsetParentRect.height){
                top = offsetParentRect.height - 2 - rectContainer.height;
            }
            if ( (left + rectContainer.width) > offsetParentRect.width){
                left = offsetParentRect.width - 2 - rectContainer.width;
            }*/
            css(mainContainer, {
                top: top + "px",
                left: left + "px"
            });
            showOrHideElement(mainContainer);
        },
        isPickerVisible = function() {
            return isClassInElement(mainContainer, "shown");
        },
        preventDafeult = function(e){
            //fixed bug with showing keyboard for tablets that don't support date type
            e.preventDefault();
            self.trigger("onShowPicker");
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
            entitySelect = mainContainer.querySelector(".entity_select");
        },
        createNodes = function(){
            createMainContainer();
            createMonthYearTab();
            createScheduler();
            createTimeContainer();
            createSelect();
            addEvents();
        },
        addEventsForInput = function(isAddEvents){
            var a = inputElement,
                event = (!isAddEvents)? "remove" : "add";
            if (!isAddEvents){
                removeClass(inputElement,"hasDatePicker");
                self.off("onHidePicker", onHidePicker);
                self.off("onShowPicker", onShowPicker);
                self.off("onChangeDate", onChangeDate);
            } else {
                addClass(inputElement,"hasDatePicker");
                self.on("onHidePicker", onHidePicker);
                self.on("onShowPicker", onShowPicker);
                self.on("onChangeDate", onChangeDate);
            }

            if ("ontouchstart" in document.documentElement){
                /*a.addEventListener("touchstart", preventDafeult);
                a.addEventListener("touchend", preventDafeult);
                a.addEventListener("focus", preventDafeult);*/
            };
            a[event+"EventListener"]("input", onInput);
            a[event+"EventListener"]("change", onChange);
            a[event+"EventListener"]("click", onClickAndFocus);
            a[event+"EventListener"]("focus", onClickAndFocus);
            a[event+"EventListener"]("blur", onBlur);
        },
        onHidePicker = function(){
            hidePicker();
        },
        onShowPicker = function(){
            var h, m, s;
            if (!currentDate){
                clearChild(hour);
                clearChild(minutes);
                clearChild(seconds);
                updateRangeOfTime();
                h = (hour.value === "")? 0 : rangeHours[0];
                m = (minutes.value === "")? 0 : rangeMinutes[0];
                s = (seconds.value === "")? 0 : rangeSeconds[0];
                setNewDate(new Date(todayDate.getFullYear(), todayDate.getMonth(),todayDate.getDate(), h, m, s));
            } else {
                showType[pickerOptions.type]()
            }
            showPicker();

        },
        onChangeDate = function(oldDate, newDate){
            var stringDate = dateParser.toStringFormat(newDate, pickerOptions[pickerOptions.type+"Format"]);
            currentDate = newDate;
            if (inputElement.value !== stringDate){
                inputElement.value = stringDate
            }
            showType[pickerOptions.type](newDate);
        },
        onInput = function(e){
            e.preventDefault();
            var value = this.value,
                date;
            date = dateParser.fromStringFormat(value, pickerOptions[pickerOptions.type+"Format"]);
            if (!isNaN(date) && date !== null){
                setNewDate(date);
            }
        },
        onChange = function(e){
            var value = this.value;
            dateParser.fromStringFormat(value, pickerOptions.dateFormat);
        },
        onClickAndFocus = function() {
            if ( true || !isPickerVisible() ){
                inputElemntLast = this;
                self.trigger("onShowPicker");
            }
        },
        onBlur = function() {
            //bd.addEventListener("click", bdEvent);
        },
        destoy = function(){
            addEventsForInput(false);
            if(bd.querySelectorAll("input.hasDatePicker").length === 0){
                bd.removeChild(mainContainer);
            }
            inputElement.datepicker = null;
            delete inputElement.datepicker
        },
        updateRangeOfTime = function(){
            rangeHours = getRange(hoursAr, pickerOptions.stepHours);
            rangeMinutes = getRange(minutesAr, pickerOptions.stepMinutes);
            rangeSeconds = getRange(minutesAr, pickerOptions.stepSeconds);
        },
        dayNames = [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ],
        getMinutes = function(){
            var res = [], text;
            for (var i=0; i<60; i++){
                text = (i<10)? "0"+ i.toString() : i.toString();
                res.push(text);
            }
            return res;
        },
        getHours = function(){
            var res = [], text;
            for (var i=0; i<24; i++){
                text = (i<10)? "0"+ i.toString() : i.toString();
                res.push(text);
            }
            return res;
        },
        rangeHours,
        rangeMinutes,
        rangeSeconds,
        currentDate = null,
        hoursAr = getHours(),
        minutesAr = getMinutes(),
        todayDate = new Date(),
        pickerOptions = {
            dateFormat: "dd/mm/yy",
            timeFormat: "HH:MM:ss",
            datetimeFormat: "dd/mm/yy HH:MM:ss",
            type: "date",
            hourText:"Hours",
            minutesText:"Minutes",
            secondsText:"Seconds",
            zoneText:"Zone",
            timeText:"Time",
            selectingMonth: true,
            selectingYear: true,
            shortYearCutoff: 50,
            stepMinutes: 0,
            stepSeconds: 0,
            stepHours: 0,
            showSeconds:false,
            showZones:false
        };
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
    addEventsForInput(true);

    return inputElement.datepicker = {
        attachEvent: function(event, handler){
            self.on(event,handler);
        },
        detachEvent: function(event, handler){
            self.off(event, handler);
        },
        hide:function () {
            self.trigger("onHidePicker");
        },
        show:function() {
            self.trigger("onShowPicker");
        },
        setDate:function(newDate){
            setNewDate(newDate);
        },
        getDate:function(){
            return currentDate;
        },
        destroy: function(){
            destoy();
            // todo: Add method for remove container listeners
            delete this;
        }
    }

}

datepicker = function(elementId, some, options){
    return new _datepicker(elementId, some, options);
}