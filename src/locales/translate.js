import i18next from 'i18next';
import en from './en';

const translate = (e) => {
  i18next.init({
    lng: 'en',
    resources: {
      en,
    },
  }).then((t) => e(t));
};

export default translate;
