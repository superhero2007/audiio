import {PipeTransform, Pipe} from '@angular/core';

@Pipe({
  name: 'searchTracsPipe'
})
export class SearchTracksPipe implements PipeTransform {

  tracks: Array<any>;

  public columns: Array<any> = [
    {'name': 'title'},
    {'name': 'lyrics'},
    {'name': 'name'}
  ];

  transform(tracks: any[], term: string): any[] {

    if (term === '') {
      return tracks;
    }
    ;

    if (tracks !== undefined) {

      let filterByArr: Array<string> = this.cleanFilterBy(term);
      let tempArray: Array<any> = [];
      let previousMatchFlag = true;
      let flag = false;

      this.tracks = tracks;

      this.tracks.forEach((track: any, j) => {

        previousMatchFlag = true;
        filterByArr.forEach((searchTerm, i) => {
          if (searchTerm != undefined && searchTerm.length > 0) {
            flag = false;
            if (previousMatchFlag) {
              previousMatchFlag = false;
              this.columns.forEach((column: any, k) => {
                if (track[column.name] !== undefined && track[column.name] !== null) {
                  if (track[column.name].toString().toLowerCase().match(searchTerm.toLocaleLowerCase())) {
                    flag = true;
                    previousMatchFlag = true;
                  }
                }
                if (track.hasOwnProperty('meta_album')) {
                  if(track.meta_album[0] !== undefined) {
                    if (track.meta_album[0][column.name] !== undefined && track.meta_album[0][column.name] !== null) {
                      if (track.meta_album[0][column.name].toString().toLowerCase().match(searchTerm.toLocaleLowerCase())) {
                        flag = true;
                        previousMatchFlag = true;
                      }
                    }
                    if (track.meta_artist[0][column.name] !== undefined && track.meta_artist[0][column.name] !== null) {
                      if (track.meta_artist[0][column.name].toString().toLowerCase().match(searchTerm.toLocaleLowerCase())) {
                        flag = true;
                        previousMatchFlag = true;
                      }
                    }
                  }
                }


              });

              /*track.meta_album[0].forEach((album: any, l) => {
              });
              track.meta_artist[0].forEach((artist: any, l) => {
              });*/
            }
          }
        });
        if (flag) {
          tempArray.push(track);
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
    let arr = term.split(" ");
    return arr;
  }
}


