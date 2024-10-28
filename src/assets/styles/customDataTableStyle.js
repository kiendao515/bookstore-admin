const customDataTableStyle = {
  rows: {
    style: {
      minHeight: '64px', // override the row height
      fontSize: '1rem',
      color: '#3F4254',
      paddingLeft: '0px',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: '#ebedf3',
      },
      '&:last-of-type': {
        borderBottom: '1px solid #ebedf3',
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: '#F3F6F9 ',
    },
  },
  headRow: {
    style: {
      borderBottomColor: '#ebedf3',
    },
  },
  cells: {
    style: {
      // paddingLeft: "0px", // override the cell padding for data cells
      // paddingRight: "1rem",
      // marginLeft: 'px',
      padding: '1rem',
      '&:first-of-type': {
        borderLeft: '1px solid #ebedf3',
      },
      borderRight: '1px solid #ebedf3',
    },
  },
  headCells: {
    style: {
      fontSize: '0.9rem',
      fontWeight: 600,
      paddingLeft: '0px',
      paddingRight: '0px',
      color: '#3F4254',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem',
      lineHeight: '1.5 !important',
      padding: '0 1rem',
      borderRight: '1px solid #ebedf3',
      borderTop: '1px solid #ebedf3',
      '&:first-of-type': {
        borderLeft: '1px solid #ebedf3',
      },
    },
    activeSortStyle: {
      '&:focus': {
        outline: 'none',
        color: '#FAF8F5',
      },
      '&:not(focus)': {
        color: '#FAF8F5',
      },
      '&:hover:not(:focus)': {
        color: '#FAF8F5',
      },
    },
    inactiveSortStyle: {
      '&:focus': {
        outline: 'none',
        color: '#B5B5C3',
      },
      '&:hover': {
        color: '#FAF8F5',
      },
    },
  },
};

export default customDataTableStyle;
