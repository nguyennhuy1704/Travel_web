import { notification } from 'antd';
import moment from 'moment';

// send notification
type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const Notification = (status: NotificationType, msg: any) => {
    if (status !== 'error') {
        notification[status]({
            message: 'Thông báo',
            description: msg,
        });
    } else {
        notification[status]({
            message: 'Thông báo',
            description: msg,
        });
    }
};

// moment time to DD/MM/YYYY or ...'
export const momentToStringDate = (date: string | Date, type = 'date') => {
    switch (type) {
        case 'date':
            return date ? moment(date).format('DD/MM/YYYY') : '';
        case 'dateTime':
            return moment(date).format('HH:mm DD/MM/YYYY');
        case 'time':
            return moment(date).format('HH:mm');
        default:
            return '';
    }
};

// create function format number 100000 to 100.000
export const currencyFormat = (number: number) => {
    return number?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

// cover DD/MM/YYYY to YYYY-MM-DD
export const getDateFormat = (date: any) => {
    return date.split('/').reverse().join('-');
};

// check all field value empty in object
export const checkEmptyAllFieldInObject = (obj: any) => {
    return Object.values(obj).every((x) => x || x === 0);
};

// generator uuid
export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// function download file cannot open blank page
export const downloadFile = (fileLink: string) => {
    fetch(fileLink, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        },
    })
        .then((response) => response.blob())
        .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link: any = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileLink.slice(fileLink.lastIndexOf('/') + 1));

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
        });
};

// format size file
export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// timing wait
export const wait = (timeout: number) => {
    return new Promise((resolve: any) => setTimeout(resolve, timeout));
};

// enter number only
export const enterNumbersOnly = (value: any) => {
    if (value === null || value === undefined || value == 0) return ''
    var result = value?.replace(/[^\w\s]/gi, '')
    return result
  }

  export function formatedDate(date: string) {
    const formatedTimeZone = new Date(date)
    const day = `${formatedTimeZone.getDate()}-${
      formatedTimeZone.getMonth() + 1
    }-${formatedTimeZone.getFullYear()}`
    const formatedMinutes =
      formatedTimeZone.getMinutes() < 10
        ? `0${formatedTimeZone.getMinutes()}`
        : `${formatedTimeZone.getMinutes()}`
    const time = `${formatedTimeZone.getHours()}:${formatedMinutes}`
    return time + ' ' + day
  }
