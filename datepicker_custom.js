(function(){
    var _datepicker = function(elementId, options, toStringFunc, fromStringFunc, toLocalDateTimeFunc){
        var self = this,
            bd = document.body,
            inputElement,
            objects = {
                mainContainer:null,
                myTab:null,
                leftButton:null,
                rightButton:null,
                centralPane:null,
                subCentralPane:null,
                monthContainer:null,
                yearContainer:null,
                timeContainer:null,
                subTimeContainer:null,
                timeText:null,
                hour:null,
                minutes:null,
                seconds:null,
                tContTable:null,
                zones:null,
                scheduler:null,
                subSchedulerContainer:null,
                calendar:null,
                tableHead:null,
                tableBody:null,
                entitySelect:null,
                buttonPanel: null,
                buttonNow: null,
                buttonDone: null
            },
            isMobile =  /Android|AppleWebKit|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/gim.test(navigator.userAgent.toLowerCase()),
            isSupportTouchEvents = ("ontouchstart" in document.documentElement),
            isSupportMSPointer = (!!window.navigator.msPointerEnabled),
            isSupportPointer = (!!window.PointerEvent),
            isMobileVersion = (isMobile && (isSupportPointer || isSupportMSPointer || isSupportTouchEvents)),
            inputElemntLast,
            NOOP = function(){},
            bdEvent = function(e){
                var target = e.target,
                    parent;

                if (isPickerVisible() && !target.datepicker ){
                    parent = target;
                    while (parent !== bd){
                        if (parent === objects.mainContainer){
                            showOrHideElement(objects.entitySelect, false);
                            return;
                        } else {
                            parent = parent.parentNode;
                        }
                    }
                    self.trigger("onHidePicker");
                }
            },
            resizeEvent = function(){
                if (isPickerVisible()){
                    showPicker(objects.mainContainer.inputElemntLast);
                }
            },
            getElement = function () {
                if (typeof elementId == "string"){
                    inputElement = bd.querySelector("#"+elementId+"[type='text']")
                } else {
                    if (elementId.jquery){
                        inputElement = elementId[0];
                    } else if (typeof elementId == "object"){
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
                if (!objects.mainContainer){
                    objects.mainContainer = createElement("div", {class:"datepicker_main_container"});
                }
                bd.appendChild(objects.mainContainer);
            },
            createMonthYearTab = function(){
                objects.myTab = createElement("div", {class:"month_year_tab"});
                objects.mainContainer.appendChild(objects.myTab);

                //left button
                objects.leftButton = createElement("button", {class:"month_year_tab_button l_button"});
                objects.leftButton.innerHTML = "&lt;";
                objects.myTab.appendChild(objects.leftButton);

                //right button
                objects.rightButton = createElement("button", {class:"month_year_tab_button r_button"});
                objects.rightButton.innerHTML = "&gt;";
                objects.myTab.appendChild(objects.rightButton);

                //central pane
                objects.centralPane = createElement("div", {class: "central_pane"});
                objects.myTab.appendChild(objects.centralPane);

                //sub pane
                objects.subCentralPane = createElement("div", {class:"central_pane_sub"});
                objects.centralPane.appendChild(objects.subCentralPane);

                //month container
                objects.monthContainer = createElement("div", {class:"central_pane_month"});
                objects.subCentralPane.appendChild(objects.monthContainer);

                //year container
                objects.yearContainer = createElement("div", {class:"central_pane_year"});
                objects.subCentralPane.appendChild(objects.yearContainer);
            },
            createElementsForSelect= function(entitiesAr){
                if (!objects.entitySelect){
                    return;
                }
                clearChild(objects.entitySelect);
                var length = entitiesAr.length,
                    selectValue = objects.entitySelect.value,
                    onclick = function(){
                        var val = this.value,
                            tempVal,
                            int = parseInt(val),
                            isNan = isNaN(int),
                            newDate,
                            showingDate = objects.entitySelect.showingDate || currentDate;
                        if (val === objects.entitySelect.value){
                            if (isMobileVersion){
                                showOrHideElement(objects.entitySelect, false);
                            } else {
                                return;
                            }
                        }
                        switch (objects.entitySelect.entity){
                            case "month":
                                if (isNan){
                                    tempVal = searchInString(val, pickerOptions.shortMonthNames.concat(pickerOptions.monthNames));
                                    if (tempVal !== null){
                                        objects.entitySelect.value = tempVal;
                                    } else {
                                        return;
                                    }
                                } else {
                                    objects.entitySelect.value  = int;
                                }
                                newDate = new Date(showingDate.getFullYear(), objects.entitySelect.value, showingDate.getDate(), objects.hour.value, objects.minutes.value, objects.seconds.value);
                                break;
                            case "year":
                                if (!isNan){
                                    objects.entitySelect.value = int;
                                } else {
                                    return;
                                }
                                newDate = new Date(objects.entitySelect.value, showingDate.getMonth(), showingDate.getDate(), objects.hour.value, objects.minutes.value, objects.seconds.value);
                                break;
                            default:
                                return;
                                break;
                        }
                        showOrHideElement(objects.entitySelect, false);
                        if (!isNaN(newDate)){
                            if (pickerOptions.changeDateOnClickNewYear && objects.entitySelect.entity === "year"){
                                setNewDate(newDate);
                                showPicker();
                            } else {
                                showType[pickerOptions.type](newDate);
                                showPicker();
                            }
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
                        });
                    child.appendChild(createElement("span",{},{ innerHTML:value}));
                    objects.entitySelect.appendChild(child);
                    if (isSelected){
                        res = child;
                    }
                }
                return res;
            },
            createButtonPanel = function(){
                objects.buttonPanel = createElement("div", {class:"button_panel"});
                objects.mainContainer.appendChild(objects.buttonPanel);

                objects.buttonNow = createElement("button",{
                    class:"button button_now"
                }, {innerHTML:pickerOptions.currentText});
                objects.buttonPanel.appendChild(objects.buttonNow);

                objects.buttonDone = createElement("button",{
                    class:"button button_done"
                }, {innerHTML:pickerOptions.closeText});
                objects.buttonPanel.appendChild(objects.buttonDone);
            },
            createSelect = function(){
                objects.entitySelect = createElement("div", {class:"entity_select hidden"});
                objects.mainContainer.appendChild(objects.entitySelect);
            },
            createTimeContainer = function(){
                var selectsAr, tr ,td, tdName, i;
                objects.timeContainer = createElement("div",{class:"time_container"});
                objects.mainContainer.appendChild(objects.timeContainer);

                //sub
                objects.subTimeContainer = createElement("div",{class:"datepicker_time_container_sub"});
                objects.timeContainer.appendChild(objects.subTimeContainer);

                objects.tContTable = createElement("table", {class:"t_cont_table"});
                objects.subTimeContainer.appendChild(objects.tContTable);

                objects.timeText = createElement("span", {class:"t_cont_time_text"});
                objects.hour = createElement("select", {class:"select datepicker_time_hour"});
                objects.minutes = createElement("select", {class:"select datepicker_time_minutes"});
                objects.seconds = createElement("select", {class:"select datepicker_time_seconds"});
                objects.zones = createElement("select", {class:"select datepicker_time_zones"});

                selectsAr = [objects.timeText, objects.hour, objects.minutes, objects.seconds, objects.zones];
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
                    objects.tContTable.appendChild(tr);
                }
            },
            createScheduler = function(){
                objects.scheduler = createElement("div", {class:"scheduler"});
                objects.mainContainer.appendChild(objects.scheduler);

                //sub container
                objects.subSchedulerContainer = createElement("div", {class:"scheduler_sub"});
                objects.scheduler.appendChild(objects.subSchedulerContainer);

                //table
                objects.calendar = createElement("table", {class:"scheduler_calendar"});
                objects.subSchedulerContainer.appendChild(objects.calendar);

                //table head
                objects.tableHead = createElement("thead", {
                    class:"calendar_header",
                    align:"center"
                });
                objects.calendar.appendChild(objects.tableHead);

                //table body
                objects.tableBody = createElement("tbody", {
                    class:"calendar_body",
                    align:"center"
                });
                createTableBody(objects.tableBody);
                objects.calendar.appendChild(objects.tableBody);
            },
            createTableBody = function(body){
                var i, j, tr, td;
                for ( i = 0; i < 6; i++){
                    tr = createElement("tr", {
                        class:((i + 1 === 6)? "datepicker_scheduler_calendar_body_last_row" : "")
                    });
                    for ( j = 0; j < 7; j++){
                        td = createElement("td",{
                            "data-day":"",
                            "data-month":"",
                            "data-year":""
                        });
                        tr.appendChild(td);
                    }
                    body.appendChild(tr);
                }
            },
            daysInMonth = function(date) {
                return 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
            },
            onButtonClick = function(){
                var date = new Date(this["data-year"], this["data-month"], this["data-day"], objects.hour.value, objects.minutes.value, objects.seconds.value);
                showType[pickerOptions.type](date);
                showPicker();
            },
            onChangeSelect = function(){
                var date = currentDate || todayDate,
                    utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(objects.hour.value), parseInt(objects.minutes.value), parseInt(objects.seconds.value));
                if (!isNaN(utcDate)){
                    setNewDate(utcDate, function(){
                        self.trigger("onChange");
                    });
                }
            },
            mainBlockClick = function(e){
                e.stopPropagation();
                if (isElementVisible(objects.entitySelect)){
                    showOrHideElement(objects.entitySelect, false);
                }
            },
            searchInString = function(value, arr){
                var res = null;
                (arr || []).forEach(function(val, index){
                    if (val.toLowerCase() === value.toLowerCase()){
                        res = (index > 11)? index-12 : index;
                    }
                });
                return res;
            },
            dateParser = (function(){
                return {
                    toStringFormat: toStringFunc,
                    fromStringFormat: fromStringFunc
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
                    if (options.hasOwnProperty(opt)){
                        style[opt] = options[opt];
                    }
                }
            },
            addOptionsToSelect = function(select, data, extraText){
                var length = data.length, i, opt,
                    withTime = function(hour){
                        var int = parseInt(hour),
                            hours = ((int < 13)? hour : hour-12) + ((int < 12)? " AM" : " PM");

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
            getRangeYear = function(range){
                var res = [], i,
                    lenght,
                    c = 2000,
                    rAr;
                if (isArray(range)){
                    lenght = range.length;
                    for (i = 0; i < lenght; i++){
                        res.push(range[i].toString());
                    }
                } else {
                    if (/c/.test(range)){
                        range = range.replace(/c/gim, "");
                        rAr = range.split(":");
                        for ( i = 0; i < 2; i++){
                            if (/-/.test(rAr[i])){
                                rAr[i] = parseInt(rAr[i].replace("-",""));
                                rAr[i] = c - (rAr[i] || 0);
                            } else {
                                rAr[i] = parseInt(rAr[i].replace("+",""));
                                rAr[i] = c + (rAr[i] || 0);
                            }
                        }
                    } else {
                        rAr = range.split(":");
                        for ( i = 0; i < 2; i++){
                            rAr[i] = parseInt(rAr[i]);
                        }
                    }
                    if (rAr[0] > rAr[1]){
                        var t = rAr[0];
                        rAr[0] = rAr[1];
                        rAr[1] = t;
                    }
                    for( i = rAr[0]; i <= rAr[1]; i++){
                        res.push(i.toString());
                    }
                }
                if (!res.length){
                    throw new Error("Unknown range of year!\r\nCheck your datepicker options");
                }
                return res;
            },
            getRangeMonth = function(range){
                var res = [], i, length, k = 1;
                if (isArray(range)){
                    length = range.length;
                    for (i = 0; i < length; i++){
                        res.push(pickerOptions.monthNames[range[i] - 1]);
                    }
                } else if (!isNaN(parseInt(range))){
                    length = pickerOptions.monthNames.length;
                    if (range > 1){
                        k = parseInt(range);
                    }
                    for (i=0; i< length; i+=k){
                        res.push(pickerOptions.monthNames[i]);
                    }
                }
                if (!res.length){
                    throw new Error("Unknown range of year!\r\nCheck your datepicker options");
                }
                return res;
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
                var elem = document.createElement(nodeName), opt;
                for (opt in options){
                    if (options.hasOwnProperty(opt)){
                        elem.setAttribute(opt,options[opt]);
                    }
                }
                for (opt in methods){
                    if (methods.hasOwnProperty(opt)){
                        elem[opt] = methods[opt];
                    }
                }
                return elem;
            },
            removeClass = function(element, className){
                if (element.classList){
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
                if (element.classList){
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
            isElementVisible = function(element){
                return isClassInElement(element, "shown");
            },
            onMousewheelAndScroll = function(e){
                e.stopPropagation();
            },
            addEvents = function(isAdd){
                var event = (isAdd)? "add" : "remove";
                bd[event + "EventListener"]("click", bdEvent);
                objects.mainContainer[event + "EventListener"]("click", mainBlockClick);
                window[event + "EventListener"]("resize", resizeEvent);
                objects.entitySelect[event+"EventListener"]("mousewheel", onMousewheelAndScroll);
                objects.entitySelect[event+"EventListener"]("scroll", onMousewheelAndScroll);
            },
            setDate = function(){
                var day = this["data-day"],
                    month = this["data-month"],
                    year = this["data-year"],
                    gmtDate = new Date(year, month, day, objects.hour.value, objects.minutes.value, objects.seconds.value);
                setNewDate(gmtDate, function(){
                    self.trigger("onChange");
                });
            },
            updateInputText = function(flag){
                var text = dateParser.toStringFormat(currentDate, pickerOptions[pickerOptions.type + "Format"]),
                    inputText = inputElement.value, date;
                if (text !== inputText){
                    if (!flag){
                        inputElement.value = text;
                    } else {
                        date = dateParser.fromStringFormat(inputText, pickerOptions[pickerOptions.type+"Format"]);
                        if (!!date && !isNaN(date) && date !== null){
                            date = checkNewDate(date);
                            if (date!== null){
                                setNewDate(date, function(){
                                    self.trigger("onChange");
                                });
                            }
                        }
                    }

                }
            },
            updateButtonPanelFunc = function(){
                showOrHideElement(objects.buttonPanel, pickerOptions.showButtonPanel);
                showOrHideElement(objects.buttonNow, pickerOptions.showNowButton);
                objects.buttonDone.onclick = function(){
                    hidePicker();
                };
                objects.buttonNow.onclick = function(){
                    var date = checkNewDate(toLocalDateTimeFunc(new Date()));
                    setNewDate(date, function(){
                        self.trigger("onChange");
                    });
                };
            },
            showType = (function(){
                return {
                    date: function(date){
                        var today = todayDate,
                            current = currentDate,
                            showingDate = date || null,
                            difDate,
                            funcForSelect = function(node, type, value, array, showingDate){
                                return function(e){
                                    var length,
                                        childsHeight,
                                        heightCont = objects.mainContainer.getBoundingClientRect().height,
                                        selected;
                                    e.stopPropagation();
                                    objects.entitySelect.showingDate = showingDate;
                                    objects.entitySelect.value = value;
                                    objects.entitySelect.entity = type;
                                    selected = createElementsForSelect(array);
                                    length = objects.entitySelect.childElementCount;
                                    showOrHideElement(objects.entitySelect);
                                    childsHeight = objects.entitySelect.firstChild.offsetHeight * length;
                                    css(objects.entitySelect, {
                                        top: 0 +"px",
                                        left: this.offsetLeft + this.offsetParent.offsetLeft + "px"
                                    });
                                    if (childsHeight > heightCont){
                                        addClass(objects.entitySelect, "overflow_y");
                                        if (selected){
                                            selected.scrollIntoView(true);
                                            objects.entitySelect.scrollTop = selected.offsetTop;
                                        }
                                    } else {
                                        removeClass(objects.entitySelect, "overflow_y");
                                    }
                                    if(!isMobileVersion){
                                        objects.entitySelect.onmouseenter = function(){
                                            objects.entitySelect.onmouseleave = function(){
                                                showOrHideElement(this, false);
                                            }
                                        }
                                    }
                                }
                            },
                            arrTd,
                            lastTr,
                            counter,
                            days = 1,
                            lastDate,
                            length = pickerOptions.minDayNames.length,
                            month,
                            monthInt,
                            year,
                            i,
                            tr = createElement("tr"),
                            minDaysAr,
                            prevDate,
                            nextDate;
                        updateInputText();
                        updateButtonPanelFunc();
                        showOrHideElement(objects.timeContainer, false);
                        showOrHideElement(objects.myTab);
                        showOrHideElement(objects.scheduler);
                        if (!showingDate){
                            showingDate = (!current)? today : current;
                        }
                        month = pickerOptions.monthNames[showingDate.getMonth()];
                        monthInt = showingDate.getMonth();
                        year = showingDate.getFullYear();

                        counter  = (new Date(year, monthInt, 1)).getDay();
                        if (pickerOptions.startWeekOnMonday){
                            counter = (counter === 0)? 6 : counter - 1;
                        } else {
                            //counter = counter - 1;
                        }
                        lastDate = daysInMonth(showingDate);
                        arrTd = objects.tableBody.querySelectorAll("td");
                        //clear and set days descriptions
                        clearChild(objects.tableHead);
                        minDaysAr = (pickerOptions.startWeekOnMonday)? pickerOptions.minDayNames.slice(1) : pickerOptions.minDayNames;
                        if (pickerOptions.startWeekOnMonday){
                            minDaysAr.push(pickerOptions.minDayNames[0]);
                        }
                        for (i = 0; i < length ; i++) {
                            td = createElement("td", {}, {
                                innerHTML: minDaysAr[i]
                            });
                            tr.appendChild(td);
                        }
                        objects.tableHead.appendChild(tr);
                        //set month and year
                        objects.monthContainer.innerHTML = month;
                        objects.yearContainer.innerHTML  = year;
                        //attache entity selector if need it
                        if (!!pickerOptions.selectingMonth){
                            objects.monthContainer.onclick = funcForSelect(objects.monthContainer, "month", month, rangeMonths, showingDate);
                            addClass(objects.monthContainer, "hover");
                        } else {
                            objects.monthContainer.onclick = NOOP;
                            removeClass(objects.monthContainer, "hover");
                        }
                        if (!!pickerOptions.selectingYear){
                            objects.yearContainer.onclick = funcForSelect(objects.yearContainer, "year", year.toString(), rangeYears, showingDate);
                            addClass(objects.yearContainer, "hover");
                        } else {
                            objects.yearContainer.onclick = NOOP;
                            removeClass(objects.yearContainer, "hover");
                        }
                        //set buttons title
                        prevDate = checkNewDate(new Date(((monthInt === 0)? year-1:year), ((monthInt === 0)? 11 : monthInt-1), 1, showingDate.getHours(), showingDate.getMinutes(), showingDate.getSeconds()), true);
                        objects.leftButton.title = pickerOptions.monthNames[prevDate.getMonth()]+ " "+ prevDate.getFullYear();
                        objects.leftButton["data-day"] = objects.rightButton["data-day"] = 1;
                        objects.leftButton["data-month"] = prevDate.getMonth();
                        objects.leftButton["data-year"] = prevDate.getFullYear();
                        objects.leftButton.onclick = onButtonClick;
                        objects.rightButton.onclick = onButtonClick;
                        nextDate = checkNewDate(new Date(((monthInt === 11)? year+1:year), ((monthInt === 11)? 0 : monthInt+1), 1, showingDate.getHours(), showingDate.getMinutes(), showingDate.getSeconds()), false);
                        objects.rightButton.title = pickerOptions.monthNames[nextDate.getMonth()]+ " "+ nextDate.getFullYear();
                        objects.rightButton["data-month"] = nextDate.getMonth();
                        objects.rightButton["data-year"] = nextDate.getFullYear();
                        //set calendar
                        for (i=0; i<arrTd.length; i++){
                            var td = arrTd[i];
                            td.setAttribute("class", "");
                            if (i < counter){
                                if (pickerOptions.showSiblingMonthsDays){
                                    difDate = new Date(year, monthInt, 1 -(counter - i), 12, 0, 0);
                                    td["data-day"]  = difDate.getDate();
                                    td["data-month"] = difDate.getMonth() ;
                                    td["data-year"] = difDate.getFullYear();
                                    td.onclick = setDate;
                                    td.innerHTML = difDate.getDate();
                                    addClass(td, "number");
                                    addClass(td, "grey");
                                } else {
                                    td.onclick = NOOP;
                                    td.innerHTML = "";
                                    td["data-day"]  = "";
                                    td["data-month"] = "" ;
                                    td["data-year"] = "";
                                    addClass(td, "space");
                                }
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
                                    if (pickerOptions.showSiblingMonthsDays){
                                        difDate = new Date(year, monthInt, days, 12, 0, 0);
                                        td["data-day"]  = difDate.getDate();
                                        td["data-month"] = difDate.getMonth() ;
                                        td["data-year"] = difDate.getFullYear();
                                        td.onclick = setDate;
                                        td.innerHTML = difDate.getDate();
                                        addClass(td, "number");
                                        addClass(td, "grey");
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
                        }
                        if (!pickerOptions.showSiblingMonthsDays){
                            lastTr = objects.tableBody.querySelector("tr.datepicker_scheduler_calendar_body_last_row");
                            (lastTr.querySelectorAll(".space").length < 7 )? lastTr.style.display = "table-row" : lastTr.style.display = "none";
                        }
                        return true;
                    },
                    time: function(){
                        var h,
                            min,
                            sec,
                            isTime = /\s?(tt|t|TT|T)\s?/.exec(pickerOptions.timeFormat);

                        updateInputText();
                        updateButtonPanelFunc();
                        showOrHideElement(objects.timeContainer);
                        showOrHideElement(objects.myTab, false);
                        showOrHideElement(objects.scheduler, false);
                        if (!pickerOptions.showSeconds){
                            addClass(objects.tContTable.querySelector(".t_cont_table_row.seconds"),"hidden");
                        } else {
                            removeClass(objects.tContTable.querySelector(".t_cont_table_row.seconds"),"hidden");
                        }
                        showOrHideElement(objects.tContTable.querySelector(".t_cont_table_row.zones"), pickerOptions.showZones);
                        clearChild(objects.hour);
                        clearChild(objects.minutes);
                        clearChild(objects.seconds);
                        addOptionsToSelect(objects.hour, rangeHours, ((isTime && isTime.length === 2)? isTime[1] : false));
                        addOptionsToSelect(objects.minutes, rangeMinutes);
                        addOptionsToSelect(objects.seconds, rangeSeconds);

                        if (currentDate){
                            h = (currentDate.getHours()<10)? "0"+currentDate.getHours().toString() : currentDate.getHours().toString();
                            min = (currentDate.getMinutes()<10)? "0"+currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
                            sec = (currentDate.getSeconds()<10)? "0"+currentDate.getSeconds().toString() : currentDate.getSeconds().toString();
                            objects.timeText.innerHTML = dateParser.toStringFormat(currentDate, pickerOptions.timeFormat);
                            objects.hour.value = h;
                            objects.minutes.value = min;
                            objects.seconds.value = sec;
                        }

                        objects.hour.onchange = onChangeSelect;
                        objects.minutes.onchange = onChangeSelect;
                        objects.seconds.onchange = onChangeSelect;

                        return true;
                    },
                    datetime: function(date){
                        showType.date(date);
                        showType.time();
                        updateButtonPanelFunc();
                        showOrHideElement(objects.timeContainer);
                        showOrHideElement(objects.myTab);
                        showOrHideElement(objects.scheduler);

                        return true;
                    }
                }
            })(),
            checkNewDate = function(date, prev){
                var dateNum = date.getDate(),
                    monthNum = date.getMonth(),
                    monthString = pickerOptions.monthNames[monthNum],
                    monthIncorrect = false,
                    monthNumAr = (function(){
                        var res = [],
                            length = rangeMonths.length, i;
                        for (i=0; i<length; i++){
                            res.push(searchInString(rangeMonths[i],pickerOptions.monthNames));
                        }
                        return res;
                    })(),
                    yearNum = date.getFullYear(),
                    yearString = yearNum.toString(),
                    yearIncorrect = false,
                    hour = (date.getHours() < 10)? "0"+date.getHours().toString() : date.getHours().toString(),
                    minutes = (date.getMinutes() < 10)? "0"+date.getMinutes().toString() : date.getMinutes().toString(),
                    second = (date.getSeconds() < 10)? "0"+date.getSeconds().toString() : date.getSeconds().toString(),
                    milliseconds = date.getMilliseconds() || 0,
                    minMaxValue = function(ar, value){
                        var length = ar.length, i;
                        if (value <= ar[0]){
                            return {
                                min:ar[0],
                                max:ar[1]
                            }
                        }
                        if (value >= ar[length-1]){
                            return {
                                min: ar[length-2],
                                max: ar[length-1]
                            }
                        }
                        for (i = 0; i < length; i++){
                            if (value < ar[i]){
                                return {
                                    min:ar[i-1],
                                    max:ar[i]
                                };
                            }
                        }
                    },
                    some = function(value){
                        return function(val){
                            return val === value;
                        }
                    };
                if (searchInString(monthString, rangeMonths) === null){
                    monthIncorrect = true
                }
                if (!rangeYears.some(some(yearString))){
                    yearIncorrect = true;
                }
                if (!rangeHours.some(some(hour))){
                    hour = minMaxValue(rangeHours, hour);
                    hour = (typeof prev === undefined || !prev)? hour.max : hour.min;
                }
                if (!rangeMinutes.some(some(minutes))){
                    minutes = minMaxValue(rangeMinutes, minutes);
                    minutes = (typeof prev === "undefined" || !prev)? minutes.max : minutes.min;
                }
                if (!rangeSeconds.some(some(second))){
                    second = minMaxValue(rangeSeconds, second);
                    second = (typeof prev === "undefined" || !prev)? second.max : second.min;
                }

                if (typeof prev === "undefined" || !prev){
                    if ((monthIncorrect && yearIncorrect) || (!monthIncorrect && yearIncorrect)){
                        monthNum = monthNumAr[0];
                        yearNum = minMaxValue(rangeYears, yearNum).max;
                        if ((!monthIncorrect && yearIncorrect) && yearNum == rangeYears[rangeYears.length-1]){
                            monthNum = monthNumAr[monthNumAr.length-1];
                        }
                        return new Date(yearNum, monthNum, dateNum, hour, minutes, second);
                    }
                    if (monthIncorrect && !yearIncorrect){
                        monthNum = minMaxValue(monthNumAr, monthNum).max;
                        /*if (monthNum.min === monthNum.max && yearNum == rangeYears[rangeYears.length-1]){
                         monthNum = monthNumAr[monthNumAr.length-1];
                         } else {
                         monthNum = monthNum.max;
                         }*/
                    }
                } else {
                    if ((monthIncorrect && yearIncorrect) || (!monthIncorrect && yearIncorrect)){
                        monthNum = monthNumAr[monthNumAr.length-1];
                        yearNum = minMaxValue(rangeYears, yearNum).min;
                        if ((!monthIncorrect && yearIncorrect) && yearNum == rangeYears[0]){
                            monthNum = monthNumAr[0];
                        }
                        return new Date(yearNum, monthNum, dateNum, hour, minutes, second);
                    }
                    if (monthIncorrect && !yearIncorrect){
                        monthNum = minMaxValue(monthNumAr, monthNum).min;
                        /*if (monthNum.min === monthNum.max && yearNum == rangeYears[0]){
                         monthNum = monthNumAr[0];
                         } else {
                         monthNum = monthNum.min;
                         }*/
                    }
                }
                return new Date(yearNum, monthNum, dateNum, hour, minutes, second, milliseconds);
            },
            setNewDate = function(newDate, callback){
                var getUTCDateFromString = function(dateString){
                        var date  = new Date(dateString),
                            newDate;
                        if (typeof date === "object" && !!date && !isNaN(date)){
                            newDate =  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCMilliseconds());
                        }
                        return newDate;
                    },
                    d = (typeof newDate === "object")? newDate : getUTCDateFromString(newDate),
                    correctDate;
                if (typeof d === "object" && !!d && !isNaN(d)){
                    correctDate = checkNewDate(d);
                    if (correctDate.getTime() !== d.getTime()){
                        if (pickerOptions.autoCorrectDate && (!currentDate || correctDate.getTime() !== currentDate.getTime())){
                            self.trigger("onChangeDate", currentDate, correctDate);
                        }
                    } else {
                        if (!currentDate || correctDate.getTime() !== currentDate.getTime()){
                            self.trigger("onChangeDate", currentDate, correctDate);
                        }
                    }

                    callback && callback();
                } else {
                    //todo: throw error "Incorrect date"
                }
            },
            hidePicker = function() {
                css(objects.mainContainer, {
                    display:"none"
                });
            },
            showPicker = function(input) {
                css(objects.mainContainer, {
                    display:"block"
                });
                input = input || inputElement;
                var top,
                    left,
                    bdRect = bd.getBoundingClientRect(),
                    rectContainer = objects.mainContainer.getBoundingClientRect(),
                    inputRect = input.getBoundingClientRect(),
                    offsetParentRect;
                offsetParentRect = {
                    top: 0 - bd.scrollTop,
                    left: 0 - bd.scrollLeft
                };

                top = inputRect.bottom - offsetParentRect.top;
                left = inputRect.left - offsetParentRect.left;
                if ( (top + rectContainer.height) > bdRect.height){
                    if (inputRect.top - rectContainer.height >= 0){
                        top = inputRect.top - rectContainer.height;
                    } else {
                        top = bdRect.height - 2 - rectContainer.height;
                    }
                }
                if ( (left + rectContainer.width) > bdRect.width){
                    left = bdRect.width - 2 - rectContainer.width;
                }
                css(objects.mainContainer, {
                    top: top + "px",
                    left: left + "px"
                });
            },
            isPickerVisible = function() {
                return objects.mainContainer.style.display === "block";
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
                objects = document.querySelector(".datepicker_main_container").objects;
            },
            createNodes = function(){
                createMainContainer();
                createMonthYearTab();
                createScheduler();
                createTimeContainer();
                createSelect();
                createButtonPanel();
                addEvents(true);
            },
            addEventsForInput = function(isAddEvents){
                var a = inputElement,
                    optionEvent,
                    event = (!isAddEvents)? "remove" : "add";
                if (!isAddEvents){
                    removeClass(inputElement,"hasDatePicker");
                    for (optionEvent in pickerOptions.on){
                        if (pickerOptions.on.hasOwnProperty(optionEvent)){
                            self.off(optionEvent, pickerOptions.on[optionEvent]);
                        }
                    }
                    self.off("onHidePicker", onHidePicker);
                    self.off("onShowPicker", onShowPicker);
                    self.off("onChangeDate", onChangeDate);
                } else {
                    addClass(inputElement,"hasDatePicker");
                    for (optionEvent in pickerOptions.on){
                        if (pickerOptions.on.hasOwnProperty(optionEvent)){
                            self.on(optionEvent, pickerOptions.on[optionEvent]);
                        }
                    }
                    self.on("onHidePicker", onHidePicker);
                    self.on("onShowPicker", onShowPicker);
                    self.on("onChangeDate", onChangeDate);
                }

                if ("ontouchstart" in document.documentElement){
                    a[event+"EventListener"]("touchstart", preventDafeult);
                    a[event+"EventListener"]("touchend", preventDafeult);
                    a[event+"EventListener"]("focus", preventDafeult);
                    a[event+"EventListener"]("input", onInput);
                    a[event+"EventListener"]("change", onChange);
                } else {
                    a[event+"EventListener"]("input", onInput);
                    a[event+"EventListener"]("change", onChange);
                    a[event+"EventListener"]("click", onClickAndFocus);
                    a[event+"EventListener"]("focus", onClickAndFocus);
                    a[event+"EventListener"]("blur", onBlur);
                }
            },
            onHidePicker = function(){
                hidePicker();
            },
            onShowPicker = function(){
                var h, m, s, date;
                objects.mainContainer.currentInput = inputElement;
                if (!currentDate){
                    clearChild(objects.hour);
                    clearChild(objects.minutes);
                    clearChild(objects.seconds);
                    updateRangeOfTime();
                    h = (objects.hour.value === "")? 0 : rangeHours[0];
                    m = (objects.minutes.value === "")? 0 : rangeMinutes[0];
                    s = (objects.seconds.value === "")? 0 : rangeSeconds[0];
                    date = new Date(todayDate.getFullYear(), todayDate.getMonth(),todayDate.getDate(), h, m, s);
                    setNewDate(checkNewDate(date));
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
                if (!objects.mainContainer.currentInput || objects.mainContainer.currentInput === inputElement){
                    showType[pickerOptions.type](newDate);
                }
                self.trigger("onAfterChangeDate", oldDate, newDate);
            },
            onInput = function(e){
                e.preventDefault();
                objects.mainContainer.inputElemntLast = this;
                var value = this.value.trim(),
                    date,
                    dateSecond = new Date(value),
                    format = pickerOptions[pickerOptions.type+"Format"];
                if ( !(!!dateSecond && !isNaN(dateSecond) && dateSecond !== null) && /[^\/\s\d:\.-]/.test(value)){
                    if (!/tt|TT|T|t|MMMM|MMM|dddd|ddd/.test(format)){
                        this.value = value.replace(/[^\/\s\d:\.-]/gi, "").trim();
                        return;
                    }
                }
                date = dateParser.fromStringFormat(value, format);
                if (!isNaN(date) && date !== null){
                    setNewDate(date, function(){
                        self.trigger("onChange");
                    });
                }
            },
            onChange = function(){
                var value = this.value, date;
                objects.mainContainer.inputElemntLast = this;
                date = dateParser.fromStringFormat(value, pickerOptions[pickerOptions.type + "Format"]);
                setNewDate(date, function(){
                    self.trigger("onChange");
                });
            },
            onClickAndFocus = function(e) {
                objects.mainContainer.inputElemntLast = this;
                if ( true || !isPickerVisible() ){
                    if (e.type === "focus" && objects.mainContainer.currentInput === this){
                        return;
                    }
                    inputElemntLast = this;
                    if(currentDate){
                        updateInputText(true);
                    }
                    self.trigger("onShowPicker");
                }
            },
            onBlur = function() {
                //bd.addEventListener("click", bdEvent);
            },
            destoy = function(){
                addEventsForInput(false);
                if((objects.mainContainer.amount - 1) === 0){
                    bd.removeChild(objects.mainContainer);
                    addEvents(false);
                }
                objects.mainContainer.amount -= 1;
                delete inputElement.datepicker;
                isDestroied = true;
            },
            updateRangeOfTime = function(){
                rangeMonths = getRangeMonth(pickerOptions.rangeMonths);
                rangeYears = getRangeYear(pickerOptions.rangeYears);
                rangeHours = getRange(hoursAr, pickerOptions.stepHours);
                rangeMinutes = getRange(minutesAr, pickerOptions.stepMinutes);
                rangeSeconds = getRange(minutesAr, pickerOptions.stepSeconds);
            },
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
            getOprions = function(options){
                var res = {},
                    a,
                    type = typeof options;
                if (type === "undefined"){
                    return pickerOptions;
                }
                if (type === "string"){
                    if (options in pickerOptions){
                        return pickerOptions[options];
                    } else {
                        return undefined;
                    }
                }
                if (type === "object"){
                    for (a in options){
                        if (options.hasOwnProperty(a)){
                            if (options[a] in pickerOptions){
                                if (pickerOptions.hasOwnProperty(options[a])){
                                    res[options[a]] = pickerOptions[options[a]];
                                }
                            } else {
                                res[options[a]] = undefined;
                            }
                        }
                    }
                }
                return res;
            },
            clearPicker = function(){
                currentDate = null;
                inputElement.value = "";
            },
            setOptions = function(options){
                var type = typeof options;
                if (type === "undefined"){
                    return "undefined";
                } else if (type === "object"){
                    addEventsForInput(false);
                    extend(false, pickerOptions, options);
                    addEventsForInput(true);
                    updateRangeOfTime();
                    setNewDate(currentDate);
                    if (!!currentDate){
                        if (objects.mainContainer.currentInput === inputElement && isPickerVisible()){
                            showType[pickerOptions.type]();
                        }
                        updateInputText();
                    }
                } else {
                    return "undefined";
                }
            },
            isDestroied = false,
            rangeHours,
            rangeMinutes,
            rangeSeconds,
            rangeMonths,
            rangeYears,
            currentDate = null,
            hoursAr = getHours(),
            minutesAr = getMinutes(),
            todayDate = toLocalDateTimeFunc(new Date()),
            pickerOptions = {
                dateFormat: "dd/MM/yy",
                timeFormat: "HH:mm:ss",
                datetimeFormat: "dd/MM/yy HH:mm:ss",
                type: "date",
                on: {},
                rangeMonths: 0,
                rangeYears:"c-50:c+50",
                hourText:"Hours",
                startWeekOnMonday: true,
                minutesText:"Minutes",
                secondsText:"Seconds",
                zoneText:"Zone",
                timeText:"Time",
                currentText:"Now",
                closeText: "Done",
                showButtonPanel: false,
                showNowButton: true,
                showSiblingMonthsDays: false,
                changeDateOnClickNewYear: false,
                minDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "St"],
                shortDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                autoCorrectDate: true,
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
            if (!this["_eventHandlers"]){
                this["_eventHandlers"] = [];
            }
            if (!this._eventHandlers[eventName]) {
                this._eventHandlers[eventName] = [];
            }
            this._eventHandlers[eventName].push(handler);
        };
        self.off = function(eventName, handler) {
            var handlers = this._eventHandlers[eventName],
                i,
                length;
            if (!handlers){
                return;
            }
            length = handlers.length;
            for(i = 0; i < length; i++) {
                if (handlers[i] == handler) {
                    handlers.splice(i--, 1);
                }
            }
        };
        self.trigger = function(eventName) {
            var handlers = this._eventHandlers[eventName],
                i,
                length;
            if (!handlers){
                return;
            }
            length = handlers.length;
            for (i = 0; i < length; i++) {
                handlers[i].apply(this, [].slice.call(arguments, 1));
            }
        };
        extend(false, pickerOptions,options || {});
        getElement();
        if (inputElement && inputElement.datepicker){
            return inputElement.datepicker;
        }
        if (!objects.mainContainer){
            if (document.querySelectorAll(".datepicker_main_container").length < 1){
                createNodes();
                objects.mainContainer.objects = objects;
                objects.mainContainer.amount = 1;
            } else{
                searchNodes();
                objects.mainContainer.amount += 1;
            }
        }
        addEventsForInput(true);
        updateRangeOfTime();

        if(inputElement){
            inputElement["datepicker"] = {
                attachEvent: function(event, handler){
                    if (!isDestroied) {
                        self.on(event,handler);
                    } else {
                        return undefined;
                    }
                },
                detachEvent: function(event, handler){
                    if (!isDestroied){
                        self.off(event, handler);
                    } else {
                        return undefined;
                    }
                },
                hide:function () {
                    if (!isDestroied){
                        self.trigger("onHidePicker");
                    } else {
                        return undefined;
                    }
                },
                show:function() {
                    if (!isDestroied){
                        self.trigger("onShowPicker");
                    } else {
                        return undefined;
                    }
                },
                setDate:function(newDate){
                    if (!isDestroied){
                        setNewDate(newDate);
                    } else {
                        return undefined;
                    }
                },
                getDate:function(){
                    if (!isDestroied){
                        return currentDate;
                    } else {
                        return undefined;
                    }
                },
                getOptions: function(options){
                    if (!isDestroied){
                        return getOprions(options);
                    } else {
                        return undefined;
                    }
                },
                setOptions: function(options){
                    if (!isDestroied){
                        setOptions(options);
                    } else {
                        return undefined;
                    }
                },
                clear: function(){
                    if (!isDestroied){
                        clearPicker();
                    } else {
                        return undefined;
                    }
                },
                destroy: function(){
                    if (!isDestroied){
                        destoy();
                    }
                    return isDestroied;
                }
            };
            return inputElement.datepicker;
        }
    };
    if (!window.datepicker){
        window.datepicker = function(elementId, options, toStringFunc, fromStringFunc, toLocalDateTimeFunc){
            return new _datepicker(elementId, options, toStringFunc, fromStringFunc, toLocalDateTimeFunc);
        };
    } else {
        throw new Error("datepicker is already exist");
    }
})(window);