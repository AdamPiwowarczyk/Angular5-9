using System;
using System.ComponentModel.DataAnnotations;

namespace DataDisplayAPI.Models
{
    public class Person
    {
        [Key]
        public Guid PersonId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Occupation { get; set; }
        public string AvatarUrl { get; set; }
    }
}
