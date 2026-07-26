export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    appName: "مِسك رُومز",
    appSubTitle: "نظام حجز قاعات التدريب والاجتماعات",
    companyName: "MiskTech - الدعم الفني",
    nav: {
      calendar: "جدول المواعيد",
      logbook: "سجل السكرتارية",
      rooms: "إدارة القاعات",
      stats: "الإحصائيات",
      newBooking: "حجز قاعة جديد",
      printLogbook: "طباعة السجل اليومي"
    },
    hero: {
      title: "نظام حجز القاعات الرقمي الذكي",
      subtitle: "بديل السجل الورقي لتنظيم حجوزات التدريب والاجتماعات بسرعة وسهولة دون تضارب المواعيد",
      quickStats: "الحالة المباشرة للقاعات اليوم"
    },
    stats: {
      totalBookings: "إجمالي الحجوزات",
      activeToday: "حجوزات اليوم",
      freeRooms: "القاعات المتاحة حالياً",
      busiestRoom: "القاعة الأكثر طلباً",
      topEntity: "الجهة الأكثر حجزاً"
    },
    filter: {
      allRooms: "جميع القاعات",
      selectDate: "اختر التاريخ",
      today: "اليوم",
      searchPlaceholder: "ابحث باسم الحاجز، الجهة، أو الموضوع...",
      filterByStatus: "الحالة",
      allStatuses: "جميع الحالات",
      confirmed: "مؤكد",
      pending: "قيد الانتظار",
      cancelled: "ملغي"
    },
    modal: {
      title: "تسجيل حجز قاعة جديد",
      subtitle: "يرجى تعبئة كافة التفاصيل لمنع تضارب الحجوزات",
      bookerName: "اسم الحاجز (الموظف / الدعم الفني)",
      bookerNamePlaceholder: "مثال: م. أحمد علي - الدعم الفني",
      entityName: "اسم الجهة / الإدارة الطالبة",
      entityNamePlaceholder: "مثال: إدارة التدريب والتطوير / شركة الخليج",
      eventTitle: "موضوع الحجز / عنوان التدريب أو الاجتماع",
      eventTitlePlaceholder: "مثال: ورشة عمل الأنظمة الجديدة / اجتماع مع وفد...",
      roomSelect: "اختر القاعة المطلوب حجزها",
      bookingDate: "تاريخ الحجز",
      startTime: "من الساعة",
      endTime: "إلى الساعة",
      attendees: "عدد الحضور المتوقع",
      eventType: "نوع الفعالية",
      types: {
        training: "تدريب",
        meeting: "اجتماع",
        workshop: "ورشة عمل",
        interview: "مقابلة عمل",
        other: "أخرى"
      },
      equipment: "التجهيزات والمستلزمات المطلوبة",
      equipmentList: {
        projector: "جهاز عرض (بروجكتور)",
        soundSystem: "نظام صوتي ومايكروفون",
        whiteboard: "سبورة تفاعلية",
        videoconf: "نظام فيديو كونفرانس",
        hospitality: "ضيافة ومشروبات",
        laptops: "أجهزة كمبيوتر محمولة"
      },
      notes: "ملاحظات إضافية",
      notesPlaceholder: "أي متطلبات خاصة أو ملاحظات للدعم الفني والسكرتارية...",
      conflictWarning: "تنبيه تضارب: توجد قاعة محجوزة بالفعل في هذا الموعد! يرجى اختيار وقت آخر أو قاعة أخرى.",
      submit: "حفظ وتأكيد الحجز",
      submitting: "جاري الحفظ...",
      cancel: "إلغاء"
    },
    logbook: {
      title: "سجل حجوزات القاعات (دفتر السكرتارية الإلكتروني)",
      subtitle: "استعراض كامل لكافة الحجوزات المسجلة مع إمكانية البحث والتعديل والطباعة",
      tableHeader: {
        id: "#",
        date: "التاريخ",
        time: "الميعاد (من - إلى)",
        room: "القاعة",
        booker: "اسم الحاجز",
        entity: "الجهة / الإدارة",
        eventTitle: "الموضوع / التدريب",
        attendees: "العدد",
        equipment: "التجهيزات",
        status: "الحالة",
        actions: "الإجراءات"
      },
      noData: "لا توجد حجوزات مسجلة مطابقة للبحث",
      printTitle: "سجل حجوزات قاعات الاجتماعات والتدريب - MiskTech"
    },
    calendar: {
      title: "الجدول التفاعلي لمواعيد القاعات",
      dayView: "عرض اليوم",
      weekView: "عرض الأسبوع",
      monthView: "عرض الشهر",
      freeSlot: "متاحة للحجز",
      busySlot: "مشغولة"
    },
    rooms: {
      title: "إدارة القاعات والقواعد",
      capacity: "السعة",
      location: "الموقع",
      code: "كود القاعة",
      status: "الحالة"
    },
    messages: {
      successAdd: "تم تسجيل الحجز بنجاح وحفظه في السجل الإلكتروني!",
      errorAdd: "حدث خطأ أثناء حفظ الحجز. يرجى المحاولة مرة أخرى.",
      successStatus: "تم تحديث حالة الحجز بنجاح.",
      deleteConfirm: "هل أنت تأكد من رغبتك في حذف هذا الحجز من السجل؟"
    }
  },
  en: {
    appName: "MiskReserve",
    appSubTitle: "Training & Meeting Room Booking System",
    companyName: "MiskTech - IT Support",
    nav: {
      calendar: "Schedule Grid",
      logbook: "Secretariat Logbook",
      rooms: "Room Directory",
      stats: "Analytics",
      newBooking: "New Reservation",
      printLogbook: "Print Daily Log"
    },
    hero: {
      title: "Smart Room Reservation Platform",
      subtitle: "Replacing manual paper logbooks with real-time room availability, clash detection, and secretarial management",
      quickStats: "Live Room Status Today"
    },
    stats: {
      totalBookings: "Total Reservations",
      activeToday: "Bookings Today",
      freeRooms: "Currently Available Rooms",
      busiestRoom: "Most Requested Room",
      topEntity: "Top Entity/Department"
    },
    filter: {
      allRooms: "All Rooms",
      selectDate: "Select Date",
      today: "Today",
      searchPlaceholder: "Search by booker name, entity, title...",
      filterByStatus: "Status",
      allStatuses: "All Statuses",
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled"
    },
    modal: {
      title: "Create Room Reservation",
      subtitle: "Fill in booking details to check availability and prevent clashes",
      bookerName: "Booker Name (IT Support / Staff)",
      bookerNamePlaceholder: "e.g. Eng. Ahmed Ali - IT Dept",
      entityName: "Entity / Department Name",
      entityNamePlaceholder: "e.g. Training Dept / External Partner Co.",
      eventTitle: "Event / Training / Meeting Title",
      eventTitlePlaceholder: "e.g. New ERP System Training Workshop",
      roomSelect: "Target Room",
      bookingDate: "Reservation Date",
      startTime: "From Time",
      endTime: "To Time",
      attendees: "Expected Attendees",
      eventType: "Event Type",
      types: {
        training: "Training",
        meeting: "Meeting",
        workshop: "Workshop",
        interview: "Interview",
        other: "Other"
      },
      equipment: "Requested Equipment & Services",
      equipmentList: {
        projector: "Projector / Display Screen",
        soundSystem: "Sound System & Microphones",
        whiteboard: "Interactive Whiteboard",
        videoconf: "Video Conferencing System",
        hospitality: "Hospitality & Refreshments",
        laptops: "Laptops / Training Devices"
      },
      notes: "Additional Notes",
      notesPlaceholder: "Any special setup instructions for IT & Secretariat...",
      conflictWarning: "Time Slot Conflict: Selected room is already reserved during this time slot!",
      submit: "Confirm & Book Room",
      submitting: "Saving...",
      cancel: "Cancel"
    },
    logbook: {
      title: "Room Reservations Logbook (Digital Secretariat Ledger)",
      subtitle: "Complete digital ledger replacing the physical paper logbook with instant search and print options",
      tableHeader: {
        id: "#",
        date: "Date",
        time: "Time (From - To)",
        room: "Room",
        booker: "Booker Name",
        entity: "Entity / Dept",
        eventTitle: "Event Title",
        attendees: "Count",
        equipment: "Equipment",
        status: "Status",
        actions: "Actions"
      },
      noData: "No reservation records found for selected filters",
      printTitle: "MiskTech - Meeting & Training Rooms Daily Schedule"
    },
    calendar: {
      title: "Interactive Room Schedule Grid",
      dayView: "Day View",
      weekView: "Week View",
      monthView: "Month View",
      freeSlot: "Available",
      busySlot: "Reserved"
    },
    rooms: {
      title: "Room Directory & Amenities",
      capacity: "Capacity",
      location: "Location",
      code: "Room Code",
      status: "Status"
    },
    messages: {
      successAdd: "Reservation saved successfully in the digital ledger!",
      errorAdd: "Error saving reservation. Please try again.",
      successStatus: "Reservation status updated successfully.",
      deleteConfirm: "Are you sure you want to delete this reservation from the logbook?"
    }
  }
};
