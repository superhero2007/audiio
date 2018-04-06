import {
  Component, OnInit, ChangeDetectionStrategy, OnDestroy, AfterViewInit, AfterContentChecked,
  AfterViewChecked, ElementRef
} from '@angular/core';
import {TrackService} from '../shared/track/track.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PagerService} from '../shared/pager.service';
import {PlaylistsService} from '../playlists/playlists.service';
import {FilterTracksPipe} from '../shared/pipe/filtertracks.pipe';
import {SearchTracksPipe} from '../shared/pipe/searchtracks.pipe';
import {FilterTracksLengthPipe} from '../shared/pipe/track-length.pipe';
import {GoogleAnalyticsEventsService} from '../shared/google-analytics-events.service';
import {TrackWaveService} from '../shared/track/track-wave.service';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationExtras, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss', '../shared/styles/mobile.scss'],
  providers: [FilterTracksPipe, SearchTracksPipe, PagerService, FilterTracksLengthPipe],
  changeDetection: ChangeDetectionStrategy.Default,

})
export class BrowseComponent implements OnInit, OnDestroy, AfterViewInit {

  item: any;
  minCount = 0;
  maxCount = 14;
  form: FormGroup;
  showHideGenres = true;
  showHideMoods = false;
  showHideElements = false;
  allTracks = [];
  allArtists = [];
  allAlbums = [];
  filteredTracks: any[];
  tracks: any;
  filterBy = [];
  pager: any = {};
  pageMaxRows = 20;
  search = "";
  showTrackLengthdd = false;
  showVocalsdd = false;
  showEnergydd = false;
  filterParams: any[] = [];

  filterByGenres = [
    {"name": "acoustic", "value": "genre_acoustic"},
    {"name": "ambient", "value": "genre_ambient"},
    {"name": "cinematic", "value": "genre_cenematic"},
    //{"type :"genre",name": "christmas", "value": "genre_christmas"},
    //{"type :"genre",name": "orchestral", "value": "genre_orchestral"},
    //{"type :"genre",name": "country", "value": "genre_country"},
    {"name": "electric", "value": "genre_electric"},
    //{"type :"genre",name": "faith", "value": "genre_faith"},
    {"name": "folk", "value": "genre_folk"},
    //{"type :"genre",name": "hiphop", "value": "genre_hiphop"},
    {"name": "indie", "value": "genre_indie"},
    {"name": "pop", "value": "genre_pop"},
    //{"type :"genre",name": "rb", "value": "genre_rb"},
    {"name": "rock", "value": "genre_rock"},
    //{"type :"genre",name": "singerwriter", "value": "genre_singerwriter"}
  ];
  filterByMoods = [
    {"name": "aggressive", "value": "mood_aggressive"},
    {"name": "anthemic", "value": "mood_anthemic"},
    {"name": "bold", "value": "mood_bold"},
    {"name": "burdened", "value": "mood_burdened"},
    {"name": "calm", "value": "mood_calm"},
    {"name": "carefree", "value": "mood_carefree"},
    {"name": "chill", "value": "mood_chill"},
    {"name": "cold", "value": "mood_cold"},
    {"name": "confident", "value": "mood_confident"},
    {"name": "cinematic", "value": "mood_cinematic"},
    {"name": "cheerful", "value": "mood_cheerful"},
    {"name": "earthy", "value": "mood_earthy"},
    {"name": "empowering", "value": "mood_empowering"},
    {"name": "epic", "value": "mood_epic"},
    {"name": "exciting", "value": "mood_exciting"},
    {"name": "gritty", "value": "mood_gritty"},
    {"name": "hopeful", "value": "mood_hopeful"},
    {"name": "happy", "value": "mood_happy"},
    {"name": "loving", "value": "mood_loving"},
    {"name": "minimal", "value": "mood_minimal"},
    {"name": "optimistic", "value": "mood_optimistic"},
    {"name": "peaceful", "value": "mood_peaceful"},
    {"name": "rebellious", "value": "mood_rebellious"},
    {"name": "romantic", "value": "mood_romantic"},
    {"name": "sinister", "value": "mood_sinister"},
    {"name": "whimsical", "value": "mood_whimsical"},
    {"name": "youthful", "value": "mood_youthful"},
    {"name": "upbeat", "value": "mood_upbeat"},
    {"name": "tense", "value": "mood_tense"},
    {"name": "vintage", "value": "mood_vintage"},
    {"name": "quirky", "value": "mood_quirky"}
  ];
  filterByElements = [
    {"name": "claps", "value": "ele_claps"},
    {"name": "ooo’s & ahh’s", "value": "ele_ooah"},
    {"name": "drumsticks", "value": "ele_drumsticks"},
    {"name": "guitar", "value": "ele_guitar"},
    {"name": "bass", "value": "ele_bass"},
    {"name": "snare", "value": "ele_snare"},
    //{name": "scratches", "value": "ele_scratches"},
    {"name": "snaps", "value": "ele_snaps"},
    {"name": "piano", "value": "ele_piano"},
    {"name": "acoustic", "value": "ele_acoustic"},
    {"name": "strings", "value": "ele_strings"}
  ];
  filterByVocals = [
    //{name": "ambient", "value": "genre_ambient"},
    //{name": "choir", "value": "vocal_choir"},
    {"name": "female", "value": "vocal_female"},
    {"name": "harmony", "value": "vocal_harmony"},
    {"name": "male", "value": "vocal_male"},
    //{name": "whispers", "value": "vocal_whispers"}
  ];
  filterByEnergy = [
    {"name": "low", "value": "energy_low"},
    {"name": "medium", "value": "energy_medium"},
    {"name": "high", "value": "energy_high"}
  ];
  filterByAssignment = [
    {"name": "bmi", "value": "pro_bmi"},
    {"name": "ascap", "value": "pro_ascap"},
    {"name": "sesac", "value": "pro_sesac"}
  ]
  sub: Subscription;
  url: any;
  firstFilterByUrl;

