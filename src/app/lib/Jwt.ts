// if crypto is not installed on cli run 
// npm install crypto-js --save
// if moment is not installed, on cli run
// npm install moment-timezone '''
import * as CryptoJS from 'crypto-js'; 
import * as moment from 'moment-timezone';

export const Jwt = {
    date: null,
    header: {
        alg: 'HS256',
        typ: 'JWT',
    },
    payload: {

    },
    signature: '',
    secret: '',

    timezone: null,

    setAlgo: function(alg){
        this.header.alg = alg;
        return this;
    },

    setClaim: function(key, value){
        this.payload[key] = value;
        return this;
    },

    setIssuer: function(issuer){
        this.setClaim('iss', issuer);
        return this;
    },

    setAudience: function(audience){
        this.setClaim('aud', audience);
        return this;
    },

    setExpiration: function(expiration){
        this.setClaim('exp', expiration);
        return this;
    },

    setId: function(id){
        this.setClaim('jti', id);
        return this;
    },

    setIssuedAt: function(){
        let now = this.getTimeFormated();
        this.setClaim('iat', now);
        return this;
    },

    setSecret: function(s){
        this.secret = s;
        return this;
    },

    setDate: function(){
        if(!this.date){
            this.date = new Date();
        }
    },

    getTimeFormated: function(){
        this.setDate();
        let d = this.date;

        let mon = this.addZero(d.getMonth() + 1);
        let date = this.addZero(d.getDate());
        var hr = this.addZero(d.getHours());
        let min = this.addZero(d.getMinutes());
        let sec = this.addZero(d.getSeconds());
        let now = d.getFullYear() + "-" + mon + "-" + date + " " + hr + ":" + min + ":" + sec;
        return now;
    },

    addZero: function(value){
        if(value < 10){
            value = "0" + value;
        }
        return value;
    },

    getTimezone: function(){
        this.setDate();
        if(!this.timezone){
            this.timezone = {
                name: moment.tz.guess(),
                gmt: this.date.toString().split("GMT")[1].split(" (")[0]
            }
        }
        return this.timezone;
    },

    sha256: function(h='', s=''){
        return CryptoJS.HmacSHA256(h, s).toString();
    },
    base64url: function(source) {
        let string = JSON.stringify(source);
        let b64url = btoa(string);
        b64url = b64url.replace(/=+$/, '');
        b64url = b64url.replace(/\+/g, '-');
        b64url = b64url.replace(/\//g, '_');
        return b64url;
    },
    getToken: function(){
        let header = this.base64url(this.header);
        let payload = this.base64url(this.payload);
        let signature = this.sha256(header + '.' + payload, this.secret);

        let token = header + '.' + payload + '.' + signature;
        return token;
    },

    /* payload */
    getPayload: function(token){
        var base64Url = token.split('.')[1];
        var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(base64);
    }
}