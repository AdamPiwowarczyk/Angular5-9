using System.ComponentModel.DataAnnotations;

namespace DataDisplayAPI.DTOs
{
    public class UserToRegisterDto
    {
        [Required]
        public string Login { get; set; }
        
        [Required]
        [StringLength(64, MinimumLength = 2, ErrorMessage = "Password needs to be between 2 and 64 characters")]
        public string Password { get; set; }
    }
}