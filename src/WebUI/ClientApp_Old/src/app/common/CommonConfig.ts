export class CommonConfig {
  static getDataTableSettings(disableSearch: boolean = false) {
    return {
      destroy: true,
      ordering: true,
      responsive: true,
      autoWidth: true,
      processing: true,
      searching: !disableSearch,
      pagingType: "full_numbers",
      lengthMenu: [
        [-1, 5, 10, 15, 20, 50, 100],
        ["All", 5, 10, 15, 20, 50, 100],
      ],
      pageLength: 10,
      language: {
        processing:
          '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> ',
      },
    };
  }
}
