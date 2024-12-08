// Util functions
import { sha256 } from 'js-sha256';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/vi';
import Global from './Global';
import axios from 'axios';
import { remark } from "remark";
import remarkHtml from "remark-html";

import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

moment.locale('vi');

const Utils = {
    // sha256
    sha256: (text) => {
        return sha256(text);
    },

    // Check object empty
    isObjectEmpty: (obj) => {
        return Utils.isObjectNull(obj) || (Object.keys(obj).length === 0 && obj.constructor === Object)
    },

    // Get full url
    getFullUrl: (url) => {
        if (url && !url.startsWith('http') && !url.startsWith('blob')) {
            // console.log(`${process.env.REACT_APP_BASE_URL}${encodeURI(url)}`);
            return `${process.env.REACT_APP_BASE_URL}${encodeURI(url)}`;
        }
        // console.log(encodeURI(url));
        return encodeURI(url);
    },

    // Check is full url
    checkFullUrl: (url) => {
        if (url && url.startsWith('http')) {
            return true;
        }
        return false;
    },

    // Check object null|undefine
    isObjectNull: (obj) => {
        return obj === null || obj === undefined || obj === 'NULL'
    },

    // convert first character of string to uppercase
    convertFirstCharacterToUppercase: (stringToConvert) => {
        var firstCharacter = stringToConvert.substring(0, 1)
        var restString = stringToConvert.substring(1)
        return firstCharacter.toUpperCase() + restString
    },

    // format number
    formatNumber: (iNumber) => {
        return new Intl.NumberFormat('de-DE').format(iNumber)
    },

    // format date time
    formatDateTime: (sDateTime, sFormat = 'DD/MM/YYYY HH:mm', utc = false) => {
        if (utc) {
            return moment(sDateTime).utc().format(sFormat);
        }
        return moment(sDateTime).local().format(sFormat);
    },

    // get time ago
    timeAgo: (sDateTime) => {
        const momentTime = moment.utc(sDateTime);
        return momentTime.fromNow();
    },

    // Change empty to null
    formatEmptyKey: (items) => {
        for (const [key, value] of Object.entries(items)) {
            if (value === '' || value === undefined) {
                items[key] = null;
            }
        }
    },

    // remove null key
    removeNullKey: (items) => {
        for (const [key, value] of Object.entries(items)) {
            if (_.isNull(value)) {
                delete items[key];
            }
        }
    },

    // Delete null 
    formatNullKey: (items) => {
        for (const [key, value] of Object.entries(items)) {
            if (_.isNull(value)) {
                delete items[key];
            }
        }
    },

    // check pagination
    getNextPage: (pagination) => {
        const { total, count, currentPage } = pagination;

        const hasMorePage = (currentPage * Global.gDefaultPagination) < total;
        if (hasMorePage) {
            return currentPage + 1;
        }

        return null;
    },

    // get current url
    getCurrentUrl: () => {
        return window.location.href;
    },

    // get last array item
    getLastItem: (items) => {
        if (items && Array.isArray(items) && items.length > 0) {
            return items[items.length - 1];
        }
        return null;
    },

    // scroll div to bottom
    scrollToBottom: (id) => {
        var div = document.getElementById(id);
        if (div) {
            div.scrollTop = div.scrollHeight - div.clientHeight;
        }
    },

    // Decode html
    decodeHTML: (html) => {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = html;
        return textArea.value;
    },


    // open link in new tab
    openInNewTab: (url) => {
        window.open(url, "_blank").focus();
    },

    // open link in current tab
    openInCurrentTab: (url) => {
        window.open(url);
    },

    /**
     * Convert file size to MB
     * @param {number} sizeInBytes File size in bytes
     * @returns 
     */
    fileSizeInMB: (sizeInBytes) => {
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        return sizeInMB;
    },
    getBookQuality: (quality) => {
        switch (quality) {
            case "NEW":
                return "Mới";
            case "GOOD":
                return "Tốt";
            case "OLD":
                return "Cũ";
            default:
                return "Không xác định"; // hoặc giá trị mặc định khác nếu cần
        }
    },
    uploadFile: async (file) => {
        const url = `https://api.cloudinary.com/v1_1/dwjvhoiin/upload`;
        const fd = new FormData();
        fd.append('upload_preset', "kiendao");
        fd.append('file', file);
        let rs = await fetch(url, {
            method: 'POST',
            body: fd,
        })
        let url_image = (await rs.json()).secure_url;
        return url_image;
    },
    handleOrderStatus: (status) => {
        switch (status) {
            case "CREATED":
                return "Chờ xác nhận";
            case "READY_TO_PACKAGE":
                return "Chờ gói hàng";
            case "READY_TO_SHIP":
                return "Sẵn sàng gửi";
            case "SHIPPING":
                return "Đang gửi";
            case "DONE":
                return "Thành công";
            case "CANCEL":
                return "Hủy"
            default:
                return "Trạng thái không xác định"; // Fallback for unknown statuses
        }
    },


    markdownToHtml: (markdownText) => {
        const file = remark().use(remarkHtml).processSync(markdownText);
        return String(file);
    },

    htmlToMarkdown: (htmlText) => {
        const file = remark()
            .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
            .use(rehypeRemark)
            .use(remarkStringify)
            .processSync(htmlText);

        return String(file);
    },
    markdownToHtml: (markdownText) => {
        const file = remark().use(remarkHtml).processSync(markdownText);
        return String(file);
    },

    htmlToMarkdown: (htmlText) => {
        const file = remark()
            .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
            .use(rehypeRemark)
            .use(remarkStringify)
            .processSync(htmlText);

        return String(file);
    },
    hexToRGBA: (hex, alpha) => {
        // Remove '#' if it's included
        hex = hex.replace('#', '');

        // Parse hexadecimal color string to separate RGB values
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);

        // Convert alpha value to range between 0 and 1
        var a = alpha >= 0 ? parseFloat(alpha) : 1;
        // Return RGBA string
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    },
    allElementsZero: (array) => {
        for (let element of array) {
            if (element !== 0) {
                return false;
            }
        }
        return true;
    },
    blurColor: (colorCode, opacity) => {
        return `rgba(${parseInt(colorCode.slice(1, 3), 16)}, ${parseInt(
            colorCode.slice(3, 5),
            16
        )}, ${parseInt(colorCode.slice(5, 7), 16)}, ${opacity})`;
    },

};

export default Utils;