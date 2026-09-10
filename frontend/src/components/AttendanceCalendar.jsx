import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import "./AttendanceCalendar.css";

const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};

const AttendanceCalendar = ({ records }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const getRecordForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return records.find((r) => r.date === dateStr);
    };

    const getDayStatus = (day, record) => {
        const date = new Date(year, month, day);

        if (record) {
            return record.late_minutes > 0 ? "late" : "ontime";
        }

        if (isWeekday(date) && isPastDate(date)) {
            return "absent";
        }

        return "none";
    };

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(year, month + offset, 1));
        setSelectedDay(null);
    };

    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push(<div key={`empty-${i}`} className="cal-cell empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const record = getRecordForDay(day);
        const status = getDayStatus(day, record);
        const isSelected = selectedDay === day;
        const isClickable = status === "ontime" || status === "late";

        cells.push(
            <div
                key={day}
                className={`cal-cell status-${status} ${isSelected ? "selected" : ""} ${isClickable ? "clickable" : ""}`}
                onClick={() => isClickable && setSelectedDay(day)}
            >
                {day}
            </div>
        );
    }

    const selectedRecord = selectedDay ? getRecordForDay(selectedDay) : null;
    const selectedStatus = selectedDay ? getDayStatus(selectedDay, selectedRecord) : null;
    const selectedDateLabel = selectedDay
        ? new Date(year, month, selectedDay).toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric", year: "numeric"
          })
        : null;

    return (
        <div className="attendance-calendar">
            <div className="cal-header">
                <div className="cal-title">
                    <div className="cal-icon"><CalendarDays size={20} /></div>
                    <div>
                        <h3>Attendance Calendar</h3>
                        <p>View your daily attendance record</p>
                    </div>
                </div>

                <div className="cal-nav">
                    <button onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
                    <span>{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                    <button onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
                </div>
            </div>

            <div className="cal-weekdays">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="cal-weekday">{d}</div>
                ))}
            </div>

            <div className="cal-grid">
                {cells}
            </div>

            {selectedRecord && (
                <div className="cal-details">
                    <div className="cal-details-header">
                        <strong>{selectedDateLabel}</strong>
                        <span className={`cal-badge status-${selectedStatus}`}>
                            {selectedStatus === "late" ? "Late" : "On time"}
                        </span>
                    </div>

                    <div className="cal-details-body">
                        <div className="cal-detail-item">
                            <Clock size={16} />
                            <div>
                                <p className="cal-detail-label">Clock In</p>
                                <p className="cal-detail-value">{selectedRecord.time_in || "-"}</p>
                            </div>
                        </div>

                        <div className="cal-detail-item">
                            <Clock size={16} />
                            <div>
                                <p className="cal-detail-label">Clock Out</p>
                                <p className="cal-detail-value">{selectedRecord.time_out || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="cal-legend">
                <span className="legend-item"><span className="dot status-ontime"></span> On time</span>
                <span className="legend-item"><span className="dot status-late"></span> Late</span>
                <span className="legend-item"><span className="dot status-absent"></span> Absent</span>
                <span className="legend-item"><span className="dot status-none"></span> Weekend / No record</span>
            </div>
        </div>
    );
};

export default AttendanceCalendar;