const tintColor = '#2f95dc';

const themeColor = {
  recsys: {
    theme: {
      morning: 'rgba(160,232,255,0.6)',
      afternoon: 'rgba(252,162,57,0.8)',
      night: 'rgba(19,23,75,0.8)',
    },
    text: {
      morning: 'rgba(0, 0, 0, 1)',
      afternoon: 'rgba(0, 0, 0, 1)',
      night: 'rgba(255, 255, 255, 0.8)',
    },
  },

  hbs: {
    theme: 'rgba(66, 244, 146, 0.4)',
    text: 'rgba(0, 0, 0, 0.5)',
  },
  
  ds: {
    theme: 'rgba(157, 65, 244, 0.4)',
    text: 'rgba(255, 255, 255, 1)',
  },

  rated: {
    theme: 'rgba(255, 212, 127, 0.8)',
    text: 'rgba(0, 0, 0, 0.8)',
  },

  bookmarked: {
    theme: 'rgba(169, 99, 99, 0.8)',
    text: 'rgba(255, 255, 255, 0.8)',
  },

}

export default {
  tintColor,

  themeColor,

  tabIconDefault: '#ccc',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};
