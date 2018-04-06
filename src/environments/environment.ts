export const environment = {
  production: false,
  version: '1.0.1',
  domain: 'https://audiio.com',
  cloudFront: 'https://dy0ihivhn4k8h.cloudfront.net',
  api: {
    url: 'https://audiio.com/api/',
    login: 'account/login',
    accountCreate: 'account/create',
    accountInvite: 'account/invite',
    accountUpdate: 'account/update',
    payment: 'payment/submit',
    track: 'track',
    album: 'album',
    legal: 'legal',
    privacy: 'privacy',
    about: 'about',
    artist: 'artist',
    playlist: 'playlist',
    contact: 'contact',
    custom: 'custom',
    forgotPassword: 'forgot-password',
    resetPassword: 'reset-password',
    trackAnalytics: 'track-analytics',
    favorite: 'account/favorite',
    coupon: 'coupon'
  },
  media: {
    path: 'https://audiio.com/storage/app/media',
    thumbs: 'https://d24xdckfbtq7yf.cloudfront.net',
    mp3: 'https://dy0ihivhn4k8h.cloudfront.net',
    m4a: 'https://audiio.com/storage/app/media/_m4a',
    json: 'https://d76shei82om6h.cloudfront.net'
  }
};
