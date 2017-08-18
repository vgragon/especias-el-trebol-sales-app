export default {
    getFormattedDate: function (criteria, dateTime) {
        if (criteria === "MONTH") {
            return this.getNaturalMonth(dateTime) + ", " + dateTime.getFullYear();
        }
        else if (criteria === "DAY") {
            return this.getNaturalMonth(dateTime) + " " + dateTime.getDate() + ", " + dateTime.getFullYear();
        }
    },
    getPixelsNumber: function (value) {
        if (typeof value === "undefined") return 0;
        if (typeof value === "number") return value;
        if (typeof value === "string") {
            return value.indexOf("px") >= 0 ? Number.parseInt(value.slice(0, -2)) : Number.parseInt(value);
        }
        else return 0;
    },
    formatNumber: function (criteria, number) {
        if (criteria === "CURRENCY") {
            let n = number,
                c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d === undefined ? "." : d,
                t = t === undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }
    },
    toISOString: function (dt) {
        let tzo = -dt.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                let norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };

        return dt.getFullYear() +
            '-' + pad(dt.getMonth() + 1) +
            '-' + pad(dt.getDate()) +
            'T' + pad(dt.getHours()) +
            ':' + pad(dt.getMinutes()) +
            ':' + pad(dt.getSeconds()) +
            '.000' +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
    },
    getMonthNumberJS: function (monthName) {
        switch (monthName) {
            case "January":
                return 0;
            case "February":
                return 1;
            case "March":
                return 2;
            case "April":
                return 3;
            case "May":
                return 4;
            case "June":
                return 5;
            case "July":
                return 6;
            case "August":
                return 7;
            case "September":
                return 8;
            case "October":
                return 9;
            case "November":
                return 10;
            case "December":
                return 11;
        }
    },
    getNaturalMonth: function (date) {
        let monthNumber = date.getMonth();
        switch (monthNumber) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
        }
    },
    getNaturalDay: function (date) {
        let dayNumber = date.getDay();
        switch (dayNumber) {
            case 0:
                return "Mon";
            case 1:
                return "Tue";
            case 2:
                return "Wed";
            case 3:
                return "Thu";
            case 4:
                return "Fri";
            case 5:
                return "Sat";
            case 6:
                return "Sun";
        }
    },
    sortByDate: function (a, b) {
        return new Date(b.dateTime) - new Date(a.dateTime);
    },
    sortByMonth: function (a, b) {
        return new Date(b.dateTime).getMonth() - new Date(a.dateTime).getMonth();
    }
};
