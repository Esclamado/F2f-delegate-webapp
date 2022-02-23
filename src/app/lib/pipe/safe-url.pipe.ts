import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'safeUrlYoutube'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}	

  transform(url) {

   var regExp = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/;
   var match = url.match(regExp);

   if (match && match[1].length == 11) {
     url = 'http://www.youtube.com/embed/'+match[1];
   }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}