using System.Threading.Tasks;
using DataDisplayAPI.Models;

namespace DataDisplayAPI.Data
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string username, string password);
        Task<bool> UserExists(string username);
        Task<bool> UserIsAdmin(string username);    
    }
}