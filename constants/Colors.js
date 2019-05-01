const tintColor = '#2f95dc';

const themeColor = {
  recsys: {
    theme: {
      morning: 'rgba(65,105,225,0.6)',
      afternoon: 'rgba(252,162,57,0.8)',
      night: 'rgba(19,23,75,0.8)',
    },
    text: {
      morning: 'rgba(255, 255, 255, 0.8)',
      afternoon: 'rgba(0, 0, 0, 1)',
      night: 'rgba(255, 255, 255, 0.8)',
    },
    gradient: {
      morning: ['rgba(65,105,225,0.6)','rgba(86,157,238,0.6)','rgba(177,250,248,0.6)'],
      afternoon: ['rgba(252,162,57,0.8)','rgba(246,92,64,0.8)','rgba(255,119,87,0.8)',],
      night: ['rgba(19,23,75,0.8)', 'rgba(19,100,200,0.8)', 'rgba(19,150,250,0.8)'],
    },
  },

  hbs: {
    theme: 'rgba(66, 244, 146, 0.4)',
    text: 'rgba(255, 255, 255, 1)',
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