  constructor(private fb: FormBuilder,
              private trackService: TrackService,
              private pagerService: PagerService,
              private filterTracksPipe: FilterTracksPipe,
              private playlistsService: PlaylistsService,
              private searchTracksPipe: SearchTracksPipe,
              private filterTracksLengthPipe: FilterTracksLengthPipe,
              private trackWaveService: TrackWaveService,
              private titleService: Title,
              private route: ActivatedRoute,
              private router: Router,
              public element: ElementRef,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {

  }

  ngOnDestroy() {
    document.querySelectorAll('.browseLink')[0]['style']['color'] = 'black';
    document.querySelectorAll('.browseLink')[0]['style']['background'] = 'white';
  }

  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('browse');

    window.scrollTo(0, 0);
    this.titleService.setTitle('Audiio - Browse');
    if (this.playlistsService.getAllTracksSource() !== undefined) {
      this.allArtists = this.playlistsService.getAllArtistsSource();
      this.allAlbums = this.playlistsService.getAllAlbumsSource();
      this.allTracks = this.playlistsService.getAllTracksSource();
      this.setPage(1);

    } else {
      this.playlistsService.allTracksSourceUpdated.subscribe(
        (tracks) => {
          this.playlistsService.allArtistsSourceUpdated.subscribe(
            (artists) => {
              this.playlistsService.allAlbumsSourceUpdated.subscribe(
                (albums) => {

                  this.allAlbums = albums;
                  this.allArtists = artists;
                  this.allTracks = this.trackService.formatTracks(artists, albums, tracks);
                  this.setPage(1);
                }
              );
            }
          );
        }
      );
    }
  }

  filterbyurl(params) {

    this.filterParams = params;
    if (params.hasOwnProperty('genre')) {
      if (typeof params.genre == 'object') {
        params.genre.filter((param) => {
          if (document.getElementById("genre_" + param + "-input") !== null) {
            document.getElementById("genre_" + param + "-input").click();
          }
        });
      } else {
        if (document.getElementById("genre_" + params['genre'] + "-input") !== null) {
          document.getElementById("genre_" + params['genre'] + "-input").click();
        }
      }
    }
    if (params.hasOwnProperty('mood')) {
      if (typeof params.mood == 'object') {
        params.mood.filter((param) => {
          if (document.getElementById("mood_" + param + "-input") !== null) {
            document.getElementById("mood_" + param + "-input").click();
          }
        });
      } else {
        if (document.getElementById("mood_" + params['mood'] + "-input") !== null) {
          document.getElementById("mood_" + params['mood'] + "-input").click();
        }
      }
    }
    if (params.hasOwnProperty('ele')) {
      if (typeof params.ele == 'object') {
        params.ele.filter((param) => {
          if (document.getElementById("ele_" + param + "-input") !== null) {
            document.getElementById("ele_" + param + "-input").click();
          }
        });
      } else {
        if (document.getElementById("ele_" + params['ele'] + "-input") !== null) {
          document.getElementById("ele_" + params['ele'] + "-input").click();
        }
      }
    }
  }

  ngAfterViewInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      if(this.firstFilterByUrl == null){
        this.filterbyurl(params);
      }
      this.firstFilterByUrl = 1;
    });
    document.querySelectorAll('.browseLink')[0]['style']['color'] = 'white';
    document.querySelectorAll('.browseLink')[0]['style']['background'] = 'black';
  }

  setPage(page: number) {
    if (page > 0 && (this.pager.totalPages == null || page <= this.pager.totalPages)) {
      this.filteredTracks = this.filterTracksPipe.transform(this.allTracks, this.filterBy);
      this.filteredTracks = this.searchTracksPipe.transform(this.filteredTracks, this.search);
      this.filteredTracks = this.filterTracksLengthPipe.transform(this.filteredTracks, {
        min: this.minCount,
        max: this.maxCount
      });
      //this.playlistsService.setPlayerQueueSource(this.filteredTracks);

      if (page > (Math.ceil(this.filteredTracks.length / this.pageMaxRows))) {
        this.pager = this.pagerService.getPager(this.filteredTracks.length, 1, this.pageMaxRows);
        this.setPage(this.pager.totalPages);
      } else {
        this.pager = this.pagerService.getPager(this.filteredTracks.length, page, this.pageMaxRows);
      }
      this.tracks = this.filteredTracks.slice(this.pager.startIndex, this.pager.endIndex + 1);
      if (this.tracks[0] === -1) {
        this.tracks = -1;
      }
    }
  }

  onHideAllDD() {
    this.showTrackLengthdd = false;
    this.showVocalsdd = false;
    this.showEnergydd = false;
  }

  onToggleTrackLengthDD() {
    if (!this.showTrackLengthdd) {
      this.onHideAllDD();
    }
    this.showTrackLengthdd = (this.showTrackLengthdd) ? false : true;
  }

  onHideTrackLengthDD(e) {
    this.onHideAllDD();
    this.showTrackLengthdd = false;
  }

  onToggleVocalsDD() {
    if (!this.showVocalsdd) {
      this.onHideAllDD();
    }
    this.showVocalsdd = (this.showVocalsdd) ? false : true;
  }

  onHideVocalsDD(e) {
    this.onHideAllDD();
    this.showVocalsdd = false;
  }

  onToggleEnergyDD() {
    if (!this.showEnergydd) {
      this.onHideAllDD();
    }
    this.showEnergydd = (this.showEnergydd) ? false : true;
  }

  onHideEnergyDD(e) {
    this.onHideAllDD();
    this.showEnergydd = false;
  }

  onShowHideGenres() {
    this.showHideGenres = (this.showHideGenres === true ? false : true);
  }

  onShowHideMoods() {
    this.showHideMoods = (this.showHideMoods === true ? false : true);
  }

  onShowHideElements() {
    this.showHideElements = (this.showHideElements === true ? false : true);
  }

  onTrackLengthChange(e) {
    this.setPage(1);

  }

  onChange(e) {
    this.onHideAllDD();
    if (e.source !== undefined) {

      if (e.source.checked) {
        this.filterBy.push({"value": e.source.value, "name": e.source.name, "obj": e})
      } else {
        const index: number = this.filterBy.findIndex(filter => filter.value === e.source.value);
        this.filterBy.splice(index, 1);
      }
    } else {

      e.source = {
        value: e.currentTarget.getAttribute('value'),
        name: e.currentTarget.getAttribute('name'),
        checked: e.currentTarget.checked,
        custom: true
      };
      const index: number = this.filterBy.findIndex(i => i.value === e.source.value);

      if (e.source.checked && index < 0) {
        this.filterBy.push({"value": e.source.value, "name": e.source.name, "obj": e})
      } else {
        this.filterBy.splice(index, 1);
      }
    }
    this.setPage(1);

    this.filterParams = [];
    this.filterBy.filter((item) => {
      this.filterParams.push(item.name);
    });
    const queryStringProp = e.source.value.slice(0, e.source.value.indexOf("_"));
    const navigationExtras: NavigationExtras = {
      queryParams: {[queryStringProp]: this.filterParams}
    };
    this.router.navigate(['/browse'], navigationExtras);

  }

  onRemoveFilter(e, filter) {
    const index: number = this.filterBy.findIndex(i => i.value === filter.value);
    if (filter.obj.source !== undefined) {
      filter.obj.source.checked = false;
      if (filter.obj.srcElement != undefined) {
        filter.obj.srcElement.checked = false
      }
    } else {
      filter.obj.source = filter;
    }
    this.onChange(filter.obj);
  }
}
