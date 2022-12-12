jQuery.noConflict();
var cpt = 1;
var recurrenceEditMode = 'current';
var keyTimer = null;
function dateFormat(inputDate, format) {
	const date = new Date(inputDate);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	format = format.replace("MM", month.toString().padStart(2, "0"));
	if (format.indexOf("yyyy") > -1) {
		format = format.replace("yyyy", year.toString());
	} else if (format.indexOf("yy") > -1) {
		format = format.replace("yy", year.toString().substr(2, 2));
	}
	format = format.replace("dd", day.toString().padStart(2, "0"));
	return format;
}

function getResourceName(resourceId) {
	var listing_name = '';
	jQuery.each(section_resources, function (index, value) {
		if (value.id == resourceId) {
			listing_name = value.full_text;
		}
	});
	return listing_name;
}

function triggerEventClick(info_date, event, className) {
	jQuery('#editorTab').appendTo(jQuery("#editorInnerTab"));
	console.log(jQuery("#editorInnerTab"));
	jQuery("#editorInnerTab").show();
	if (typeof (info_date) != 'undefined') {
		var indate = info_date;
		if (typeof (indate) != 'undefined') {
			indate = moment(indate).format("YYYY-MM-DD");
			jQuery('#schedule-add').find('#wpm-initial-date').val(indate);
		}
	}
	localStorage.setItem("event_id", event.id);

	var flag = 1;
	if (typeof (className) != 'undefined') {
		if (className.indexOf('k-i-close') >= 0) {
			if (confirm('Are you sure you want to delete this task?')) {
				if (cal_type != "view_only") {
					let loader = jQuery('#loader').append('<div class="loader-14"></div>');
					schedulerTasks.splice(getIndexById(info.event.id), 1);
					//console.log(schedulerTasks);
					jQuery.post(
						WPMAddRecord.ajaxurl, {
							action: 'wpm_delete_record',
							id: event.id,
						},
						function (response) {
							jQuery('#toast-container').append('<div id="toast' + (cpt) + '" class="toast erreur toast-entrance d-flex"><div class="d-flex justify-content-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" class="eva eva-checkmark-circle-outline" fill="#ffffff"><g data-name="Layer 2"><g data-name="checkmark-circle"><rect width="24" height="24" opacity="0"></rect><path d="M9.71 11.29a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 16a1 1 0 0 0 .72-.34l7-8a1 1 0 0 0-1.5-1.32L12 13.54z"></path><path d="M21 11a1 1 0 0 0-1 1 8 8 0 0 1-8 8A8 8 0 0 1 6.33 6.36 7.93 7.93 0 0 1 12 4a8.79 8.79 0 0 1 1.9.22 1 1 0 1 0 .47-1.94A10.54 10.54 0 0 0 12 2a10 10 0 0 0-7 17.09A9.93 9.93 0 0 0 12 22a10 10 0 0 0 10-10 1 1 0 0 0-1-1z"></path></g></g></svg></div>Event is deleted successfully.</div>')

							var val = cpt;
							setTimeout(function () {
								jQuery('#toast' + val).remove();
							}, 5500);

							cpt++;
							get_booking_data(calendar);
						});
				}
			}
			flag = 0;
		}
	}
	if (flag == 1) {
		console.log('eventA ', event);
		if (typeof (event.recurring) != 'undefined') {
			jQuery('#repeat_selection').prop('checked', true);
			jQuery(".status-recurrence").val(event.recurring);
			if (event.recurring != '') {
				jQuery('#theModal').toggleClass('show');

				jQuery("#modal-dismiss").click(function () {
					jQuery("#theModal").removeClass("show");
				});
			}
		} else {
			jQuery('#repeat_selection').prop('checked', false);
			jQuery(".status-recurrence").val(' ');
			jQuery("#theModal").removeClass("show");
			if (typeof (event.recurrenceId) != 'undefined' && event.recurrenceId != '' && event.recurrenceId != null) {
				jQuery('#wpm-recurrenceId').val(event.recurrenceId);
			}
			jQuery('#wpm-resourceId').val(event.sectionResourcesId);
			var listing_name = getResourceName(event.resource);
			jQuery('#wpm_listing').val(listing_name);
			jQuery('#schedule-add').find('#wpm-client').val(event.client.value);
			jQuery('#schedule-add select#wpm-client').trigger('change');

			var start_ev = (new Date(new Date(event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
			var end_ev = (new Date(new Date(event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);

			//DevMaster Created
			function padTo2Digits(num) {
				return num.toString().padStart(2, '0');
			}

			function formatDate(date) {
				return (
					[
						date.getFullYear(),
						padTo2Digits(date.getMonth() + 1),
						padTo2Digits(date.getDate()),
					].join('-') +
					' ' + [
						padTo2Digits(date.getHours()),
						padTo2Digits(date.getMinutes()),
						// padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
					].join(':')
				);
			}

			var [date_start, time_start] = formatDate(new Date(event.start)).split(' ');
			var [date_end, time_end] = formatDate(new Date(event.end)).split(' ');

			jQuery('#schedule-add').find('#wpm-date-start').val(date_start);
			jQuery('#schedule-add').find('#wpm-time-start').val(time_start);
			jQuery('#schedule-add').find('#wpm-date-end').val(date_end);
			jQuery('#schedule-add').find('#wpm-time-end').val(time_end);
			jQuery('#schedule-add').find('#wpm-description').html(event.description);
			jQuery('#schedule-add').find('#wpm-status').val(event.status.value);
			jQuery('#schedule-add').find('.save-event').removeClass('save-event').addClass('update-event').html('Update');
			jQuery('#schedule-add').modal('show');
			jQuery('.main-k-first').addClass("k-state-active");
			jQuery(".main-k-first").attr("aria-pressed", "true");
			jQuery('.main-k-second').removeClass("k-state-active");
			jQuery(".main-k-second").attr("aria-pressed", "false");
			//jQuery('.k-recur-view').css("display", "none");
			setTimeout(function () {
				jQuery('#schedule-add').find('#wpm-team').val(event.team.value);
			}, 8000);
		}
		jQuery("#this-instance").click(function () {
			//alert((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]).toISOString()).slice(0, 16));
			jQuery("#theModal").removeClass("show");
			jQuery('#wpm-resourceId').val(event.sectionResourcesId);
			var listing_name = getResourceName(event.resource);
			jQuery('#wpm_listing').val(listing_name);
			jQuery('#wpm-recurrenceId').val(event.id);
			jQuery('#wpm-rrule').val('');
			jQuery('#wpm-repeat').val(0);
			var start = (new Date(new Date(event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
			//start = start.replace(/-/g,'');
			start = start.split('T');
			start = start[0];

			jQuery('#wpm-recurrenceException').val(start);
			jQuery('#schedule-add').find('#wpm-client').val(event.client.value);
			jQuery('#schedule-add select#wpm-client').trigger('change');
			// console.log((info.el.fcSeg.start).toString());
			//alert(info.el.fcSeg.start.toString());
			//console.log((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0] + ' UTC').toISOString()));
			// console.log((new Date(info.el.fcSeg.start).toString()));
			//jQuery('#schedule-add').find('#wpm-date-start').val((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16));
			var start_ev = (new Date(new Date(event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
			var end_ev = (new Date(new Date(event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
			jQuery('#schedule-add').find('#wpm-date-start').val(start_ev.slice(0, 10));
			jQuery('#schedule-add').find('#wpm-time-start').val(start_ev.slice(11, 16));
			jQuery('#schedule-add').find('#wpm-date-end').val(end_ev.slice(0, 10));
			jQuery('#schedule-add').find('#wpm-time-end').val(end_ev.slice(11, 16));
			//jQuery('#schedule-add').find('#wpm-date-end').val((new Date(new Date(info.el.fcSeg.end).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16));
			jQuery('#schedule-add').find('#wpm-description').html(event.description);
			jQuery('#schedule-add').find('#wpm-status').val(event.status.value);
			jQuery("#schedule-add").find("#repeat_selection").prop('checked', false);
			jQuery("input.k-valid.status-recurrence").val(" ");
			jQuery("input.k-valid.status-recurrence").hide();
			jQuery('#schedule-add').find('.save-event').removeClass('update-event').addClass('save-event').html('Save');
			jQuery('#schedule-add').modal('show');
			jQuery('.main-k-first').addClass("k-state-active");
			jQuery(".main-k-first").attr("aria-pressed", "true");
			jQuery('.main-k-second').removeClass("k-state-active");
			jQuery(".main-k-second").attr("aria-pressed", "false");
			//jQuery('.k-recur-view').css("display", "none");
			setTimeout(function () {
				jQuery('#schedule-add').find('#wpm-team').val(event.team.value);
			}, 8000);
		});
		jQuery("#all-instance").click(function () {
			jQuery("#theModal").removeClass("show");
			jQuery('#wpm-repeat').val(1);
			jQuery('#repeat_selection').prop('checked', true);
			jQuery('#repeat_selection').attr('checked', 'checked');
			//jQuery('#repeat_selection').trigger('click');
			console.log(event);
			var days = event.recurring.split('BYDAY=');
			days = days[1].substr(0, days[1].length);
			var weekDays = days;
			weekDays = weekDays.replaceAll('MO', 'Monday');
			weekDays = weekDays.replaceAll('TU', 'Tuesday');
			weekDays = weekDays.replaceAll('WE', 'Wednesday');
			weekDays = weekDays.replaceAll('TH', 'Thursday');
			weekDays = weekDays.replaceAll('FR', 'Friday');
			weekDays = weekDays.replaceAll('SA', 'Saturday');
			weekDays = weekDays.replaceAll('SU', 'Sunday');
			var disStr = 'Weekly on ' + weekDays + ', until ';
			var monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			days = days.split(',');
			jQuery.each(days, function (index, value) {
				jQuery('.k-recur-weekday-buttons span.k-button[data-value="' + value + '"]').addClass('k-state-active');
			});
			if (event.recurring.indexOf('UNTIL=') >= 0) {
				var until = event.recurring.split('UNTIL=');
				until = jQuery.trim(until[1]);
				var date = until.substr(6, 2);
				var month = until.substr(4, 2);
				var year = until.substr(0, 4);
				disStr += monthString[Number(month)] + ' ' + date + ', ' + year;

				jQuery('input.k-valid.status-recurrence').val(disStr);
				jQuery('.k-recur-end-until').attr('checked', 'checked');
				jQuery('.k-recur-end-until').prop('checked', true);
				jQuery('#wpm_until').val(year + '-' + month + '-' + date);
				//jQuery('#wpm_until').val(date+'-'+month+'-'+year);
			}
			if (event.recurring.indexOf('INTERVAL=') >= 0) {
				var interval = event.recurring.split('INTERVAL=');
				interval = jQuery.trim(interval[1]);
				interval = interval.substr(0, 1);

				jQuery('#wpm-interval').val(interval);
				//jQuery('#wpm_until').val(date+'-'+month+'-'+year);
			}
			jQuery('#wpm-resourceId').val(event.sectionResourcesId);
			var listing_name = getResourceName(event.resource);
			jQuery('#wpm_listing').val(listing_name);
			jQuery('#schedule-add').find('#wpm-client').val(event.client.value);
			jQuery('#schedule-add select#wpm-client').trigger('change');
			var start_ev = (new Date(new Date(event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
			var end_ev = (new Date(new Date(event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
			jQuery('#schedule-add').find('#wpm-date-start').val(start_ev.slice(0, 10));
			jQuery('#schedule-add').find('#wpm-time-start').val(start_ev.slice(11, 16));
			jQuery('#schedule-add').find('#wpm-date-end').val(end_ev.slice(0, 10));
			jQuery('#schedule-add').find('#wpm-time-end').val(end_ev.slice(11, 16));
			jQuery("#schedule-add").find("#repeat_selection").prop('checked', true);
			jQuery('input.k-valid.status-recurrence').show();
			jQuery('.fbox__items.status_div').addClass('showDropdown');
			//jQuery('#schedule-add').find('#wpm-date-start').val((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16));
			//					jQuery('#schedule-add').find('#wpm-date-end').val((new Date(new Date(info.el.fcSeg.end).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16)); 
			//jQuery('#schedule-add').find('#wpm-date-start').val(info.el.fcSeg.start.toLocaleString());
			//jQuery('#schedule-add').find('#wpm-date-end').val(info.el.fcSeg.end.toLocaleString());
			jQuery('#schedule-add').find('#wpm-description').html(event.description);
			jQuery('#schedule-add').find('#wpm-status').val(event.status.value);
			jQuery('#schedule-add').find('.save-event').removeClass('save-event').addClass('update-event').html('Update');
			jQuery('#schedule-add').modal('show');
			setTimeout(function () {
				jQuery('#schedule-add').find('#wpm-team').val(event.team.value);
			}, 8000);
			jQuery('.main-k-first').removeClass("k-state-active");
			jQuery(".main-k-first").attr("aria-pressed", "false");
			jQuery('.main-k-second').addClass("k-state-active");
			jQuery(".main-k-second").attr("aria-pressed", "true");
			//jQuery('.k-recur-view').css("display", "block");
		});
	}
}

function prepareFullCalendar() {
	var __data = section_resources;
	section_resources_value = section_resources;
	var section_resources_array = [];
	var curDate = new Date();
	var utcdate = (curDate.getUTCDate());
	//console.log('utcdate'+utcdate.toString().length);
	utcdate = (utcdate.toString().length == 1) ? '0' + utcdate : utcdate;
	//console.log('section_resources'+JSON.stringify(section_resources));
	var start_date = curDate.getUTCFullYear() + '-0' + (curDate.getUTCMonth() + 1) + '-' + utcdate + 'T';
	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var day = weekday[curDate.getDay()].toLowerCase();

	for (let i = 0; i < __data.length; ++i) {
		section_resources_value = section_resources;
		section_resources_array[__data[i].value] = __data[i];
		section_resources_value[i]['businessHours'] = [];
		var workingHours = __data[i].workingHours;
		end_date_str = '';
		start_date_str = '';
		var startTime = '00:00:00';
		var endTime = '23:59:59';
		startTime = workingHours.monday.start;
		endTime = workingHours.monday.end;
		if (endTime == '00:00') {
			endTime = '24:00';
		}
		if (startTime == null) {
			startTime = '00:00:00';
			endTime = '23:59:59';
		}
		section_resources_value[i]['businessHours'].push({
			startTime: startTime,
			endTime: endTime,
			daysOfWeek: [1],
			'weekday': 'MO'
		});

		startTime = workingHours.tuesday.start;
		endTime = workingHours.tuesday.end;
		if (endTime == '00:00') {
			endTime = '24:00';
		}
		if (startTime == null) {
			startTime = '00:00:00';
			endTime = '23:59:59';
		}
		section_resources_value[i]['businessHours'].push({
			startTime: startTime,
			endTime: endTime,
			daysOfWeek: [2],
			'weekday': 'TU'
		});

		startTime = workingHours.wednesday.start;
		endTime = workingHours.wednesday.end;
		if (endTime == '00:00') {
			endTime = '24:00';
		}
		if (startTime == null) {
			startTime = '00:00:00';
			endTime = '23:59:59';
		}
		section_resources_value[i]['businessHours'].push({
			startTime: startTime,
			endTime: endTime,
			daysOfWeek: [3],
			'weekday': 'WE'
		});

		startTime = workingHours.thursday.start;
		endTime = workingHours.thursday.end;
		if (endTime == '00:00') {
			endTime = '24:00';
		}
		if (startTime == null) {
			startTime = '00:00:00';
			endTime = '23:59:59';
		}
		section_resources_value[i]['businessHours'].push({
			startTime: startTime,
			endTime: endTime,
			daysOfWeek: [4],
			'weekday': 'TH'
		});

		startTime = workingHours.friday.start;
		endTime = workingHours.friday.end;
		if (endTime == '00:00') {
			endTime = '24:00';
		}
		if (startTime == null) {
			startTime = '00:00:00';
			endTime = '23:59:59';
		}
		section_resources_value[i]['businessHours'].push({
			startTime: startTime,
			endTime: endTime,
			daysOfWeek: [5],
			'weekday': 'FR'
		});

		startTime = workingHours.saturday.start;
		endTime = workingHours.saturday.end;
		if (endTime == '00:00') {
			endTime = '24:00';
		}
		if (startTime == null) {
			startTime = '00:00:00';
			endTime = '23:59:59';
		}
		section_resources_value[i]['businessHours'].push({
			startTime: startTime,
			endTime: endTime,
			daysOfWeek: [6],
			'weekday': 'SA'
		});

		startTime = workingHours.sunday.start;
		endTime = workingHours.sunday.end;
		if (endTime == '00:00') {
			endTime = '24:00';
		}
		if (startTime == null) {
			startTime = '00:00:00';
			endTime = '23:59:59';
		}
		section_resources_value[i]['businessHours'].push({
			startTime: startTime,
			endTime: endTime,
			daysOfWeek: [0, 7],
			'weekday': 'SU'
		});

		/* if (startTime == null) {
                start_date_str = start_date + '00:00:00';
                end_date_str = start_date + '23:59:59';
            } else {
                start_date_str = start_date + startTime + ':00';
                end_date_str = start_date + endTime + ':00';
            }
            console.log('push' + JSON.stringify({
                start: start_date_str,
                end: end_date_str,
                display: "background",
                resourceId: __data[i].value,
                sectionResourcesId: __data[i].value,
				backgroundColor: '#e5e5e5', 
            }));
            schedulerTasks.push({
                start: start_date_str,
                display: "background",
                resourceId: __data[i].value,
                sectionResourcesId: __data[i].value,
				backgroundColor: '#e5e5e5', 
            });*/
	}
	//console.log('section_resources_value'+JSON.stringify(section_resources_value));
	return section_resources_value;
}

function myconfig() {
	jQuery("#dropdown-filter").fadeOut();
console.log("myconfig");
	jQuery('.dropdown-filter-search').fadeOut();
	jQuery('.dropdown-filter-group').fadeOut();
	jQuery(".filter_overlay").fadeIn();
	jQuery(".dropdown-config").fadeToggle();
}

jQuery(document).on("click", "#cancel-config", function () {
	jQuery(".dropdown-config").fadeOut();
	jQuery(".filter_overlay").fadeOut();
})

function filterCalForGroup(groups, calendar) {
	console.log('filtercalgroup');
	var selected_user_ids = [];
	var selected_listing = [];
	jQuery.each(groups, function (index, value) {
		if (value != '') {
			var selgroup = clublist.group_list[value];
			jQuery.each(selgroup, function (index1, value1) {
				selected_user_ids.push(value1);
			});
			var sellistings = clublist.group_listings[value];
			jQuery.each(sellistings, function (index1, value1) {
				selected_listing.push(value1);
			});
		}
	});
	var newTasks = [];
	var newResources = [];
	jQuery.each(schedulerTasks, function (key, value) {
		if (selected_user_ids.indexOf(value.client.value) >= 0) {
			newTasks.push(value);
		}
	});
	jQuery.each(section_resources, function (key, value) {
		if (selected_listing.indexOf(value.id) >= 0) {
			newResources.push(value);
		}
	});
	//calendar.setEvents(newTasks);
	calendar.setOptions({
		'resources': newResources
	});
	//calendar.refresh();
}

function get_booking_data(calendar) {
	var cal_viewww = "";
	if (cal_type == "view_only") {
		cal_viewww = cal_view;
	}
	let loader = jQuery('#loader').append('<div class="loader-14"></div>');
	loader.show();
	console.log('send Ajax');
	jQuery.ajax({
		type: "POST",
		url: AdminajaxUrl.ajaxurl,
		data: {
			action: 'get_booking_data',
			cal_type: cal_type,
			cal_view: cal_viewww,
		},
		dataType: 'json',
		success: function (response) {
			console.log('received Ajax');
			var filter_location = jQuery('#location_select').val();
			schedulerTasks = libEvents(response.schedular_tasks);
			console.log('schedulerTasksbooking' + JSON.stringify(schedulerTasks));
			resources = prepareFullCalendar('');

			//calendar.setOptions('data', schedulerTasks);
			var section_resources_value = resources;
			if (typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '') {
				var __data = section_resources;
				var selected_values = filter_location.toString();
				var section_resources_value = [];
				for (let i = 0; i < __data.length; ++i) {
					if (selected_values.indexOf(__data[i].value) >= 0) {
						section_resources_value.push(__data[i]);
					}
				}
			}
			if (typeof (filter_group) != 'undefined' && filter_group != null && filter_group != '') {
				var selected_values = filter_group.toString();
				selected_values = selected_values.split(',');
				filterCalForGroup(selected_values, calendar);
			}
			calendar.setOptions({
				'resources': section_resources_value
			});
			calendar.setEvents(schedulerTasks);
			//calendar.refresh();
			//calendar.refetchEvents();
			//calendar.render();
			/*if(reload == 1){
				var initialDate = jQuery('#schedule-add').find('#wpm-initial-date').val();
				if(typeof(initialDate) != 'undefined') {
					initFullCalendar('',initialDate);
				}
				else {
					initFullCalendar('','');
				}
			}*/
			jQuery(".k-scheduler-layout").removeClass("hide_opicity");
			loader.html("");
			loader.hide();
			jQuery('#toast-container').append('<div id="toast' + 2 + '" class="toast erreur toast-entrance d-flex"><div class="d-flex justify-content-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" class="eva eva-checkmark-circle-outline" fill="#ffffff"><g data-name="Layer 2"><g data-name="checkmark-circle"><rect width="24" height="24" opacity="0"></rect><path d="M9.71 11.29a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 16a1 1 0 0 0 .72-.34l7-8a1 1 0 0 0-1.5-1.32L12 13.54z"></path><path d="M21 11a1 1 0 0 0-1 1 8 8 0 0 1-8 8A8 8 0 0 1 6.33 6.36 7.93 7.93 0 0 1 12 4a8.79 8.79 0 0 1 1.9.22 1 1 0 1 0 .47-1.94A10.54 10.54 0 0 0 12 2a10 10 0 0 0-7 17.09A9.93 9.93 0 0 0 12 22a10 10 0 0 0 10-10 1 1 0 0 0-1-1z"></path></g></g></svg></div>Calendar has been refreshed.</div>')
			setTimeout(function () {
				jQuery('#toast' + 2).remove();
			}, 5500);
		},
		error: function(errorThrown){
			console.log(errorThrown);
	   }
	});
}

let customEvent = {
	eventsToBookings: function (events) {

		//console.log('schedulerEvents');
		//console.log(schedulerEvents);
		var bookingslength = events.length;
		var bookings = [];
		var bookingId = 1;

		function isDeleted(orignalItem, booking) {
			//START FROM HERE
			var allRecArr = orignalItem.recurrenceException.split(",");
			//allRecArr     = jQuery.map(allRecArr, function(item, index){return moment(item).toISOString()});
			//console.log("AllRECARR",allRecArr);
			if (allRecArr.find(item => item == booking)) {
				return true;
			} else {
				return false;
			}
		}

		function libRecExp(currentItem, eventItem) {
			var eventTime = eventItem.start; //object
			var eventHours = eventTime.getHours();
			var eventMin = eventTime.getMinutes();
			currentItem.setHours(eventHours, eventMin, 0, 0);
			return currentItem.toISOString();


		}

		for (var i = 0; i < bookingslength; i++) {
			if (events[i]['recurrenceRule']) {


				/*var recBooking = rrule.RRule.fromString((events[i]['recurrenceRule']));
				if(recBooking.options.until == null){
				    recBooking.options.until = kendo.date.addDays(recBooking.options.dtstart, 365);
				}

				recBooking = recBooking.all();
				if (recBooking.length > 0) {
				    recBooking.forEach(function (item) { //Bookings List
				        let tempObj = Object.assign({}, events[i]);
				        tempObj['bookingId'] = bookingId++;
				        tempObj['recExp'] = libRecExp(item, events[i]);
				        var tempRecExp = libRecExp(item, events[i]);
				        if (events[i].recurrenceException) {
				            var isDel = isDeleted(events[i], tempRecExp);
				            if (!isDel) {
				                bookings.push(tempObj);
				            }
				        } else {
				            bookings.push(tempObj);
				        }
				    });

				}*/
			} else {
				let tempObj = Object.assign({}, events[i]);
				tempObj['bookingId'] = bookingId++;
				bookings.push(tempObj);
			}
		}
		return bookings;
	}, //end eventToBooking
	validRecExp: function (recurrenceException, moment) {
		if (recurrenceException) {
			var eventRecExp = recurrenceException;
			var eventRecExpArr = eventRecExp.split(",");
			var expArr = [];
			eventRecExpArr.forEach(function (item) {
				if (item.length == '20211211T190000Z'.length) {
					expArr.push(moment(item).toISOString());
				} else {
					expArr.push(item);
				}
			});
			var newRecExp = expArr.join(",");
			return newRecExp;
		} else {
			return "";
		}
	}, //end valid rec exp
	appendRecExp: function (fullString, rule) {
		if (!fullString) {
			fullString = "";
		}
		if (fullString.length > 5) {
			var eventRecExpArr = fullString.split(",");
			eventRecExpArr.push(rule);
			var newRecExp = eventRecExpArr.join(",");
			return newRecExp;
		} else {
			return rule;
		}
	}, //end appendRecExp
}

/*
 * Events Reshaping ----End
 */
/*
 * Making Data Ready to user by Kalendar
 */
//1): Event Sources	
//Database To Events Function
function libEvents(schedular_tasks) {
	console.log('schedular_tasks', schedular_tasks);
	if (schedular_tasks) {
		for (var i = 0; i < schedular_tasks.length; i++) {
			schedular_tasks[i]['start'] = new Date(schedular_tasks[i]['start']);
			schedular_tasks[i]['end'] = new Date(schedular_tasks[i]['end']);
			if (schedular_tasks[i]['rrule']) {
				schedular_tasks[i]['rrule'] = (schedular_tasks[i]['rrule']).replace('\\n', '\n');
			}
			if (schedular_tasks[i]['recurring'] && schedular_tasks[i]['recurring'][0] == '{') {
				schedular_tasks[i]['recurring'] = JSON.parse(schedular_tasks[i]['recurring']);
			}
			schedular_tasks[i]['resourceId'] = Number(schedular_tasks[i]['gymSectionId']);
			schedular_tasks[i]['sectionResourcesId'] = Number(schedular_tasks[i]['gymSectionId']);
			if (schedular_tasks[i]['recurrenceId']) {
				if (schedular_tasks[i]['recurrenceId'] == '0' || schedular_tasks[i]['recurrenceId'] == null) {
					schedular_tasks[i]['recurrenceId'] = null
				} else {
					schedular_tasks[i]['recurrenceId'] = Number(schedular_tasks[i]['recurrenceId']);
				}
			}
			if (schedular_tasks[i]['recurringException'] && typeof schedular_tasks[i]['recurringException'] == 'string'){
				schedular_tasks[i]['recurringException'] = JSON.parse(schedular_tasks[i]['recurringException']);
			}
			if (schedular_tasks[i]['recurringExceptionRule'] && schedular_tasks[i]['recurringExceptionRule'][0] == '[') {
				schedular_tasks[i]['recurringExceptionRule'] = JSON.parse(schedular_tasks[i]['recurringExceptionRule']);
			}
		}

		return schedular_tasks;
	}
}

//Assigning After Editing
schedulerTasks = libEvents(schedular_tasks);
console.log('Hee', schedulerTasks);
datadummy = libEvents(schedular_tasks);
/*********************
 *End
 **/

//2): Timeline Title Sources
var section_resources = [];
var workingHours = [];
if (gym_resources) {
	section_resources = gym_resources.listings;
	workingHours = gym_resources.workingHours;
	//Replacing Values of object of both arrays
	section_resources.forEach(function (item, index) {
		section_resources[index]['value'] = Number(item.value);
	});
}

gym_sections = section_resources;

/*
 *-----End
 */


/*********************
 *staging 1 code start from here
 **/

/******************
 * Removed same ids here
 */
let filtered = datadummy.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

schedulerTasks = filtered;
/******************
 * End here
 */

//console.log("sports ids ");
//console.log(filter_sports_id);
var filter_loctions_gym = [];
var valuezzz = "Location";
var valuezzzSport = "Sports";
var clickedUser = false;
var clickedSportUser = false;

function returnValue(value, optionvalue, getid) {

	document.getElementById("dropdown-content").style.display = "none";

	document.getElementById("locationValue").innerHTML = optionvalue;

	valuezzz = value;
	loctionId = getid;
}

function returnSportValue(valuesport, optionValueSport, getidSport) {
	document.getElementById("dropdown-content-sports").style.display = "none";


	document.getElementById("sportvalue").innerHTML = optionValueSport;

	valuezzzSport = valuesport;
	sportsId = getidSport;
}

function locationfun() {

	lists = document.getElementById("dropdown-content");
	if (lists.style.display == "none") {

		lists.style.display = "block";

	} else {
		lists.style.display = "none";
	}
	checksport = document.getElementById("dropdown-content-sports");
	if (checksport.style.display == "block") {

		checksport.style.display = "none";

	}

}

function sportsFun() {

	sportlists = document.getElementById("dropdown-content-sports");
	if (sportlists.style.display == "none") {

		sportlists.style.display = "block";

	} else {
		sportlists.style.display = "none";
	}
	checklist = document.getElementById("dropdown-content");
	if (checklist.style.display == "block") {

		checklist.style.display = "none";

	}
}

//console.log("gym_sections names");
//console.log(gym_sections);
//console.log('user_group_data'+user_group_data);
gym_sections_location = Array.from(gym_sections)

var html_loctions = "<div class='submenu' id='submenu1'><div class='dropdown-btn' id='locationvalue'  onclick='locationfun()'><p id='locationValue'>" + tranlations['Location'] + "</p><i class='fas fa-chevron-down'></i></div> <div class='dropdown-content' style='display:none' id='dropdown-content'>";
var optionsLoc = '<option value="0">All Listings</option>';
//console.log('filter_location'+filter_location);
if (typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '') {
	var filter_locations = filter_location.toString();
}
for (var i = 0; i < gym_sections_location.length; i++) {
	idlocation = gym_sections_location[i]["value"] + "value";
	strngid = String(idlocation);
	html_loctions += "<div class='dropdown-item' onclick='returnValue(this.dataset.value, this.innerHTML,this.id)'   id=" + gym_sections_location[i]['value'] + 'value' + " data-value=" + gym_sections_location[i]['value'] + " >" + gym_sections_location[i]['text'] + "</div>"
	var selected = '';
	if (typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '') {
		selected = (filter_locations.indexOf(gym_sections_location[i]['value']) >= 0) ? 'selected="selected"' : '';
	}
	optionsLoc += "<option value='" + gym_sections_location[i]['value'] + "'" + selected + ">" + gym_sections_location[i]['full_text'] + "</option>";
}
html_loctions += "</div></div>";
var groupsLoc = '<option value="0">All Groups</option>';
if (typeof (filter_group) != 'undefined' && filter_group != null && filter_group != '') {
	var filter_groups = filter_group.toString();
}
user_group_data = JSON.parse(user_group_data);
for (var i = 0; i < user_group_data.length; i++) {
	var selected = '';
	if (typeof (filter_groups) != 'undefined' && filter_groups != null && filter_groups != '') {
		selected = (filter_groups.indexOf(user_group_data[i]['users_groups_id']) >= 0) ? 'selected="selected"' : '';
	}
	groupsLoc += "<option value='" + user_group_data[i]['users_groups_id'] + "'" + selected + ">" + user_group_data[i]['group_name'] + "</option>";
}

/**
 ############# sports fields geting here
 */

//console.log("sportsfilds ");
listssports = Object.entries(sportsList);


//console.log(listssports[0][1]);

spots_data_loction = listssports[0][1];
var html_sports_loctions = "<div class='submenus' id='submenu2'><div class='dropdown-btn' onclick='sportsFun()'>  <p id='sportvalue' >" + tranlations["Sports"] + "</p><i class='fas fa-chevron-down'></i></div> <div class='dropdown-content' style='display:none' id='dropdown-content-sports'>";
for (var i = 0; i < spots_data_loction.length; i++) {

	html_sports_loctions += "<div class='dropdown-item' onclick='returnSportValue(this.dataset.value, this.innerHTML,this.id)' id=" + spots_data_loction[i][1] + 'value' + " data-value=" + spots_data_loction[i][1] + " >" + spots_data_loction[i][0] + "</div>"
}
html_sports_loctions += "</div></div>";


//console.log("wokring hours here");
wokring_hour = Object.entries(hourss);
wokringmonday = Object.entries(wokring_hour[0][1]);
//console.log(wokringmonday);


/**
 ############# sports fields geting end here
 */


/**
 ############# clublist fetching start form here
 */
console.log('clublist' + JSON.stringify(clublist));
list_club = Object.entries(clublist);
//console.log("List Club");
//console.log(list_club);
//console.log(clublist);
//console.log(list_club[0][1]);
listing_club = list_club[0][1]
var html_club = "<select class='submenu' id='submenu3'><option>" + tranlations["Club/Client"] + "</option>";
for (var i = 0; i < listing_club.length; i++) {

	html_club += "<option>" + listing_club[i] + "</option>";
}
html_club += "</select>";
console.log('html_club' + html_club);

/**
 ############# end here
 */


/*********************
 *End staging 1 code here
 **/


/*
 * Choosing The Templates for the Kalendar
 */

var eventTemplateLogic, editableObject;
if (is_user_login == true) {
	eventTemplateLogic = jQuery("#event-template").html();
	editableObject = {
		template: jQuery("#editor").html()
	};
} else {
	eventTemplateLogic = jQuery("#event-template-non-login").html();
	editableObject = false;
}
/*
 *-----End
 */

/*
 *	Lib Code Starts
 */
// 
var sampleDataNextID = gym_resources.sample_data_next_id;

//schedulerTasks.length < 1 ? sampleDataNextID = 1 : sampleDataNextID = Math.max.apply(Math, schedulerTasks.map(function(o) { return o.id; })) + 1;
function getIndexById(id) {
	var idx,
		l = schedulerTasks.length;

	for (var j = 0; j < l; j++) {
		if (schedulerTasks[j].id == id) {
			return j;
		}
	}
	return null;
}

function updateEvent(values, calendar) {
	let loader = jQuery('#loader').append('<div class="loader-14"></div>');
	loader.show();
	if (cal_type != "view_only") {
		if (values == '') {
			var client = jQuery('#wpm-client').val();
			var team = jQuery('#wpm-team').val();
			var description = jQuery('#wpm-description').val();
			var title = jQuery('#wpm-client').find('option:selected').text();
			// var start_from = new Date(jQuery('#wpm-date-start').val());
			// var end_to = new Date(jQuery('#wpm-date-end').val());
			var [starth, startm] = jQuery("#wpm-time-start").val().split(':');
			var [endh, endm] = jQuery("#wpm-time-end").val().split(':');
			// start_from.setHours(starth);
			// start_from.setMinutes(startm);
			// end_to.setHours(endh);
			// end_to.setMinutes(endm);
			// var start_from = start_from;
			// var end_to = end_to;
			var start_from = jQuery('#wpm-date-start').val() + " " + jQuery('#wpm-time-start').val();
			var end_to = jQuery('#wpm-date-end').val() + " " + jQuery('#wpm-time-end').val();
			console.log(start_from, end_to, 'datejee');
			var status = jQuery('#wpm-status').val();
			var resourceId = jQuery('#wpm-resourceId').val();
			var recurrenceId = jQuery('#wpm-recurrenceId').val();
			/*var id = jQuery('#wpm-eventId').val();*/
			var id = localStorage.getItem("event_id");
			localStorage.removeItem("event_id");

			var rrule = '';
			var repeatEnd = jQuery('input[name="wpm_end"]:checked').val();
			var interval = jQuery('select[name="wpm-interval"]').val();
			var until = '';
			var count = 0;
			var byday = '';
			if (jQuery('#wpm-repeat').val() == 1) {

				jQuery('#schedule-add .k-recur-weekday-buttons span.k-button.k-state-active').each(function () {
					byday += jQuery(this).attr('data-value') + ',';
				});

				//DevMaster Changed
				rrule = jQuery("#wpm-rrule").val();
			}

			values = {
				'client': client,
				'team': team,
				'description': description,
				'title': title,
				'start_from': start_from,
				'end_to': end_to,
				'status': status,
				'resourceId': resourceId,
				'recurrenceId': recurrenceId,
				'id': id,
				'recurrenceRule': rrule,
			};
		}
		if (typeof (values.recurrenceRule) != 'undefined' && values.recurrenceRule != '') {
			/* var rule= values.recurrenceRule.split('\n');
			rule = rule[0].replace('DTSTART:','');
			var start = new Date(values.start_from).toISOString();
				start = start.replace(/-/g, '');
				start = start.replace(/:/g, '');
				start = start.split('.');
				start = start[0] + 'Z';
			var newrule = values.recurrenceRule.replace('DTSTART:'+rule,'DTSTART:'+start);
			values.recurrenceRule = newrule; */
		}
		jQuery.post(
			WPMAddRecord.ajaxurl, {
				action: 'wpm_update_record',
				id: values.id,
				title: values.title,
				wpm_client: values.client,
				team: values.team,
				//pricegroup: e.data.pricegroup.value,
				start: values.start_from,
				end: values.end_to,
				description: values.description,
				repert: '',
				status: values.status,
				//gymId: e.data.GymID,
				recurrenceException: values.recurringException,
				recurrenceRule: values.recurrenceRule,
				recurrenceId: recurrenceId,
				gymSectionId: values.resourceId,
			},
			function (response) {
				get_booking_data(calendar);

				loader.html("");
				loader.hide();
				jQuery('#toast-container').append('<div id="toast' + (cpt) + '" class="toast erreur toast-entrance d-flex"><div class="d-flex justify-content-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" class="eva eva-checkmark-circle-outline" fill="#ffffff"><g data-name="Layer 2"><g data-name="checkmark-circle"><rect width="24" height="24" opacity="0"></rect><path d="M9.71 11.29a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 16a1 1 0 0 0 .72-.34l7-8a1 1 0 0 0-1.5-1.32L12 13.54z"></path><path d="M21 11a1 1 0 0 0-1 1 8 8 0 0 1-8 8A8 8 0 0 1 6.33 6.36 7.93 7.93 0 0 1 12 4a8.79 8.79 0 0 1 1.9.22 1 1 0 1 0 .47-1.94A10.54 10.54 0 0 0 12 2a10 10 0 0 0-7 17.09A9.93 9.93 0 0 0 12 22a10 10 0 0 0 10-10 1 1 0 0 0-1-1z"></path></g></g></svg></div>Event is updated successfully.</div>')

				var val = cpt;

				setTimeout(function () {
					jQuery('#toast' + val).remove();
				}, 5500);

				cpt++;
			}
		);
	}
}

function createEvent(values, calendar) {
	console.log('calendar', calendar);
	if (cal_type != "view_only") {
		if (values == '') {
			var client = jQuery('#wpm-client').val();
			var team = jQuery('#wpm-team').val();
			var description = jQuery('#wpm-description').val();
			var title = jQuery('#wpm-client').find('option:selected').text();
			var start_from = jQuery('#wpm-date-start').val() + 'T' + jQuery('#wpm-time-start').val();
			var end_to = jQuery('#wpm-date-end').val() + 'T' + jQuery('#wpm-time-end').val();
			var status = jQuery('#wpm-status').val();
			var resourceId = jQuery('#wpm-resourceId').val();
			var recurrenceId = jQuery('#wpm-recurrenceId').val();
			var recurrenceException = jQuery('#wpm-recurrenceException').val();
			var rrule = '';
			var repeatEnd = jQuery('input[name="wpm_end"]:checked').val();
			var interval = jQuery('select[name="wpm-interval"]').val();
			var until = '';
			var count = 0;
			var byday = '';
			if (jQuery('#wpm-repeat').val() == 1) {

				jQuery('#schedule-add .k-recur-weekday-buttons span.k-button.k-state-active').each(function () {
					byday += jQuery(this).attr('data-value') + ',';
				});
				var start = new Date(start_from).toISOString();
				start = start.replace(/-/g, '');
				start = start.replace(/:/g, '');
				start = start.split('.');
				start = start[0] + 'Z\n';

				//DevMaster Changed
				rrule = jQuery("#wpm-rrule").val();
			}
			values = {
				'client': client,
				'team': team,
				'description': description,
				'title': title,
				'start_from': start_from,
				'end_to': end_to,
				'status': status,
				'resourceId': resourceId,
				'recurrenceId': recurrenceId,
				'id': '',
				'recurrenceRule': rrule,
				'recurrenceException': recurrenceException
			};
		}

		if (values.recurrenceException != '') {
			// jQuery.post(
			// 	WPMAddRecord.ajaxurl, {
			// 		action: 'wpm_update_record',
			// 		id: values.recurrenceId,
			// 		recurrenceException: values.recurrenceException
			// 	},
			// 	function (response) {}
			// );
		}
		//alert(rrule);
		var id = sampleDataNextID++;
		jQuery.post(
			WPMAddRecord.ajaxurl, {
				action: 'wpm_add_record',
				id: id,
				title: values.title,
				wpm_client: values.client,
				team: values.team,
				start: values.start_from,
				end: values.end_to,
				description: values.description,
				repert: '',
				status: values.status,
				//gymId: e.data.GymID,
				recurrenceRule: values.recurrenceRule,
				recurrenceId: values.recurrenceId,
				gymSectionId: values.resourceId,
				recurrenceException: values.recurrenceException
			},
			function (response) {

				jQuery('#toast-container').append('<div id="toast' + (cpt) + '" class="toast erreur toast-entrance d-flex"><div class="d-flex justify-content-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" class="eva eva-checkmark-circle-outline" fill="#ffffff"><g data-name="Layer 2"><g data-name="checkmark-circle"><rect width="24" height="24" opacity="0"></rect><path d="M9.71 11.29a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 16a1 1 0 0 0 .72-.34l7-8a1 1 0 0 0-1.5-1.32L12 13.54z"></path><path d="M21 11a1 1 0 0 0-1 1 8 8 0 0 1-8 8A8 8 0 0 1 6.33 6.36 7.93 7.93 0 0 1 12 4a8.79 8.79 0 0 1 1.9.22 1 1 0 1 0 .47-1.94A10.54 10.54 0 0 0 12 2a10 10 0 0 0-7 17.09A9.93 9.93 0 0 0 12 22a10 10 0 0 0 10-10 1 1 0 0 0-1-1z"></path></g></g></svg></div>Event is created successfully.</div>')

				var val = cpt;

				setTimeout(function () {
					jQuery('#toast' + val).remove();
				}, 5500);

				cpt++;
				get_booking_data(calendar);

			});
	}
}


jQuery(function () {
	if (jQuery('.filter_overlay').length == 0)
		jQuery('body').append('<div class="filter_overlay"></div>');

	jQuery("body").on('click', '#wpm_until', function () {
		jQuery('.k-recur-end-until').attr('checked', 'checked');
		jQuery('.k-recur-end-until').prop('checked', true);
	});
	jQuery("body").on('click', '#wpm_count', function () {
		jQuery('.k-recur-end-count').attr('checked', 'checked');
		jQuery('.k-recur-end-count').prop('checked', true);
	});

	resources = prepareFullCalendar();
	var businessHours = [];
	if (typeof (resources[0]['businessHours']) != 'undefined' && (resources[0]['businessHours']) != 'null' && (resources[0]['businessHours']) != '') {
		businessHours = resources[0]['businessHours'];
	}

	var calendarEl = document.getElementById('scheduler');
	calendarEl.innerHTML = '';


	initialDate = moment(new Date()).format('YYYY-MM-DD');
	if (cal_starttime == "" && cal_endtime == "") {

		cal_starttime = '00:00';
		cal_endtime = '23:59';

	}



	if (cell_width == "" || cell_width == 0) {
		cell_width = 80;
	} else {
		cell_width = parseInt(cell_width);
	}

	//console.log('calendar_view'+calendar_view);
	if (calendar_view == "" || calendar_view == 0) {
		calendar_view_val = 'resourceTimelineDay';
	} else {
		calendar_view_val = (calendar_view);
	}
	var section_resources_value = resources;
	var colors = [];
	var __data = resources;
	for (let i = 0; i < __data.length; ++i) {
		for (let b = 0; b < __data[i]['businessHours'].length; ++b) {
			if (__data[i]['businessHours'][b].startTime != '00:00' && __data[i]['businessHours'][b].startTime != '00:00:00' && __data[i]['businessHours'][b].endTime != '23:59:59' && __data[i]['businessHours'][b].endTime != '24:00') {


				// var color = {'start': '00:00', 'end':__data[i]['businessHours'][b].startTime,'background':'#C0C0C0','resource':__data[i].id, 'recurring': { 'repeat': 'weekly', 'weekDays':__data[i]['businessHours'][b].weekday}};
				// colors.push(color);


				// var color = {'start': __data[i]['businessHours'][b].endTime, 'end':'24:00','background':'#C0C0C0','resource':__data[i].id, 'recurring': { 'repeat': 'weekly', 'weekDays':__data[i]['businessHours'][b].weekday}};
				// colors.push(color);
			}
		}

	}


	if (typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '') {
		var __data = section_resources;
		var selected_values = filter_location.toString();
		var section_resources_value = [];
		for (let i = 0; i < __data.length; ++i) {
			if (selected_values.indexOf(__data[i].value) >= 0) {
				section_resources_value.push(__data[i]);
				businessHours = resources[i]['businessHours'];

			}
		}
	}
	console.log('colors' + JSON.stringify(colors));
	//console.log('events'+calendar_view_val);
	/* 	jQuery.ajax({
			type: "POST",
			url: 'https://us-central1-superpos-9bf75.cloudfunctions.net/getCallerId',
			data: {
				phone: '1234567890'
			},
			success: function (response) {
			} 
		});	 */
	console.log('section_resources_value' + JSON.stringify(section_resources_value));
	console.log('schedulerTasks' + JSON.stringify(schedulerTasks));
	//var calendar_view_val = this.options[e.target.selectedIndex].getAttribute('data-view');
	if (calendar_view == "" || calendar_view == 0) {
		calendar_view_val = 'resourceTimelineDay';
	} else {
		calendar_view_val = (calendar_view);
	}




	var timer;
	var $tooltip = jQuery('#calendar-event-tooltip-popup');
	var tooltip = $tooltip.mobiscroll().popup({
		display: 'anchored',
		touchUi: false,
		showOverlay: false,
		contentPadding: false,
		width: 350
	}).mobiscroll('getInst');

	$tooltip.mouseenter(function (ev) {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	});

	$tooltip.mouseleave(function (ev) {
		timer = setTimeout(function () {
			tooltip.close();
		}, 200);
	});
	newTasks = schedulerTasks;
	newResources = section_resources;
	var section_resources_value = section_resources;
	if (typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '') {
		var __data = section_resources;
		var selected_values = filter_location.toString();
		var newResources = [];
		for (let i = 0; i < __data.length; ++i) {
			if (selected_values.indexOf(__data[i].value) >= 0) {
				newResources.push(__data[i]);
			}
		}

	}
	/* 	if(typeof(filter_group) != 'undefined' && filter_group != null && filter_group != ''){
			var selected_values = filter_group.toString();
			groups  =selected_values.split(',');
			var selected_user_ids = [];
			var selected_listing = [];
			jQuery.each(groups, function(index, value){
				if(value != ''){
				var selgroup = clublist.group_list[value];
				jQuery.each(selgroup, function(index1, value1){
					selected_user_ids.push(value1);
				});		
				var sellistings = clublist.group_listings[value];
				jQuery.each(sellistings, function(index1, value1){
					selected_listing.push(value1);
				});	
			}
			});
			var newTasks = [];
			var newResources = [];
			jQuery.each( schedulerTasks, function( key, value ) {
				if(selected_user_ids.indexOf(value.client.value) >=0){
					newTasks.push(value);
				}
			});
			jQuery.each( section_resources, function( key, value ) {
				if(selected_listing.indexOf(value.id) >=0){
					newResources.push(value);
				}
			});
		} */
	console.log('newTasks' + JSON.stringify(newTasks));
	var mobi_locale = 'en';
	if (current_language == "nb-NO") {
		mobi_locale = 'no';
	}

	mobiscroll.setOptions({
		theme: 'material',
		locale: mobiscroll.locale[mobi_locale],
	});
	var now = new Date(),
		calendar = jQuery(calendarEl).mobiscroll().eventcalendar({
			locale: mobiscroll.locale[mobi_locale],
			modules: [mobiscroll.print],
			view: {
				timeline: {
					type: 'day'
				},
			},
			dragToMove: true,
			dragToResize: true,
			data: newTasks,
			resources: newResources,
			colors: colors,
			theme: 'gibbs-material',
			onEventClick: function (info, inst) {
				triggerEventClick(info.date, info.event, jQuery(info.domEvent.target).attr('class'));
			},
			onCellClick: function (event, inst) {
				var indate = event.date;
				console.log(indate);
				if (typeof (indate) != 'undefined') {
					var inidate = moment(indate).format("YYYY-MM-DD");
					jQuery('#schedule-add').find('#wpm-initial-date').val(inidate);
				}
				//console.log('Clicked on: ' + JSON.stringify(info));
				var listing_name = getResourceName(event.resource);
				jQuery('#wpm-repeat').val(0);
				//jQuery('.k-recur-view').hide();
				jQuery('#wpm-resourceId').val(event.resource);
				jQuery('#wpm_listing').val(listing_name);
				jQuery('#schedule-add').find('#wpm-client').val('');
				jQuery("#schedule-add").find("#repeat_selection").prop('checked', false);
				jQuery("input.k-valid.status-recurrence").val(" ");
				jQuery("input.k-valid.status-recurrence").hide();
				jQuery('#schedule-add select#wpm-client').trigger('change');

				console.log('QUAK', (new Date(new Date(indate).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 10));
				jQuery("#wpm-date-start").val((new Date(new Date(indate).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 10));
				jQuery("#wpm-time-start").val((new Date(new Date(indate).toString().split('GMT')[0] + ' UTC').toISOString()).slice(11, 16));
				var end = new Date(indate);
				end.setMinutes(end.getMinutes() + 30);
				jQuery("#wpm-date-end").val((new Date(new Date(end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 10));
				jQuery("#wpm-time-end").val((new Date(new Date(end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(11, 16));

				//console.log(((new Date(new Date(end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16)));
				jQuery('#editorTab').appendTo(jQuery("#editorInnerTab"));
				console.log(jQuery("#editorInnerTab"));
				jQuery("#editorInnerTab").show();
				jQuery('#schedule-add').modal('show');
			},
			onPageChange: function (event, inst) {
				/* if(jQuery('.cal_view_select').length == 1)
				jQuery('.cal_view_select').niceSelect();
				
				jQuery("#location_select").select2({allowClear: true,closeOnSelect: false});
				jQuery("#group_select").select2({allowClear: true,closeOnSelect: false});
	
				var section_resources_value = section_resources;
				if(typeof(filter_location) != 'undefined' && filter_location != null && filter_location != ''){
					var __data = section_resources;
					var selected_values = filter_location.toString();
					var section_resources_value = [];
					for (let i = 0; i < __data.length; ++i) {
						if (selected_values.indexOf(__data[i].value) >= 0) {
							section_resources_value.push(__data[i]);
						}
					}
					jQuery('#filter-count span').html(section_resources_value.length);
					jQuery('#filter-count').show();
					jQuery("#filtervalue").show();
				}
			
				if(typeof(filter_group) != 'undefined' && filter_group != null && filter_group != ''){
					var selected_values = filter_group.toString();
					selected_values  =selected_values.split(',');
					filterCalForGroup(selected_values,calendar);
				}
		
				cal_starttime = jQuery('.starttime').val();
				cal_endtime = jQuery('.endtime').val();
				if(cal_starttime == "" && cal_endtime == ""){
								
					cal_starttime = '00:00';
					cal_endtime = '23:59';
					
				}
				if(cell_width == "" || cell_width == 0){
					cell_width = 80;
				}else{
					cell_width = parseInt(cell_width);
				}
	
				
				calendar_view_val = jQuery('#cal_view_select').val();
				setCalendarTime(calendar_view_val,cal_starttime,cal_endtime);
				jQuery('.mbsc-timeline-column').attr('style','width:'+cell_width+'px !important;max-width:'+cell_width+'px !important');
				jQuery('.mbsc-timeline-header-column').attr('style','width:'+cell_width+'px !important;max-width:'+cell_width+'px !important');
				if(jQuery('.daterangepicker').length <= 0){
				jQuery("#reportrange").daterangepicker({
					startDate: start,
					endDate: end,
					singleDatePicker: true,
					showWeekNumbers: true,
					"locale": {
						"format": "D MMMM, Y",
						"separator": " - ",
						"applyLabel": "Apply",
						"cancelLabel": "Cancel",
						"fromLabel": "From",
						"toLabel": "To",
						"customRangeLabel": "Custom",
						"weekLabel": "W",
						"daysOfWeek": [
							"Su",
							"Mo",
							"Tu",
							"We",
							"Th",
							"Fr",
							"Sa"
						],
						"monthNames": [
							"January",
							"February",
							"March",
							"April",
							"May",
							"June",
							"July",
							"August",
							"September",
							"October",
							"November",
							"December"
						],
						"firstDay": 1
					},
				}, function(start, end, label) {
					console.log('start'+start);
					console.log('end'+end);
						//jQuery("#reportrange span").html(date+' '+month+', '+year);
					jQuery("#reportrange span").html(start.format("D MMMM, Y") + "  (Week " + start.format("w")+')');
					var iniDate = start.format("YYYY-MM-DD");
				
					calendar.navigate(start.format("YYYY-MM-DD"));
					
		});
				
				//if(calendar_view_val == 'resourceTimelineDay' || calendar_view_val == 'timeGridDay'){
					var start = new Date(event.firstDay);
					var end = new Date(event.lastDay);
					end.setDate(end.getDate()-1);
					setReportRange(start,end);	
	} */
				//}
				var start = new Date(event.firstDay);
				var end = new Date(event.lastDay);
				end.setDate(end.getDate() - 1);
				setReportRange(start, end);
			},
			clickToCreate: false,
			dragToCreate: false,
			showEventTooltip: false,
			onEventHoverIn: function (info, inst) { // More info about onEventHoverIn: https://docs.mobiscroll.com/5-18-3/eventcalendar#event-onEventHoverIn
				var start = info.event.start;
				var startDate = moment(start).format("DD.MM.YYYY");
				start = (start.getHours() < 10 ? '0' : '') + start.getHours() + ':' + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
				var end = info.event.end;
				var endDate = moment(end).format("DD.MM.YYYY");
				if (typeof (end) != 'undefined' && end !== null) {
					end = (end.getHours() < 10 ? '0' : '') + end.getHours() + ':' + (end.getMinutes() < 10 ? '0' : '') + end.getMinutes();

				}
				var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var d = new Date(info.event.start);
				var dayName = days[d.getDay()];

				var desc = info.event.description;
				var resourceId = info.event.sectionResourcesId;
				var listing_name = '';
				//console.log('section_resources'+JSON.stringify(section_resources));
				jQuery.each(section_resources, function (index, value) {
					if (value.id == resourceId) {
						listing_name = value.full_text;
					}

				});


				var repeated = '';
				if (typeof (info.event.recurrenceRule) != 'undefined' && info.event.recurrenceRule != '') {
					var endDate = info.event.recurrenceRule.split('UNTIL=');
					endDate = jQuery.trim(endDate[1]);
					var date = endDate.substr(6, 2);
					var month = endDate.substr(4, 2);
					var year = endDate.substr(0, 4);
					endDate = date + '.' + month + '.' + year;

					repeated = '<p class="tooltip-custom"><span>Repeating to: </span>' + endDate + '</p>';
				}
				var comment = '';
				if (typeof (desc) != 'undefined' && desc != '' && desc != null) {
					comment = '<p class="tooltip-custom"><span>Comment: </span>' + desc.substr(0, 60) + '</p>';
				}
				var related_to = '';
				if (typeof (info.event.first_event_id) != 'undefined' && info.event.first_event_id != '' && info.event.first_event_id != 'null' && info.event.first_event_id != null) {
					var first_event_ids = info.event.first_event_id.split(',');
					jQuery.each(first_event_ids, function (index, value) {
						var eventt = getIndexById(value);
						if (typeof (schedulerTasks[eventt]) != 'undefined' && schedulerTasks[eventt] != '' && schedulerTasks[eventt] != 'null' && schedulerTasks[eventt] != null) {
							var resId = schedulerTasks[eventt]['resourceId'];
							related_to += '<p class="tooltip-custom"><span>Related to: </span>';
							jQuery.each(section_resources, function (index, value) {
								if (value.id == resId) {
									listing_name = value.full_text;
									related_to += '' + listing_name + ',';
								}
							});
							related_to = related_to.substr(0, related_to.length - 1);
							related_to += '</p>';
						}

					});
				}

				var ddate = startDate + ' - ' + endDate;
				if (startDate == endDate) {
					ddate = startDate;
				}
				//<p class="tooltip-custom"><span>Related to: </span> Listing a, Listing b(max 20char per listing, on hoover here show full listing name)</p>
				var eventOutput = '<div class="k-widget k-popup k-group k-reset"><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><div class="topAction"><i class="fa fa-edit view-more" data-event =\'' + (JSON.stringify(info.event)) + '\' data-info_date="' + info.date + '" data-target="' + jQuery(info.domEvent.target).attr('class') + '"></i><i class="fa fa-trash"></i><i class="fa fa-close"></i></div><h4>Kamil lager mat spiser kl 19</h4><p class="tooltip-custom"><span>Date: </span> ' + ddate + '</p><p class="tooltip-custom"><span>Customer: </span> ' + info.event.title + '</p>' + repeated + related_to + comment + '</div></div>';
				//<div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><h4>Original booking</h4><p class="tooltip-custom"><span>Listing: </span> '+listing_name+'</p><p class="tooltip-custom"><span>Day: </span> '+dayName+'</p><p class="tooltip-custom"><span>Time: </span>' + start + ' - ' + end + '</p></div></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>
				//<div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><h4>Score: 34</h4><p class="tooltip-custom"><span>Desired hours: </span> 20</p><p class="tooltip-custom"><span>Algorithm hours: </span> 20</p><p class="tooltip-custom"><span>Received hours: </span> 20</p></div></div>
				//  var eventOutput = '<div role="tooltip" class="k-widget k-tooltip k-popup k-group k-reset" data-role="popup" style="position: absolute;display: block;opacity: 1;left: ' + left + 'px;top:30px;" aria-hidden="true"><div class="k-tooltip-content"><p class="tooltip-time"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">' + start + ' - ' + end + '</font></font></p><p class="tooltip-custom"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">' + info.event.title + '</font></font></p><p><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Comment: ' + desc + '</font></font></p><p></p></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>';
				jQuery('#calendar-event-tooltip-popup').html('');
				if (jQuery('#calendar-event-tooltip-popup').length > 0 && jQuery('#calendar-event-tooltip-popup .k-popup').length == 0)
					jQuery('#calendar-event-tooltip-popup').append(eventOutput);
				clearTimeout(timer);
				timer = null;

				tooltip.setOptions({
					anchor: info.domEvent.target
				});
				tooltip.open();
				console.log(jQuery(info.domEvent.target).html());
				if (jQuery(info.domEvent.target).find('.k-event-delete').length == 0)
					jQuery(info.domEvent.target).append('<a href="#" class="k-link k-event-delete" title="Slett" aria-label="Slett"><span class="k-icon k-i-close"></span></a>');

			},
			onEventHoverOut: function (args) { // More info about onEventHoverOut: https://docs.mobiscroll.com/5-18-3/eventcalendar#event-onEventHoverOut
				if (!timer) {
					timer = setTimeout(function () {
						tooltip.close();
					}, 200);
				}
			},
			onEventUpdate: function(args){
				var event = args.event;
				if (event.recurring) {
					var originalRecurringEvent = args.oldEvent;
					var newRecurringEvent = args.newEvent;		
					var event = args.event;	
					var recurrenceEditModePopup = jQuery('#demo-recurrence-edit-mode-popup').mobiscroll().popup({
						display: 'bottom',
						theme: 'material',
						themeVariant: 'light',
						contentPadding: false,
						buttons: ['cancel', {
							text: 'Ok',
							keyCode: 'enter',
							handler: function () {
								recurrenceEditMode = jQuery('input[name="recurrence-mode"]:checked').val();
								console.log(jQuery('input[name="recurrence-mode"]:checked'));
								// alert(recurrenceEditMode);
								console.log('newRecurringEvent', newRecurringEvent);
								console.log('originalRecurringEvent', originalRecurringEvent);
								console.log('event', event);
								if(recurrenceEditMode == 'current'){
									console.log("current");
									var values = {
										id: newRecurringEvent.id,
										title: newRecurringEvent.title,
										client: newRecurringEvent.client.value,
										team: newRecurringEvent.team.value,
										start_from: (new Date(new Date(newRecurringEvent.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										end_to: (new Date(new Date(newRecurringEvent.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										description: newRecurringEvent.description,
										repert: '',
										status: newRecurringEvent.status.value,
										//gymId: e.data.GymID,
										recurrenceRule: '',
										recurrenceId: newRecurringEvent.id,
										resourceId: (typeof (newRecurringEvent.resource) != 'undefined' && newRecurringEvent.resource != null) ? newRecurringEvent.resource : newRecurringEvent.resource
									};
									var newException = values.start_from.slice(0, 10);
									console.log("newexception here", newException, values);
									createEvent(values, calendar);
									values = {
										id: originalRecurringEvent.id,
										title: originalRecurringEvent.title,
										client: originalRecurringEvent.client.value,
										team: originalRecurringEvent.team.value,
										start_from: (new Date(new Date(originalRecurringEvent.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										end_to: (new Date(new Date(originalRecurringEvent.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										description: originalRecurringEvent.description,
										status: originalRecurringEvent.status.value,
										//gymId: e.data.GymID,
										recurrenceRule: originalRecurringEvent.recurring,
										recurringException: '',
										resourceId: (typeof (event.resource) != 'undefined' && event.resource != null) ? event.resource : originalRecurringEvent.resource
									};
									var exception = originalRecurringEvent.recurringException ? originalRecurringEvent.recurringException : [];
									exception.push(newException);
									console.log(exception);
									values.recurringException = JSON.stringify(exception);
									updateEvent(values, calendar);
								}
								if(recurrenceEditMode == 'following'){
									console.log("following");
									var values = {
										id: newRecurringEvent.id,
										title: newRecurringEvent.title,
										client: newRecurringEvent.client.value,
										team: newRecurringEvent.team.value,
										start_from: (new Date(new Date(newRecurringEvent.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										end_to: (new Date(new Date(newRecurringEvent.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										description: newRecurringEvent.description,
										repert: '',
										status: newRecurringEvent.status.value,
										//gymId: e.data.GymID,
										recurrenceRule: originalRecurringEvent.recurring,
										recurringException: JSON.stringify(originalRecurringEvent.recurringException),
										recurrenceId: newRecurringEvent.id,
										resourceId: (typeof (newRecurringEvent.resource) != 'undefined' && newRecurringEvent.resource != null) ? newRecurringEvent.resource : newRecurringEvent.resource
									};
									createEvent(values, calendar);
									var newRecurring =  originalRecurringEvent.recurring;
									var params = newRecurring.split(';');
									newRecurring = "";
									for(var i = 0 ; i < params.length ; i ++){
										var keyval = params[i].split('=');
										if(keyval[0] == 'UNTIL'){
											var until = new Date(newRecurringEvent.start);
											until.setDate(until.getDate() - 1);
											var untilString = until.toISOString();
											untilString = untilString.replaceAll('-', '');
											untilString = untilString.replaceAll(':', '');
											untilString = untilString.slice(0, -5);
											untilString += "Z";
											keyval[1] = untilString;
											params[i] = keyval[0] + '=' + keyval[1];
										}
										newRecurring += i == 0 ? params[i] : ';' + params[i];
									}
									values = {
										id: originalRecurringEvent.id,
										title: originalRecurringEvent.title,
										client: originalRecurringEvent.client.value,
										team: originalRecurringEvent.team.value,
										start_from: (new Date(new Date(originalRecurringEvent.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										end_to: (new Date(new Date(originalRecurringEvent.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
										description: originalRecurringEvent.description,
										status: originalRecurringEvent.status.value,
										recurrenceRule: newRecurring,
										recurringException: JSON.stringify(originalRecurringEvent.recurringException),
										resourceId: (typeof (event.resource) != 'undefined' && event.resource != null) ? event.resource : originalRecurringEvent.resource
									};
									updateEvent(values, calendar);
								}
								if(recurrenceEditMode == 'all'){
									console.log("ALL");
									var start_from = (new Date(new Date(newRecurringEvent.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
									var end_to = (new Date(new Date(newRecurringEvent.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
									var start =  start_from.slice(11, 16);
									var end   = end_to.slice(11, 16);
									console.log("bu blublua", start, end);
									console.log("bu blublub", start_from, end_to);
									values = {
										id: originalRecurringEvent.id,
										title: originalRecurringEvent.title,
										client: originalRecurringEvent.client.value,
										team: originalRecurringEvent.team.value,
										start_from: (new Date(new Date(originalRecurringEvent.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 11) + start,
										end_to: (new Date(new Date(originalRecurringEvent.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 11) + end,
										description: originalRecurringEvent.description,
										status: originalRecurringEvent.status.value,
										//gymId: e.data.GymID,
										recurrenceRule: originalRecurringEvent.recurring,
										resourceId:  newRecurringEvent.resource
									};
									console.log("bu blubluc va", values);
									console.log("bu blubluc", values.start_from, values.end_to);
									updateEvent(values, calendar);
								}
								recurrenceEditModePopup.close();
							},
							cssClass: 'mbsc-popup-button-primary'
						}],
						onClose: function () {
							// Reset edit mode to current
							jQuery('#recurrence-edit-mode-current').mobiscroll('getInst').checked = true;
						},
						responsive: {
							medium: {
								display: 'center',
								fullScreen: false,
								touchUi: false
							}
						},
						cssClass: 'md-recurring-event-editor-popup'
					}).mobiscroll('getInst');
					recurrenceEditModePopup.open();
					return false;
				}
			},
			onEventDragEnd: function (event, inst) {
				console.log(event, inst);
				if (typeof (event.event.recurring) != 'undefined' && event.event.recurring != '') {
					
				} else {
					var values = {
						id: event.event.id,
						title: event.event.title,
						client: event.event.client.value,
						team: event.event.team.value,
						start_from: (new Date(new Date(event.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
						end_to: (new Date(new Date(event.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
						description: event.event.description,
						repert: '',
						status: event.event.status.value,
						//gymId: e.data.GymID,
						recurrenceRule: '',
						recurrenceId: '',
						resourceId: (typeof (event.resource) != 'undefined' && event.resource != null) ? event.resource : event.event.sectionResourcesId
					};
					updateEvent(values, calendar);

				}
				if (typeof (event.event.start) != 'undefined') {
					var indate = event.event.start;
					if (typeof (indate) != 'undefined') {
						indate = moment(indate).format("YYYY-MM-DD");
						jQuery('#schedule-add').find('#wpm-initial-date').val(indate);
					}
				}
			},
			onPageLoaded: function (event, inst) {

				/* var section_resources_value = section_resources;
				if(typeof(filter_location) != 'undefined' && filter_location != null && filter_location != ''){
					var __data = section_resources;
					var selected_values = filter_location.toString();
					var section_resources_value = [];
					for (let i = 0; i < __data.length; ++i) {
						if (selected_values.indexOf(__data[i].value) >= 0) {
							section_resources_value.push(__data[i]);
						}
					}
					jQuery('#filter-count span').html(section_resources_value.length);
					jQuery('#filter-count').show();
					jQuery("#filtervalue").show();
				} */

				//} 
				var start = new Date(event.firstDay);
				var end = new Date(event.lastDay);
				end.setDate(end.getDate() - 1);
				setReportRange(start, end);
			},
			/* renderScheduleEvent: function(arg){
				
				console.log('arg'+JSON.stringify(arg));
				var status_class = arg.original.status.value;
				var comment = '';
				if(arg.original.description != ''){
					comment += '<img src="/wp-content/plugins/schedule-calendar/images/comment_icon.png" />';
				}
				var repeated = '';
				var linked = '';
				if(typeof(arg.original.recurrenceRule) != 'undefined' && arg.original.recurrenceRule != '' && arg.original.recurrenceRule != null) {
				repeated = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">			<path d="M16.8921 1.04565V6.67065C16.8921 7.16284 16.5054 7.5144 16.0483 7.5144H10.4233C9.93115 7.5144 9.57959 7.16284 9.57959 6.67065C9.57959 6.21362 9.93115 5.8269 10.4233 5.8269H13.939C12.8843 3.823 10.7749 2.4519 8.45459 2.4519C5.00928 2.4519 2.26709 5.22925 2.26709 8.6394C2.26709 12.0847 5.00928 14.8269 8.45459 14.8269C9.896 14.8269 11.3022 14.3347 12.3921 13.4207C12.7437 13.1042 13.271 13.1746 13.5874 13.5261C13.8687 13.8777 13.8335 14.405 13.4819 14.7214C12.0757 15.8816 10.2827 16.5144 8.41943 16.5144C4.09521 16.5144 0.57959 12.9988 0.57959 8.6394C0.57959 4.31519 4.09521 0.799561 8.41943 0.799561C11.2319 0.799561 13.7983 2.31128 15.2046 4.63159V1.04565C15.2046 0.588623 15.5562 0.201904 16.0483 0.201904C16.5054 0.201904 16.8921 0.588623 16.8921 1.04565Z" fill="white"/></svg>';
				}
				else if(typeof(arg.original.recurrenceId) != 'undefined' && arg.original.recurrenceId != '' && arg.original.recurrenceId != null) {
				repeated = '<img src="/wp-content/plugins/schedule-calendar/images/un-repeated_icon.png" />';
				}
				if(typeof(arg.original.first_event_id) != 'undefined' && arg.original.first_event_id != '' && arg.original.first_event_id != 'null'  && arg.original.first_event_id != null) {
					linked = '<img src="/wp-content/plugins/schedule-calendar/images/linked_icon.png" />';
				}
				
				return  '<div class="fc-event-main-frame calendar-status-'+status_class+'"><div class="fc-event-title-container"><div class="fc-event-title fc-sticky" style="top: 0px;">'+repeated+linked+arg.original.title+comment+'</div></div></div>';
			}, */
			renderHeader: function () {
				var renderHeader = '<div class="fc-header-toolbar fc-toolbar fc-toolbar-ltr" style="width:100%;">';
				renderHeader += '<div mbsc-calendar-prev class="cal-header-prev"></div>' +
					'<div mbsc-calendar-next class="cal-header-next"></div>';
				renderHeader += '<div id="reportrange"><i class="fa fa-calendar"></i>&nbsp; <span></span> <i class="fa fa-caret-down"></i></div><i class="fa fa-refresh" aria-hidden="true"></i><div id="cal_options" >';
				renderHeader += "<div class='filling-gap' onClick='hideAll()'></div>";
				//if(jQuery('.search_calendar').length == 0){
				var filter_html = '';
				// var filter_search="<input id='search_cal'> </input>";
				if (typeof (filter_search) != 'undefined' && filter_search != null && filter_search != '') {
					filter_html = '<span id="filter_search">' + filter_search + '<span class="fas fa-times close-search" aria-hidden="true"></span></span>';
				}
				//}


				//if(jQuery('.filter_calendar').length == 0){
				renderHeader +=
					'<div style="color: #008474;display: inline-block;" class="search_calendar">' +
					// '<div id="filter-count" style="display: none;" class="filter_numbrs"></div>' +
					'<div class="k-input-icon" id="btn-search"><span class="btn-filter-click">' +
					'<i class="fa fa-search"></i><span>' + '<span></span>' + 
					'</div>' + 
					'<div class="dropdown-filter-search">' +
					'<h3>' + tranlations["Search"] + '</h3>' +
					'<form class="search_submit">' +
					'<div class="form-group">'+
					'<label class="text-bld-label"> Please Input Search Text </label>'+
					'<input id="search_cal" class="input-type-class-avoid"> </input>'+
					'</div>'+
					'<div id="demo-search-sidebar-list" style="display:none; overflow-y:auto; height:400px;"></div>' + 
					'<button class="applyBtn btn btn-sm btn-primary" type="button" style="margin-top:5px; margin-;eft:10px;">Close</button>' +
					'</form>' + 
					"</div></div>";
				//}

				//if(jQuery('.filter_calendar').length == 0){
				renderHeader +=
					'<div style="color: #008474;display: inline-block;" class=" filter_calendar">' +
					// '<div id="filter-count" style="display: none;" class="filter_numbrs"></div>' +
					'<div class="btn-filter" id="btn-filter"><span class="btn-filter-click">' +
					'<i class="fa fa-filter"></i><span>' + '</span></span><span id="filter-count" style="display: none;"> (<span></span>) </span><span id="filtervalue" class="fas fa-times close-filter" style="display: none;" aria-hidden="true"></span>' +
					'</div>' +
					// '<div style="display: none;" id="filtervalue"><p id="filterValues"></p><span class="fas fa-times close-filter" aria-hidden="true"></span></div>' +
					'<div class="dropdown-filter" id="dropdown-filter" >' +
					'<h3>' + tranlations["Filter"] + '</h3>' +
					'<form class="filter_submit">' +
					'<div class="form-group">' +
					'<label class="text-bld-label">Listing</label>' +
					'<div class="positon-absolute-select-position"><i class="fa fa-angle-down"></i></div><select id="location_select" multiple data-placeholder="' + tranlations["Select Location"] + '...">' +
					optionsLoc +
					'</select>' +
					'</div>' +
					'<div class="drp-buttons"><span class="drp-selected">08/05/2022 - 08/05/2022</span><button class="cancelBtn btn btn-sm btn-default" type="button">Reset</button><button class="applyBtn btn btn-sm btn-primary" type="button">Apply</button></div>' +
					'</form>' +
					'<span id="cancel-filter" class="fas fa-times" aria-hidden="true"></span>' +
					'</div></div>';
				//}

				renderHeader += '<div style="color: #008474;display:inline-block;" class="dropdown1">' +
					'<div class="btn-config" onclick="myconfig()">' +
					'<i class="fa fa-cog dropbtn1"></i><span class="translation-block">' + ' </span>' +
					'</div>' +
					'<div class="dropdown-config">' +
					'<h3>' + tranlations["Calendar Setting"] + '</h2>' +
					'<form class="config_submit">' +
					'<div class="row">' +
					'<div class="col-md-6">' +
					'<div class="form-group">' +
					'<label>' + tranlations["View calendar from"] + '<i class="fa fa-question-circle show-info" aria-hidden="true"></i><div role="tooltip" class="tooltips info-tip" data-role="popup" style="position: absolute;display: none;opacity: 1;" aria-hidden="true"><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><p class="tooltip-custom">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div></div><div class="k-callout k-callout-n" style="left: 146.9999px;"></div></div></label>' +
					'<select class="starttime">' +
					'<option value="">' + tranlations["Velg"] + '</option>' +
					'<option ' + ((cal_starttime == '00:00' && show_full_day != 1) ? 'selected' : '') + '>00:00</option>' +
					'<option ' + (cal_starttime == '01:00' ? 'selected' : '') + '>01:00</option>' +
					'<option ' + (cal_starttime == '02:00' ? 'selected' : '') + '>02:00</option>' +
					'<option ' + (cal_starttime == '03:00' ? 'selected' : '') + '>03:00</option>' +
					'<option ' + (cal_starttime == '04:00' ? 'selected' : '') + '>04:00</option>' +
					'<option ' + (cal_starttime == '05:00' ? 'selected' : '') + '>05:00</option>' +
					'<option ' + (cal_starttime == '06:00' ? 'selected' : '') + '>06:00</option>' +
					'<option ' + (cal_starttime == '07:00' ? 'selected' : '') + '>07:00</option>' +
					'<option ' + (cal_starttime == '08:00' ? 'selected' : '') + '>08:00</option>' +
					'<option ' + (cal_starttime == '09:00' ? 'selected' : '') + '>09:00</option>' +
					'<option ' + (cal_starttime == '10:00' ? 'selected' : '') + '>10:00</option>' +
					'<option ' + (cal_starttime == '11:00' ? 'selected' : '') + '>11:00</option>' +
					'<option ' + (cal_starttime == '12:00' ? 'selected' : '') + '>12:00</option>' +
					'<option ' + (cal_starttime == '13:00' ? 'selected' : '') + '>13:00</option>' +
					'<option ' + (cal_starttime == '14:00' ? 'selected' : '') + '>14:00</option>' +
					'<option ' + (cal_starttime == '15:00' ? 'selected' : '') + '>15:00</option>' +
					'<option ' + (cal_starttime == '16:00' ? 'selected' : '') + '>16:00</option>' +
					'<option ' + (cal_starttime == '17:00' ? 'selected' : '') + '>17:00</option>' +
					'<option ' + (cal_starttime == '18:00' ? 'selected' : '') + '>18:00</option>' +
					'<option ' + (cal_starttime == '19:00' ? 'selected' : '') + '>19:00</option>' +
					'<option ' + (cal_starttime == '20:00' ? 'selected' : '') + '>20:00</option>' +
					'<option ' + (cal_starttime == '21:00' ? 'selected' : '') + '>21:00</option>' +
					'<option ' + (cal_starttime == '22:00' ? 'selected' : '') + '>22:00</option>' +
					'<option ' + (cal_starttime == '23:00' ? 'selected' : '') + '>23:00</option>' +
					'</select>' +
					'<div class="position-absolute-select-stm"><i class="fa fa-clock-o" aria-hidden="true"></i></div>' +
					'</div>' +
					'</div>' +
					'<div class="col-md-6">' +
					'<div class="form-group">' +
					'<label>' + tranlations["View calendar to"] + '<i class="fa fa-question-circle show-info" aria-hidden="true"></i><div role="tooltip" class="tooltips info-tip" data-role="popup" style="position: absolute;display: none;opacity: 1;" aria-hidden="true"><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><p class="tooltip-custom">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div></div><div class="k-callout k-callout-n" style="left: 146.9999px;"></div></div></label>' +
					'<select class="endtime">' +
					'<option value="">' + tranlations["Velg"] + '</option>' +
					'<option ' + (cal_endtime == '00:00' ? 'selected' : '') + '>00:00</option>' +
					'<option ' + (cal_endtime == '01:00' ? 'selected' : '') + '>01:00</option>' +
					'<option ' + (cal_endtime == '02:00' ? 'selected' : '') + '>02:00</option>' +
					'<option ' + (cal_endtime == '03:00' ? 'selected' : '') + '>03:00</option>' +
					'<option ' + (cal_endtime == '04:00' ? 'selected' : '') + '>04:00</option>' +
					'<option ' + (cal_endtime == '05:00' ? 'selected' : '') + '>05:00</option>' +
					'<option ' + (cal_endtime == '06:00' ? 'selected' : '') + '>06:00</option>' +
					'<option ' + (cal_endtime == '07:00' ? 'selected' : '') + '>07:00</option>' +
					'<option ' + (cal_endtime == '08:00' ? 'selected' : '') + '>08:00</option>' +
					'<option ' + (cal_endtime == '09:00' ? 'selected' : '') + '>09:00</option>' +
					'<option ' + (cal_endtime == '10:00' ? 'selected' : '') + '>10:00</option>' +
					'<option ' + (cal_endtime == '11:00' ? 'selected' : '') + '>11:00</option>' +
					'<option ' + (cal_endtime == '12:00' ? 'selected' : '') + '>12:00</option>' +
					'<option ' + (cal_endtime == '13:00' ? 'selected' : '') + '>13:00</option>' +
					'<option ' + (cal_endtime == '14:00' ? 'selected' : '') + '>14:00</option>' +
					'<option ' + (cal_endtime == '15:00' ? 'selected' : '') + '>15:00</option>' +
					'<option ' + (cal_endtime == '16:00' ? 'selected' : '') + '>16:00</option>' +
					'<option ' + (cal_endtime == '17:00' ? 'selected' : '') + '>17:00</option>' +
					'<option ' + (cal_endtime == '18:00' ? 'selected' : '') + '>18:00</option>' +
					'<option ' + (cal_endtime == '19:00' ? 'selected' : '') + '>19:00</option>' +
					'<option ' + (cal_endtime == '20:00' ? 'selected' : '') + '>20:00</option>' +
					'<option ' + (cal_endtime == '21:00' ? 'selected' : '') + '>21:00</option>' +
					'<option ' + (cal_endtime == '22:00' ? 'selected' : '') + '>22:00</option>' +
					'<option ' + (((cal_endtime == '23:00' || cal_endtime == '23:59') && show_full_day != 1) ? 'selected' : '') + '>23:00</option>' +
					'</select>' +
					'<div class="position-absolute-select-stm"><i class="fa fa-clock-o" aria-hidden="true"></i></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div class="row">' +
					'<div class="col-md-9">' +
					'<label>' + tranlations["View calendar from 00:00 - 23:59"] + '</label>' +
					'</div>' +
					'<div class="col-md-3" style="padding:0px 25px;">' +
					'<div class="button r" id="button-1" for="show_full_day"><input type="checkbox" class="checkbox" value="' + show_full_day + '" id="show_full_day"' + (show_full_day == '1' ? 'checked' : '') + '/><div class="knobs"></div><div class="layer"></div></div>' +
					'</div>' +
					'</div>' +
					'<div class="row">' +
					'<div class="col-md-12">' +
					'<div class="form-group">' +
					'<label>' + tranlations["show_extra_info"] + '<i class="fa fa-question-circle show-info" aria-hidden="true"></i><div role="tooltip" class="tooltips info-tip" data-role="popup" style="position: absolute;display: none;opacity: 1;" aria-hidden="true"><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><p class="tooltip-custom">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div></div><div class="k-callout k-callout-n" style="left: 146.9999px;"></div></div></label>' +
					'<select class="show_extra_info">' +
					'<option value="">' + tranlations["Velg"] + '</option>' +
					'<option value="age_group" ' + (show_extra_info == 'age_group' ? 'selected' : '') + '>' + tranlations["age_group"] + '</option>' +
					'<option value="level" ' + (show_extra_info == 'level' ? 'selected' : '') + '>' + tranlations["level"] + '</option>' +
					'<option value="type" ' + (show_extra_info == 'type' ? 'selected' : '') + '>' + tranlations["type"] + '</option>' +
					'<option value="sport" ' + (show_extra_info == 'sport' ? 'selected' : '') + '>' + tranlations["sport"] + '</option>' +
					'<option value="members" ' + (show_extra_info == 'members' ? 'selected' : '') + '>' + tranlations["members"] + '</option>' +
					'<option value="team_name" ' + (show_extra_info == 'team_name' ? 'selected' : '') + '>' + tranlations["team_name"] + '</option>' +
					'</select>' +
					'<div class="position-absolute-select-stm"><i class="fa fa-angle-down" aria-hidden="true"></i></div>' +
					'</div>' +
					'</div>' +
					/* '<div class="col-md-6">' +
					'<div class="form-group">' +
					'<label>' + tranlations["cell_width"] + '<i class="fa fa-question-circle show-info" aria-hidden="true"></i><div role="tooltip" class="tooltips info-tip" data-role="popup" style="position: absolute;display: none;opacity: 1;" aria-hidden="true"><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><p class="tooltip-custom">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div></div><div class="k-callout k-callout-n" style="left: 146.9999px;"></div></div></label>' +
					'<select class="cell_width">' +
					'<option value="60" ' + (cell_width == '60' ? 'selected' : '') + '>' + tranlations["small"] + '</option>' +
					'<option value="120" ' + (cell_width == '120' ? 'selected' : '') + '>' + tranlations["medium"] + '</option>' +
					'<option value="180" ' + (cell_width == '180' ? 'selected' : '') + '>' + tranlations["big"] + '</option>' +
					'</select>' +
					'<div class="position-absolute-select-stm"><i class="fa fa-angle-down" aria-hidden="true"></i></div>' +
					'</div>' +
					'</div>' + */
					'</div>' +
					'<div class="row">' +
					'<div class="col-md-12">' +
					'<button type="button" class="k-button export_pdf"><span class="k-button-text">' + tranlations["Export to PDF"] + '</span><span class="k-icon k-i-file-pdf"></span></button>' +
					'</div>' +
					'</div>' +
					'<div class="drp-buttons">' +
					'<span class="drp-selected">08/05/2022 - 08/05/2022</span>' +
					'<button class="cancelBtn btn btn-sm btn-default" type="button">Nullstill</button>' +
					'<button class="applyBtn btn btn-sm btn-primary" type="button">Bruk</button>' +
					'</div>' +
					'</form>' +
					'<span id="cancel-config" class="fas fa-times" aria-hidden="true"></span>' +
					'</div></div>';


				//if(jQuery('.filter_group').length == 0){
				renderHeader +=
					'<div style="color: #008474;display: inline-block;" class=" filter_group">' +
					'<div id="group-count" style="display: none;" class="filter_numbrs"></div>' +
					'<div class="btn-filter-group">' +
					'<i class="fa fa-list"></i>' +
					'</div>' +
					'<div style="display: none;" id="filtervalue_group"><p id="filterValues"></p><span class="fas fa-times close-filter" aria-hidden="true"></span></div>' +
					'</div>';
				//}

				renderHeader += '<div class="fc-button-group cal_view_select_outer" style="min-width:150px;"><select id="cal_view_select" class="cal_view_select"><option data-view="resourceTimelineDay" value="resourceTimelineDay" class="fc-resourceTimelineDay-button fc-button fc-state-default fc-corner-right" ' + ((calendar_view_val == 'resourceTimelineDay') ? 'selected="selected"' : '') + '>Timeline day</option><option data-view="resourceTimelineWeek" value="resourceTimelineWeek"class="fc-resourceTimelineWeek-button fc-button fc-state-default" ' + ((calendar_view_val == 'resourceTimelineWeek') ? 'selected="selected"' : '') + '>Timeline week</option><option data-view="resourceTimelineMonth" value="resourceTimelineMonth" class="fc-resourceTimelineMonth-button fc-button fc-state-default" ' + ((calendar_view_val == 'resourceTimelineMonth') ? 'selected="selected"' : '') + '>Timeline month</option><option data-view="timeGridDay" value="timeGridDay" class="fc-timeGridDay-button fc-button fc-state-default" ' + ((calendar_view_val == 'timeGridDay') ? 'selected="selected"' : '') + '>Day</option><option data-view="timeGridWeek" value="timeGridWeek" class="fc-timeGridWeek-button fc-button fc-state-default" ' + ((calendar_view_val == 'timeGridWeek') ? 'selected="selected"' : '') + '>Week</option><option data-view="dayGridMonth" value="dayGridMonth"class="fc-dayGridMonth-button fc-button fc-state-default" ' + ((calendar_view_val == 'dayGridMonth') ? 'selected="selected"' : '') + '>Month</option><option data-view="listWeek" value="listWeek" class="fc-agendaMonth-button fc-button fc-state-default" ' + ((calendar_view_val == 'listWeek') ? 'selected="selected"' : '') + '>Agenda</option></select></div></div>';
				renderHeader += '</div>';
				return renderHeader;
				/* return '<div mbsc-calendar-nav class="cal-header-nav"></div>' +
				    '<div class="cal-header-picker">' +
				    '<label><input data-icon="material-event-note" mbsc-segmented type="radio" name="view" value="month" class="md-view-change" checked></label>' +
				    '<label><input data-icon="material-date-range" mbsc-segmented type="radio" name="view" value="week" class="md-view-change"></label>' +
				    '<label><input data-icon="material-view-day" mbsc-segmented type="radio" name="view" value="day" class="md-view-change"></label>' +
				    '</div>' +
				    '<div mbsc-calendar-prev class="cal-header-prev"></div>' +
				    '<div mbsc-calendar-next class="cal-header-next"></div>'; */
			}
		}).mobiscroll('getInst');
	var timer;
    var $searchList = jQuery('#demo-search-sidebar-list');
	var list = $searchList.mobiscroll().eventcalendar({
        view: {
            agenda: {
                type: 'year',
                size: 5
            }
        },
		themeVariant: 'light',
        showControls: false,
        onEventClick: function (args) {
            calendar.navigate(args.event.start);
            calendar.setSelectedEvents([args.event]);
        }
    }).mobiscroll('getInst');;

	setTimeout(function () {
		jQuery('body').on('click', '.export_pdf', function () {
			jQuery('.dropdown-config').hide();
			jQuery('.mbsc-calendar-wrapper.mbsc-flex-col.mbsc-flex-1-1.mbsc-gibbs-material.mbsc-material.mbsc-calendar-wrapper-fixed').hide();
			calendar.print();
			setTimeout(function () {
				jQuery('.mbsc-calendar-wrapper.mbsc-flex-col.mbsc-flex-1-1.mbsc-gibbs-material.mbsc-material.mbsc-calendar-wrapper-fixed').show();
			}, 1500);
		});

		jQuery('body').on('click', '.view-more', function () {
			var event = jQuery(this).attr('data-event');
			var info_date = jQuery(this).attr('data-info_date');
			var target = jQuery(this).attr('data-target');
			triggerEventClick(info_date, JSON.parse(event), target);
			tooltip.close();
		});
		jQuery('.mbsc-timeline-resource-header').html('Listings');
		jQuery.each(section_resources_value, function (index, value) {

			jQuery(".mbsc-timeline-resource-title").eq(index).attr('title', value.full_text);
			jQuery(".mbsc-timeline-resource-title").eq(index).attr('full_title', value.sports);
		});
		jQuery("body").on('mouseover', '.mbsc-timeline-resource-title', function () {
			if (!jQuery(this).parent().next().hasClass('sports-tip')) {
				var full_title = jQuery.trim(jQuery.trim(jQuery(this).attr('full_title')));
				full_title = full_title.substr(1, full_title.length - 2);
				var title = jQuery.trim(jQuery(this).attr('title'));
				var pos = jQuery(this).position();
				var left = 0;
				var top = jQuery(this).offset().top
				if (typeof (pos) != 'undefined') {
					left = pos.left - 10;
					top = top - 160;
				}
				if (full_title != '') {
					var eventOutput = '<div role="tooltip" class="k-tooltip sports-tip " data-role="popup" style="position: absolute;display: block;opacity: 1;z-index:9999999;top:' + top + 'px;" aria-hidden="true"><div class="k-tooltip-content"><h4>' + title + '</h4><p class="tooltip-custom"><span class="bold_sports">Sports:</span> ' + full_title + '</p></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>';
					//var eventOutput = '<div role="tooltip" class="sports-tip" data-role="popup" style="position: absolute;display: block;opacity: 1;left: ' + left + 'px;top:30px;" aria-hidden="true"><h4>'+title+'</h4><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><p class="tooltip-custom">'+full_title+'</p></div></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>';
					jQuery(eventOutput).insertAfter(jQuery(this).parent());
					//jQuery(this).append(jQuery(eventOutput));
				} else {
					var eventOutput = '<div role="tooltip" class="k-tooltip sports-tip" data-role="popup" style="position: absolute;display: block;opacity: 1;left:10px;z-index:9999999;top:' + top + 'px;" aria-hidden="true"><div class="k-tooltip-content"><h4>' + title + '</h4></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>';
					//var eventOutput = '<div role="tooltip" class="sports-tip" data-role="popup" style="position: absolute;display: block;opacity: 1;left: ' + left + 'px;top:30px;" aria-hidden="true"><h4>'+title+'</h4><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><p class="tooltip-custom">'+full_title+'</p></div></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>';
					//jQuery(this).append(jQuery(eventOutput));
					jQuery(eventOutput).insertAfter(jQuery(this).parent());
				}
			}
		});
		jQuery("body").on('mouseout', '.mbsc-timeline-resource-title', function () {
			jQuery(this).parent().parent().find('.sports-tip').remove();
		});

		jQuery('.fa-arrows-rotate').click(function () {
			console.log("ok");
			get_booking_data(calendar);
			calendar.refresh();
		});

		if ((typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '')) {
			have_filters = 1;
			var filter_locations = filter_location.toString();
			var res_array = filter_locations.split(',');
			if ((res_array.length > 0)) {
				jQuery('#filter-count span').html(res_array.length);
				jQuery('#filter-count').show();
				jQuery("#filtervalue").show();
			}
		}




		if (jQuery('.cal_view_select').length == 1)
			jQuery('.cal_view_select').niceSelect();

		jQuery("#location_select").select2({
			allowClear: true,
			closeOnSelect: false
		});
		jQuery("#group_select").select2({
			allowClear: true,
			closeOnSelect: false
		});


		cal_starttime = jQuery('.starttime').val();
		cal_endtime = jQuery('.endtime').val();
		if (cal_starttime == "" && cal_endtime == "") {

			cal_starttime = '00:00';
			cal_endtime = '23:59';

		}
		if (cell_width == "" || cell_width == 0) {
			cell_width = 80;
		} else {
			cell_width = parseInt(cell_width);
		}


		calendar_view_val = jQuery('#cal_view_select').val();
		setCalendarTime(calendar_view_val, cal_starttime, cal_endtime);

		if (jQuery('.daterangepicker').length <= 0) {
			jQuery("#reportrange").daterangepicker({
				startDate: start,
				endDate: end,
				singleDatePicker: true,
				showWeekNumbers: true,
				"locale": {
					"format": "D MMMM, Y",
					"separator": " - ",
					"applyLabel": "Apply",
					"cancelLabel": "Cancel",
					"fromLabel": "From",
					"toLabel": "To",
					"customRangeLabel": "Custom",
					"weekLabel": "W",
					"daysOfWeek": [
						"Su",
						"Mo",
						"Tu",
						"We",
						"Th",
						"Fr",
						"Sa"
					],
					"monthNames": [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December"
					],
					"firstDay": 1
				},
			}, function (start, end, label) {
				console.log('start' + start);
				console.log('end' + end);
				//jQuery("#reportrange span").html(date+' '+month+', '+year);
				jQuery("#reportrange span").html(start.format("D MMMM, Y") + "  (Week " + start.format("w") + ')');
				var iniDate = start.format("YYYY-MM-DD");

				calendar.navigate(start.format("YYYY-MM-DD"));

			});

			//if(calendar_view_val == 'resourceTimelineDay' || calendar_view_val == 'timeGridDay'){
			/* 	var start = new Date(event.firstDay);
				var end = new Date(event.lastDay);
				end.setDate(end.getDate()-1);
				setReportRange(start,end); */
		}


	}, 2000);


	function setReportRange(start, end) {
		console.log('setReportRange');
		var calendar_view_val = jQuery('#cal_view_select').val();

		if (calendar_view_val == 'timeGridDay' || calendar_view_val == 'resourceTimelineDay') {
			jQuery("#reportrange span").html(moment(start).format("D MMMM, Y") + ' - Week ' + weekNumber(new Date(start)));
		} else if (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'resourceTimelineWeek' || calendar_view_val == 'listWeek') {
			var display_date = moment(start).format("D") + ' - ' + moment(end).format("D");
			if (moment(start).format("MMMM, Y") == moment(end).format("MMMM, Y"))
				jQuery("#reportrange span").html(display_date + ' ' + moment(start).format("MMMM, Y") + ' - Week ' + weekNumber(new Date(start)));
			else {
				var display_date = moment(start).format("D") + ' ' + moment(start).format("MMMM, Y") + ' - ' + moment(end).format("D") + ' ' + moment(end).format("MMMM, Y");
				jQuery("#reportrange span").html(display_date + ' - Week ' + weekNumber(new Date(start)));
			}
		} else if (calendar_view_val == 'resourceTimelineMonth') {
			var display_date = moment(start).format("D") + ' - ' + moment(end).format("D");
			jQuery("#reportrange span").html(display_date + ' ' + moment(start).format("MMMM, Y") + ' - Week ' + weekNumber(new Date(start)) + ' - ' + weekNumber(new Date(end)));
		} else if (calendar_view_val == 'dayGridMonth') {
			var display_date = moment(start).format("D MMMM") + ' - ' + moment(end).format("D MMMM");
			jQuery("#reportrange span").html(display_date + ' ' + moment(start).format(", Y") + ' - Week ' + weekNumber(new Date(start)) + ' - ' + weekNumber(new Date(end)));
		}
	}

	function setCalendarTime(calendar_view_val, starttime, endtime) {

		var section_resources_value = section_resources;
		if (typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '') {
			var __data = section_resources;
			var selected_values = filter_location.toString();
			var section_resources_value = [];
			for (let i = 0; i < __data.length; ++i) {
				if (selected_values.indexOf(__data[i].value) >= 0) {
					section_resources_value.push(__data[i]);
					businessHours = resources[i]['businessHours'];
				}
			}
		}

		if (calendar_view_val == '')
			calendar_view_val = jQuery('#cal_view_select').val();

		var cell_width_val = jQuery('.cell_width').val();

		if (calendar_view_val == 'resourceTimelineWeek') {
			calendar.setOptions({
				view: {
					timeline: {
						type: 'week',
						startTime: starttime,
						endTime: endtime,
						timeCellStep: cell_width_val
					}
				},
				colors: colors,
				locale: mobiscroll.locale[mobi_locale],
				//resources: section_resources_value
			})
		} else if (calendar_view_val == 'resourceTimelineMonth') {
			calendar.setOptions({
				view: {
					timeline: {
						type: 'month',
						startTime: starttime,
						endTime: endtime,
						timeCellStep: cell_width_val
					}
				},
				colors: colors,
				locale: mobiscroll.locale[mobi_locale],
				//resources: section_resources_value
			})
		} else if (calendar_view_val == 'resourceTimelineDay') {
			calendar.setOptions({
				view: {
					timeline: {
						type: 'day',
						startTime: starttime,
						endTime: endtime,
						timeCellStep: cell_width_val
					}
				},
				colors: colors,
				locale: mobiscroll.locale[mobi_locale],
				//resources: section_resources_value
			})
		} else if (calendar_view_val == 'timeGridDay') {
			calendar.setOptions({
				view: {
					schedule: {
						type: 'day',
						startTime: starttime,
						endTime: endtime,
						timeCellStep: cell_width_val
					}
				},
				colors: colors,
				locale: mobiscroll.locale[mobi_locale],
				//resources:[]
			})
		} else if (calendar_view_val == 'timeGridWeek') {
			calendar.setOptions({
				view: {
					schedule: {
						type: 'week',
						startTime: starttime,
						endTime: endtime,
						timeCellStep: cell_width_val
					}
				},
				colors: colors,
				locale: mobiscroll.locale[mobi_locale],
			})
		} else if (calendar_view_val == 'dayGridMonth') {
			calendar.setOptions({
				view: {
					calendar: {
						labels: 'all',
						type: 'month',
						startTime: starttime,
						endTime: endtime,
						timeCellStep: cell_width_val
					}
				},
				colors: [],
				locale: mobiscroll.locale[mobi_locale],
			})
		} else if (calendar_view_val == 'listWeek') {
			calendar.setOptions({
				view: {
					agenda: {
						type: 'week',
						startTime: starttime,
						endTime: endtime,
						timeCellStep: cell_width_val
					}
				},
				colors: colors,
				locale: mobiscroll.locale[mobi_locale],
			})
		}
	}
	jQuery("body").on('change', '#cal_view_select', function (e) {
		var calendar_view_val = this.options[e.target.selectedIndex].getAttribute('data-view');
		var starttime = jQuery(".starttime").val();
		var endtime = jQuery(".endtime").val();
		setCalendarTime(calendar_view_val, starttime, endtime)
		//jQuery(calendarEl).mobiscroll('redraw');
		//calendarEl.redraw();
		var have_filters = 0;
		var filter_location = jQuery('#location_select').val();
		if ((typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '')) {
			have_filters = 1;
			var filter_locations = filter_location.toString();
			var res_array = filter_locations.split(',');
			res_array = res_array.filter(function (el) {
				return el != null && el != '';
			});
			if ((res_array.length > 1)) {
				have_filters = 2;
			}
		}
		if (have_filters == 0 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
			jQuery('.listing-error').show();
			jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
			jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
			jQuery("#scheduler .custom-footer").hide();
		} else if (have_filters == 2 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
			jQuery('.listing-error1').show();
			jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
			jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
			jQuery("#scheduler .custom-footer").hide();
		} else {
			jQuery('.listing-error').hide();
			jQuery('.listing-error1').hide();
			jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'visible');
			jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'visible');
			jQuery("#scheduler .custom-footer").show();
		}

		/* var title= jQuery('.fc-toolbar-title').html();
				var title_sp = title.split(' ');
				var num = title_sp[0].substr(0,2);
				if(isNaN(num)){
					var month = title_sp[0]; 
					title= jQuery.trim(title.replace(month+' ',''));
					title = title.split(',');
					var date =jQuery.trim(title[0]);
					var year = jQuery.trim(title[1]);
					var dates = jQuery('.fc-toolbar-title').html();
					dates = dates.split(',');
					var year1 = jQuery.trim(dates[1]);
					var dates1 = dates[0].split('–');
					var date1 =jQuery.trim( dates1[0])+','+year1;
					var dates2 =  dates1[0].split(' ');
					var date2 = jQuery.trim( dates2[0])+jQuery.trim(dates1[1]);				
				}
				else {				
					if(title.indexOf('–')>= 0){
						var date = jQuery.trim(title_sp[0])+' - '+jQuery.trim(title_sp[2]);
						var month = jQuery.trim(title_sp[3]);
						var year = jQuery.trim(title_sp[4]);
						var date1 =jQuery.trim( title_sp[0])+' '+month+' '+year;
						console.log('title_sp[0]'+title_sp[0]);
						console.log('title_sp[1]'+title_sp[1]);
						console.log('title_sp[2]'+title_sp[2]);
						console.log('date'+date1);
						var date2 =jQuery.trim(jQuery.trim( title_sp[2]))+' '+month+' '+year;
						console.log('date2'+date2);
					}
					else {
					var date = jQuery.trim(title_sp[0]);
					var month = jQuery.trim(title_sp[1]);
					var year = jQuery.trim(title_sp[2]);
					}
				}
	
				var calendar_view_val = jQuery('#cal_view_select').val();
				
				if(calendar_view_val == 'timeGridDay' || calendar_view_val == 'resourceTimelineDay'){
					jQuery("#reportrange span").html(date+' '+month+', '+year+' - Week '+weekNumber(new Date(jQuery('.fc-toolbar-title').html())));
				}
				else if(calendar_view_val == 'timeGridWeek' || calendar_view_val == 'resourceTimelineWeek' || calendar_view_val == 'listWeek'){
					jQuery("#reportrange span").html(date+' '+month+', '+year+' - Week '+weekNumber(new Date(date1)));
				}
				else {
					jQuery("#reportrange span").html(date+' '+month+', '+year+' - Week '+weekNumber(new Date(date1))+' - '+weekNumber(new Date(date2)));
				} */


		previous_view = calendar_view_val;
		jQuery.ajax({
			type: "POST",
			url: AdminajaxUrl.ajaxurl,
			data: {
				action: 'save_cal_calview',
				calendar_view: this.options[e.target.selectedIndex].getAttribute('data-view'),
			},
			success: function (response) {

				//get_booking_data(calendar);


			}
		});
		//}

		//calendar.changeView(this.options[e.target.selectedIndex].getAttribute('data-view'));
		//calendar.render();
		jQuery('#scheduler').fadeIn();
	})



	/* var calendar = jQuery(calendarEl).mobiscroll().eventcalendar({
		view: {
            timeline: {
                type: 'day',
				
            }
        },
        data:schedulerTasks,
        resources: section_resources
	}); */
	/*var calendar = new FullCalendar.Calendar(calendarEl, {
		//businessHours: { daysOfWeek: [0,1,2,3,4,5,6],startTime: '00:00',endTime: '24:00',},
		locale: 'nn',
		slotMinTime: cal_starttime, 
        slotMaxTime: cal_endtime, 
		initialDate: initialDate, 
		slotMinWidth: cell_width,
        initialView: calendar_view_val,
		weekends:true,
		allDaySlot: false,
		titleFormat:{  day: 'numeric', year: 'numeric', month: 'long', week: 'numeric' },
		firstDay:1,
		  slotLabelFormat: { // like '14:30:00'
			hour: '2-digit',
			minute: '2-digit',
			meridiem: false,
			hour12: false
		  },
		  views: { 
			resourceTimelineWeek: { 
			  
			  slotLabelFormat: [
				(date) => {
				  return dayjs(date.date.marker).format('ddd D/M');
				},				
				(date) => {
				  return dayjs(date.date.marker).format('HH:mm');
				}
			  ],
			}, 
			resourceTimelineMonth: { 
				
				slotLabelFormat: [
				  (date) => {
					return dayjs(date.date.marker).format('Ddd');
				  }
				],
			  },
		
		  },
        headerToolbar: {
            left: 'prev,next today title',
            center: '',
            right: ''
        },
        editable: true,
        resourceAreaColumns: [{
            field: 'text',
            headerContent: 'Listings'
        }],
        resourceOrder: 'text',
        resources: section_resources_value,
        events: schedulerTasks,
		forceEventDuration: true,
        eventMouseEnter: function (info) {

			//console.log('eventMouseEnterinfo' + JSON.stringify(info));
            var start = info.event.start;
            start =  (start.getHours() < 10 ? '0' : '') + start.getHours()+ ':' +  (start.getMinutes() < 10 ? '0' : '') + start.getMinutes(); 
            var end = info.event.end;
            if (typeof (end) != 'undefined' && end !== null) {
				end =  (end.getHours() < 10 ? '0' : '') + end.getHours()+ ':' +  (end.getMinutes() < 10 ? '0' : '') + end.getMinutes(); 
				
			}
			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var d = new Date(info.event.start);
			var dayName = days[d.getDay()];

            var desc = info.event.extendedProps.description;
			var resourceId = info.event.extendedProps.sectionResourcesId;
			var listing_name= '';
			//console.log('section_resources'+JSON.stringify(section_resources));
			jQuery.each(section_resources, function(index, value) {
				if(value.id == resourceId){
					listing_name = value.full_text;
				} 

			});

            var pos = jQuery(info.el).parent().find('.fc-event-title.fc-sticky').position();
            var left = 0;
            if (typeof (pos) != 'undefined')
                left = pos.left - 100;
				var repeated= '';
				if (typeof(info.event.extendedProps.recurrenceRule) != 'undefined' &&info.event.extendedProps.recurrenceRule != '') {
					var endDate = info.event.extendedProps.recurrenceRule.split('UNTIL=');
					endDate = jQuery.trim(endDate[1]);
					var date = endDate.substr(6,2);
					var month = endDate.substr(4,2);
					var year = endDate.substr(0,4);
					endDate = date+'.'+month+'.'+year;
				
					repeated = '<p class="tooltip-custom"><span>Repeating to: </span>'+endDate+'</p>';
				}
				var comment= '';
				if (typeof(desc) != 'undefined' && desc != '') {
					comment = '<p class="tooltip-custom"><span>Comment: </span>'+desc.substr(0, 60)+'</p>';
				}
				var related_to = '';
				if(typeof(info.event.extendedProps.first_event_id) != 'undefined' && info.event.extendedProps.first_event_id != '' && info.event.extendedProps.first_event_id != 'null'  && info.event.extendedProps.first_event_id != null) {
					var first_event_ids = info.event.extendedProps.first_event_id.split(',');
					    jQuery.each(first_event_ids, function(index, value){
							var eventt = getIndexById(value);
							if(typeof( schedulerTasks[eventt]) != 'undefined' &&  schedulerTasks[eventt] != '' &&  schedulerTasks[eventt] != 'null'  &&  schedulerTasks[eventt] != null) {
							var resId = schedulerTasks[eventt]['resourceId'];
							related_to +='<p class="tooltip-custom"><span>Related to: </span>';
							jQuery.each(section_resources, function(index, value) {
								if(value.id == resId){
									listing_name = value.full_text;
									related_to += ''+listing_name+',';
								} 				
							});
							related_to = related_to.substr(0,related_to.length-1);
							related_to += '</p>';
							}

						});
				}
				
				//<p class="tooltip-custom"><span>Related to: </span> Listing a, Listing b(max 20char per listing, on hoover here show full listing name)</p>
			var eventOutput = '<div role="tooltip" class="k-widget k-tooltip k-popup k-group k-reset" data-role="popup" style="position: absolute;display: block;opacity: 1;left: ' + left + 'px;top:30px;" aria-hidden="true"><div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><h4 style="display: inline-block;width: 75%;">' + start + ' - ' + end + '</h4><span style="display: inline-block;font-size: 1.2em;font-weight: 600;">View more</span><p class="tooltip-custom"><span>Customer: </span> '+info.event.title+'</p>'+repeated+related_to+comment+'</div></div>';
			//<div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><h4>Original booking</h4><p class="tooltip-custom"><span>Listing: </span> '+listing_name+'</p><p class="tooltip-custom"><span>Day: </span> '+dayName+'</p><p class="tooltip-custom"><span>Time: </span>' + start + ' - ' + end + '</p></div></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>
			//<div class="k-tooltip-content-holebox"><div class="k-tooltip-content"><h4>Score: 34</h4><p class="tooltip-custom"><span>Desired hours: </span> 20</p><p class="tooltip-custom"><span>Algorithm hours: </span> 20</p><p class="tooltip-custom"><span>Received hours: </span> 20</p></div></div>
          //  var eventOutput = '<div role="tooltip" class="k-widget k-tooltip k-popup k-group k-reset" data-role="popup" style="position: absolute;display: block;opacity: 1;left: ' + left + 'px;top:30px;" aria-hidden="true"><div class="k-tooltip-content"><p class="tooltip-time"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">' + start + ' - ' + end + '</font></font></p><p class="tooltip-custom"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">' + info.event.title + '</font></font></p><p><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Comment: ' + desc + '</font></font></p><p></p></div><div class="k-callout k-callout-n" style="left: 84.9999px;"></div></div>';
            
            if (jQuery(info.el).parent().find('.k-tooltip').length == 0)
                jQuery(info.el).append(eventOutput);
			if(jQuery(info.el).parent().find('.fc-event-title.fc-sticky').find('.k-event-delete').length == 0)
            jQuery(info.el).parent().find('.fc-event-title.fc-sticky').append('<a href="#" class="k-link k-event-delete" title="Slett" aria-label="Slett"><span class="k-icon k-i-close"></span></a>');
        },
        eventMouseLeave: function (info) {
            if (jQuery(info.el).parent().find('.k-tooltip').length > 0)
                jQuery(info.el).parent().find('.k-tooltip').remove();
            if (jQuery(info.el).parent().find('.k-event-delete').length > 0)
                jQuery(info.el).parent().find('.k-event-delete').remove();
        },
        eventResize: function (info) {
            if(typeof(info.el) != 'undefined'){
				var indate = info.el.fcSeg.start;
				if(typeof(indate) != 'undefined'){
					indate =  moment(indate).format("YYYY-MM-DD");
					jQuery('#schedule-add').find('#wpm-initial-date').val(indate);
				}
			}
			if (typeof(info.event.extendedProps.recurrenceRule) != 'undefined' &&info.event.extendedProps.recurrenceRule != '') {
				jQuery('#theModal').toggleClass('show');

				jQuery("#modal-dismiss").click(function () {
					jQuery("#theModal").removeClass("show");
				});
			
			jQuery("#this-instance").click(function () {
				jQuery("#theModal").removeClass("show");
				jQuery("#schedule-add").removeClass("show");
				
				var start = (new Date(new Date(info.event._instance.range.start).toString().split('GMT')[0] + ' UTC').toISOString());
				start = start.replace(/-/g,'');
				start = start.split('T');
				start = start[0];
				var values = {
					id: info.event.id,
					title: info.event.title,
					client: info.event.extendedProps.client.value,
					team: info.event.extendedProps.team.value,
					start_from: (new Date(new Date(info.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					end_to: (new Date(new Date(info.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					description: info.event.extendedProps.description,
					repert: '',
					status: info.event.extendedProps.status.value,
					//gymId: e.data.GymID,
					recurrenceRule: '',
					recurrenceId: info.event.id,
					recurrenceException:start,
					resourceId:  (typeof(info.newResource)!= 'undefined' && info.newResource != null)?info.newResource.id:info.event.extendedProps.sectionResourcesId
				};
				createEvent(values, calendar);
			});
			jQuery("#all-instance").click(function () {
				jQuery("#theModal").removeClass("show");
				jQuery("#schedule-add").removeClass("show");
				var values = {
					id: info.event.id,
					title: info.event.title,
					client: info.event.extendedProps.client.value,
					team: info.event.extendedProps.team.value,
					start_from: (new Date(new Date(info.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					end_to: (new Date(new Date(info.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					description: info.event.extendedProps.description,
					repert: '',
					status: info.event.extendedProps.status.value,
					//gymId: e.data.GymID,
					recurrenceRule: info.event.extendedProps.recurrenceRule,
					recurrenceId: '',
					resourceId: (typeof(info.newResource)!= 'undefined' && info.newResource != null)?info.newResource.id:info.event.extendedProps.sectionResourcesId
				};
				updateEvent(values,calendar);
			});
		}
		else {
			var values = {
				id: info.event.id,
				title: info.event.title,
				client: info.event.extendedProps.client.value,
				team: info.event.extendedProps.team.value,
				start_from: (new Date(new Date(info.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
				end_to: (new Date(new Date(info.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
				description: info.event.extendedProps.description,
				repert: '',
				status: info.event.extendedProps.status.value,
				//gymId: e.data.GymID,
				recurrenceRule: '',
				recurrenceId: '',
				resourceId: (typeof(info.newResource)!= 'undefined' && info.newResource != null)?info.newResource.id:info.event.extendedProps.sectionResourcesId
			};
			updateEvent(values,calendar);
		}
        },
        eventDrop: function (info) {
			if (typeof(info.event.extendedProps.recurrenceRule) != 'undefined' &&info.event.extendedProps.recurrenceRule != '') {
				jQuery('#theModal').toggleClass('show');

				jQuery("#modal-dismiss").click(function () {
					jQuery("#theModal").removeClass("show");
				});
			
			jQuery("#this-instance").click(function () {
				jQuery("#theModal").removeClass("show");
				jQuery("#schedule-add").removeClass("show");
				var start = (new Date(new Date(info.event._instance.range.start).toString().split('GMT')[0] + ' UTC').toISOString());
				start = start.replace(/-/g,'');
				start = start.split('T');
				start = start[0];
				var values = {
					id: info.event.id,
					title: info.event.title,
					client: info.event.extendedProps.client.value,
					team: info.event.extendedProps.team.value,
					start_from: (new Date(new Date(info.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					end_to: (new Date(new Date(info.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					description: info.event.extendedProps.description,
					repert: '',
					status: info.event.extendedProps.status.value,
					//gymId: e.data.GymID,
					recurrenceRule: '', 
					recurrenceId: info.event.id,
					recurrenceException:start,
					resourceId: (typeof(info.newResource)!= 'undefined' && info.newResource != null)?info.newResource.id:info.event.extendedProps.sectionResourcesId
				};
				createEvent(values,calendar);
				jQuery("#schedule-add").removeClass("show");
			});
			jQuery("#all-instance").click(function (event) {
				event.preventDefault();
				event.stopImmediatePropagation();
				jQuery("#theModal").removeClass("show");
				jQuery("#schedule-add").removeClass("show");
				var values = {
					id: info.event.id,
					title: info.event.title,
					client: info.event.extendedProps.client.value,
					team: info.event.extendedProps.team.value,
					start_from: (new Date(new Date(info.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					end_to: (new Date(new Date(info.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
					description: info.event.extendedProps.description,
					repert: '',
					status: info.event.extendedProps.status.value,
					//gymId: e.data.GymID,
					recurrenceRule: info.event.extendedProps.recurrenceRule,
					recurrenceId: '',
					resourceId:  (typeof(info.newResource)!= 'undefined' && info.newResource != null)?info.newResource.id:info.event.extendedProps.sectionResourcesId
				};
				updateEvent(values, calendar);
				jQuery("#schedule-add").removeClass("show");
			});
		}
		else {
			var values = {
				id: info.event.id,
				title: info.event.title,
				client: info.event.extendedProps.client.value,
				team: info.event.extendedProps.team.value,
				start_from: (new Date(new Date(info.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
				end_to: (new Date(new Date(info.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16),
				description: info.event.extendedProps.description,
				repert: '',
				status: info.event.extendedProps.status.value,
				//gymId: e.data.GymID,
				recurrenceRule: '',
				recurrenceId: '',
				resourceId:  (typeof(info.newResource)!= 'undefined' && info.newResource != null)?info.newResource.id:info.event.extendedProps.sectionResourcesId
			};
			updateEvent(values, calendar);

		}
			if(typeof(info.el) != 'undefined'){
				var indate = info.el.fcSeg.start;
				if(typeof(indate) != 'undefined'){
					indate =  moment(indate).format("YYYY-MM-DD");
					jQuery('#schedule-add').find('#wpm-initial-date').val(indate);
				}
			}
            
        },
		eventContent: function(arg){
			//console.log('arg'+JSON.stringify(arg));
			var status_class = arg.event.extendedProps.status.value;
			var comment = '';
			if(arg.event.extendedProps.description != ''){
				comment += '<img src="/wp-content/plugins/schedule-calendar/images/comment_icon.png" />';
			}
			var repeated = '';
			var linked = '';
			if(typeof(arg.event.extendedProps.recurrenceRule) != 'undefined' && arg.event.extendedProps.recurrenceRule != '' && arg.event.extendedProps.recurrenceRule != null) {
			repeated = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">			<path d="M16.8921 1.04565V6.67065C16.8921 7.16284 16.5054 7.5144 16.0483 7.5144H10.4233C9.93115 7.5144 9.57959 7.16284 9.57959 6.67065C9.57959 6.21362 9.93115 5.8269 10.4233 5.8269H13.939C12.8843 3.823 10.7749 2.4519 8.45459 2.4519C5.00928 2.4519 2.26709 5.22925 2.26709 8.6394C2.26709 12.0847 5.00928 14.8269 8.45459 14.8269C9.896 14.8269 11.3022 14.3347 12.3921 13.4207C12.7437 13.1042 13.271 13.1746 13.5874 13.5261C13.8687 13.8777 13.8335 14.405 13.4819 14.7214C12.0757 15.8816 10.2827 16.5144 8.41943 16.5144C4.09521 16.5144 0.57959 12.9988 0.57959 8.6394C0.57959 4.31519 4.09521 0.799561 8.41943 0.799561C11.2319 0.799561 13.7983 2.31128 15.2046 4.63159V1.04565C15.2046 0.588623 15.5562 0.201904 16.0483 0.201904C16.5054 0.201904 16.8921 0.588623 16.8921 1.04565Z" fill="white"/></svg>';
			}
			else if(typeof(arg.event.extendedProps.recurrenceId) != 'undefined' && arg.event.extendedProps.recurrenceId != '' && arg.event.extendedProps.recurrenceId != null) {
			repeated = '<img src="/wp-content/plugins/schedule-calendar/images/un-repeated_icon.png" />';
			}
			if(typeof(arg.event.extendedProps.first_event_id) != 'undefined' && arg.event.extendedProps.first_event_id != '' && arg.event.extendedProps.first_event_id != 'null'  && arg.event.extendedProps.first_event_id != null) {
				linked = '<img src="/wp-content/plugins/schedule-calendar/images/linked_icon.png" />';
			}
			
			return { html: '<div class="fc-event-main-frame calendar-status-'+status_class+'"><div class="fc-event-title-container"><div class="fc-event-title fc-sticky" style="top: 0px;">'+repeated+linked+arg.event.title+comment+'</div></div></div>' };
		},
        eventClick: function (info) {
            //console.log('eventClick' + JSON.stringify(info));
			if(typeof(info.el) != 'undefined'){
				var indate = info.el.fcSeg.start;
				if(typeof(indate) != 'undefined'){
					indate =  moment(indate).format("YYYY-MM-DD");
					jQuery('#schedule-add').find('#wpm-initial-date').val(indate);
				}
			}
            localStorage.setItem("event_id", info.event.id);

            var className = jQuery(info.jsEvent.target).attr('class');
            var flag = 1;
            if (typeof (className) != 'undefined') {
                if (className.indexOf('k-i-close') >= 0) {
                    if (confirm('Are you sure you want to delete this task?')) {
                        if (cal_type != "view_only") {
                            let loader = jQuery('#loader').append('<div class="loader-14"></div>');
                            schedulerTasks.splice(getIndexById(info.event.id), 1);
                            //console.log(schedulerTasks);
                            jQuery.post(
                                WPMAddRecord.ajaxurl, {
                                    action: 'wpm_delete_record',
                                    id: info.event.id,
                                },
                                function (response) {
                                    var cpt = 1;

                                    jQuery('#toast-container').append('<div id="toast' + (cpt) + '" class="toast erreur toast-entrance d-flex"><div class="d-flex justify-content-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" class="eva eva-checkmark-circle-outline" fill="#ffffff"><g data-name="Layer 2"><g data-name="checkmark-circle"><rect width="24" height="24" opacity="0"></rect><path d="M9.71 11.29a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 16a1 1 0 0 0 .72-.34l7-8a1 1 0 0 0-1.5-1.32L12 13.54z"></path><path d="M21 11a1 1 0 0 0-1 1 8 8 0 0 1-8 8A8 8 0 0 1 6.33 6.36 7.93 7.93 0 0 1 12 4a8.79 8.79 0 0 1 1.9.22 1 1 0 1 0 .47-1.94A10.54 10.54 0 0 0 12 2a10 10 0 0 0-7 17.09A9.93 9.93 0 0 0 12 22a10 10 0 0 0 10-10 1 1 0 0 0-1-1z"></path></g></g></svg></div>Event is deleted successfully.</div>')

                                    var val = cpt;
									loader.html("");
				loader.hide();
                                    setTimeout(function () {
                                        jQuery('#toast' + val).remove();
                                    }, 5500);

                                    cpt++;
                                    get_booking_data(calendar);
                                });
                        }
                    }
                    flag = 0;
                }
            }
            if (flag == 1) {
                if (typeof (info.event.extendedProps.recurrenceRule) != 'undefined') {
                    if (info.event.extendedProps.recurrenceRule != '') {
                        jQuery('#theModal').toggleClass('show');

                        jQuery("#modal-dismiss").click(function () {
                            jQuery("#theModal").removeClass("show");
                        });
                    }
                } else {
                    jQuery("#theModal").removeClass("show");
					if (typeof (info.event.extendedProps.recurrenceId) != 'undefined' && info.event.extendedProps.recurrenceId != '' && info.event.extendedProps.recurrenceId != null) {
						jQuery('#wpm-recurrenceId').val(info.event.extendedProps.recurrenceId);
					}
                    jQuery('#wpm-resourceId').val(info.event.extendedProps.sectionResourcesId);
					jQuery('#wpm_listing').val(info.event.extendedProps.full_text);
                    jQuery('#schedule-add').find('#wpm-client').val(info.event.extendedProps.client.value);
                    jQuery('#schedule-add select#wpm-client').trigger('change');
                    jQuery('#schedule-add').find('#wpm-date-start').val((new Date(new Date(info.event.start).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16));
                    jQuery('#schedule-add').find('#wpm-date-end').val((new Date(new Date(info.event.end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16));
                    jQuery('#schedule-add').find('#wpm-description').html(info.event.extendedProps.description);
                    jQuery('#schedule-add').find('#wpm-status').val(info.event.extendedProps.status.value);
                    jQuery('#schedule-add').find('.save-event').removeClass('save-event').addClass('update-event').html('Update');
                    jQuery('#schedule-add').modal('show');
					jQuery('.main-k-first').addClass("k-state-active");
                    jQuery(".main-k-first").attr("aria-pressed", "true");
                    jQuery('.main-k-second').removeClass("k-state-active");
                    jQuery(".main-k-second").attr("aria-pressed", "false");
                    jQuery('.k-recur-view').css("display", "none");
                    setTimeout(function () {
                        jQuery('#schedule-add').find('#wpm-team').val(info.event.extendedProps.team.value);
                    }, 8000);
                }
                jQuery("#this-instance").click(function () {
                    //alert((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]).toISOString()).slice(0, 16));
                    jQuery("#theModal").removeClass("show");
                    jQuery('#wpm-resourceId').val(info.event.extendedProps.sectionResourcesId);
					jQuery('#wpm_listing').val(info.event.extendedProps.full_text);
					jQuery('#wpm-recurrenceId').val(info.event.id);
					jQuery('#wpm-rrule').val('');
					jQuery('#wpm-repeat').val(0);
					var start = (new Date(new Date(info.event._instance.range.start).toString().split('GMT')[0] + ' UTC').toISOString());
				    start = start.replace(/-/g,'');
				    start = start.split('T');
				    start = start[0];

					jQuery('#wpm-recurrenceException').val(start);
                    jQuery('#schedule-add').find('#wpm-client').val(info.event.extendedProps.client.value);
                    jQuery('#schedule-add select#wpm-client').trigger('change');
                   // console.log((info.el.fcSeg.start).toString());
                    //alert(info.el.fcSeg.start.toString());
                    //console.log((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0] + ' UTC').toISOString()));
                   // console.log((new Date(info.el.fcSeg.start).toString()));
                    //jQuery('#schedule-add').find('#wpm-date-start').val((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16));
                    jQuery('#schedule-add').find('#wpm-date-start').val((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]).toISOString()).slice(0, 16));
                    jQuery('#schedule-add').find('#wpm-date-end').val((new Date(new Date(info.el.fcSeg.end).toString().split('GMT')[0]).toISOString()).slice(0, 16));
                    //jQuery('#schedule-add').find('#wpm-date-end').val((new Date(new Date(info.el.fcSeg.end).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16));
                    jQuery('#schedule-add').find('#wpm-description').html(info.event.extendedProps.description);
                    jQuery('#schedule-add').find('#wpm-status').val(info.event.extendedProps.status.value);
                    jQuery('#schedule-add').find('.save-event').removeClass('update-event').addClass('save-event').html('Save');
                    jQuery('#schedule-add').modal('show');
					jQuery('.main-k-first').addClass("k-state-active");
                    jQuery(".main-k-first").attr("aria-pressed", "true");
                    jQuery('.main-k-second').removeClass("k-state-active");
                    jQuery(".main-k-second").attr("aria-pressed", "false");
                    jQuery('.k-recur-view').css("display", "none");
                    setTimeout(function () {
                        jQuery('#schedule-add').find('#wpm-team').val(info.event.extendedProps.team.value);
                    }, 8000);
                });
                jQuery("#all-instance").click(function () {
                    jQuery("#theModal").removeClass("show");
					jQuery('#wpm-repeat').val(1);
					jQuery('#repeat_selection').prop('checked',true); 
					jQuery('#repeat_selection').attr('checked','checked'); 
					//jQuery('#repeat_selection').trigger('click');
					var days = info.event.extendedProps.recurrenceRule.split('BYDAY=');
					days = days[1].substr(0,days[1].length);
					days = days.split(',');
					jQuery.each(days, function(index, value) {
						jQuery('.k-recur-weekday-buttons span.k-button[data-value="'+value+'"]').addClass('k-state-active');
					});
					if(info.event.extendedProps.recurrenceRule.indexOf('UNTIL=')>=0){
					var until = info.event.extendedProps.recurrenceRule.split('UNTIL=');
					until = jQuery.trim(until[1]);
					var date = until.substr(6,2);
					var month = until.substr(4,2);
					var year = until.substr(0,4);
					
					jQuery('.k-recur-end-until').attr('checked', 'checked');
					jQuery('.k-recur-end-until').prop('checked', true);	
					jQuery('#wpm_until').val(year+'-'+month+'-'+date);				
					//jQuery('#wpm_until').val(date+'-'+month+'-'+year);
					}
					if(info.event.extendedProps.recurrenceRule.indexOf('INTERVAL=')>=0){
						var interval = info.event.extendedProps.recurrenceRule.split('INTERVAL=');
						interval = jQuery.trim(interval[1]);
						interval = interval.substr(0,1);
						
						jQuery('#wpm-interval').val(interval);				
						//jQuery('#wpm_until').val(date+'-'+month+'-'+year);
						}
                    jQuery('#wpm-resourceId').val(info.event.extendedProps.sectionResourcesId);
					jQuery('#wpm_listing').val(info.event.extendedProps.full_text);
                    jQuery('#schedule-add').find('#wpm-client').val(info.event.extendedProps.client.value);
                    jQuery('#schedule-add select#wpm-client').trigger('change');
                    jQuery('#schedule-add').find('#wpm-date-start').val((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]).toISOString()).slice(0, 16));
                    jQuery('#schedule-add').find('#wpm-date-end').val((new Date(new Date(info.el.fcSeg.end).toString().split('GMT')[0]).toISOString()).slice(0, 16));
                    //jQuery('#schedule-add').find('#wpm-date-start').val((new Date(new Date(info.el.fcSeg.start).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16));
//					jQuery('#schedule-add').find('#wpm-date-end').val((new Date(new Date(info.el.fcSeg.end).toString().split('GMT')[0]+' UTC').toISOString()).slice(0, 16)); 
                    //jQuery('#schedule-add').find('#wpm-date-start').val(info.el.fcSeg.start.toLocaleString());
                    //jQuery('#schedule-add').find('#wpm-date-end').val(info.el.fcSeg.end.toLocaleString());
                    jQuery('#schedule-add').find('#wpm-description').html(info.event.extendedProps.description);
                    jQuery('#schedule-add').find('#wpm-status').val(info.event.extendedProps.status.value);
                    jQuery('#schedule-add').find('.save-event').removeClass('save-event').addClass('update-event').html('Update');
                    jQuery('#schedule-add').modal('show');
                    setTimeout(function () {
                        jQuery('#schedule-add').find('#wpm-team').val(info.event.extendedProps.team.value);
                    }, 8000);
                    jQuery('.main-k-first').removeClass("k-state-active");
                    jQuery(".main-k-first").attr("aria-pressed", "false");
                    jQuery('.main-k-second').addClass("k-state-active");
                    jQuery(".main-k-second").attr("aria-pressed", "true");
                    jQuery('.k-recur-view').css("display", "block");
                });
            }
        },
        dateClick: function (info) {
			if(typeof(info.el) != 'undefined'){
				var indate = info.el.fcSeg.start;
				if(typeof(indate) != 'undefined'){
					indate =  moment(indate).format("YYYY-MM-DD");
					jQuery('#schedule-add').find('#wpm-initial-date').val(indate);
				}
			}
            //console.log('Clicked on: ' + JSON.stringify(info));
			jQuery('#wpm-repeat').val(0);
			jQuery('.k-recur-view').hide();
            jQuery('#wpm-resourceId').val(info.resource.id);
			jQuery('#wpm_listing').val(info.resource.extendedProps.full_text);
			jQuery('#schedule-add').find('#wpm-client').val('');
			jQuery('#schedule-add select#wpm-client').trigger('change');
            var dd = info.dateStr;
            dd = dd.slice(0, 16);
            var start = new Date(info.date);
            document.getElementById("wpm-date-start").value = dd;

            var end = new Date(info.date);
            end.setMinutes(start.getMinutes() + 30);
            //console.log(((new Date(new Date(end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16)));
            document.getElementById("wpm-date-end").value = (new Date(new Date(end).toString().split('GMT')[0] + ' UTC').toISOString()).slice(0, 16);
            jQuery('#schedule-add').modal('show');
        }
    });
 
    calendar.render(); */




	jQuery("body").on('mouseout', '.fc-datagrid-cell.fc-resource', function () {
		jQuery(this).find('.sports-tip').remove();
	});
	jQuery("#scheduler").find(".custom-footer").remove();

	if (cal_type == "view_only") {
		var calele = jQuery('#scheduler .mbsc-calendar-wrapper').next();
		jQuery('<div class="custom-footer">' +
			'<div class="row row-centered">' +
			'<div class="col-md-2 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#fe852c !important"></span> <span class="ft_color_txt">Ønsket tider</span>' +
			'</div>' +
			'<div class="col-md-2 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#62b0d9 !important"></span> <span class="ft_color_txt">Algoritme forslag</span>' +
			'</div>' +
			'<div class="col-md-2 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#086CA3"></span> <span class="ft_color_txt">Manuelt godkjent</span>' +
			'</div>' +
			'<div class="col-md-2 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#F13C30 !important"></span> <span class="ft_color_txt">Algoritme avslag</span>' +
			'</div>' +
			'<div class="col-md-2 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#A80A00"></span> <span class="ft_color_txt">Manuelt avslått</span>' +
			'</div>' +

			'</div>' +
			'</div>').insertAfter(calele);

	} else {
		var calele = jQuery('#scheduler .mbsc-calendar-wrapper').next();
		jQuery('<div class="custom-footer">' +
			'<div class="row row-centered">' +
			'<div class="col-md-3 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#3B940B !important"></span> <span class="ft_color_txt">Betalt</span>' +
			'</div>' +
			'<div class="col-md-3 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#65B0D6 !important"></span> <span class="ft_color_txt">Godkjent</span>' +
			'</div>' +
			'<div class="col-md-3 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#006DA5 !important"></span> <span class="ft_color_txt">Sesongbooking</span>' +
			'</div>' +
			'<div class="col-md-3 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#FF8312 !important"></span> <span class="ft_color_txt">Venter på godkjenning</span>' +
			'</div>' +
			'<div class="col-md-3 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#EE3535 !important"></span> <span class="ft_color_txt">Kansellert/utløpt</span>' +
			'</div>' +
			'<div class="col-md-3 col-centered">' +
			'<span class="ft_color dot-cl" style="background-color:#C0C0C0 !important"></span> <span class="ft_color_txt">Stengt</span>' +
			'</div>' +
			'</div>' +
			'</div>').insertAfter(calele);
	}
	jQuery('#scheduler .fc-event-main-frame').each(function () {
		var classN = jQuery(this).attr('class');
		classN = classN.replace('fc-event-main-frame', '');
		jQuery(this).parent().parent().addClass(classN);
	});

	jQuery('.listing-error').hide();
	jQuery('.listing-error1').hide();
	jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'visible');;
	jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'visible');;
	jQuery("#scheduler .custom-footer").show();
	var have_filters = 0;
	//var filter_location = jQuery('#location_select').val();

	if ((typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '')) {
		have_filters = 1;
		var filter_locations = filter_location.toString();
		var res_array = filter_locations.split(',');
		res_array = res_array.filter(function (el) {
			return el != null && el != '';
		});
		if ((res_array.length > 1)) {
			have_filters = 2;
		}
	}
	if (have_filters == 0 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
		jQuery('.listing-error').show();
		jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
		jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
		jQuery("#scheduler .custom-footer").hide();
	} else if (have_filters == 2 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
		jQuery('.listing-error1').show();
		jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
		jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
		jQuery("#scheduler .custom-footer").hide();
	} else {
		jQuery('.listing-error').hide();
		jQuery('.listing-error1').hide();
		jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'visible');;
		jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'visible');;
		jQuery("#scheduler .custom-footer").show();
	}

	jQuery(document).on("click", "button.save-event", function () {
		createEvent('', calendar);
		jQuery('#schedule-add').modal('hide');
	});
	jQuery(document).on("click", "button.update-event", function () {
		updateEvent('', calendar);
		jQuery('#schedule-add').find('.update-event').removeClass('update-event').addClass('save-event').html('Save')
		jQuery('#schedule-add').modal('hide');
	});
	jQuery(document).on("click", "button.save-recurrence", function () {
		let weekDays = '';
		let repeat = 'weekly';
		let interval = 1;
		let until = new Date();
		if (jQuery('span[data-value="MO"]').hasClass("k-state-active"))
			weekDays += weekDays.length ? ',MO' : 'MO';
		if (jQuery('span[data-value="TU"]').hasClass("k-state-active"))
			weekDays += weekDays.length ? ',TU' : 'TU';
		if (jQuery('span[data-value="WE"]').hasClass("k-state-active"))
			weekDays += weekDays.length ? ',WE' : 'WE';
		if (jQuery('span[data-value="TH"]').hasClass("k-state-active"))
			weekDays += weekDays.length ? ',TH' : 'TH';
		if (jQuery('span[data-value="FR"]').hasClass("k-state-active"))
			weekDays += weekDays.length ? ',FR' : 'FR';
		if (jQuery('span[data-value="SA"]').hasClass("k-state-active"))
			weekDays += weekDays.length ? ',SA' : 'SA';
		if (jQuery('span[data-value="SU"]').hasClass("k-state-active"))
			weekDays += weekDays.length ? ',SU' : 'SU';
		// repeat = jQuery("#repeat-type").val() ;
		interval = Number(jQuery('#repeat-interval').val());
		until = new Date(jQuery("#wpm_until").val());
		var recurring = "";
		var untilString = until.toISOString();
		untilString = untilString.replaceAll('-', '');
		untilString = untilString.replaceAll(':', '');
		untilString = untilString.slice(0, -5);
		untilString += "Z";
		recurring += "FREQ=" + repeat.toUpperCase() + ";UNTIL=" + untilString + ";INTERVAL=" + interval + ";BYDAY=" + weekDays;
		jQuery("#wpm-rrule").val(recurring);
		weekDays = weekDays.replaceAll('MO', 'Monday');
		weekDays = weekDays.replaceAll('TU', 'Tuesday');
		weekDays = weekDays.replaceAll('WE', 'Wednesday');
		weekDays = weekDays.replaceAll('TH', 'Thursday');
		weekDays = weekDays.replaceAll('FR', 'Friday');
		weekDays = weekDays.replaceAll('SA', 'Saturday');
		weekDays = weekDays.replaceAll('SU', 'Sunday');
		var monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var disp = 'Weekly on ' + weekDays + ', until ' + monthString[until.getMonth()] + ' ' + (until.getDate() + 1) + ', ' + until.getFullYear();
		jQuery("input.k-valid.status-recurrence").val(disp);
		console.log(recurring);
		jQuery('.k-recur-view').removeClass('showPop');
	})

	jQuery(document).on("click", ".filter_group_submit", function (e) {
		e.preventDefault();
		var selected_values = '';
		jQuery("#lgroup_select").find("option:selected").each(function () {
			selected_values += (jQuery(this).val()) + ',';
		});
		if (selected_values != '') {
			selected_values = selected_values.substr(0, selected_values.length - 1);
		}
		jQuery(".dropdown-filter-group").fadeOut();
		jQuery("#dropdown-filter").fadeOut();
console.log("filter_group_submit");
		jQuery(".dropdown-config").fadeOut();
		//initFullCalendar(selected_values,'');
		if (selected_values != '' && selected_values != '0') {
			jQuery.ajax({
				type: "POST",
				url: AdminajaxUrl.ajaxurl,
				data: {
					action: 'save_cal_filter_group',
					filter_group: selected_values,
				},
				success: function (response) {

					//get_booking_data(calendar);


				}
			});
			jQuery('#filter-group-count').html(res_array.length);
			jQuery('#filter-group-count').show();
			jQuery("#filtervalue-group").show();
		}
		//calendar.setOption('resources', section_resources_value);
		//calendar.refetchEvents();

		//calendar.setResources(selected_values);
	});

	jQuery(document).on("click", ".filter__group_submit .applyBtn", function (e) {
		e.preventDefault();
		var selected_values = '';
		jQuery("#group_select").find("option:selected").each(function () {
			selected_values += (jQuery(this).val()) + ',';
		});
		if (selected_values != '' && selected_values != '0') {
			var res_array = selected_values.split(',');
			res_array = res_array.filter(function (el) {
				return el != null && el != '';
			});
			if ((res_array).length > 0) {
				filterCalForGroup(res_array, calendar);
				jQuery.ajax({
					type: "POST",
					url: AdminajaxUrl.ajaxurl,
					data: {
						action: 'save_cal_filter_group',
						filter_group: selected_values,
					},
					success: function (response) {

						//get_booking_data(calendar);


					}
				});
			}

		} else {
			calendar.setEvents(schedulerTasks);
			calendar.setOptions({
				'resources': section_resources
			});
			//calendar.refetchEvents();
		}

		jQuery('.listing-error').hide();
		jQuery('.listing-error1').hide();
		jQuery("#dropdown-filter").fadeOut();
console.log("filter__group_submit");
		jQuery(".dropdown-config").fadeOut();
		jQuery(".dropdown-filter-group").fadeToggle();
		jQuery(".filter_overlay").fadeOut();
	});

	jQuery(document).on("click", ".filter_calendar .applyBtn", function (e) {
		e.preventDefault();
		var selected_values = '';
		jQuery("#location_select").find("option:selected").each(function () {
			selected_values += (jQuery(this).val()) + ',';
		});
		jQuery('.listing-error').hide();
		jQuery('.listing-error1').hide();
		jQuery("#dropdown-filter").fadeOut();
console.log("filter_calendar");
		jQuery(".dropdown-config").fadeOut();
		jQuery(".filter_overlay").fadeOut();
		//initFullCalendar(selected_values,'');
		var section_resources_value = section_resources;
		var businessHours = [];
		if (selected_values != '' && selected_values != '0') {
			var __data = section_resources;
			var res_array = selected_values.split(',');
			res_array = res_array.filter(function (el) {
				return el != null && el != '';
			});
			var section_resources_value = [];
			for (let i = 0; i < __data.length; ++i) {
				if (selected_values.indexOf(__data[i].value) >= 0) {
					section_resources_value.push(__data[i]);
					businessHours = resources[i]['businessHours'];
				}
			}
			filterCal(selected_values);
			jQuery.ajax({
				type: "POST",
				url: AdminajaxUrl.ajaxurl,
				data: {
					action: 'save_cal_filters',
					filter_location: selected_values,
				},
				success: function (response) {

					//get_booking_data(calendar);


				}
			});
			var calendar_view_val = jQuery('#cal_view_select').val();
			var have_filters = 0;
			var filter_location = jQuery('#location_select').val();
			if ((typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '')) {
				have_filters = 1;
				var filter_locations = filter_location.toString();
				var res_array = filter_locations.split(',');
				if ((res_array.length > 1)) {
					have_filters = 2;
				}
			}
			if (have_filters == 0 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
				jQuery('.listing-error').show();
				jQuery('.listing-error1').hide();
				jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
				jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
				jQuery("#scheduler .custom-footer").hide();
			} else if (have_filters == 2 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
				jQuery('.listing-error1').show();
				jQuery('.listing-error').hide();
				jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
				jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
				jQuery("#scheduler .custom-footer").hide();
			} else {
				jQuery('.listing-error').hide();
				jQuery('.listing-error1').hide();
				jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'visible');
				jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'visible');
				jQuery("#scheduler .custom-footer").show();
			}
			jQuery('#filter-count span').html(res_array.length);
			jQuery('#filter-count').show();
			jQuery("#filtervalue").show();
		}

		//calendar.setOption('businessHours', businessHours);
		console.log('rrr' + JSON.stringify(section_resources_value));
		calendar.setOptions({
			'resources': section_resources_value
		});

		//calendar.setResources(selected_values);
	});

	var start = moment();
	var end = moment();

	if (jQuery('#reportrange').length > 0) {
		function weekNumber(date = new Date()) {
			var firstJanuary = new Date(date.getFullYear(), 0, 1);
			var dayNr = Math.ceil((date - firstJanuary) / (24 * 60 * 60 * 1000));
			var weekNr = Math.ceil((dayNr + firstJanuary.getDay()) / 7);
			return weekNr;
		}

		function cb(start, end) {}


		cb(start, end);

		jQuery(document).on("click", "#cancel-filter", function () {
			jQuery("#dropdown-filter").fadeOut();
console.log("cancel-filter");
		})

		jQuery(document).on("click", ".close-search", function () {
			calendar.setEvents(schedulerTasks);
			//calendar.refetchEvents();
			jQuery('#search_cal').val('');
			jQuery(this).parent('#filter_search').remove();
			/* jQuery.ajax({
				type: "POST",
				url: AdminajaxUrl.ajaxurl,
				data: {
					action: 'save_cal_filter_search',
					filter_location: '',
				},
				success: function (response) {
					
				}
			});	 */

		})
		jQuery(document).on("click", "#clear-filter", function () {
			jQuery('.close-filter').trigger('click');
			var section_resources_value = section_resources;
			calendar.setOptions('resources', section_resources_value);
			//calendar.refetchEvents();
			jQuery("#location_select").val('').trigger('change');
			jQuery("#dropdown-filter").fadeOut();
console.log("clear-filter");
			jQuery.ajax({
				type: "POST",
				url: AdminajaxUrl.ajaxurl,
				data: {
					action: 'save_cal_filters',
					filter_location: '',
				},
				success: function (response) {

				}
			});

		})
		jQuery(document).on("click", ".close-filter", function () {
			var section_resources_value = section_resources;
			calendar.setOptions({
				'resources': section_resources_value
			});
			calendar.setEvents(schedulerTasks);

			jQuery('.listing-error').hide();
			jQuery('.listing-error1').hide();
			jQuery("#location_select").val('').trigger('change');
			jQuery("#dropdown-filter").fadeOut();
console.log("close-filter");
			jQuery('#filter-count').hide();
			jQuery("#filtervalue").hide();
			jQuery.ajax({
				type: "POST",
				url: AdminajaxUrl.ajaxurl,
				data: {
					action: 'save_cal_filters',
					filter_location: '',
				},
				success: function (response) {

				}
			});
			var have_filters = 0;
			var filter_location = jQuery('#location_select').val();
			if ((typeof (filter_location) != 'undefined' && filter_location != null && filter_location != '')) {
				have_filters = 1;
				var res_array = filter_location.split(',');
				res_array = res_array.filter(function (el) {
					return el != null && el != '';
				});
				if ((res_array.length > 1)) {
					have_filters = 2;
				}
			}
			var calendar_view_val = jQuery('#cal_view_select').val();
			if (have_filters == 0 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
				jQuery('.listing-error').show();
				jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
				jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
				jQuery("#scheduler .custom-footer").hide();
			} else if (have_filters == 2 && (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'dayGridMonth' || calendar_view_val == 'timeGridDay')) {
				jQuery('.listing-error1').show();
				jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'hidden');
				jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'hidden');
				jQuery("#scheduler .custom-footer").hide();
			} else {
				jQuery('.listing-error').hide();
				jQuery('.listing-error1').hide();
				jQuery('#scheduler .mbsc-calendar-wrapper').next().css('visibility', 'visible');;
				jQuery('#scheduler .mbsc-calendar-wrapper').find('.mbsc-calendar-body').css('visibility', 'visible');;
				jQuery("#scheduler .custom-footer").show();
			}
		});
		jQuery(document).on("click", "#cancel-config", function () {
			jQuery(".dropdown-config").fadeOut();
		})
		jQuery('body').on("click", ".cancelBtn", function (e) {
			e.preventDefault();
			//console.log('html'+jQuery(this).parent().parent('form').html());
			jQuery(this).parent().parent('form').find('input').val('');
			if (jQuery(this).parent().parent('form').find('.select2-selection__rendered').length > 0)
				jQuery(this).parent().parent('form').find('.select2-selection__rendered').html('');
			jQuery(this).parent().parent('form').find('select').val('');
			if (jQuery(this).parent().parent('form').find('#location_select').length > 0) {
				jQuery('.close-filter').trigger('click');
			}
		});
		jQuery('body').on("click", ".config_submit .applyBtn", function (e) {
			e.preventDefault();
			var that;
			that = jQuery('.config_submit');
			var cell_width_val = jQuery(".cell_width").val();

			if (cell_width_val != "") {
				cell_width_val = parseInt(cell_width_val);
			} else {
				cell_width_val = 60;
			}
			var show_extra_info = jQuery(".show_extra_info").val();

			if (jQuery("#show_full_day")[0].checked == true) {
				jQuery(that).find(".submit_settings").prop("disabled", true);
				jQuery(that).find(".submit_settings").text(tranlations["loading"] + ".....");
				let loader = jQuery('#loader').append('<div class="loader-14"></div>');
				loader.show();

				setTimeout(function () {

					jQuery.ajax({
						type: "POST",
						url: AdminajaxUrl.ajaxurl,
						data: {
							action: 'save_cal_setting',
							starttime: "",
							endtime: "",
							show_full_day: "1",
							cell_width: cell_width_val,
							show_extra_info: show_extra_info,
						},
						success: function (response) {

							//get_booking_data(calendar);

						}
					});




					jQuery(".dropdown-config").fadeOut();
					jQuery(".filter_overlay").fadeOut();
					jQuery(that).find(".submit_settings").prop("disabled", false);
					jQuery(that).find(".submit_settings").text(tranlations["USE"]);
					loader.html("");
					loader.hide();

					setCalendarTime('', '00:00', '23:59');
				}, 1000);
			}

			if (jQuery(this).find(".starttime").val() != "" && jQuery(this).find(".endtime").val() != "") {

				jQuery(that).find(".submit_settings").prop("disabled", true);
				jQuery(that).find(".submit_settings").text(tranlations["loading"] + ".....");
				let loader = jQuery('#loader').append('<div class="loader-14"></div>');

				setTimeout(function () {
					var starttime;
					var endtime;
					starttime = jQuery(that).find(".starttime").val();
					endtime = jQuery(that).find(".endtime").val();

					jQuery.ajax({
						type: "POST",
						url: AdminajaxUrl.ajaxurl,
						data: {
							action: 'save_cal_setting',
							starttime: starttime,
							endtime: endtime,
							show_full_day: "0",
							cell_width: cell_width_val,
							show_extra_info: show_extra_info,
						},
						dataType: 'json',
						success: function (response) {
							//get_booking_data(calendar);
							if (cell_width_val != "") {
								//setTimeout(function(){
								if (jQuery('.mbsc-timeline-column').width() < cell_width_val) {
									jQuery('.mbsc-timeline-column').attr('style', 'width:' + cell_width_val + 'px !important;max-width:' + cell_width_val + 'px !important');
									jQuery('.mbsc-timeline-header-column').attr('style', 'width:' + cell_width_val + 'px !important;max-width:' + cell_width_val + 'px !important');
								}
								//},1000);
							}

						}
					});

					if (cell_width_val != "") {
						//setTimeout(function(){
						if (jQuery('.mbsc-timeline-column').width() < cell_width_val) {
							jQuery('.mbsc-timeline-column').attr('style', 'width:' + cell_width_val + 'px !important;max-width:' + cell_width_val + 'px !important');
							jQuery('.mbsc-timeline-header-column').attr('style', 'width:' + cell_width_val + 'px !important;max-width:' + cell_width_val + 'px !important');
						}
						//},1000);
					}


					jQuery(".dropdown-config").fadeOut();
					jQuery(".filter_overlay").fadeOut();
					jQuery(that).find(".submit_settings").prop("disabled", false);
					jQuery(that).find(".submit_settings").text(tranlations["USE"]);
					loader.html("");
					loader.hide();
					setCalendarTime('', starttime, endtime);

				}, 1000);


			}


		})

		/*jQuery(document).on("click", " .config_btn", function (e) {
			e.preventDefault();
			var selected_values = '';
			var cal_starttime = jQuery(".starttime").val();
			var cal_endtime = jQuery(".endtime").val();
			calendar.setOption('slotMinTime',cal_starttime);
			calendar.setOption('slotMaxTime',cal_endtime);
		});*/

		var previous_view = jQuery('#cal_view_select').val();
		jQuery("body").on('focus', '#cal_view_select', function (e) {
			previous_view = this.value;
		})
		jQuery('.fc-prev-button').click(function () {
			var title = jQuery('.fc-toolbar-title').html();
			var title_sp = title.split(' ');
			var num = title_sp[0].substr(0, 2);
			if (isNaN(num)) {
				var month = title_sp[0];
				title = jQuery.trim(title.replace(month + ' ', ''));
				title = title.split(',');
				var date = jQuery.trim(title[0]);
				var year = jQuery.trim(title[1]);
				var dates = jQuery('.fc-toolbar-title').html();
				dates = dates.split(',');
				var year1 = jQuery.trim(dates[1]);
				var dates1 = dates[0].split('–');
				var date1 = jQuery.trim(dates1[0]) + ',' + year1;
				var dates2 = dates1[0].split(' ');
				var date2 = jQuery.trim(dates2[0]) + jQuery.trim(dates1[1]);
			} else {
				if (title.indexOf('–') >= 0) {
					var date = jQuery.trim(title_sp[0]) + ' - ' + jQuery.trim(title_sp[2]);
					var month = jQuery.trim(title_sp[3]);
					var year = jQuery.trim(title_sp[4]);
					var date1 = jQuery.trim(title_sp[0]) + ' ' + month + ' ' + year;
					console.log('title_sp[0]' + title_sp[0]);
					console.log('title_sp[1]' + title_sp[1]);
					console.log('title_sp[2]' + title_sp[2]);
					console.log('date' + date1);
					var date2 = jQuery.trim(jQuery.trim(title_sp[2])) + ' ' + month + ' ' + year;
					console.log('date2' + date2);
				} else {
					var date = jQuery.trim(title_sp[0]);
					var month = jQuery.trim(title_sp[1]);
					var year = jQuery.trim(title_sp[2]);
				}
			}

			var calendar_view_val = jQuery('#cal_view_select').val();

			if (calendar_view_val == 'timeGridDay' || calendar_view_val == 'resourceTimelineDay') {
				jQuery("#reportrange span").html(date + ' ' + month + ', ' + year + ' - Week ' + weekNumber(new Date(jQuery('.fc-toolbar-title').html())));
			} else if (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'resourceTimelineWeek' || calendar_view_val == 'listWeek') {
				jQuery("#reportrange span").html(date + ' ' + month + ', ' + year + ' - Week ' + weekNumber(new Date(date1)));
			} else {
				jQuery("#reportrange span").html(date + ' ' + month + ', ' + year + ' - Week ' + weekNumber(new Date(date1)) + ' - ' + weekNumber(new Date(date2)));
			}
			//jQuery("#reportrange span").html(date+' '+month+', '+year);
		});

		jQuery('.fc-next-button').click(function () {
			var title = jQuery('.fc-toolbar-title').html();
			var title_sp = title.split(' ');
			var num = title_sp[0].substr(0, 2);
			if (isNaN(num)) {
				var month = title_sp[0];
				title = jQuery.trim(title.replace(month + ' ', ''));
				title = title.split(',');
				var date = jQuery.trim(title[0]);
				var year = jQuery.trim(title[1]);
				var dates = jQuery('.fc-toolbar-title').html();
				dates = dates.split(',');
				var year1 = jQuery.trim(dates[1]);
				var dates1 = dates[0].split('–');
				var date1 = jQuery.trim(dates1[0]) + ',' + year1;
				var dates2 = dates1[0].split(' ');
				var date2 = jQuery.trim(dates2[0]) + jQuery.trim(dates1[1]);
			} else {
				if (title.indexOf('–') >= 0) {
					var date = jQuery.trim(title_sp[0]) + ' - ' + jQuery.trim(title_sp[2]);
					var month = jQuery.trim(title_sp[3]);
					var year = jQuery.trim(title_sp[4]);
					var date1 = jQuery.trim(title_sp[0]) + ' ' + month + ' ' + year;
					console.log('title_sp[0]' + title_sp[0]);
					console.log('title_sp[1]' + title_sp[1]);
					console.log('title_sp[2]' + title_sp[2]);
					console.log('date' + date1);
					var date2 = jQuery.trim(jQuery.trim(title_sp[2])) + ' ' + month + ' ' + year;
					console.log('date2' + date2);
				} else {
					var date = jQuery.trim(title_sp[0]);
					var month = jQuery.trim(title_sp[1]);
					var year = jQuery.trim(title_sp[2]);
				}
			}
			var calendar_view_val = jQuery('#cal_view_select').val();

			if (calendar_view_val == 'timeGridDay' || calendar_view_val == 'resourceTimelineDay') {
				jQuery("#reportrange span").html(date + ' ' + month + ', ' + year + ' - Week ' + weekNumber(new Date(jQuery('.fc-toolbar-title').html())));
			} else if (calendar_view_val == 'timeGridWeek' || calendar_view_val == 'resourceTimelineWeek' || calendar_view_val == 'listWeek') {
				jQuery("#reportrange span").html(date + ' ' + month + ', ' + year + ' - Week ' + weekNumber(new Date(date1)));
			} else {
				jQuery("#reportrange span").html(date + ' ' + month + ', ' + year + ' - Week ' + weekNumber(new Date(date1)) + ' - ' + weekNumber(new Date(date2)));
			}
			//jQuery("#reportrange span").html(date+' '+month+', '+year);
		});

		/* jQuery(document).on("click","body",function(event){
		var ele = event.target;
		alert(jQuery(ele).html());
	  }); */
		jQuery(document).on("click", ".filter_overlay", function () {
			jQuery("#dropdown-filter").fadeOut();
console.log("filter_overlay");
			jQuery('.dropdown-filter-search').fadeOut();
			jQuery('.dropdown-filter-group').fadeOut();
			jQuery('.dropdown-config').fadeOut();
			jQuery(".filter_overlay").fadeOut();
		});
		jQuery(document).on("click", "#btn-filter", function () {
			jQuery("#dropdown-filter").fadeToggle();
			jQuery('.dropdown-filter-search').fadeOut();
			jQuery('.dropdown-filter-group').fadeOut();
			jQuery('.dropdown-config').fadeOut();
			jQuery(".filter_overlay").fadeIn();
		});
		jQuery(document).on("click", "#filter-count", function () {
			jQuery("#dropdown-filter").fadeToggle();
			jQuery('.dropdown-filter-search').fadeOut();
			jQuery('.dropdown-filter-group').fadeOut();
			jQuery('.dropdown-config').fadeOut();
			jQuery(".filter_overlay").fadeIn();
		});
		jQuery(document).on("click", "#cancel-filter-group", function () {
			jQuery(".dropdown-filter-group").fadeToggle();
			jQuery(".filter_overlay").fadeOut();
		});
		jQuery(document).on("click", ".btn-filter-group", function () {
			jQuery(".dropdown-filter-group").fadeToggle();
			jQuery(".filter_overlay").fadeIn();
			jQuery('.select2-search__field').focus();
		});

		function filterCal(selected_values) {
			var newTasks = [];
			if (selected_values != '') {
				jQuery.each(schedulerTasks, function (key, value) {
					var pushed = 0;

					if (value.resourceId != '') {
						var resourceId = '' + schedulerTasks[key].resourceId;
						resourceId = resourceId.toLowerCase();
						if (selected_values.indexOf(resourceId) >= 0) {
							newTasks.push(value);
						}
					}
				});
			} else {
				newTasks = schedulerTasks;
			}
			calendar.setEvents(newTasks);
			//calendar.refetchEvents();
		}

		function searchCal(typed_val) {
			var newTasks = [];
			if (typed_val != '') {
				/* if(typed_val != '' && typeof(typed_val) != 'undefined') {
					jQuery.ajax({
						type: "POST",
						url: AdminajaxUrl.ajaxurl,
						data: {
							action: 'save_cal_filter_search',
							filter_search: typed_val,
						},
						success: function (response) {
						}
					});	
				} */
				typed_val = typed_val.toLowerCase();
				jQuery.each(schedulerTasks, function (key, value) {
					var pushed = 0;

					if (value.title != '') {
						var title = '' + schedulerTasks[key].title;
						title = title.toLowerCase();
						if (title.indexOf(typed_val) >= 0) {
							newTasks.push(value);
							pushed == 1;
						}
					}
					if (value.description != '' && pushed != pushed) {
						var description = '' + schedulerTasks[key].description;
						description = description.toLowerCase();
						if (description.indexOf(typed_val) >= 0) {
							newTasks.push(value);
							pushed == 1;
						}
					}
				});

			} else {
				newTasks = schedulerTasks;
			}
			listTasks = JSON.parse(JSON.stringify(newTasks));
			newResources = section_resources;
			console.log('newResources', listTasks);
			list.setEvents(listTasks);
			calendar.setEvents(newTasks);
			for(var i = 0 ; i < listTasks.length ; i ++) {
				console.log(listTasks[i]);
				for ( var j = 0 ; j < newResources.length ; j++){
					if(newResources[j].id == listTasks[i].sectionResourcesId){
						listTasks[i].title = newTasks[i].title + '<br/>' + newResources[j].name
					}
				}
			}
			if(newTasks.length != 0 && typed_val != ''){
				jQuery("#demo-search-sidebar-list").find(".custom-footer").hide();
				$searchList.show();
			}
			if(newTasks.length == 0)
					$searchList.hide();
			//calendar.refetchEvents();
		}


		jQuery(document).on("click", ".dropdown-filter-search .applyBtn", function () {
			jQuery('.dropdown-filter-search').fadeOut();
			jQuery(".filter_overlay").fadeOut();
		});
		jQuery(document).on("input", "#search_cal", function(){
			var typed_val = jQuery('#search_cal').val();
			if(keyTimer != null){
				clearTimeout(keyTimer);
			}
			keyTimer = setTimeout(() => {
				searchCal(typed_val);
			}, 500);
		});
		jQuery(document).on("click", ".search_calendar #btn-search", function () {
			jQuery('.dropdown-filter-search').fadeToggle();
			jQuery('#dropdown-filter').fadeOut();
			jQuery('.dropdown-filter-group').fadeOut();
			jQuery('.dropdown-config').fadeOut();
			jQuery('#search_cal').focus();
			jQuery(".filter_overlay").fadeIn();

		});
		jQuery(document).on("click", ".search_calendar .cancel-search", function () {
			jQuery('.dropdown-filter-search').fadeOut();
			jQuery(".filter_overlay").fadeOut();
		});


		jQuery("body").on('keydown', '#search_cal', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				jQuery(".search_submit .applyBtn").trigger('click');
				event.preventDefault();
			}
		});
		jQuery("body").on('keypress', '#search_cal', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				jQuery(".search_submit .applyBtn").trigger('click');

			}
		});
		jQuery("body").on('keyup', '#search_cal', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				jQuery(".search_submit .applyBtn").trigger('click');

			}
		});
		jQuery("body").on('click', '#dropdown-filter', function (event) {

			if (jQuery(event.target).attr('class') == 'select2-search__field' || jQuery(event.target).attr('class') == 'select2-selection select2-selection--multiple') {
				setTimeout(function () {
					if (jQuery('.select2-container.select2-container--default.select2-container--open').length > 0) {
						jQuery('.dropdown-filter .form-group').css('height', '340px');
					} else {
						jQuery('.dropdown-filter .form-group').css('height', 'auto');
					}
				}, 100);
			} else {
				jQuery('.dropdown-filter .form-group').css('height', 'auto');
			}
		});



		jQuery(document).on("mouseover", ".show-info", function () {
			jQuery(this).next('.info-tip').show();
		});
		jQuery(document).on("mouseout", ".show-info", function () {
			jQuery(this).next('.info-tip').hide();
		});
		jQuery(document).on("change", "#show_full_day", function () {
			if (jQuery(this).is(':checked')) {
				jQuery(".starttime").find("option:first").prop("selected", true);
				jQuery(".endtime").find("option:first").prop("selected", true);
				jQuery(".starttime").find("option:first").attr("selected", 'selected');
				jQuery(".endtime").find("option:first").attr("selected", 'selected');
			} else {
				jQuery(".starttime").find("option:eq(1)").attr("selected", 'selected');
				jQuery(".endtime").find("option:last").attr("selected", 'selected');
				jQuery(".starttime").find("option:eq(1)").prop("selected", true);
				jQuery(".endtime").find("option:last").prop("selected", true);
			}
		})
		jQuery(document).on("change", ".starttime,.endtime", function () {
			jQuery("#show_full_day").prop("checked", false);
		})
		/* if(jQuery('#cal_view_select').length == 0) {
			if(calendar_view == "" || calendar_view == 0){
				calendar_view_val = 'resourceTimelineDay';
			}else{  
				calendar_view_val = (calendar_view);
			}
			jQuery('#cal_options').append(
				'<div class="fc-button-group cal_view_select_outer" style="min-width:105px;"><select id="cal_view_select" class="cal_view_select"><option data-view="resourceTimelineDay" value="resourceTimelineDay" class="fc-resourceTimelineDay-button fc-button fc-state-default fc-corner-right" '+((calendar_view_val == 'resourceTimelineDay')?'selected="selected"':'')+'>Timeline day</option><option data-view="resourceTimelineWeek" value="resourceTimelineWeek"class="fc-resourceTimelineWeek-button fc-button fc-state-default" '+((calendar_view_val == 'resourceTimelineWeek')?'selected="selected"':'')+'>Timeline week</option><option data-view="resourceTimelineMonth" value="resourceTimelineMonth" class="fc-resourceTimelineMonth-button fc-button fc-state-default" '+((calendar_view_val == 'resourceTimelineMonth')?'selected="selected"':'')+'>Timeline month</option><option data-view="timeGridDay" value="timeGridDay" class="fc-timeGridDay-button fc-button fc-state-default" '+((calendar_view_val == 'timeGridDay')?'selected="selected"':'')+'>Day</option><option data-view="timeGridWeek" value="timeGridWeek" class="fc-timeGridWeek-button fc-button fc-state-default" '+((calendar_view_val == 'timeGridWeek')?'selected="selected"':'')+'>Week</option><option data-view="dayGridMonth" value="dayGridMonth"class="fc-dayGridMonth-button fc-button fc-state-default" '+((calendar_view_val == 'dayGridMonth')?'selected="selected"':'')+'>Month</option><option data-view="listWeek" value="listWeek" class="fc-agendaMonth-button fc-button fc-state-default" '+((calendar_view_val == 'listWeek')?'selected="selected"':'')+'>Agenda</option></select></div>'
			);
			if(jQuery('.cal_view_select').length > 0) {
				jQuery('.cal_view_select').niceSelect();
			}
		} */
	}
});

jQuery(".dropdown-toggle").click(function () {
	if (jQuery('#addShowClass').hasClass('show')) {
		jQuery('.dropdown').removeClass('show');
	} else {
		jQuery('.dropdown').addClass('show');
	}
});
var calele = jQuery('#scheduler .mbsc-calendar-wrapper').next();
jQuery('<div class="k-full-footer"></div>').insertAfter(calele);
jQuery(".k-full-footer").find(".custom-footer").remove();

if (cal_type == "view_only") {
	jQuery(".k-full-footer").append('<div class="custom-footer">' +
		'<div class="row row-centered">' +
		'<div class="col-md-2 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#fe852c !important"></span> <span class="ft_color_txt">Ønsket tider</span>' +
		'</div>' +
		'<div class="col-md-2 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#62b0d9 !important"></span> <span class="ft_color_txt">Algoritme forslag</span>' +
		'</div>' +
		'<div class="col-md-2 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#086CA3"></span> <span class="ft_color_txt">Manuelt godkjent</span>' +
		'</div>' +
		'<div class="col-md-2 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#F13C30 !important"></span> <span class="ft_color_txt">Algoritme avslag</span>' +
		'</div>' +
		'<div class="col-md-2 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#A80A00"></span> <span class="ft_color_txt">Manuelt avslått</span>' +
		'</div>' +

		'</div>' +
		'</div>');

} else {
	jQuery(".k-full-footer").append('<div class="custom-footer">' +
		'<div class="row row-centered">' +
		'<div class="col-md-3 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#3B940B !important"></span> <span class="ft_color_txt">Betalt</span>' +
		'</div>' +
		'<div class="col-md-3 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#65B0D6 !important"></span> <span class="ft_color_txt">Godkjent</span>' +
		'</div>' +
		'<div class="col-md-3 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#006DA5 !important"></span> <span class="ft_color_txt">Sesongbooking</span>' +
		'</div>' +
		'<div class="col-md-3 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#FF8312 !important"></span> <span class="ft_color_txt">Venter på godkjenning</span>' +
		'</div>' +
		'<div class="col-md-3 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#EE3535 !important"></span> <span class="ft_color_txt">Kansellert/utløpt</span>' +
		'</div>' +
		'<div class="col-md-3 col-centered">' +
		'<span class="ft_color dot-cl" style="background-color:#C0C0C0 !important"></span> <span class="ft_color_txt">Stengt</span>' +
		'</div>' +
		'</div>' +
		'</div>');
}

setTimeout(function () {

	const noResFound = jQuery('<div class="not-found-info"style="text-align:center;">' + tranlations["No Reservation Found!"] + '</div>');

	function getReservationTableNew(response) {
		jQuery('#client-info-data').empty();
		var output = '<div class="col-md-4"><div class="outer-form-tabs"><table><tr><th colspan="2">Customer Info</th></tr>';
		if (response.user_data.display_name != "") {
			output += '<tr><td>Name:</td><td><div class="outer-table-data"><span>' + response.user_data.display_name + '</span></div></td></tr>';
		}
		if (response.user_data.customer_email != "") {
			output += '<tr><td>Email:</td><td><div class="outer-table-data"><span>' + response.user_data.customer_email + '</span></div></td></tr>';
		}
		if (response.user_data.customer_tlf != "") {
			output += '<tr><td>Tlf:</td><td><div class="outer-table-data"><span>' + response.user_data.customer_tlf + '</span></div></td></tr>';
		}
		if (response.user_data.customer_address != "") {
			output += '<tr><td>Address:</td><td><div class="outer-table-data"><span>' + response.user_data.customer_address + '</span></div></td></tr>';
		}
		if (response.user_data.customer_zip != "") {
			output += '<tr><td>Zip:</td><td><div class="outer-table-data"><span>' + response.user_data.customer_zip + '</span></div></td></tr>';
		}
		if (response.user_data.customer_city != "") {
			output += '<tr><td>City:</td><td><div class="outer-table-data"><span>' + response.user_data.customer_city + '</span></div></td></tr>';
		}
		if (response.user_data.org_number != "") {
			output += '<tr><td>Org number:</td><td><div class="outer-table-data"><span>' + response.user_data.org_number + '</span></div></td></tr>';
		}
		output += '</table></div></div>';
		//output += '<div class="col-md-4"><div class="outer-form-tabs"><table><tr><th colspan="2">Billing Address<i class="fa fa-edit edit_modalbtn<?php echo $data->id;?>"  data-booking_id="';

		{
			/* <tr>
									      			<th colspan="2">Billing Address <?php if($page_type == "owner"){ ?> <i class="fa fa-edit edit_modalbtn<?php echo $data->id;?>"  data-booking_id="<?php echo $data->id; ?>"></i><?php } ?></th>
									      		</tr>
									      		<?php if($data->billing_name != ""){ ?>
										      		<tr>
										      			<td>Name:</td>
										      			<td><div class="outer-table-data"><span><?php echo $data->billing_name;?></span></div></td>
										      		</tr>
										      	<?php } ?>
									      		<?php if($data->billing_email != ""){ ?>
										      		<tr>
										      			<td>Email:</td>
										      			<td><div class="outer-table-data"><span><?php echo $data->billing_email;?></span></div></td>
										      		</tr>
										      	<?php } ?>
										      	<?php if($data->billing_tlf != ""){ ?>
										      		<tr>
										      			<td>Tlf:</td>
										      			<td><div class="outer-table-data"><span><?php echo $data->billing_tlf;?></span></div></td>
										      		</tr>
										      	<?php } ?>
										      	<?php if($data->billing_address != ""){ ?>
										      		<tr>
										      			<td>Address:</td>
										      			<td><div class="outer-table-data"><span><?php echo $data->billing_address;?></span></div></td>
										      		</tr>
										      	<?php } ?>
										      	<?php if($data->billing_zip != ""){ ?>
										      		<tr>
										      			<td>Zip:</td>
										      			<td><div class="outer-table-data"><span><?php echo $data->billing_zip;?></span></div></td>
										      		</tr>
										      	<?php } ?>
										      	<?php if($data->billing_city != ""){ ?>
										      		<tr>
										      			<td>City:</td>
										      			<td><div class="outer-table-data"><span><?php echo $data->billing_city;?></span></div></td>
										      		</tr>
										      	<?php } ?>
									      	</table>
									      </div>
							      	</div>
							      </div>
							    </div>'' */
		}
		jQuery('#client-info-data').html(
			`<table class="table">
									<tbody>
										<tr>
    										<th>
    										` + tranlations["Username"] + `
    										</th>
    										<td>
    										${response.user_data.nickname}
    										</td>
    									</tr>
    									<tr>
    										<th>
    										` + tranlations["FirstName"] + `
    										</th>
    										<td>
    										${response.user_data.first_name}
    										</td>
    									</tr>
    									<tr>
    										<th>
    										` + tranlations["LastName"] + `
    										</th>
    										<td>
    										${response.user_data.last_name}
    										</td>
    									</tr>
    									<tr>
    										<th>
    										` + tranlations["Description"] + `
    										</th>
    										<td>
    										${response.user_data.description}
    										</td>
    									</tr>
    									<tr>
    										<th>
    										` + tranlations["Email"] + `
    										</th>
    										<td>
    										${response.user_data.billing_email}
    										</td>
    									</tr>
    									<tr>
    										<th>
    										` + tranlations["Phone"] + `
    										</th>
    										<td>
    										${response.user_data.billing_phone}
    										</td>
    									</tr>
									</tbody>
								 </table>`
		);
		//jQuery('#client-info-data').html(output);
		//Hide Animation
		jQuery('#loader-spinner-client-info').hide();
		jQuery("#loader-spinner").hide();
		jQuery('#client-info-data').show();
		jQuery('#reservation-table').show();
		jQuery('#reservation-table tbody').empty();
		jQuery('#reservation-table tbody').html("");

		var res = libEvents(response.data);

		//var allBookings = getClientBookings(res);
		var allBookings = customEvent.eventsToBookings(res);
		if (allBookings.length < 1) {}
		//console.log(allBookings.length);
		allBookings.forEach(function (booking) {
			var date, startTime, endTime;
			var isRecur = booking.recurrenceRule ? 'true' : 'false';
			var isDis = "";
			if (booking.recurrenceRule) {
				date = new Date(booking.recExp); //ISO
				startTime = booking.start;
				endTime = booking.end;

				//timeSpan   =
			} else {
				//console.log("Not Recurring",booking.start);
				date = booking.start //objs
				startTime = booking.start;
				endTime = booking.end;
			}

			if (current_language == "nb-NO") {
				var month = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"][date.getMonth()];
				//	var month = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"][date.getMonth()];
				var weekday = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"][date.getDay()];


				if (cal_type == "view_only") {

					date = weekday + ', ' + date.getFullYear();
				} else {
					date = date.getDate() + ' ' + month + ', ' + date.getFullYear();
				}


				if (startTime.getHours() < 10) {

					var start_hoursss = "0" + startTime.getHours();

				} else {
					var start_hoursss = startTime.getHours();
				}
				if (startTime.getMinutes() < 10) {

					var start_minutesss = "0" + startTime.getMinutes();

				} else {
					var start_minutesss = startTime.getMinutes();
				}

				if (endTime.getHours() < 10) {

					var end_hoursss = "0" + endTime.getHours();

				} else {
					var end_hoursss = endTime.getHours();
				}
				if (endTime.getMinutes() < 10) {

					var end_minutesss = "0" + endTime.getMinutes();

				} else {
					var end_minutesss = endTime.getMinutes();
				}
				startTime = start_hoursss + ":" + start_minutesss;

				endTime = end_hoursss + ":" + end_minutesss;


			} else {
				//var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()];
				var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];

				var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];


				if (cal_type == "view_only") {

					date = weekday + ', ' + date.getFullYear();
				} else {
					date = date.getDate() + ' ' + month + ', ' + date.getFullYear();
				}

				startTime = moment(startTime).format("LT");
				endTime = moment(endTime).format("LT");


			}
			// listing title is present as | booking.post_title
			//console.log(booking);
			//<td>${booking.post_title}</td>
			if (booking.status.text == undefined) {
				booking.status = {
					text: "",
					value: ""
				};
			}


			var record = jQuery("<tr>" +

				"<td>" + date + "</td>" +
				"<td>" + startTime + " - " + endTime + "</td>" +
				"<td>" + booking.post_title + "</td>" +
				"<td>" + (booking.status.text.length > 5 ? booking.status.text.slice(0, 10).concat('...') : booking.status.text) + "</td>" +
				"<td>" + (isDis != "disable-links" ? "<a class=\"delete-booking " + isDis + "\"" + "booking-id=" + "\"" + booking.bookingId + "\"" + "event-id=" + "\"" + booking.id + "\"" + "isRecur=" + "\"" + booking.bookingId + "\"" + ">" + "<i class=\"fas fa-trash-alt\"></i></a>" : "") + "</td>" +
				"</tr>");
			var tr_record = jQuery("<tr></tr>");
			tr_record.append(`<td class="tooltip" full_title="${booking.post_title}">${(booking.post_title.length > 25) ? booking.post_title.slice(0, 25).concat('...') : booking.post_title}</td>`);
			if (cal_type == "view_only") {
				tr_record.append(`<td>${booking.team.text}</td>`);
			}
			tr_record.append(`<td>${date}</td>`);
			tr_record.append(`<td>${startTime} - ${endTime}</td>`);

			if (cal_type != "view_only") {

				tr_record.append(`<td class="tooltip" full_title="${booking.status.text}">${(booking.status.text.length > 10 ? booking.status.text.slice(0, 10).concat('...') : booking.status.text)}</td>`);
				if (isDis != "disable-links") {
					tr_record.append(`<td><a href="#${booking.bookingId}" class="delete-booking ${isDis}" booking-id="${booking.bookingId}" event-id="${booking.id}" isRecur="${isRecur}"><i class="fas fa-trash-alt"></i></a></td>`);
				} else {
					tr_record.append(`<td></td>`);
				}

			}
			//console.log("Hey There !");
			//console.log(tr_record);
			//<td>${booking.post_title}</td>
			jQuery('#reservation-table tbody').append(tr_record);
			//jQuery('#reservation-table tbody')
			//	.append(`<tr><td>${booking.title}</td><td>${`${moment(date).format('ll')}`}</td><td>${`${moment(startTime).format("LT")} - ${moment(endTime).format("LT")}`}</td><td>${booking.status.text}</td><td><a href="#${booking.bookingId}" class="delete-booking ${isDis}" booking-id="${booking.bookingId}" event-id="${booking.id}" isRecur="${isRecur}"><i class="fas fa-trash-alt"></i></a></td></tr>`);
		});
		//jQuery('#reservation-table tbody').append(record);
		//var addPlayTdText =jQuery(".disable-links").closest('tr').children()[0].text();
		//console.log(addPlayTdText);
		//console.log(jQuery(".disable-links").closest('tr').children()[0].remove());
		if (allBookings.length < 1) {
			//Show No Reservation Found
			jQuery('#reservation-table').parent().append(noResFound);

		} else {
			if (current_language == "nb-NO") {


				var languagess = {
					"sProcessing": "Procesando...",
					"sLengthMenu": "Mostrar _MENU_ registros",
					"sZeroRecords": "No se encontraron resultados",
					"sEmptyTable": "Ningún dato disponible en esta tabla",
					"sInfo": "Viser side _PAGE_ til _PAGES_ av _TOTAL_",
					"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
					"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
					"sInfoPostFix": "",
					"sSearch": "Buscar:",
					"sUrl": "",
					"sInfoThousands": ",",
					"sLoadingRecords": "Cargando...",
					"oPaginate": {
						"sFirst": "Først",
						"sLast": "Siste",
						"sNext": "Neste",
						"sPrevious": "Tidligere"
					},
					"oAria": {
						"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
						"sSortDescending": ": Activar para ordenar la columna de manera descendente"
					}
				};
			} else {
				var languagess = {};
			}
			jQuery('#reservation-table').DataTable().destroy();

			if (cal_type == "view_only") {
				var columnss = [

					{
						"width": "39%"
					},
					{
						"width": "20%"
					},
					{
						"width": "24%"
					},
					{
						"width": "20%"
					}
				];
			} else {
				var columnss = [

					{
						"width": "39%"
					},
					{
						"width": "20%"
					},
					{
						"width": "24%"
					},
					{
						"width": "20%"
					},
					{
						"width": "7%"
					}
				];

			}
			//Initiating DataTable
			jQuery('#reservation-table').DataTable({
				searching: false,
				lengthChange: false,
				lengthMenu: [5],
				"language": languagess,
				"columns": columnss,
				"columnDefs": [{
					type: 'date',
					'targets': [1]
				}, ],
				"order": [
					[1, 'asc']
				],
			});

		}


		jQuery(".delete-booking").click(function (e) {
			// console.log(e.target);
			if (jQuery(e.target).parent().hasClass('disable-links') || jQuery(e.target).hasClass('disable-links')) {
				alert("Kan ikke fjerne åpen hendelse fra tabellen. Trykk på rød kapp slett for å slette.");
				return;
			}
			var delBtn = jQuery(e.currentTarget);
			// console.log(delBtn);
			var eventId = Number(delBtn.attr('event-id'));
			var bookingId = Number(delBtn.attr('booking-id'));
			var isRepeating = delBtn.attr('isRecur') == "true" ? true : false;
			//Remove TR of Table
			delBtn.closest('tr').css("background-color", "red").hide('slow', function () {
				delBtn.closest('tr').remove();
			});

			//2) if recurring update othervice remove
			//True/!GetRecExp//ConverttoArrays//IfDigitsConvertToValidUsingMomement//ToString , Separated//Set To Item//
			if (isRepeating) {
				var repeatingBooking = allBookings.find(item => item.bookingId == bookingId);
				var cRecExp = moment(repeatingBooking.recExp).toISOString();
				var dataItem = dataSource.get(eventId);
				var itemRecExp = dataItem.recurrenceException;
				dataItem.set("recurrenceException", customEvent.appendRecExp(itemRecExp, cRecExp));

			} else {
				var dataItem = dataSource.get(eventId);
				//dataSource.remove(dataItem);
				//console.log("Data Source Remove Event");
				// console.log(scheduler.removeEvent);
				scheduler.removeEvent(dataItem);
				//dataSource.removeEvent(dataItem);
			}
			//else{
			//	var dataItem = dataSource.get();
			//}


			//Remove Booking From the Table
		});
		//jQuery('#reservation-table').DataTable().destroy();
		return;
	} // creating and manipulating reservation Function END___-----

	jQuery('select#wpm-client').change(function () { //on dropdown value change
		if (jQuery(this).find("option:selected").text() == "stengt" || jQuery(this).find("option:selected").text() == "Stengt") {
			jQuery("body").find(".status_booking").find("option[value=closed]").prop("selected", true);

		}
		jQuery('span[aria-owns="wpm-team_listbox"]').hide();
		jQuery('#no-team-error').hide();
		//jQuery('.data-table #loader-spinner').show();


		//Change the Teams Dropdown
		var _get_client_val = jQuery(this).val();
		//console.log(this);

		jQuery.post(
			GetBookingByUser.ajaxurl, {
				action: 'get_booking_by_user',
				id: _get_client_val,
				cal_type: cal_type,
			},
			function (response) {

				if (response.user_teams.length) {

					var userTeams = [];
					var output = '<option value="">Select</option>';
					response.user_teams.forEach(function (team) {
						output += '<option value="' + team.id + '">' + team.name + '</option>';
						userTeams.push(team.id)
					});

					jQuery('#wpm-team').html(output);
					jQuery('#no-team-error').hide();
					jQuery('#reservation-table-container').show();
				} else {
					jQuery('span[aria-owns="wpm-team_listbox"]').parent().append('');
				}
				getReservationTableNew(response);
			}
		);
		return false;
	});
	jQuery('#wpm-repeat').click(function () {
		if (jQuery(this).is(':checked')) {
			jQuery("input.k-valid status-recurrence").show();
			jQuery('#wpm-repeat').val(1);
		} else {
			//jQuery('.k-recur-view').hide();
			jQuery('#wpm-repeat').val(0);
			jQuery("input.k-valid status-recurrence").hide();
		}
	});
	jQuery('span[aria-label="RepeatAldri"]').click(function () {
		jQuery('span[aria-label="Repeat Weekly"]').removeClass(' k-state-active');
		jQuery('span[aria-label="Repeat Weekly"]').attr('aria-pressed', false);
		jQuery(this).addClass(' k-state-active');
		jQuery(this).attr('aria-pressed', true);
		//jQuery('.k-recur-view').hide();
		jQuery('#wpm-repeat').val(0);
	});
	jQuery('span[aria-label="Repeat Weekly"]').click(function () {
		jQuery('span[aria-label="RepeatAldri"]').removeClass(' k-state-active');
		jQuery('span[aria-label="RepeatAldri"]').attr('aria-pressed', false);
		jQuery(this).addClass(' k-state-active');
		jQuery(this).attr('aria-pressed', true);
		//jQuery('.k-recur-view').show();
		jQuery('#wpm-repeat').val(1);
	});
	jQuery(document).on("click", "button.close", function () {
		jQuery('#schedule-add').modal('hide');
	});
	jQuery(document).on("click", "button.cancel-event", function () {
		jQuery('#schedule-add').modal('hide');
		jQuery('#schedule-add').find('.update-event').removeClass('update-event').addClass('save-event').html('Save');
		jQuery('#schedule-add').find('.save-event').removeClass('save-event').addClass('update-event').html('Update');
	});

	jQuery("#tab-1").on('click', function () {
		jQuery(".tab-1").css("display", "block");
		jQuery(".tab-2").css("display", "none");
		jQuery(".tab-3").css("display", "none");
		jQuery(".tab-4").css("display", "none");
	});

	jQuery("#tab-2").on('click', function () {
		jQuery(".tab-1").css("display", "none");
		jQuery(".tab-2").css("display", "block");
		jQuery(".tab-3").css("display", "none");
		jQuery(".tab-4").css("display", "none");
	});

	jQuery("#tab-3").on('click', function () {
		jQuery(".tab-1").css("display", "none");
		jQuery(".tab-2").css("display", "none");
		jQuery(".tab-3").css("display", "block");
		jQuery(".tab-4").css("display", "none");
	});
	jQuery("#tab-4").on('click', function () {
		jQuery(".tab-1").css("display", "none");
		jQuery(".tab-2").css("display", "none");
		jQuery(".tab-3").css("display", "none");
		jQuery(".tab-4").css("display", "block");
	});
	jQuery(".k-group-start").on('click', function () {
		jQuery(".k-group-start").removeClass('k-state-active');
		jQuery(this).addClass('k-state-active');
	});

	jQuery("#never-tabs").on('click', function () {
		jQuery(".weekly-tabs").css('display', 'none');
	});

	jQuery("#weekly-tabs").on('click', function () {
		jQuery(".weekly-tabs").css('display', 'table-row');
	});

	jQuery(".sec-tab").on('click', function () {
		jQuery(".sec-tab").removeClass('wpm-active');
		jQuery(this).addClass('wpm-active');
	});

	jQuery('.fc-event-title.fc-sticky').each(function () {
		//jQuery(this).append('<a href="#" class="k-link k-event-delete" title="Slett" aria-label="Slett"><span class="k-icon k-i-close"></span></a>');
	});

	jQuery('.fc-event-title-container').hover(function () {
			jQuery(this).find('.k-event-delete').addClass('k-event-delete-show');
		},
		function () {
			jQuery(this).find('.k-event-delete').removeClass('k-event-delete-show');
		}
	);
	jQuery('.k-recur-end-count').click(function () {
		jQuery('input.k-recur-count').removeAttr('disabled');
	});

}, 3000);
jQuery(document).on("change", "select.status_booking", function () {

	if (jQuery(this).val() == "closed") {

		var stengt_id = "";
		jQuery("body").find("select#wpm-client").find("option").each(function () {


			if (jQuery(this).text() == "Stengt" || jQuery(this).text() == "stengt") {
				stengt_id = jQuery(this).attr("value");
			}

		});

		if (stengt_id != "") {
			var kendoDropDownList2 = jQuery("body").find("select#wpm-client").data('kendoDropDownList');
			kendoDropDownList2.value(stengt_id);
			kendoDropDownList2.trigger("change");
		}
	}

});

function selectClass(event) {
	if (event.target.classList.contains('k-state-active')) {
		event.target.classList.remove('k-state-active')
	} else {
		event.target.classList.add('k-state-active')
	}
}

// jQuery('.closeButton, .footerPop .btn.btn-default').on('click', function(){
// 	jQuery('.k-recur-view').hide();
// 	jQuery('.modal-dialog .modal-content .modal-body .template-container .fbox__items .data-value .d-flexout .checkbox').trigger("change");
// });


jQuery('.tabDropdown').on('click', function () {
	jQuery('.modal-dialog .modal-content .modal-body .template-container .d-flexin').slideDown();
});

jQuery('.modal-dialog .modal-content .modal-body .template-container .d-flexin .sec-tab').on('click', function () {
	jQuery('.tabDropdown span').text(this.innerHTML);
	jQuery('.modal-dialog .modal-content .modal-body .template-container .d-flexin').slideUp();
});

// jQuery('.modal-dialog .modal-content .modal-body .template-container .fbox__items .data-value .d-flexout .width-full-small').on('click', function(){
// 	jQuery('.newPopupSt .sidebars .fbox__items.status_div.topMargin-none').toggle();
// });

// jQuery('.newPopupSt .sidebars .fbox__items.status_div.topMargin-none select.status_booking').on('click', function(){
// 	jQuery('.k-recur-view').addClass('showPop');
// });

// jQuery('.closeButton, .footerPop .btn.btn-default').on('click', function(){
// 	jQuery('.k-recur-view').removeClass('showPop');
// });


jQuery('#repeat_selection').on('click', function () {
	if (jQuery(this).is(':checked')) {
		jQuery('input.k-valid.status-recurrence').show();
		jQuery('.fbox__items.status_div').addClass('showDropdown');
		jQuery('#wpm-repeat').val(1);
	} else {
		jQuery('input.k-valid.status-recurrence').hide();
		jQuery('.fbox__items.status_div').removeClass('showDropdown');
	}
});


jQuery('input.k-valid.status-recurrence').on('click', function () {
	jQuery('.k-recur-view').addClass('showPop');
});

jQuery('.closeButton, .footerPop .btn.btn-default').on('click', function () {
	jQuery('.k-recur-view').removeClass('showPop');
});

function hideAll() {
	jQuery("#dropdown-filter").fadeOut();
console.log("hideAll");
	jQuery(".dropdown-config").fadeOut();
	jQuery(".dropdown-filter-group").fadeOut();
	jQuery(".filter_overlay").fadeOut();
}

jQuery('input[name="recurrence-mode"]').on('change', function () {
	recurrenceEditMode = this.value;
});