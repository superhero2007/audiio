//import { trigger, state, style, transition, animate } from '@angular/core';
import {trigger, state, animate, style, transition, keyframes} from '@angular/animations';


export const pageTransition =
  trigger('transition', [
    state('in', style({transform: 'translateX(100px)', opacity: '0'})),

    transition('void => *', [
      style({transform: 'translateX(200px)', opacity: '0'}),
      animate('300ms ease-out')
    ])
  ]);

export function slideToRight() {
  return trigger('slideToRight', [
    state('void', style({position: 'fixed', width: '100%'})),
    state('*', style({position: 'fixed', width: '100%'})),
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);
}

export function slideToLeft() {
  return trigger('slideToLeft', [
    state('void', style({position: 'fixed', width: '100%'})),
    state('*', style({position: 'fixed', width: '100%'})),
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(100%)'}))
    ])
  ]);
}


trigger('slideInOutAnimation', [

  state('*', style({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  })),

  // route 'enter' transition
  transition(':enter', [

    style({
      right: '-400%',
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }),
    animate('.5s ease-in-out', style({
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }))
  ]),
  transition(':leave', [
    animate('.5s ease-in-out', style({
      right: '-400%',
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }))
  ])
]);


export const slideInOutAnimation =
  trigger('slideInOutAnimation', [
    state('*', style({
      top: 0,
      opacity: 1,
      zIndex: 1,
      display: 'block',
      width: '100%',
      position: 'fixed'
    })),
    transition(':enter', [
      style({zIndex: 1, opactiy: 0, position: 'fixed'}),
      animate('1s', style({opactiy: 1, position: 'fixed'}))
    ]),
    transition(':leave', [
      style({zIndex: 2}),
      animate('2s', style({opacity: 0, position: 'fixed'}))
    ]),
  ]);

export const formBounce =
  trigger('formBounce', [
    state('*', style({
      boxShadow: '0 0 12px 0px rgba(0,0,0,.10)',
    })),
    transition('void => *', [
      style({
        boxShadow: '0 11px 15px -7px rgba(0,0,0,0)',
      }),
      animate('.2s ease-out', keyframes([

        style({
          transform: 'scale(1.05)',
          boxShadow: '0 0 12px 0px rgba(0,0,0,.10)',
          offset: 1
        }),
        style({
          transform: 'scale(1)',
          boxShadow: '0 0 12px 0px rgba(0,0,0,.10)',
          offset: 2
        })
      ]))
    ])
  ])

export const showHideActions =
  trigger('showHideActions', [
    state('hideActions', style({
      opacity:0
    })),
    state('showActions', style({
      opacity:1
    })),
    transition('hideActions => showActions',
      animate('3ms ease-out')
    ),
    transition('showActions => hideActions',
      animate('.1s 3ms ease-in')
    )
  ])

export const buttonBounceLeft =
  trigger('buttonBounceLeft', [
    state('*', style({
      transform: 'translateX(0%)',
    })),
    transition('hideActions => showActions', [
      style({
        transform: 'translateX(0%)'
      }),
      animate('.5s ease-out', keyframes([
        style({
          transform: 'translateX(-50%)',
          offset: 0
        }),
        style({
          transform: 'translateX(0%)',
          offset: .3
        }),
      ]))
    ]),
    transition('showActions => hideActions', [
      style({
        transform: 'translateX(0%)'
      }),
      animate('.3s ease-in', keyframes([
        style({
          transform: 'translateX(-100%)',
        }),

      ]))
    ])
  ])
