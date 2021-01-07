const DefaultPageData = {
    total: 0, // 总记录数
    pages: 0, // 总页数
    pageNo: 1, // 当前页
    pageSize: 10, // 每页记录数
    next: 1, // 下一页
    prev: 1, // 上一页
    lastPage: true, // 是否最后一页
    items: [] // 当前页数据
};

/**
 * 获取默认分页数据函数
 */
export function defaultPageData() {
    return JSON.parse(JSON.stringify(DefaultPageData));
}
