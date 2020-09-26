using System;
using System.ComponentModel.DataAnnotations;

#nullable enable

namespace DataDisplayAPI.DTOs
{
    public class PersonToEditDto
    {
        [Required]
        public Guid PersonId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Occupation { get; set; }
        public string? AvatarUrl { get; set; }
    }
}