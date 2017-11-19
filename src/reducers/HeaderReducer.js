import actionType from '../constants';

const initialState = {
  pageTitle: 'OnePlusTwo',
  headerTitle: 'OnePlusTwo',
  backButton: null
};

const MAX_HEADER_LENGTH = 20;

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_HEADER: {
      let { pageTitle, headerTitle } = action.payload;

      return {
        ...initialState,
        ...action.payload,
        pageTitle: pageTitle ? `${pageTitle} – OnePlusTwo` : 'OnePlusTwo',
        headerTitle: headerTitle
          ? headerTitle.length > MAX_HEADER_LENGTH
            ? headerTitle.slice(0, MAX_HEADER_LENGTH)
            : headerTitle
          : 'OnePlusTwo'
      };
    }

    default:
      return state;
  }
};
