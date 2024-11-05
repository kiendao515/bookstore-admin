import AppData from 'general/constants/AppData';

// Global variables
const Global = {
  gDefaultPagination: 30,

  gNeedToRefreshPackageList: false,

  // Filters
  gFiltersPackageList: {
    pageId: 1,
    size: 30,
    // q: '',
  },
  gNeedToRefreshCategoryList: false,
  gFiltersCategoryList: { page: 0, size: 30, q: '' },
  gNeedToRefreshAccountList: false,
  gFiltersAccountList: { page: 0, size: 30,role:'', q: '' },
  gFilterBookList : {page :0, size: 30, q: '',storeId:'',categoryId :''},
  gNeedToRefreshBookList: false
};

export default Global;  
