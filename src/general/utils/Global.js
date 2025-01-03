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
  gNeedToRefreshCollectionList: false,
  gFiltersCollectionList: { page: 0, size: 30, q: '' },
  gNeedToRefreshAccountList: false,
  gFiltersAccountList: { page: 0, size: 30,role:'', q: '' },
  gFilterBookList : {page :0, size: 30, q: '',store_id:'',category_id :'',start_at:'',end_at:''},
  gNeedToRefreshBookList: false,
  gFilterOrderList : {page :0, size: 30, q: '',store_id:'',start_at:'',end_at:'',status:'', type:1},
  gNeedToRefreshOrderList: false,
  gNeedToRefreshRevenueList: false,
  gFiltersRevenueList: { from: '', to: '',store_id:''},
  gNeedToRefreshConfigList: false,
  gFilterConfigList: { page:0,size:30},
};

export default Global;  
