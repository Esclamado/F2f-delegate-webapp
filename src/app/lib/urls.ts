export const Urls = {
    get_token: '/api/token/get',
    api_login: '/mapi/login',
    mapi_delegate_checkpassword: '/mapi/delegate/checkpassword',
    /* get user profile */
    api_delegates_get: '/api/delegates/get',
    /* forgotpass */
    mapi_delegate_forgotpassword: '/mapi/delegate/forgotpassword',
    /* change password onboarding */
    mapi_delegate_changepass: '/mapi/delegate/changepass',
    /* get preference */
    api_preferences_get: '/api/preferences/get',
    /* get events */
    api_eventdelegate_get: '/api/eventdelegate/get',
    /* get speaker */
    api_speaker_get: '/api/speaker/get',
    /* get schedules */
    mapi_delegate_meetingschedule: '/mapi/delegate/meetingschedule',
    mapi_event_schedule: '/mapi/event/schedule',
    /* get cms cms */
    api_cms_page: '/api/cms/page',
    /* delegates save */
    api_delegates_save: '/api/delegates/save',
    /* company save */
    api_company_savedescription: '/api/company/savedescription',
    /* delegates timezone save */
    api_delegates_settimezone: '/api/delegates/settimezone',
    /* get timezone label */
    api_events_gettimezone : '/api/events/gettimezone',
    /* get days */
    api_events_get: '/api/events/get',
    /* note save */
    mapi_notes_save: '/mapi/notes/save',
    /* get avalable deligate */
    api_meetingschedule_availablebytimeslot: '/api/meetingschedule/availablebytimeslot',
    /* set meeting */
    api_meetingschedule_set: '/api/meetingschedule/set',
    /* get delegate available timeslot */
    mapi_delegate_availabletimeslot: '/mapi/delegate/availabletimeslot',
    /* get notes meeting details */
    mapi_event_note: '/mapi/event/note',
    /* delegate locator */
    mapi_delegate_locator: '/mapi/delegate/locator',
    /* get receive meeting requests */
    mapi_delegate_meetingrequestlist: '/mapi/delegate/meetingrequestlist',
    /* get virtual scedule */
    mapi_event_schedulevirtual: '/mapi/event/schedulevirtual',
    /* set meeting virtual */
    api_meetingschedule_setvirtual: '/api/meetingschedule/setvirtual',
    /* disable timeslot */
    mapi_timeslot_status: '/mapi/timeslot/status',
    /* request action meeting */
    mapi_delegate_meetingrequestaction: '/mapi/delegate/meetingrequestaction',
    /* request cancel meeting*/
    mapi_delegate_requestcancelmeeting: '/mapi/delegate/requestcancelmeeting',
    mapi_delegate_meetingrequest: '/mapi/delegate/meetingrequest',
    /* get note list */
    mapi_notes_get: '/mapi/notes/get',
    /* faqs */
    api_faqs_get: '/api/faqs/get',
    /* faqs save vote */
    api_faqs_savefaqvote: '/api/faqs/savefaqvote',
    /* save feedback */
    api_feedback_save: '/api/feedback/save',
    /* get sponsor list */
    api_sponsor_get: '/api/sponsor/get',
    /* get notif */
    api_get_notifs: '/api/notification/get',
    /* change notif status*/
    api_notification_changestatus: '/api/notification/changestatus',
    /* report no show */
    mapi_noshow_report: '/mapi/noshow/report',
    /* cancel report no show */
    mapi_noshow_cancel: '/mapi/noshow/cancel',
    /* delegate same company */
    mapi_meetingsched_samecompany: '/mapi/meetingsched/samecompany',
    /* top no show delegates */
    mapi_noshow_topnoshow: '/mapi/noshow/topnoshow',
    /* send to my email */
    mapi_notes_sendtoemail: '/mapi/notes/sendtoemail',
    /* remove note */
    mapi_notes_delete: '/mapi/notes/delete',
    /* get final itinerary */
    api_delegate_meetingitinerary: '/mapi/delegate/meetingitinerary',
    /* send final itinerary */
    api_delegates_senditineraries: '/api/delegates/senditineraries',
    /* send multiple final itinerary */
    api_delegates_sendmultipleitineraries: '/api/delegates/sendmultipleitineraries',
    /* get zoom meeting */
    api_virtualconference_getzoomsettings : '/mapi/virtualconference/getzoomsettings',
    /* get shortenurl */
    api_virtualconference_shortenurl : '/mapi/virtualconference/shortenurl',
    /* api chat setasread */
    api_chat_setasread:'/api/chat/setasread' ,

    // change push notif status
    api_push_notif_toggle: '/mapi/delegate/changepushnotif',

    /* save statistics */
    api_featurecomparison_save: '/api/featurecomparison/save',

    // get unread notifications
    api_notification_getunreadcout: '/api/notification/getunreadcount'
}   
