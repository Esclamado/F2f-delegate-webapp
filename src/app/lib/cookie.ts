import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class cookie {

    isConsented = false;

    constructor() {}

    /**
     * delete cookie
     * @param name
     */
    public deleteCookie(name : string, domain : string = '') {
        this.setCookie(name, null, -1, '/', domain);
    }

    /**
     * get cookie
     * @param {string} name
     * @returns {string}
     */
    public getCookie(name : string) {
        const ca: Array<string> = document.cookie.split(';');
        const caLen: number = ca.length;
        const cookieName = `${name}=`;
        let c: string;

        for (let i = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) === 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    /**
     * set cookie
     * @param {string} name
     * @param {string} value
     * @param {number} expireDays
     * @param {string} path
     */
    public setCookie(name : string, value : string, expireDays : number = 60, path : string = '/', domain : string = '') {
        const d: Date = new Date();

        let expires = '';
        if (expireDays) {
            d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
            expires = `expires=${
                d.toUTCString()
            }`;
        }

        const cpath = path ? `; path=${path}` : '';
        const cdomain = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=${value}; ${expires}${cpath}${cdomain}`;
    }

    /**
     * consent
     * @param {boolean} isConsent
     * @param e
     * @param {string} COOKIE
     * @param {string} EXPIRE_DAYS
     * @returns {boolean}
     */
    public consent(isConsent : boolean, e : any, COOKIE : string, EXPIRE_DAYS : number) {
        if (!isConsent) {
            return this.isConsented;
        } else if (isConsent) {
            this.setCookie(COOKIE, '1', EXPIRE_DAYS);
            this.isConsented = true;
            e.preventDefault();
        }
    }

}
