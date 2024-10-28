import AppData from 'general/constants/AppData';

// Global variables
const Global = {
  gDefaultPagination: 30,

  gNeedToRefreshPackageList: false,

  // Filters
  gFiltersPackageList: {
    pageId: 1,
    limit: 30,
    // q: '',
  },
  gNeedToRefreshCategoryList: false,
  gFiltersCategoryList: { page: 0, limit: 30, q: '' },
  gNeedToRefreshAccountList: false,
  gFiltersAccountList: { page: 0, limit: 30, q: '' },
};

export default Global;
