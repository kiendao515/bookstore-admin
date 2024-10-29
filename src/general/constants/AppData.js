import AppResource from './AppResource';

const AppData = {
  // regex
  regexSamples: {
    phoneRegex:
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    urlRegex:
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  },

  // phan trang
  perPageItems: [
    { value: 5 },
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 50 },
    { value: 100 },
  ],

  // ngon ngu
  languages: [
    {
      icon: AppResource.icons.icFlagUs,
      title: 'English',
      code: 'en',
    },
    {
      icon: AppResource.icons.icFlagVi,
      title: 'Vietnamese',
      code: 'vi',
    },
  ],

  // languages
  languageItems: [
    { name: 'English', value: 'en', icon: AppResource.icons.icFlagUs },
    { name: 'Tiếng Việt', value: 'vi', icon: AppResource.icons.icFlagVi },
  ],

  // apex chart color list
  chartColors: [
    '#007aff',
    '#ff2d55',
    '#5856d6',
    '#ff9500',
    '#ffcc00',
    '#ff3b30',
    '#5ac8fa',
    '#4cd964',
  ],

  PackageStatusOption: [
    {name: "WaitingApprove", value: 0},
    {name: "Approve", value: 1},
    {name: "Delete", value: 2},
    {name: "Draft", value: 3},
  ],

  packageTypeOptions: [
    {name: "Gói Admin 120K", value: 3},
    {name: "Gói Admin 90K", value: 2},
    {name: "Gói Admin 60K", value: 1},
  ],
  appColor: ''
};

export default AppData;
