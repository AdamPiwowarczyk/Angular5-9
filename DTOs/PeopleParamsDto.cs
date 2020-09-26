namespace DataDisplayAPI.DTOs
{
    public class PeopleParamsDto
    {
        // Pagination
        private const int MaxPageSize = 50;

        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        // Filtering
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Occupation { get; set; }

        // Sorting
        public string OrderBy { get; set; }
    }
}