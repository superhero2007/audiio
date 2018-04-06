import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'searchLyrics'
})
export class SearchLyricsPipe implements PipeTransform {

  tracks: Array<any>;

  public columns: Array<any> = [
    {'name': 'lyrics'}
  ];
  constructor(private sanitized: DomSanitizer) {
  }
  transform(tracks: any[], term: string): any[] {

    if(term === ''){
      return tracks;
    };

    if (tracks !== undefined ) {

      let filterByArr: Array<string> = this.cleanFilterBy(term);
      let tempArray: Array<any> = [];
      let previousMatchFlag = true;
      let flag = false;

      this.tracks = tracks;

      this.tracks.forEach((item: any, j) => {

        previousMatchFlag = true;
        filterByArr.forEach( (searchTerm, i) => {
          if (searchTerm != undefined && searchTerm.length > 0) {
            flag = false;

            if (previousMatchFlag) {
              previousMatchFlag = false;
              this.columns.forEach((column: any, k) => {
                if (item[column.name] !== undefined && item[column.name] !== null) {
                  if (item[column.name].toString().toLowerCase().match(searchTerm.toLocaleLowerCase())) {
                    flag = true;
                    previousMatchFlag = true;

                    let phrase = item[column.name].toString().toLowerCase();
                    phrase = phrase.replace(/&amp;nbsp;/g," ").replace(/<[^>]+>/g, "");
                    let maxLength = searchTerm.length+40;
                    let trimmedString = phrase.substr(phrase.indexOf(searchTerm.toLocaleLowerCase())-40, maxLength+40);

                    phrase = trimmedString.substr(trimmedString.indexOf(" "), Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
                    let firstSection = phrase.substr(0,phrase.indexOf(searchTerm.toLocaleLowerCase()))
                    let lastSection = phrase.substr(phrase.indexOf(searchTerm.toLocaleLowerCase()) + searchTerm.length, phrase.length);
                    item.phrase = this.sanitized.bypassSecurityTrustHtml(firstSection + "<strong style='color:#FD3F92'>" + searchTerm + "</strong>" + lastSection);

                  };
                }
              });
            }
          }
        });
        if (flag) {
          tempArray.push(item);
        }
      });

      this.tracks = tempArray;
      if (this.tracks.length <= 0) {
        this.tracks = [-1];
      }

      return this.tracks;
    }
  }

  cleanFilterBy(term: string): any[] {
    // let arr = term.split(" ");
    let arr = [term];
    return arr;
  }
}
