module.exports = (columns, defaultSortColumn, body) => {
  let pageIndex = 0;
  let pageSize;
  let sortCol = defaultSortColumn;
  let sortOrder = "DESC";
  let searchString = null;

  if (!!body.pageSize && !isNaN(Number(body.pageSize))) {
    pageSize = Number(body.pageSize);
    pageSize = pageSize < 0 ? 10 : pageSize;
  }
  if (!!body.pageIndex && !isNaN(Number(body.pageIndex))) {
    pageIndex = Number(body.pageIndex);
    pageIndex = pageIndex < 0 ? 0 : pageIndex;
  }
  if (!!body.sortCol) {
    if (columns.includes(body.sortCol)) {
      sortCol = body.sortCol;
    }
  }
  if (
    !!body.sortOrder &&
    ["ASC", "DESC", "asc", "desc"].includes(body.sortOrder)
  ) {
    sortOrder = body.sortOrder;
  }

  if (!!body.searchString) {
    searchString = body.searchString;
    if (searchString === "") {
      searchString = null;
    }
  }

  let offset = !!pageSize ? pageIndex * pageSize : 0;
  let sort = [[sortCol, sortOrder]];
  return {
    offset: offset,
    sort: sort,
    pageSize: pageSize,
    pageIndex: pageIndex,
    searchString: searchString,
  };
};
